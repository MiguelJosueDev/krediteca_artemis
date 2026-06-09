// Helper de cálculo financiero compartido.
// Sin `import "server-only"` — lo usan componentes "use client" (LoanSimulator,
// ConsolidationSimulator). Funciones puras, sin side effects.

/**
 * Pago mensual fijo de un préstamo a plazos (fórmula PMT estándar).
 * Superconjunto de guardas de ambas implementaciones previas.
 */
export function calculatePMT(principal, annualRatePct, months) {
  if (principal <= 0) return 0
  if (annualRatePct <= 0) return principal / months
  const r = (annualRatePct / 100) / 12
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

/**
 * Totales del préstamo: pago mensual, total pagado e interés total.
 */
export function loanTotals({ principal, annualRatePct, months }) {
  const monthlyPayment = calculatePMT(principal, annualRatePct, months)
  const totalPaid = monthlyPayment * months
  const totalInterest = totalPaid - principal
  return {
    monthlyPayment,
    totalPaid,
    totalInterest: totalInterest > 0 ? totalInterest : 0,
  }
}

/**
 * Tabla de amortización mes a mes.
 * Se calcula sin redondear; el saldo de la última fila se fuerza a 0 para
 * evitar drift de punto flotante (un -$0.13 final lee como bug en YMYL).
 */
export function buildAmortizationSchedule({ principal, annualRatePct, months }) {
  const payment = calculatePMT(principal, annualRatePct, months)
  const r = annualRatePct > 0 ? (annualRatePct / 100) / 12 : 0
  const rows = []
  let balance = principal

  for (let month = 1; month <= months; month++) {
    const interestPart = balance * r
    const principalPart = payment - interestPart
    balance -= principalPart

    rows.push({
      month,
      payment,
      principalPart,
      interestPart,
      balance: month === months ? 0 : balance,
    })
  }

  return rows
}
