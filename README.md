# Soilahoudine Mohamed Ali — Site Personnel v2

## Stack
- Next.js 15 (App Router, JS only)
- MySQL (Aiven) + Prisma ORM
- NextAuth.js (Google + GitHub)
- Tailwind CSS + Playfair Display + Inter

## Installation

```bash
npm install
cp .env.example .env
# Remplis .env avec tes vraies valeurs
npm run db:generate
npm run db:push
npm run dev
```

## Ajouter ta photo
Place ton fichier photo dans `public/photo.jpg`

## Variables .env requises
- DATABASE_URL : ta connexion Aiven MySQL
- NEXTAUTH_SECRET : `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- GOOGLE_CLIENT_ID / SECRET : console.cloud.google.com
- GITHUB_CLIENT_ID / SECRET : github.com/settings/developers
- ADMIN_EMAIL : ton email (seul accès admin autorisé)

## Pages
| Route | Description |
|-------|-------------|
| / | Accueil portfolio |
| /actualites | Liste articles |
| /actualites/[slug] | Article détail |
| /admin | Dashboard admin |
| /admin/articles | Gérer actualités |
| /admin/projets | Gérer projets |
| /admin/annonces | Gérer annonces |

## API REST
- GET/POST /api/articles
- GET/PUT/DELETE /api/articles/[id]
- GET/POST /api/projets
- PUT/DELETE /api/projets/[id]
- GET/POST /api/annonces
- PUT/DELETE /api/annonces/[id]

## Déploiement Vercel
1. Push sur GitHub
2. Import sur vercel.com
3. Ajoute les variables .env dans Vercel Settings
4. Deploy !
