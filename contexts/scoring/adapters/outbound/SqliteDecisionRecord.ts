import Database from "better-sqlite3"
import type { DecisionRecord } from "@scoring/domain/types"
import type { DecisionRecordPort } from "@scoring/ports/driven/DecisionRecordPort"

/**
 * Adaptador append-only sobre better-sqlite3.
 * Tabla `decisions`: solo INSERT, nunca UPDATE/DELETE (invariante 4).
 * `payload` es el JSON completo del DecisionRecord → reconstruible bit a bit.
 */
export class SqliteDecisionRecord implements DecisionRecordPort {
  private readonly db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS decisions (
        decision_id   TEXT PRIMARY KEY,
        payload       TEXT NOT NULL,
        model_version TEXT NOT NULL,
        config_version TEXT NOT NULL,
        created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  append(record: DecisionRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO decisions (decision_id, payload, model_version, config_version)
      VALUES (?, ?, ?, ?)
    `)
    stmt.run(record.decisionId, JSON.stringify(record), record.modelVersion, record.configVersion)
  }

  getById(decisionId: string): DecisionRecord | null {
    const stmt = this.db.prepare(`SELECT payload FROM decisions WHERE decision_id = ?`)
    const row = stmt.get(decisionId) as { payload: string } | undefined
    if (!row) return null
    return JSON.parse(row.payload) as DecisionRecord
  }
}
