# VC Intelligence - Precision Sourcing Platform

A modern SaaS platform for VC investors and analysts to discover and enrich company data with real-time web intelligence.

## Features

- **Company Discovery & Search**: Browse 20+ mock companies with advanced filtering by funding stage, industry, and signals
- **Real-Time Company Enrichment**: AI-powered data enrichment that extracts:
  - Company summaries and business model analysis
  - Key product features and market positioning
  - Growth signals and investment indicators
  - Relevant sources and references
- **Company Profiles**: Comprehensive company details including founders, funding, team size, and key metrics
- **Lists & Collections**: Create and manage custom company lists for organized sourcing
- **Saved Searches**: Save and re-run complex filter combinations for regular updates
- **Professional UI**: Built with shadcn/ui components and Tailwind CSS for a premium experience

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: React 19 + shadcn/ui + Tailwind CSS
- **Styling**: Dark mode support with custom color tokens
- **Database**: Mock data (ready for Supabase/Neon integration)
- **API**: Next.js Route Handlers for enrichment endpoints

## Getting Started

### Installation

1. **Using shadcn CLI** (Recommended):
   ```bash
   npx shadcn-cli@latest init my-vc-app
   cd my-vc-app
   git clone <this-repo> .
   npm install
   ```

2. **Manual Setup**:
   ```bash
   git clone <this-repo>
   cd vc-intelligence
   pnpm install
   ```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
/app
  /api/enrich          - Company enrichment API endpoint
  /layout.tsx          - Root layout with theme setup
  /page.tsx            - Main app shell
  /globals.css         - Design tokens and theme configuration

/components
  /layout              - App shell components (sidebar, top bar)
  /pages               - Page components (companies, lists, searches)
  /companies           - Company-specific components (table, filters, profile)
  /ui                  - shadcn/ui components

/lib
  types.ts             - TypeScript interfaces
  mock-data.ts         - 20 sample companies for development
```

## Core Components

### Companies Explorer (`/components/pages/companies-page.tsx`)
- Table and card view modes
- Advanced filtering by stage, industry, and signals
- Real-time search
- Click-to-enrich workflow

### Company Profile Sheet (`/components/companies/company-profile-sheet.tsx`)
- Detailed company information
- Founders and team information
- Signal analysis
- AI-powered enrichment with source citations
- Save and share functionality

### Lists Management (`/components/pages/lists-page.tsx`)
- Create and manage custom company lists
- Export functionality
- List sharing

### Saved Searches (`/components/pages/saved-searches-page.tsx`)
- Save filter combinations
- Quick access to frequently-used searches
- Edit and delete saved searches

## Enrichment API

The enrichment endpoint (`/api/enrich`) accepts a POST request:

```bash
curl -X POST http://localhost:3000/api/enrich \
  -H "Content-Type: application/json" \
  -d '{
    "website": "example.com",
    "company_name": "Example Corp"
  }'
```

Response includes company summary, business description, keywords, signals, and source URLs.

## Color Theme

- **Primary**: Deep purple (`oklch(0.4 0.15 280)`)
- **Secondary**: Medium purple (`oklch(0.5 0.12 260)`)
- **Accent**: Bright purple (`oklch(0.6 0.15 270)`)
- **Dark Mode**: Sophisticated dark background with light text
- **Neutral**: Gray scale for backgrounds and borders

## Future Enhancements

- Supabase integration for persistent storage
- Real user authentication with Auth.js
- WebSocket support for live data updates
- Advanced analytics dashboard
- Investment thesis builder
- Deal pipeline management
- Team collaboration features
- Export to PowerPoint/PDF

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

The app is production-ready and can be deployed to Vercel with a single command. Environment variables (if needed for APIs) can be configured in the Vercel dashboard.

### GitHub Integration

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/vc-intelligence.git
   git push -u origin main
   ```
3. Connect to Vercel for automatic deployments

## Performance Optimizations

- Server-side rendering for fast initial loads
- Client-side filtering for instant feedback
- Lazy loading of company profiles
- Optimized bundle size with tree-shaking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or feature requests, please create an issue in the GitHub repository or contact the development team.
