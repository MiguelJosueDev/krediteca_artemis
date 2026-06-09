import { Inter } from "next/font/google";
import "./globals.css";
// El comparador es global: la bandeja debe vivir en el layout raíz para que la
// selección persista al navegar entre /comparador, el home, etc. Aquí (servidor)
// se arma el catálogo unificado; getTopOffers sigue server-only y solo cruza al
// cliente su salida ya normalizada.
import { getTopOffers } from "@/lib/affiliates/leadgid";
import { allCards, normalizeCard, normalizeLoan } from "@/lib/catalog";
import CompareProvider from "./components/compare/CompareProvider";
import CompareWidget from "./components/compare/CompareWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://krediteca.com"),
  title: {
    default: "Krediteca · Comparador Financiero en México",
    template: "%s | Krediteca"
  },
  description:
    "Compara tasas, plazos y requisitos reales de bancos y fintech mexicanas. Sin letras chiquitas, sin sorpresas.",
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }) {
  // Catálogo unificado para el comparador (tarjetas + préstamos normalizados).
  // getTopOffers() y los normalizadores corren en el servidor; al cliente solo
  // cruza `compareCatalog` (data pública ya serializada).
  const loans = await getTopOffers();
  const compareCatalog = [
    ...allCards.map(normalizeCard),
    ...loans.map(normalizeLoan),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "Organization"],
    name: "Krediteca",
    url: "https://krediteca.com",
    logo: "https://krediteca.com/krediteca_logo_navbar.png",
    description: "Comparador financiero en México. Compara tasas, plazos y requisitos de préstamos personales y tarjetas de crédito.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Paseo de la Reforma 250",
      addressLocality: "Ciudad de México",
      addressRegion: "CDMX",
      postalCode: "06600",
      addressCountry: "MX"
    },
    sameAs: [
      "https://www.linkedin.com/company/krediteca",
      "https://twitter.com/krediteca"
    ]
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <CompareProvider catalog={compareCatalog}>
          {children}
          <CompareWidget />
        </CompareProvider>
      </body>
    </html>
  );
}
