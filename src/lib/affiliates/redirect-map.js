// Mapa estático de destinos de afiliados
// ID interno -> Destino final (Deeplink del afiliado)

export const affiliateRedirectMap = {
  nu: {
    destination: "https://nu.com.mx/prestamo-personal?aff=krediteca", // Ejemplo ilustrativo
    active: true,
  },
  mercadopago: {
    destination: "https://www.mercadopago.com.mx/credito?aff=krediteca",
    active: true,
  },
  kueski: {
    destination: "https://kueski.com/?aff=krediteca",
    active: true,
  },
}

export function getRedirectDestination(id) {
  const offer = affiliateRedirectMap[id]
  if (!offer || !offer.active) {
    // Fallback: Si no existe o está pausada, mandar al home o a una landing genérica
    return "/"
  }
  return offer.destination
}
