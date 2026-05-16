import AdminFloatingBtn from '@/components/AdminFloatingBtn'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'Soilahoudine Mohamed Ali — IA · Entrepreneur · Data Scientist',
  description:
    "CEO de Komor-IA, Fondateur de KM-News. Étudiant en Master IA & Data Science à l'Université Mohamed Premier d'Oujda.",
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
