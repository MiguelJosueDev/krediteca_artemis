import { NextResponse } from "next/server"
import { updateConversion } from "@/lib/db"

// Helper para disparar GA4 Server-Side
async function sendGA4Conversion(clickId, payout, status) {
  const measurement_id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"
  const api_secret = process.env.GA_API_SECRET || "DUMMY_SECRET"

  if (api_secret === "DUMMY_SECRET") return

  try {
    // Si la venta fue aprobada, enviamos un evento de compra/lead con el valor monetario
    const eventName = status === "approved" ? "purchase" : "lead_rejected"
    
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
      method: "POST",
      body: JSON.stringify({
        // Usamos el mismo click_id que usamos como client_id en el evento de click
        // Esto permite a GA4 atar la conversión a la misma sesión.
        client_id: clickId, 
        events: [{
          name: eventName,
          params: {
            currency: "MXN",
            value: payout,
            transaction_id: clickId, // Para evitar duplicados
          },
        }]
      })
    })
  } catch (error) {
    console.error("Error enviando GA4 Conversion:", error)
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  // 1. Autenticación Sencilla
  // La red de afiliados debe configurar este secreto en la URL del postback
  // Ej: https://krediteca.com/api/postback/leadgid?secret=SECRETO_AQUI&click_id={sub1}&status={status}&payout={payout}
  const expectedSecret = process.env.POSTBACK_SECRET || "DUMMY_POSTBACK_SECRET"
  const secret = searchParams.get("secret")
  
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Extraer parámetros de la red
  const click_id = searchParams.get("click_id")
  const status = searchParams.get("status") || "approved"
  const payout = parseFloat(searchParams.get("payout") || "0")

  if (!click_id) {
    return NextResponse.json({ error: "Missing click_id" }, { status: 400 })
  }

  // 3. Reconciliar en Base de Datos
  const success = updateConversion(click_id, status, payout)

  if (!success) {
    // El click_id no existe en nuestra DB (click falso o expirado)
    return NextResponse.json({ error: "Click ID not found" }, { status: 404 })
  }

  // 4. Enviar Conversión a GA4
  // No hacemos await para responderle rápido a la red de afiliados.
  sendGA4Conversion(click_id, payout, status)

  return NextResponse.json({ success: true, click_id, status, payout })
}
