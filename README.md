# AYOP - At Your Own Pace

A community website for AYOP, a running community in Berlin that celebrates growth at your own pace.

## About

AYOP is a community that runs at our own pace — together. We create meaningful events and partnerships, document our journey through media, and deliver structured training that meets runners where they are.

## Features

- **Modern Stack** - Built with Next.js and TailwindCSS
- **Minimal Design** - Clean, focused user experience
- **Dark Mode** - Toggle between light and dark themes
- **Blog System** - Create, read, update, and delete blog posts with an easy-to-use UI
- **Team Showcase** - Display team members organized by Track, Partnership, and Media teams
- **Instagram Integration** - Embedded Instagram feed using Behold widget
- **Activities Section** - Showcase community activities and events
- **Custom Cursor** - Interactive cursor animations

## Sections

- **Home** - Hero section, activities overview, Instagram feed, and community introduction
- **About** - Team members organized by Track, Partnership, and Media teams with mission statements
- **Blog** - Markdown-based blog system for community stories and updates
- **Manifesto** - Community values and philosophy
- **Contact** - Get in touch with the community

## Getting Started

### Prerequisites

- Node.js 18+ (check `.nvmrc` for the recommended version)
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone git@github.com:ayop-run/website.git
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

Edit `data/en.json` to customize:

- Team members and their information
- Activities and descriptions
- Social media links
- About page content
- Manifesto text
- Header taglines

## Deployment

The site can be deployed to any platform that supports Next.js:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

## Tech Stack

- **Next.js** - React framework for production
- **TailwindCSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **next-themes** - Dark mode support
- **react-markdown** - Markdown rendering for blog posts

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## License

This project is private and proprietary to AYOP.

## Contact

- Website: [ayop.run](https://ayop.run)
- Instagram: [@ayop.run](https://www.instagram.com/ayop.run/)
- Email: hello@ayop.run
