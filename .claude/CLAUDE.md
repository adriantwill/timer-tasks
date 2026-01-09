# Timer Tasks

## Deployment
- Hosted on VPS at tasks.adrianwill.com
- Runs on port 3001 (port 3000 used by study-sesh)
- GitHub Actions auto-deploys on push to main
- Image: ghcr.io/adriantwill/timer-tasks:latest

## Data
- Uses localStorage (no backend DB)
- lifetimeStats tracks total time + weeks completed per task
- Export button downloads JSON backup

## Stack
- Next.js 16 + React 19
- Tailwind CSS
- @js-temporal/polyfill for week calculations
