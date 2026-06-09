import Database from "better-sqlite3"
import path from "path"

// En desarrollo usamos un archivo local en la raíz.
// En producción, esto se reemplazaría por Vercel Postgres, Turso, o similar.
const dbPath = path.join(process.cwd(), "attribution.db")
const db = new Database(dbPath)

// Inicializar tabla si no existe
db.pragma("journal_mode = WAL")
db.exec(`
  CREATE TABLE IF NOT EXISTS clicks (
    click_id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    payout REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS decision_clicks (
    decision_id TEXT NOT NULL,
    click_id    TEXT NOT NULL,
    offer_id    TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (decision_id, click_id)
  );
`)

/**
 * Registra un clic saliente en la base de datos.
 */
export function recordClick({ click_id, offer_id, referrer, user_agent }) {
  const stmt = db.prepare(`
    INSERT INTO clicks (click_id, offer_id, referrer, user_agent)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(click_id, offer_id, referrer, user_agent)
}

/**
 * Actualiza el clic cuando llega el postback (conversión) de la red.
 */
export function updateConversion(click_id, status, payout) {
  const stmt = db.prepare(`
    UPDATE clicks 
    SET status = ?, payout = ? 
    WHERE click_id = ?
  `)
  const info = stmt.run(status, payout, click_id)
  return info.changes > 0
}

/**
 * Ata una decisión de elegibilidad con el click_id generado en /api/go/[id].
 * Cierra el loop: decision.payload (features point-in-time) + clicks.status (outcome).
 */
export function linkDecisionClick({ decision_id, click_id, offer_id }) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO decision_clicks (decision_id, click_id, offer_id)
    VALUES (?, ?, ?)
  `)
  stmt.run(decision_id, click_id, offer_id)
}

/**
 * Agrega los clics para calcular el EPC en el dashboard.
 */
export function getEPCStats() {
  const stmt = db.prepare(`
    SELECT 
      offer_id,
      COUNT(*) as total_clicks,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as total_conversions,
      SUM(payout) as total_revenue
    FROM clicks
    GROUP BY offer_id
    ORDER BY total_revenue DESC, total_clicks DESC
  `)
  
  const stats = stmt.all()
  
  // Calcular EPC
  return stats.map(row => ({
    ...row,
    epc: row.total_clicks > 0 ? (row.total_revenue / row.total_clicks).toFixed(2) : "0.00"
  }))
}
