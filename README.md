# SurpriseSpark 🎉✨
### *Don’t Just Send A Wish. Send A Surprise.*

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-lightgrey?style=flat-square&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20RLS-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

> **SurpriseSpark** is a commercial-grade celebration platform that transforms everyday birthday greetings into interactive, emotional 3D web experiences.
>
> Instead of sending a routine text message or static card, creators configure a bespoke 3D journey featuring tap-to-unwrap gift boxes, blowable birthday candles, floating polaroid memory reels, synchronized procedural audio, and heartfelt letters.

---

## 🏛️ Final Platform Architecture

SurpriseSpark is designed around 6 decoupled engines that ensure infinite scalability across categories (Birthday, Love, Anniversary, Friendship, Festivals) without hardcoded templates:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SURPRISESPARK PLATFORM                          │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────────┤
│   Template   │    Scene     │ Personalize  │    Audio     │    Security    │
│    Engine    │    Engine    │    Engine    │    Engine    │   & Privacy    │
├──────────────┼──────────────┼──────────────┼──────────────┼────────────────┤
│ Registry,    │ Camera,      │ Recipient    │ Web Audio    │ Sliding-window │
│ Immutability,│ lighting,    │ data, photo  │ synthesis,   │ rate limiters, │
│ versioning,  │ particles,   │ reel, notes, │ 7 procedural │ zero-PII       │
│ manifests    │ 3D models    │ variable res │ BGM tracks   │ sanitization   │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────────┘
```

1. **Template Engine (`lib/engine/templateRegistry.ts`)**: Manages template manifests, scene graphs, version locking, and backwards-compatible runtime resolution.
2. **Scene Engine (`components/engine/SceneRenderer.tsx`, `components/3d/`)**: Orchestrates 3D React Three Fiber scenes, camera trajectories via GSAP, instanced particle systems, and touch/mic interaction triggers.
3. **Personalization Engine (`lib/engine/variableResolver.ts`)**: Injects recipient names (`{{recipient_name}}`), sender signoffs (`{{sender_name}}`), and memory photo reels with dynamic unused-scene skipping.
4. **Audio Engine (`lib/audio/soundManager.ts`)**: Procedural Web Audio API sound generator synthesizing sound effects (`shake`, `lid_pop`, `fanfare`, `candle_blow`, `sparkle`) and 7 ambient BGM moods with zero external audio assets or licensing costs.
5. **Asset Engine (`lib/assets/`)**: Manages 3D models, textures, animations, slot assignments, and GLTF/GLB binary validation.
6. **Analytics & Privacy Engine (`lib/analytics/`)**: 9-stage product funnel progression with cryptographic deduplication and guaranteed zero-PII data sanitization.

---

## 🎂 8 Signature Birthday Templates

| Template | Slug | Scenes | Duration | Key Interactive Highlights |
| :--- | :--- | :---: | :---: | :--- |
| **Magic Gift 🎁** | `magic-gift` | 7 | 2-3 mins | Tap-to-unwrap physics, lid pop animation, blowable cake, and letter unwrap. |
| **Birthday Cake Reveal 🎂** | `birthday-cake-reveal` | 9 | 2 mins | Multi-tier cake appearance, candle lighting, tap-to-blow wish, and confetti blast. |
| **Balloon Room 🎈** | `balloon-room` | 9 | 2-3 mins | Door unlock into 3D balloon cloud dynamically spelling recipient's name. |
| **Mystery Door 🚪** | `mystery-door` | 10 | 3 mins | Magical hallway door handle turn into celebration room with mascot delivery. |
| **Memory Journey 📸** | `memory-journey` | 10 | 3 mins | Floating polaroids drifting in space that assemble into a glowing heart constellation. |
| **Confetti Blast 🎉** | `confetti-blast` | 9 | 1-2 mins | Fast-paced 3-2-1 suspense countdown and screen-filling particle explosion. |
| **Rainbow Surprise 🌈** | `rainbow-surprise` | 8 | 2 mins | Storybook companion traversing glowing prismatic arcs into a birthday wonderland. |
| **Cute Character 🧸** | `cute-character` | 11 | 3 mins | Animated 3D companion carrying, unboxing, and presenting personalized gifts. |

---

## 🚀 Tech Stack & Dependencies

- **Framework**: [Next.js 16.3.5](https://nextjs.org/) (App Router, Turbopack, Standalone output)
- **Runtime**: [React 19.2.8](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & custom HSL tokens
- **3D Graphics**: [Three.js 0.186](https://threejs.org/) & [@react-three/fiber 9.7](https://github.com/pmndrs/react-three-fiber)
- **3D Helpers**: [@react-three/drei 10.7](https://github.com/pmndrs/drei)
- **Animation Choreography**: [GSAP 3.15](https://greensock.com/gsap/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) + PostgreSQL + Row Level Security (RLS)
- **Audio**: Web Audio API Procedural Synthesis (`AudioContext`, `OscillatorNode`, `GainNode`)
- **Testing**: [Puppeteer Core](https://pptr.dev/) with Microsoft Edge / Chromium Headless

---

## 📂 Directory Structure

```
├── app/
│   ├── page.tsx                  # Homepage with 7 high-converting conversion sections
│   ├── birthday/page.tsx         # Birthday category launchpad & 8 signature templates
│   ├── templates/page.tsx        # Searchable template directory with category filtering
│   ├── create/page.tsx           # 7-Step Creator Studio (Template → Personalize → Photos → Theme → Music → Preview → Publish)
│   ├── preview/page.tsx          # Live preview tester with Mobile (390×844) / Desktop toggles
│   ├── dashboard/page.tsx        # Creator surprise management, view counters, link sharing
│   ├── s/[publicId]/page.tsx     # Recipient full-screen 3D unboxing experience
│   ├── admin/                    # Admin CMS with 14 management sub-consoles
│   ├── api/test/                 # Production verification test suites (phase10, 11, 12, 13)
│   ├── login/ & signup/          # Authentication flows
│   ├── robots.ts & sitemap.ts    # Automated SEO metadata generators
│   └── globals.css               # Design tokens, keyframe animations, glassmorphism
├── components/
│   ├── 3d/                       # ExperienceCanvas, CameraController, SceneLighting, FallbackRenderer
│   │   ├── particles/            # Instanced high-performance particle system
│   │   └── procedural/           # Procedural GiftBox, Cake, Door, Character, Rainbow, Balloons
│   ├── creator/                  # PhotoManager, ShareModal
│   ├── editor/                   # Creator Studio visual sub-panels
│   ├── engine/                   # ExperiencePlayer, SceneRenderer, ObjectRenderer
│   ├── experience/               # PublicSurpriseClient, RecipientOpeningCurtain, RecipientFinalScreen
│   ├── home/                     # Hero, Featured, Playground, WhyDifferent, Popular, FinalCTA
│   ├── layout/                   # Navbar (Desktop & Mobile 390x844 Drawer), Footer
│   └── ui/                       # Reusable design tokens (Button, Card, Badge, Modal, Input)
├── lib/
│   ├── 3d/                       # WebGL capability detection & low-tier hardware adaptation
│   ├── admin/                    # Admin store, role authorization, audit logging
│   ├── analytics/                # Zero-PII sanitization, deduplication, 9-stage funnel
│   ├── audio/                    # SoundManager (Web Audio API procedural sound effects & BGM)
│   ├── creator/                  # LocalStorage draft persistence & Supabase cloud sync
│   ├── engine/                   # TemplateRegistry, VariableResolver, PublicId, Themes, Music
│   │   └── templates/            # Individual definitions for all 8 birthday templates
│   ├── security/                 # RateLimiter, HTML/URL input sanitizer
│   └── supabase/                 # Supabase client, server, and middleware wrappers
├── supabase/
│   ├── migrations/               # Production PostgreSQL migration (20260914000001_initial_schema.sql)
│   └── seed.sql                  # Production seed data (templates, scenes, themes, music)
├── scratch/                      # Automated E2E verification test suites
└── README.md
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (tested on Node.js v24.x)
- **NPM**: v9.0.0 or later
- **Browser**: Microsoft Edge, Google Chrome, Safari, or Firefox with WebGL enabled

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/interactive-surprise-platform.git
cd interactive-surprise-platform

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The application is equipped with full offline fallbacks and demo state; it runs immediately even before live Supabase credentials are configured.)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Validation
```bash
npm run build
npm run start
```

---

## 🌐 Production Deployment Instructions

### Vercel Deployment (Recommended)
1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables under **Project Settings → Environment Variables** (see table below).
4. Framework preset: `Next.js`.
5. Build command: `next build`.
6. Output directory: `.next`.
7. Click **Deploy**.

### Self-Hosted / Docker Deployment
Build and run using the optimized Next.js standalone server:
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

## 🔐 Environment Variables Reference

| Variable Name | Required | Default / Fallback | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Canonical domain for metadata, open graph images, and surprise share URLs. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | `https://placeholder-project.supabase.co` | Live Supabase project URL for cloud persistence. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | `placeholder-anon-key` | Supabase public anonymous API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `placeholder-service-key` | Backend-only key for elevated administrative operations. |
| `ADMIN_SECRET_KEY` | Optional | `change-me-in-production` | Secret for initial administrative bootstrap. |

---

## 🗄️ Database Migration Instructions

The platform includes a complete PostgreSQL schema migration with Row Level Security (RLS) policies for Supabase:

### Using Supabase CLI:
```bash
# Link your local project to Supabase
npx supabase link --project-ref <your-project-ref>

# Push the migration
npx supabase db push

# Optional: seed production templates and themes
npx supabase db execute --file supabase/seed.sql
```

### Using Supabase Web Dashboard:
1. Open your project on [database.new](https://database.new).
2. Navigate to the **SQL Editor**.
3. Copy the contents of `supabase/migrations/20260914000001_initial_schema.sql` and click **Run**.
4. To populate initial templates, copy and run `supabase/seed.sql`.

### Row Level Security (RLS) Summary:
- **`profiles`**: Public read; update restricted to profile owner (`auth.uid() = id`).
- **`surprises`**: Creator has full CRUD access; public access is restricted strictly to `status = 'published'`.
- **`surprise_photos`**: Owner CRUD; public read only if parent surprise is published.
- **`admin_users`**: Only users with verified role in `public.admin_users` can access administrative consoles.
- **`audit_logs`**: Append-only log for all administrative modifications.

---

## 🛡️ Admin Setup & Role Assignment

The admin console (`/admin`) is gated by Role-Based Access Control (RBAC).

### Supported Roles:
1. `superadmin`: Full system control (templates, users, analytics, security, audit logs).
2. `admin`: General platform management.
3. `template_manager`: Create, edit, and publish templates and scene manifests.
4. `moderator`: Review reported content, user moderation.

### Assigning an Administrator:
In the Supabase SQL Editor:
```sql
INSERT INTO public.admin_users (id, role)
VALUES ('<user-uuid-from-auth.users>', 'superadmin')
ON CONFLICT (id) DO UPDATE SET role = 'superadmin';
```

---

## 🎨 3D Asset Upload & Validation Rules

SurpriseSpark features automated 3D file verification (`lib/assets/assetValidator.ts`) to prevent corrupted or oversized assets from degrading recipient device performance:

- **Accepted Formats**: `.glb` (Binary GLTF - Recommended) and `.gltf` (JSON + embedded buffer).
- **Max File Size**: **15 MB** (enforced by validator).
- **Header Check**: Binary GLTF files must start with the magic byte header `0x46546C67` (`glTF`) with version `2`.
- **Animation Contract**: Characters and animated props must define standard clips (`Idle`, `Celebrate`, `Wave`). Fallbacks automatically map unmapped clips.
- **Hardware Adaptation**: High-poly models automatically trigger lower DPR (`maxDpr: 1.0`) and reduced shadow rendering on low-end mobile devices.

---

## 📱 Mobile Responsiveness (~390 × 844)

The platform is engineered specifically for modern mobile viewports (iPhone 12/13/14/15 standards):
- **Full Viewport Fill**: Zero horizontal scroll overflow.
- **Touch-First Controls**: All interactive targets are sized $\ge 44 \times 44\text{ px}$.
- **Opening Curtain**: Full-screen backdrop preventing background accidental taps until explicit user gesture unlocks audio and 3D rendering.
- **Camera Aspect Ratio**: Dynamic FOV and camera trajectory clamping that keeps 3D cakes, gift boxes, and characters perfectly centered in vertical screens.

---

## ⚠️ Known Limitations & Graceful Degradation

1. **Audio Autoplay Policy**: Browsers require a user interaction before Web Audio playback begins. The recipient experience includes an intentional "OPEN" curtain button that unlocks the Web Audio context reliably on both iOS Safari and Android Chrome.
2. **WebGL Context Loss**: If a low-memory mobile device loses the WebGL rendering context, `WebGLErrorBoundary` seamlessly renders `FallbackRenderer` (rich 2D SVG/CSS illustrations with full animations and intact sound effects) without throwing errors.
3. **Microphone Access for Candles**: While microphone candle blowing is supported on modern browsers with user permission, a one-tap screen fallback is always active so recipients can blow candles without granting mic permissions.

---

## 🔮 Recommended Future Roadmap

- [ ] **Multi-Category Launch**: Roll out Anniversary, Romantic Love, Best Friend Roasts, and Festival templates.
- [ ] **AR Mode (WebXR)**: Allow recipients to place the 3D birthday cake directly on their real-world dining table via camera augmented reality.
- [ ] **Voice Note Attachments**: Allow creators to record a 15-second personal voice note synchronized with the letter scene.
- [ ] **Collaborative Group Surprises**: Enable multiple friends to contribute photos, voice notes, and greetings to a single shared surprise link.
- [ ] **Personalized Gift Card Integration**: Embed digital gift cards (Amazon, Starbucks, Apple) that pop out of the 3D gift box upon unwrapping.

---

## 📜 License & Intellectual Property

Private & Proprietary. All rights reserved. SurpriseSpark Platform © 2026.
