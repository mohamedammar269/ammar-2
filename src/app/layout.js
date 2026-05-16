// import AdminFloatingBtn from '@/components/AdminFloatingBtn'
// import './globals.css'
// import Providers from '@/components/Providers'

// export const metadata = {
//   title: 'Soilahoudine Mohamed Ali - IA · Entrepreneur · Data Scientist',
//   description:
//     "CEO de Komor-IA, Fondateur de KM-News. Étudiant en Master IA & Data Science à l'Université Mohamed Premier d'Oujda.",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="fr">
//       <body>
//         <Providers>
//           {children}
//           <AdminFloatingBtn />
//         </Providers>
//       </body>
//     </html>
//   )
// }

import AdminFloatingBtn from '@/components/AdminFloatingBtn'
import './globals.css'
import Providers from '@/components/Providers'

// const BASE_URL = 'https://soilahoudine.com' // change quand tu auras ton domaine
const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Soilahoudine Mohamed Ali — CEO Komor-IA · Fondateur KM-News',
    template: '%s — Soilahoudine Mohamed Ali',
  },
  description:
    "CEO de Komor-IA, Fondateur et DG de KM-News. Étudiant en Master IA & Data Science à l'Université Mohamed Premier d'Oujda. Spécialisé en NLP, Machine Learning et développement web.",
  keywords: [
    'IA',
    'Intelligence Artificielle',
    'Data Science',
    'NLP',
    'Machine Learning',
    'Komor-IA',
    'KM-News',
    'Comores',
    'Maroc',
    'Oujda',
    'Next.js',
    'BERT',
    'Python',
  ],
  authors: [{ name: 'Soilahoudine Mohamed Ali', url: BASE_URL }],
  creator: 'Soilahoudine Mohamed Ali',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Soilahoudine Mohamed Ali',
    title: 'Soilahoudine Mohamed Ali — CEO Komor-IA · Fondateur KM-News',
    description:
      'CEO de Komor-IA, Fondateur de KM-News. Master IA & Data Science — Oujda, Maroc.',
    images: [
      {
        url: '/og-image.jpg', // metadataBase s'occupe du domaine automatiquement
        width: 1200,
        height: 630,
        alt: 'Soilahoudine Mohamed Ali — CEO Komor-IA · Fondateur KM-News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soilahoudine Mohamed Ali — CEO Komor-IA · Fondateur KM-News',
    description:
      'CEO de Komor-IA, Fondateur de KM-News. Master IA & Data Science.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
          <AdminFloatingBtn />
        </Providers>
      </body>
    </html>
  )
}
