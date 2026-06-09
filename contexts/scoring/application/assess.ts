import type { Applicant, EligibilityDecision, ExcludedOffer, RankedOffer } from "@scoring/domain/types"
import type { CreditDecisionUseCase, AssessContext } from "@scoring/ports/driving/CreditDecisionUseCase"
import type { ConsentPort } from "@scoring/ports/driven/ConsentPort"
import type { FeatureStorePort } from "@scoring/ports/driven/FeatureStorePort"
import type { ScoringModelPort } from "@scoring/ports/driven/ScoringModelPort"
import type { ExplainabilityPort } from "@scoring/ports/driven/ExplainabilityPort"
import type { DecisionRecordPort } from "@scoring/ports/driven/DecisionRecordPort"
import type { ThresholdConfig } from "@scoring/domain/config/thresholds"

interface Deps {
  consentPort: ConsentPort
  featureStore: FeatureStorePort
  scorer: ScoringModelPort
  explainer: ExplainabilityPort
  record: DecisionRecordPort
  config: ThresholdConfig
  idGen: () => string
  clock: () => string  // retorna ISO timestamp
}

const EPSILON = 1e-9

export function makeAssess(deps: Deps): CreditDecisionUseCase {
  const { consentPort, featureStore, scorer, explainer, record, config, idGen, clock } = deps

  return {
    assess(applicant: Applicant, context: AssessContext): EligibilityDecision {
      // Invariante 2: gating de consentimiento — falla cerrado si no hay base legal.
      const consent = consentPort.resolve(applicant)
      if (!consent.granted) {
        throw new Error("ConsentRequired: no hay base legal para procesar features.")
      }

      const features = featureStore.buildFeatures(applicant, consent)
      const ranked: RankedOffer[] = []
      const excluded: ExcludedOffer[] = []

      for (const offer of context.offers) {
        // Exclusión por no-ruteable (antes de cualquier cómputo)
        if (!offer.routable) {
          excluded.push({ offerId: offer.id, reason: "not_routable", detail: "Oferta no disponible para ruteo directo." })
          continue
        }

        const scoreResult = scorer.predict(features, offer)

        // Hard exclusions señalizadas por RulesScorer con score negativo
        if (scoreResult.score === -1) {
          excluded.push({
            offerId: offer.id,
            reason: "income_below_minimum",
            detail: `Ingreso declarado ($${features.declaredIncome.toLocaleString()}) no alcanza el mínimo de esta oferta ($${offer.minIncome.toLocaleString()}).`,
          })
          continue
        }
        if (scoreResult.score === -2) {
          excluded.push({
            offerId: offer.id,
            reason: "dti_above_band",
            detail: `Ratio deuda-ingreso (${features.dti.toFixed(1)}%) supera el umbral de esta oferta.`,
          })
          continue
        }

        const contributions = explainer.explain(features, offer, scoreResult)

        // Invariante 6: coherencia de explicación. Falla cerrado si no se cumple.
        const contributionSum = contributions.reduce((acc, c) => acc + c.value, 0)
        if (Math.abs(contributionSum - scoreResult.score) > EPSILON) {
          throw new Error(
            `ExplanationCoherenceViolation: sum(contributions)=${contributionSum} ≠ score=${scoreResult.score} para oferta ${offer.id}`
          )
        }

        // Exclusión por umbral de ruteo (invariante 5: umbral de config, no hardcodeado)
        if (scoreResult.score < config.routingThreshold) {
          excluded.push({ offerId: offer.id, reason: "below_threshold", detail: "Perfil por debajo del umbral de elegibilidad." })
          continue
        }

        const band =
          scoreResult.score >= config.bandThresholdAlta ? "alta"
          : scoreResult.score >= config.bandThresholdMedia ? "media"
          : "baja"

        ranked.push({ offerId: offer.id, band, score: scoreResult.score, contributions })
      }

      // Ordenar mejores primero
      ranked.sort((a, b) => b.score - a.score)

      const decisionId = idGen()
      const createdAt = clock()

      const decision: EligibilityDecision = {
        decisionId,
        ranked,
        excluded,
        appliedThreshold: config.routingThreshold,
        configVersion: config.configVersion,
        modelVersion: "rules-v0",
        createdAt,
      }

      // Invariante 4: persistencia inmutable de la decisión
      record.append({
        decisionId,
        applicant,
        features,
        consent,
        decision,
        modelVersion: "rules-v0",
        configVersion: config.configVersion,
        createdAt,
      })

      return decision
    },
  }
}
