# AI Discovery Agent Frontend

A modern web application built with Next.js that aggregates and displays trending AI/ML content from HuggingFace and GitHub. The platform provides an elegant, user-focused interface for exploring papers, models, datasets, and spaces from the AI/ML community.

## Features

- 🔍 **HuggingFace Integration**
  - Browse trending papers with upvotes and comments
  - Explore popular models with pipeline tags and download stats
  - Discover datasets with detailed information
  - Access community spaces with live demos

- 🌟 **GitHub Trends**
  - Track trending repositories
  - View popular developers
  - Real-time updates on stars and forks

- 📨 **Newsletter Integration**
  - Subscribe to stay updated
  - Receive curated content every 12 hours
  - Customizable email preferences

## Tech Stack

- **Framework**: Next.js 
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Integrations**: HuggingFace API, GitHub API
- **Email Service**: Custom Newsletter System

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
NEXT_PUBLIC_API_PAPERS=/api/papers
NEXT_PUBLIC_API_SUBSCRIBE=[your-subscribe-endpoint]
NEXT_PUBLIC_FETCHAPI=[your-fetch-api]
NEXT_PUBLIC_BACKEND=[your-backend-url]
NEXT_PUBLIC_API_GITHUB_DEV=[github-developers-endpoint]
NEXT_PUBLIC_API_GITHUB_REPO=[github-repositories-endpoint]
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── pages/       # Page components
├── components/       # Reusable components
└── scripts/         # Utility scripts
```

## Core Components

- `PageExplorer.js`: Main content explorer with tabs
- `NavigationHeader.js`: Navigation and layout
- `HuggingFaceTabs.js`: Content type selector
- `NewsletterPopup.js`: Subscription modal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
