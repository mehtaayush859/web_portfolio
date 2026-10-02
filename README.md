# 🌐 Ayush Mehta — Modern Developer Portfolio

An interactive, responsive, high-performance personal developer portfolio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

Designed with a cybersecurity and distributed systems aesthetic, featuring interactive canvas constellations, an intelligent 3D tour guide mascot, mobile swipe gestures, and progressive disclosure cards.

👉 **Live Site:** [https://amehta.vercel.app](https://amehta.vercel.app)

---

## ✨ Highlights & Features

- **⚡ Performance & Architecture:**
  - **Next.js 16 App Router** with React 19 Server/Client architecture.
  - **Tailwind CSS v4** featuring modern design system variables, glassmorphic surfaces, and responsive grids.
  - **100% Static Page Prerendering** for ultra-fast global edge delivery and Core Web Vitals.
  - **Next-Themes:** Seamless Dark, Light, and System theme switching with zero hydration flicker.

- **🤖 Interactive Companions & Elements:**
  - **Interactive Particle Constellation:** Ambient GPU-efficient canvas background with real-time mouse repulsion.
  - **3D Mascot Tour Guide:** Interactive floating companion offering section-specific insights and walkthrough guidance.
  - **Interactive Terminal:** Functional command-line interface in the hero section supporting commands like `help`, `skills`, `projects`, `contact`, and `clear`.

- **📱 Mobile-First Gesture Experience:**
  - **Touch-Swipe Snap Track:** Career Journey, Academic Background, Projects, and Skills feature responsive `← Swipe →` horizontal carousels with native CSS scroll-snap on mobile devices.
  - **Progressive Disclosure Modals:** Tap any card to open clean, detailed modals for career achievements, education coursework, and project architecture deep dives.

- **🔍 Comprehensive SEO & Discoverability:**
  - **JSON-LD Schema.org Structured Data** (`Person`, `WebSite`, `ProfilePage`) for Google Knowledge Graph.
  - **Open Graph (1200×630) & Twitter Cards** for rich link previews across LinkedIn, Twitter/X, and messaging apps.
  - **Dynamic `robots.ts` & `sitemap.ts`** with Google Search Console verification integration.
  - **Semantic HTML5** with accessible heading hierarchy and image optimizations.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | Next.js 16, React 19, TypeScript |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons |
| **Animation & Motion** | Motion (`motion/react`) |
| **Theming & Feedback** | `next-themes`, Custom Canvas Engine |
| **Deployment & Hosting** | Vercel (Edge Network, Automated CI/CD, SSL) |

---

## 📂 Project Structure

```text
web_portfolio/
├── app/                  # Next.js App Router (layout, page, error, robots, sitemap)
├── components/
│   ├── layout/           # Navbar, Footer, and global layouts
│   ├── motion/           # MotionWrapper and animation primitives
│   ├── sections/         # Hero, About, Journey, Projects, Skills, Contact
│   └── ui/               # Badge, Card, Button, Terminal, Modal, Mascot, Canvas
├── data/                 # Profile, Projects, Skills, and Site Configuration
├── lib/                  # SEO helpers, utility functions
├── public/               # Static assets, images, resume, verification files
└── next.config.ts        # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mehtaayush859/web-portfolio.git
   cd web-portfolio/web_portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Verification:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🌐 Custom Domain & Deployment

This project is optimized for zero-config deployment on [Vercel](https://vercel.com):

1. Import your GitHub repository into Vercel.
2. Under **Project Settings → Domains**, bind your preferred custom domain (e.g. `ayushmehta.tech`, `ayushmehta.is-a.dev`, or `ayushmehta.vercel.app`).
3. Set the optional `NEXT_PUBLIC_SITE_URL` environment variable if overriding the default canonical URL.

---

## 📄 License

Created by **Ayush Mehta**. Distributed under the MIT License.
