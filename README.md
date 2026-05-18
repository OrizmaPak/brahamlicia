# Braham Licia Consulting Website

React + Vite public website with a Firebase-backed CMS dashboard.

## Local Setup

1. Install dependencies:

```bash
npm install
npm install --prefix functions
```

2. Create `.env.local` from `.env.example`.

3. Run the site:

```bash
npm run dev
```

The admin dashboard is available at `/admin/`.

## Firebase CMS

The public site renders from local fallback content first, then subscribes to Firestore published content when Firebase is configured.

Collections:

- `publishedContent/{section}/items/{id}`: public readable content.
- `cmsDrafts/{section}/items/{id}`: admin draft content.
- `admins/{uid}`: dashboard access list.
- `enquiries/{id}`: contact form submissions.
- `mediaAssets/{id}`: Cloudinary upload metadata.

Enable Google as a sign-in provider in Firebase Auth.

Allowed admin Gmail accounts are currently:

- `orevaorior@gmail.com`
- `jovisamblue@gmail.com`

These accounts can access the dashboard immediately. You can also add additional users by placing their UID in `admins/{uid}`.

## Cloudinary Uploads

Cloudinary uploads are signed by Firebase Functions. Do not store `CLOUDINARY_API_SECRET` in frontend env files.

Set secrets before deploying functions:

```bash
firebase functions:secrets:set CLOUDINARY_CLOUD_NAME
firebase functions:secrets:set CLOUDINARY_API_KEY
firebase functions:secrets:set CLOUDINARY_API_SECRET
npm run functions:deploy
```

The Cloudinary API secret shared during setup should be rotated before production use.

## Seed Content

Seed current fallback content into Firestore with a Firebase service account:

```bash
$env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\path\to\service-account.json"
npm run seed:firebase
```

The dashboard also includes a `Seed defaults` button for authenticated admins.

## Verification

```bash
npm run lint
npm run build
```
