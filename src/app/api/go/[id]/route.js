import { NextResponse } from "next/server"
import { getRedirectDestination } from "@/lib/affiliates/redirect-map"
import { recordClick } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Helper para disparar GA4 Server-Side
async function sendGA4Event(eventName, params, clientId) {
  const measurement_id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"
  const api_secret = process.env.GA_API_SECRET || "DUMMY_SECRET"

  if (api_secret === "DUMMY_SECRET") return // Ignorar si no está configurado

  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
        events: [{
          name: eventName,
          params: params,
        }]
      })
    })
  } catch (error) {
    console.error("Error enviando GA4 Event:", error)
  }
}

export async function GET(request, { params }) {
  const { id } = await params
  
  // 1. Resolver destino base
  let destinationUrl = getRedirectDestination(id)

  if (destinationUrl === "/") {
    return NextResponse.redirect(new URL("/", request.url), 302)
  }

  // 2. Generar contexto y Click ID
  const click_id = uuidv4()
  const referrer = request.headers.get("referer") || "direct"
  const user_agent = request.headers.get("user-agent") || "unknown"
  
  // 3. Persistir en Base de Datos (asíncrono, no bloqueamos el thread con await si usamos SQLite sincrónico, pero la función de better-sqlite3 es síncrona, lo cual está bien para MVP local)
  recordClick({ click_id, offer_id: id, referrer, user_agent })
  
  // 4. Construir URL de destino inyectando el click_id
  // LeadGid y la mayoría de redes usan sub1, aff_sub, o click_id.
  const urlObj = new URL(destinationUrl)
  urlObj.searchParams.set("aff_sub", click_id)
  const finalDestination = urlObj.toString()

  // 5. Disparar Measurement Protocol a GA4 (sin bloquear la respuesta)
  // Como no tenemos la cookie _ga aquí fácilmente, usamos el click_id como client_id
  // para poder atarlo luego cuando hagamos el postback.
  sendGA4Event("affiliate_click", {
    offer_id: id,
    click_id: click_id,
    origin_referrer: referrer
  }, click_id)

  // 6. Responder con HTTP 307 (Temporary Redirect) y protección SEO
  const response = NextResponse.redirect(finalDestination, 307)
  
  // Evitar explícitamente que los motores de búsqueda indexen esta ruta
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("Cache-Control", "no-store, max-age=0")

  return response
}
