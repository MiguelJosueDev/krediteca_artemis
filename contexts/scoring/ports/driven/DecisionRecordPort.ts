import type { DecisionRecord } from "@scoring/domain/types"

export interface DecisionRecordPort {
  /** Append-only. Inmutable tras el primer INSERT (invariante 4). */
  append(record: DecisionRecord): void
  /** Reconstrucción bit a bit por decisionId. */
  getById(decisionId: string): DecisionRecord | null
}
