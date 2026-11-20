# Privacy in Practice

*Your Data. Your Rights. Your State.*

Privacy in Practice helps visitors understand privacy and cybersecurity laws across all 50 U.S. states through clear summaries, source-linked research, and state comparisons. An interactive map, searchable law library, and legislative timeline make it easy to explore personal rights and business responsibilities on all device types (mobile, tablet and desktop).

## ⚙️ Key Features

- **Nationwide State Profiles:** Explore an interactive map linking to each state’s background, elected officials, and published laws.
- **Searchable Law Library:** Find legal records by keyword, state, or privacy topic.
- **Clear Legal Breakdowns:** Expand summaries to review rights, business duties, exceptions, deadlines, and enforcement.
- **Side-by-Side Comparisons:** Compare state requirements with clear labels where the research library has gaps.
- **Traceable Research:** Follow source links, review dates, and state-specific research methodology.
- **Legislative Timeline:** Distinguish when laws were enacted from when requirements and compliance deadlines begin.

## 💫 Tech Stack

- **TypeScript:** Helps catch coding mistakes and keeps law records, state profiles, and source links consistent throughout the website.
- **React:** Powers the interactive map, search filters, state comparisons, and expandable summaries so visitors can explore information without reloading the entire website.
- **Next.js:** Organizes the website’s pages, serves the published research, and prepares the project to run on Vercel.
- **CSS:** Creates the dark theme, pink accents, keyboard highlights, and layouts that adjust to phones, tablets, and desktop screens.
- **Vercel:** Hosts the live website and can publish updates from its connected GitHub repository using the project’s Next.js build settings.
- **Lucide React:** Provides recognizable icons for navigation, privacy topics, research tools, and map controls.
- **U.S. Census Geography via us-atlas:** Supplies the state outlines stored in the project and displayed on the interactive map.

## Local Setup

Use Node.js 22.13 or newer, then run:

```sh
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173) to preview the site.

## Build and Deployment

Run `npm run typecheck`, `npm run lint`, and `npm run build` before publishing; the build also checks that only the approved research records are included.

The project uses Vercel’s **Next.js** preset, `npm ci` to install dependencies, and `npm run build` to prepare the site, with the standard Next.js output directory managed by Vercel.

These settings are recorded in `vercel.json`; clear any older Cloudflare or `dist` output overrides in the Vercel project settings before redeploying.

Research is stored in local JSON files, so the current site does not require a database or Cloudflare credentials.

## ⚖️ View Site Here

[privacyinpractice.vercel.com](https://privacyinpractice.vercel.com)

## 📱 Contact

- **LinkedIn:** [linkedin.com/in/cyristalj](https://www.linkedin.com/in/cyristalj)
- **GitHub:** [github.com/cyristal-gems](https://github.com/cyristal-gems)
- **Email:** [cyrisjoseph@outlook.com](mailto:cyrisjoseph@outlook.com)
