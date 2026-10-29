# Gulfraz Insights — Next.js & React Edition

A pixel-perfect, feature-complete rebuild of **[Gulfraz Insights](https://gulfrazinsight.vercel.app)** built with **React 18**, **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features Included

1. **Complete Content Library (73 In-Depth Strategic Essays)**
   - All 73 full-length essays, complete with rich headings, paragraphs, responsive illustration images (`IMAGE::`), blockquotes, tags, reading times, view counts, and claps.
   - Categorized under:
     - 📈 **Wealth & Financial Freedom**
     - 🧭 **Mindset & Self-Mastery**
     - 🧠 **Psychology & Human Nature**
     - ⚡ **Career & Asymmetric Growth**

2. **Interactive Freedom & Compounding Calculator (FIRE Calculator)**
   - Real-time interactive sliders for:
     - Current Savings & Investments (\$0 – \$250k+)
     - Monthly Investments (\$100 – \$10k/mo)
     - Expected Annual Return (4% – 14%)
     - Estimated Living Costs in Retirement (\$24k – \$200k/yr)
   - Real-time compounding trajectory math:
     - Target Freedom Number (25x annual spending based on the 4% Safe Withdrawal Rule)
     - Estimated timeline to complete independence (years)
     - 10-Year and 20-Year projected portfolio values
     - Visual breakdown of Personal Principal vs. Compound Interest growth percentage

3. **Built-in Text-to-Speech (TTS) Narration Audio Player**
   - Floating audio player powered by the browser's native **Web Speech API (`SpeechSynthesis`)**.
   - Breaks articles down sentence by sentence and reads them aloud using natural voices.
   - Real-time seekable progress bar, Play / Pause toggle, current spoken sentence display, and speed adjustment (1x, 1.25x, 1.5x, 2x).

4. **Saved Reading List (Offline Bookmarks Drawer)**
   - Save any article for later with a single click.
   - Slide-over drawer with unread counter, thumbnail, reading time, and direct links.
   - Persists automatically to local storage.

5. **Live Search Modal (`⌘K` / `Ctrl+K`)**
   - Instant search across article titles, subtitles, excerpts, categories, and tags.
   - Quick-select tags and suggested topics chips.

6. **Interactive Reader Features**
   - Reading progress indicator at the top of every essay.
   - Animated Claps with confetti celebrations (`canvas-confetti`).
   - Font size toggle (standard vs. comfortable large reading font).
   - Social sharing to Twitter/X, LinkedIn, and clipboard link copy with toast notifications.
   - Reader discussion & comments system with instant posting.
   - Dynamic related essays recommendations.

7. **Author Publishing Studio (Admin Mode)**
   - Protected with editorial passkey: `gulfraz123` (or shortcut `Ctrl + Shift + A`).
   - Create, edit, and delete articles with custom slugs, categories, tags, key takeaways, and section builders.
   - Article library manager and JSON export/backup utility.
   - Floating "Author Mode" dock for quick switching between reading and editing.

8. **Design & Theming**
   - Full Dark Mode and Light Mode support with smooth transition colors and local storage persistence.
   - Custom fonts: **Inter** (body), **Merriweather** (serif reading typography), and **Plus Jakarta Sans** (headings).
   - Fully responsive on mobile, tablet, and widescreen desktop.

---

## 🚀 Getting Started

### 1. Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build

To build and start the optimized production server:

```bash
npm run build
npm run start
```

### 3. Deploy to Vercel

You can deploy this Next.js project directly to Vercel with zero configuration:

```bash
npx vercel
```

---

## 🔑 Admin Credentials & Shortcuts

- **Admin Studio URL:** `/admin`
- **Passkey:** `gulfraz123`
- **Keyboard Shortcut:** `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
