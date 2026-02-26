# VC Intelligence – Precision Sourcing Platform

A modern VC sourcing dashboard built with Next.js that enables investors and analysts to explore companies, apply structured filters, and generate AI-powered enrichment summaries securely on the server.

---

## Overview

VC Intelligence is a lightweight sourcing tool designed to simulate a venture capital research workflow.

It allows users to:

* Browse structured company data
* Apply multi-criteria filters
* Save custom searches
* Create curated company lists
* Enrich company profiles using AI

The enrichment feature runs entirely server-side via a secure API route, ensuring that API keys are never exposed to the client.

---

## Core Features

### Company Discovery

* Browse 20 structured mock companies
* Filter by funding stage, industry, and growth signals
* Real-time search functionality
* Table and detail views

### AI-Powered Enrichment

* Generates company summary
* Extracts business model insights
* Identifies potential growth signals
* Returns structured response format

All enrichment requests are processed via a server-side API route.

### Lists Management

* Create and manage custom company lists
* Add/remove companies dynamically
* Lightweight state-based persistence (MVP scope)

### Saved Searches

* Save complex filter combinations
* Re-run previously defined sourcing queries

---

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **UI:** React 19 + Tailwind CSS + shadcn/ui
* **API Layer:** Next.js Route Handlers
* **Deployment:** Vercel

---

## Architecture

The project follows a clear separation of concerns:

```
/app
  /api/enrich          → Server-side enrichment endpoint
  /layout.tsx          → Root layout
  /page.tsx            → Entry page

/components
  /pages               → Page-level components
  /companies           → Company-specific UI & logic
  /ui                  → Shared UI components

/lib
  types.ts             → Type definitions
  mock-data.ts         → Structured company dataset
```

### Enrichment Flow

1. User clicks "Enrich"
2. Client sends POST request to `/api/enrich`
3. Server route calls OpenAI using `process.env.OPENAI_API_KEY`
4. Structured response is returned to client
5. UI updates with enriched insights

No API keys are exposed to the frontend.

---

## Local Development

### Prerequisites

* Node.js 18+
* npm or pnpm
* OpenAI API key

### Installation

```bash
git clone <your-repo-url>
cd vc-intelligence
npm install
```

Create a `.env.local` file:

```
OPENAI_API_KEY=your_openai_key_here
```

Start development server:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## Production Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variable:

```
OPENAI_API_KEY=sk_...
```

4. Deploy

The application is optimized for serverless deployment using Vercel.

---

## Security Considerations

* OpenAI API key stored in environment variables
* No client-side secret exposure
* Enrichment handled exclusively server-side
* No direct browser calls to external AI APIs

---

## Known Limitations (MVP Scope)

* Uses mock company data (20 companies)
* Lists and saved searches are not persisted across refresh
* No authentication layer
* No external database integration
* API rate limits depend on OpenAI account tier

---

## Future Improvements

* Database integration (Supabase / PostgreSQL)
* Authentication & user accounts
* Persistent list & search storage
* Real-time data ingestion
* Advanced scoring and ranking models
* Batch enrichment workflows

---

## Design Philosophy

This project focuses on:

* Clean component architecture
* Secure server-side AI integration
* Practical VC sourcing workflow simulation
* Deployment-ready production setup

It is intentionally scoped as an MVP to demonstrate architectural clarity, API integration, and secure AI usage patterns.

---

## Author

Built as part of a venture capital sourcing technical assignment.
