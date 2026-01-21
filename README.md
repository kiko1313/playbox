# Agtalist.info

Production-grade video platform built with Next.js 14, Firebase, and Cloudflare R2.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Cloudflare R2
- **Deployment**: Vercel
- **Styling**: Vanilla CSS (Design System)

## Design System

### Colors
- Primary: `#F22BB9`
- Accent: `#6F1249`
- Background: `#0F0E0F`
- Text: `#FFFFFF`

### Typography  
- Font: Poppins
- H1/H2: 48px
- Body: 20px

### Spacing
- Base Unit: 8px
- Border Radius: 12px

## Environment Variables

Create `.env.local` with:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with NavBar
│   ├── page.tsx             # Home (Videos)
│   ├── links/page.tsx       # Links & Files
│   ├── admin/page.tsx       # Admin Dashboard
│   ├── watch/[id]/page.tsx  # Video Player
│   └── api/
│       └── upload/
│           └── sign/route.ts # Presigned URL generation
├── components/
│   └── NavBar.tsx           # Persistent navigation
└── lib/
    ├── firebase.ts          # Firebase configuration
    ├── r2.ts                # R2 client
    └── utils.ts             # Utility functions
```

## Features

- 🎥 Video streaming with YouTube & direct file support
- 📁 File management with R2 storage
- 🔐 Secure admin authentication
- 📱 Mobile-responsive design
- ⚡ Presigned URL uploads
- 🎨 Professional UI/UX

## Deployment

Connected to Vercel via GitHub (kiko1313/playbox).

Push to `main` branch triggers automatic deployment.

## License

Private
