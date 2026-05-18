# Braham Licia Consulting Website

React + Vite public website with a Home-page-only inline CMS backed by Firebase.

## Local Development

```bash
npm install
npm run dev
```

## Build Checks

```bash
npm run lint
npm run build
```

## Public Environment Variables

Copy `.env.example` to `.env.local` for local testing. In Vercel, set the same variables in Project Settings.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_API_KEY=
```

The public website still renders hardcoded fallback content if Firebase variables are missing.

## Admin Access

Open `/admin/` and sign in with Google. The allowed emails are:

```text
orevaorior@gmail.com
jovisamblue@gmail.com
```

Dashboard v1 contains only:

- Enquiries inbox.
- Edit Home Page launcher.
- Seed Home Fallback button.

## Home Inline Editing

Open `/admin/?edit=home` from the dashboard. The real Home page loads in locked edit mode. Click any outlined text, link, or image to edit it. Every save creates a revision backup before writing to `sitePages/home`.

Main Firestore paths:

```text
sitePages/home
sitePageRevisions/home/items/{revisionId}
mediaAssets/{id}
enquiries/{id}
admins/{uid}
```

## Cloudinary Uploads

Image uploads use the callable Firebase Function `createCloudinaryUploadSignature`. The Cloudinary API secret must never be placed in Vite env vars.

Set Functions secrets before deploying functions:

```bash
firebase functions:secrets:set CLOUDINARY_CLOUD_NAME
firebase functions:secrets:set CLOUDINARY_API_KEY
firebase functions:secrets:set CLOUDINARY_API_SECRET
```

Rotate any Cloudinary API secret that was previously shared before production deployment.

## Firebase Deploy Notes

Deploy Firestore rules and Functions after Firebase CLI login:

```bash
firebase deploy --only firestore:rules
firebase deploy --only functions
```

Seed current hardcoded Home content into Firestore from an authenticated machine:

```bash
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
$env:FIREBASE_PROJECT_ID="brahamlicia"
npm run seed:home
```

The dashboard also has a Seed Home Fallback button for allowed admins.
