# ADR-001 — Modelo de negocio: Lead-gen, no originación

**Estado:** Aceptado  
**Fecha:** 2026-06-09  
**Decidor:** Miguel Cruz

## Contexto

El sprint planning marcaba esta decisión como "no-posponible" porque gobierna el `Outcome`,
la latencia de feedback y a quién le aplica la acción adversa.

Opciones consideradas:
1. **Lead-gen** — rankeamos y ruteamos al partner. Nosotros no prestamos.
2. **Originación** — nosotros decidimos el crédito. Requiere buró, regulación CNBV/CONDUSEF
   directa sobre la decisión crediticia, y latencia de repago (meses) para el Outcome.

## Decisión

**Lead-gen.**

Krediteca ranquea y rutea al partner afiliado (Nu, Mercado Pago, Kueski…); el partner toma
la decisión crediticia real. El `Outcome` es una conversión confirmada vía postback
(`status='approved'` en `/api/postback/leadgid`).

## Consecuencias

- **`EligibilityDecision`** (≡ `CreditDecision` en nuestro dominio) = ruteo de ofertas, no
  aprobación de crédito.
- **Acción adversa** = razón interna de por qué una oferta no se rutea (etiqueta para ML
  futuro), NO un aviso legal ECOA/Banamex al consumidor. Eso lo hace el partner.
- **Latencia del Outcome:** días/semanas (tiempo al postback), no meses de repago. El gate ML
  se desbloquea mucho antes que en originación.
- **Obligaciones legales directas:** reducidas vs. originación, pero LFPDPPP aplica a la
  captura de datos del solicitante. Ver ADR-003.
- El postback existente (`/api/postback/leadgid`) ya es la infraestructura del Outcome. No se
  construye desde cero.

## Revisión

Revisar si la regulación CONDUSEF exige avisos adicionales cuando el sitio hace scoring
interno de elegibilidad aunque no otorgue crédito directamente. **Verificar con abogado antes
de capturar datos reales.**
