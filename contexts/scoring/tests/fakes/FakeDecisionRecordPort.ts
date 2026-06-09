import type { DecisionRecord } from "@scoring/domain/types"
import type { DecisionRecordPort } from "@scoring/ports/driven/DecisionRecordPort"

export class FakeDecisionRecordPort implements DecisionRecordPort {
  private readonly store = new Map<string, DecisionRecord>()

  append(record: DecisionRecord): void {
    if (this.store.has(record.decisionId)) {
      throw new Error(`ImmutabilityViolation: ${record.decisionId} ya existe.`)
    }
    this.store.set(record.decisionId, record)
  }

  getById(decisionId: string): DecisionRecord | null {
    return this.store.get(decisionId) ?? null
  }

  get size(): number {
    return this.store.size
  }
}
