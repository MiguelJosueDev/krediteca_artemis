// Configuración versionada del scorer. NUNCA hardcodeada en el use case (invariante 5).
// Incrementar configVersion si cambias cualquier valor.

export interface ThresholdConfig {
  configVersion: string
  // Umbral mínimo de score para que una oferta entre a ranked (vs. excluded below_threshold)
  routingThreshold: number
  // Bandas de score para presentación al usuario
  bandThresholdAlta: number
  bandThresholdMedia: number
  // Cortes de DTI (reusa los del CapacitySimulator)
  dtiSaludable: number    // DTI ≤ este valor → Saludable
  dtiPrecaucion: number   // DTI ≤ este valor → Precaución; > → Peligro (excluido)
  // Pesos de las contribuciones (deben sumar 1 para que score ∈ [0,1])
  wIncome: number
  wDti: number
  wCapacity: number
}

export const THRESHOLDS: ThresholdConfig = {
  configVersion: "rules-v0.1",
  routingThreshold: 0.1,
  bandThresholdAlta: 0.6,
  bandThresholdMedia: 0.3,
  dtiSaludable: 35,
  dtiPrecaucion: 43,
  wIncome: 0.5,
  wDti: 0.3,
  wCapacity: 0.2,
}
