# CiveMate landing page

React/Vite landing page for the CiveMate demo waitlist.

## Run locally

```bash
npm install
npm run dev
```

## Connect the waitlist

Copy `.env.example` to `.env` and set `VITE_WAITLIST_ENDPOINT` to an endpoint that accepts JSON POST requests:

```json
{
  "name": "Ada",
  "email": "ada@example.com",
  "role": "Artist or creator",
  "source": "civemate-landing"
}
```

Without an endpoint, the form runs in clearly labelled demo mode and stores entries in the current browser's local storage.
