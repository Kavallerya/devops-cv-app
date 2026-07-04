# CV Frontend — React SPA

DevOps portfolio dashboard built with React 18, Vite 6, and Tailwind CSS v4.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [How It Works](#how-it-works)
5. [Component Tree](#component-tree)
6. [API Endpoints Consumed](#api-endpoints-consumed)
7. [Theme System](#theme-system)
8. [Animations](#animations)
9. [Nginx Configuration](#nginx-configuration)
10. [Docker Build](#docker-build)
11. [Local Development](#local-development)
12. [Production Build](#production-build)
13. [Security](#security)

---

## Overview

A single-page application (SPA) that renders a DevOps engineer's professional portfolio. Styled as a dashboard with Grafana-inspired metric panels, dark/light themes, and scroll-triggered animations. All data is fetched at runtime from the FastAPI backend.

**Key features:**

- Dashboard-style metric bar (uptime, visitors, response time, deployment platform)
- Dark/light theme with system preference detection and persistence
- Interactive architecture showcase (CI/CD pipeline, infrastructure diagram, Kubernetes overview)
- GitHub activity integration via backend proxy
- Projects and certifications grids
- Contact form with optimistic UI
- CV download button
- Staggered scroll-reveal animations
- Skeleton loading states for every section
- Fully responsive (mobile-first)

---

## Tech Stack

| Layer             | Technology                          |
| ----------------- | ----------------------------------- |
| Framework         | React 18.3.1                        |
| Build Tool        | Vite 6                              |
| Styling           | Tailwind CSS v4                     |
| HTTP Client       | Axios 1.7.9                         |
| Animations        | framer-motion 11                    |
| Icons             | react-icons 5 (Feather Icons set)   |
| Fonts             | Inter (body) + JetBrains Mono (code)|
| Runtime (prod)    | Nginx Alpine (multi-stage Docker)   |
| Dev Server        | Vite dev server (port 5173)         |

---

## Project Structure

```
frontend/
├── index.html                          # Vite entry HTML, Google Fonts link
├── package.json                        # Dependencies & scripts
├── vite.config.js                      # Vite + React + Tailwind plugins, dev proxy
├── nginx.conf                          # Production Nginx config
├── Dockerfile                          # Multi-stage: Node build → Nginx serve
│
└── src/
    ├── main.jsx                        # ReactDOM entry, ThemeProvider wrapper
    ├── App.jsx                         # Root component: data fetching + layout
    ├── index.css                       # Tailwind imports + @theme definitions + custom keyframes
    │
    ├── api/
    │   ├── cvApi.js                    # Core CV data (profile, experience, skills)
    │   └── dashboardApi.js             # Dashboard data (status, GitHub, projects, certs, contact)
    │
    ├── context/
    │   └── ThemeContext.jsx            # Theme state, system detection, localStorage persistence
    │
    └── components/
        ├── layout/
        │   ├── Header.jsx              # Sticky nav bar: logo, links, theme toggle, CV download, API docs
        │   └── Footer.jsx              # Links: GitHub, Monitoring, API + tech stack badge
        │
        ├── dashboard/
        │   └── MetricsBar.jsx          # 4 metric cards (uptime, visitors, response, platform)
        │
        ├── profile/
        │   └── ProfileHero.jsx         # Centered hero: avatar, name, title, summary, contact chips
        │
        ├── skills/
        │   └── SkillsDashboard.jsx     # Grid of category panels with skill bars and emoji icons
        │
        ├── experience/
        │   └── ExperienceTimeline.jsx  # Vertical timeline with animated cards
        │
        ├── github/
        │   └── GitHubActivity.jsx      # GitHub stats + recent repos grid
        │
        ├── architecture/
        │   └── ArchitectureShowcase.jsx # Tabbed showcase: CI/CD flow, infra diagram, K8s details
        │
        ├── projects/
        │   └── ProjectsGrid.jsx        # Project cards with tech stack badges
        │
        ├── certifications/
        │   └── CertificationsGrid.jsx  # Certification cards with issuer-specific accent colors
        │
        ├── contact/
        │   └── ContactForm.jsx         # Form with validation, sending/success/error states
        │
        └── ui/
            ├── ThemeToggle.jsx         # Animated sun/moon icon with rotation
            ├── SectionHeading.jsx      # Section title with optional badge (monospace)
            ├── StatusBadge.jsx         # Pulsing green/yellow/red status dot
            ├── SkeletonCard.jsx        # Reusable pulse skeleton with configurable lines
            └── ScrollReveal.jsx        # framer-motion wrapper: fade-up on scroll-in-view
```

---

## How It Works

### Boot Sequence

1. **`main.jsx`** renders `<ThemeProvider>` wrapping `<App />`.
2. **`ThemeProvider`** initializes theme from `localStorage` (fallback: `prefers-color-scheme` media query), applies `dark` class to `<html>`.
3. **`App.jsx`** mounts, kicks off `useEffect` that fetches core CV data via `Promise.all`:
   - `GET /api/profile` → sets `profile` state
   - `GET /api/experience` → sets `experience` state
   - `GET /api/skills` → sets `skills` state
4. While fetching, all sections show **skeleton loading** placeholders.
5. On error, a red error banner is displayed at the top of `<main>`.
6. Core data is passed down as **props** to child components.

### Lazy Sections

The following sections load their own data independently via `useEffect`:

| Section               | API Call                          | Loading State          |
| --------------------- | --------------------------------- | ---------------------- |
| MetricsBar            | `GET /api/status`                 | Pulse skeleton cards   |
| GitHubActivity        | `GET /api/github/activity`        | Pulse skeleton block   |
| ProjectsGrid          | `GET /api/projects`               | Pulse skeleton cards   |
| CertificationsGrid    | `GET /api/certifications`         | Pulse skeleton cards   |
| ContactForm           | `POST /api/contact` (on submit)   | Button spinner         |

This approach means the page renders immediately with core CV content visible while secondary sections load independently. Failed secondary requests silently show nothing — they don't break the page.

---

## Component Tree

```
App
├── Header
│   ├── Logo + Name
│   ├── Nav Links (anchor scroll)
│   ├── API Docs link
│   ├── CV Download button
│   └── ThemeToggle
│
├── <main>
│   ├── [Error Banner]          (conditionally rendered on API failure)
│   ├── MetricsBar              (4 MetricCard instances)
│   ├── ProfileHero             (ContactChip instances)
│   ├── SkillsDashboard         (Category panels with SkillBadge)
│   ├── ExperienceTimeline      (TimelineNode instances)
│   ├── GitHubActivity          (StatPill + Repo cards)
│   ├── ArchitectureShowcase    (Tab: CICDFlow | InfraDiagram | K8sOverview)
│   ├── ProjectsGrid            (ProjectCard instances)
│   ├── CertificationsGrid      (CertBadge instances)
│   └── ContactForm             (InputField instances)
│
└── Footer
```

**Data flow:** App fetches profile/experience/skills → passes as props. Each secondary section manages its own data fetching via local `useState` + `useEffect`.

**Why prop drilling over Context:** The data is consumed by exactly 3 Sibling components. Adding a Context/Zustand store would be over-engineering for this use case. Secondary sections are self-contained with local state.

---

## API Endpoints Consumed

### Core CV (fetched on App mount)

| Endpoint              | Method | Response Shape                                                    |
| --------------------- | ------ | ----------------------------------------------------------------- |
| `/api/profile`        | GET    | `{ id, name, title, summary, email, phone?, location?, linkedin?, github? }` |
| `/api/experience`     | GET    | `{ items: [{ id, company, role, start_date, end_date?, description, order }], total }` |
| `/api/skills`         | GET    | `{ categories: { "Cloud": [{ id, category, name, level }], ... } }` |

### Dashboard & Secondary (fetched lazily by each section)

| Endpoint              | Method | Response Shape                                                    |
| --------------------- | ------ | ----------------------------------------------------------------- |
| `/api/status`         | GET    | `{ status, version, uptime_seconds, visitor_count }`              |
| `/api/github/activity`| GET    | `{ username, public_repos, followers, recent_repos: [...] }`      |
| `/api/certifications` | GET    | `[{ id, name, issuer, date, expiry_date?, credential_url?, badge_url?, order }]` |
| `/api/projects`       | GET    | `[{ id, name, description, tech_stack?, github_url?, live_url?, featured, order }]` |
| `/api/contact`        | POST   | Body: `{ name, email, subject, message }` → `{ id, message }`    |

---

## Theme System

**Implementation:** `src/context/ThemeContext.jsx`

1. **Initialization:** Checks `localStorage.getItem('theme')` → falls back to `window.matchMedia('(prefers-color-scheme: dark)')` → defaults to `'dark'`.
2. **Persistence:** Every theme change writes to `localStorage`.
3. **DOM update:** Toggles `dark` class on `<html>` element. Tailwind CSS uses this class to switch color variants (`dark:bg-surface-950` etc.).
4. **Toggle:** `ThemeToggle` component renders an animated sun/moon icon. The animation uses absolute positioning with opacity + rotation transitions (300ms).

**Why `<html>` instead of `<body>`:** Tailwind's `dark:` variant is configured to check the `dark` class on a parent element. Applying it to `<html>` ensures all Tailwind `dark:` utilities work correctly.

**Preload anti-flicker:** The `<html>` tag in `index.html` has `class="dark"` hardcoded. This ensures the page loads in dark mode by default, avoiding a white flash before React hydrates.

---

## Animations

All animations use **framer-motion** with the `whileInView` trigger (`once: true` to avoid re-triggering on scroll-back):

| Component              | Animation                                    | Delay Strategy         |
| ---------------------- | -------------------------------------------- | ---------------------- |
| `ScrollReveal` wrapper | `opacity: 0 → 1`, `y: 24 → 0` (fade-up)     | Configurable per use   |
| `MetricCard`           | Staggered scroll reveal                      | 0ms, 100ms, 200ms…     |
| `SkillsDashboard`      | Staggered grid cards                         | `idx * 80ms`           |
| `ExperienceTimeline`   | Horizontal slide-in + opacity                | `idx * 100ms`          |
| `GitHubActivity`       | Staggered fade-up on repo cards              | `idx * 60ms`           |
| `ArchitectureShowcase` | Tab content fade + scale                     | Varies per sub-component|
| `ProjectsGrid`         | Staggered fade-up                            | `idx * 80ms`           |
| `CertificationsGrid`   | Staggered fade-up                            | `idx * 60ms`           |
| `ContactForm`          | Success state: scale-up + opacity            | Immediate              |
| `ThemeToggle`          | Animated sun/moon rotation on toggle         | 300ms CSS transition   |

**Performance note:** All animations use `viewport={{ once: true }}` so they fire once and stay visible. No continuous animation on scroll-back.

---

## Nginx Configuration

The production Nginx config (`nginx.conf`) serves the built SPA with the following rules:

### SPA Routing
```
location / { try_files $uri $uri/ /index.html; }
```
Any URL that doesn't match a static file is served `index.html`, enabling client-side routing.

### API Proxy
```
location /api/ { proxy_pass http://backend:8000; }
location = /api/metrics { return 403; }
```
All `/api/` requests are forwarded to the backend service (Docker DNS resolves `backend` to the backend container). The `/api/metrics` endpoint is explicitly blocked from public access (Prometheus scrapes the backend directly inside the cluster via `ServiceMonitor`).

### Health Check Proxy
```
location /health { proxy_pass http://backend:8000; }
```
Backend health check is exposed through the frontend for Kubernetes liveness probes.

### Static Asset Caching
```
location ~* \.(js|css|png|svg|ico|woff2?|ttf|otf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```
Vite generates content-hashed filenames (e.g., `index-Bhm_FxvS.css`), so aggressive caching is safe — a new build produces new filenames.

### Security Headers
```
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin" always;
```

### Dotfile Protection
```
location ~ /\. { deny all; }
```
Blocks access to files like `.env`, `.git`, etc. from the web root.

---

## Docker Build

**Multi-stage Dockerfile:**

```
Stage 1 (builder):  node:20-alpine
  ├── npm install       (production deps only: react, react-dom, axios)
  ├── Copy source
  └── npm run build     → dist/ output (HTML + content-hashed JS/CSS)

Stage 2 (runtime):     nginx:alpine
  ├── Copy nginx.conf   → /etc/nginx/conf.d/default.conf
  └── Copy dist/        → /usr/share/nginx/html/
  └── EXPOSE 80
```

The build stage includes devDependencies (`vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`) for the build step. The runtime stage is a clean Nginx Alpine image (~12MB compressed).

---

## Local Development

### Prerequisites
- Node.js 20+
- Backend running on `http://localhost:8000`

### Setup

```bash
cd frontend
npm install
npm run dev
```

Vite starts a dev server on **http://localhost:5173** with HMR (Hot Module Replacement).

### Vite Dev Proxy

Configured in `vite.config.js`:
```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000', changeOrigin: true }
  }
}
```
All `/api/*` requests from the browser are proxied to the backend (port 8000), avoiding CORS issues during development.

### Environment Variables

No frontend-specific environment variables are needed. The API base URL is always `/api` (same origin in production, proxied in development).

---

## Production Build

```bash
npm run build
```

**Output:** `dist/` directory containing:
- `index.html` — entry point with module script reference
- `assets/index-{hash}.css` — Tailwind-generated CSS (~6.6 KB gzipped)
- `assets/index-{hash}.js` — Bundled React app (~112 KB gzipped)

The hashed filenames enable cache-busting and immutable caching in Nginx.

### Docker Build

```bash
docker build -t cv-frontend:latest .
```

The Docker image is built as part of the GitHub Actions CI/CD pipeline, scanned with Trivy, and pushed to Docker Hub.

---

## Security

| Concern                     | Mitigation                                               |
| --------------------------- | -------------------------------------------------------- |
| Public Prometheus metrics   | Nginx returns `403` for `GET /api/metrics`              |
| Clickjacking                | `X-Frame-Options: SAMEORIGIN`                            |
| MIME sniffing               | `X-Content-Type-Options: nosniff`                        |
| Referrer leakage            | `Referrer-Policy: strict-origin`                         |
| Dotfile exposure            | Nginx denies `location ~ /\.`                            |
| XSS (React)                | React auto-escapes JSX output by default                 |
| Content Security            | Not currently configured (CV site, no user-generated content) |

---

## Dependencies

### Production (`dependencies`)

| Package       | Version  | Purpose                         |
| ------------- | -------- | ------------------------------- |
| react         | ^18.3.1  | UI framework                    |
| react-dom     | ^18.3.1  | React DOM renderer              |
| axios         | ^1.7.9   | HTTP client for API calls       |
| framer-motion | ^11.x    | Declarative animations          |
| react-icons   | ^5.x     | Icon library (Feather Icons set)|

### Development (`devDependencies`)

| Package              | Version  | Purpose                      |
| -------------------- | -------- | ---------------------------- |
| vite                 | ^6.0.5   | Build tool + dev server      |
| @vitejs/plugin-react | ^4.3.4   | React Fast Refresh for Vite  |
| tailwindcss          | ^4.x     | Utility-first CSS framework  |
| @tailwindcss/vite    | ^4.x     | Tailwind Vite plugin         |