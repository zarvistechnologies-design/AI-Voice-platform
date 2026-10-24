# AI Voice Platform Frontend

This is the Next.js + TypeScript frontend for the AI Voice Platform project.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

The local development server runs at `http://localhost:3000` by default.

## Production API routing

Use the same-origin API proxy in production. This keeps authentication cookies
on the frontend origin and lets the browser reuse its existing connection:

```env
BACKEND_URL=https://your-backend.example.com
NEXT_PUBLIC_API_PROXY_MODE=on
NEXT_PUBLIC_API_URL=
```

`BACKEND_URL` is server-only and must be reachable by the Next.js container.
The Dockerfile intentionally has no hosted-backend default: every deployment
must pass its own `BACKEND_URL` build argument. Docker Compose uses the internal
`http://backend:5000` service address. Never use `localhost` as a
browser-facing production API URL.

## Google sign-in

Create `.env.local` and add the Google OAuth Web client ID:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Use the same value for `GOOGLE_CLIENT_ID` in the backend `.env`. In Google
Cloud Console, add `http://localhost:3000` as an authorized JavaScript origin.
The Google client secret must not be added to the frontend.

## WhatsApp Embedded Signup

Create a WhatsApp Embedded Signup v4 configuration under **Facebook Login for
Business > Configurations** in your Meta app. Configure the frontend with that
app's ID and the new configuration ID:

```env
NEXT_PUBLIC_META_APP_ID=your-meta-app-id
NEXT_PUBLIC_META_CONFIG_ID=your-v4-embedded-signup-configuration-id
```

In the backend environment, set `META_APP_ID` to the same app ID and set
`META_APP_SECRET` to that app's secret. Keep the secret server-side. Add the
frontend origin to the Meta app's allowed JavaScript SDK domains and OAuth
settings. Use HTTPS outside localhost. Rebuild and redeploy the frontend after
changing either `NEXT_PUBLIC_` value.

The WhatsApp connection screen reports missing configuration instead of
launching Meta with another app's ID. Coexistence requires the corresponding
WhatsApp Business app onboarding capability in your Meta configuration.

## Folder Structure

```text
src/
  app/
    layout.tsx        Root HTML, fonts, and metadata
    page.tsx          Home page composition
    globals.css       Global styles and design tokens
  components/
    layout/           Header, footer, and page shell
    sections/         Home page sections
    ui/               Small reusable UI pieces
  config/
    site.ts           Navigation, footer links, and content constants
  hooks/
    useTheme.ts       Light, dark, and system theme preference
public/               Static assets
```

## Development Notes

- Add page-level sections inside `src/components/sections`.
- Add shared layout pieces inside `src/components/layout`.
- Keep reusable content arrays and site-wide labels in `src/config/site.ts`.
- Keep `src/app/page.tsx` focused on composing the page, not holding all UI code.
