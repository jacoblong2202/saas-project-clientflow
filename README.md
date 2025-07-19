# ClientFlow - Client Management SaaS

A modern SaaS platform for client management, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Modern Design**: Clean, responsive design with a professional SaaS aesthetic
- **Public Pages**: Complete marketing site with all essential pages
- **Authenticated App Dashboard**: Complete CRM and agency management system
- **Sales Pipeline Management**: Kanban board for tracking leads and clients
- **Client Relationship Management**: Comprehensive CRM with client table and metrics
- **Agency Planner**: Goal tracking, task management, and notes system
- **AI Assistant**: Chat interface for business help and document generation
- **User Settings**: Profile management, security settings, and preferences
- **Component Library**: Built with shadcn/ui for consistent, accessible components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid development

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public marketing pages
│   │   ├── layout.tsx      # Public layout with navbar & footer
│   │   ├── page.tsx        # Homepage with hero section
│   │   ├── pricing/        # Pricing page with 3-tier plans
│   │   ├── about/          # About page with mission & team
│   │   ├── blog/           # Blog with featured posts
│   │   ├── updates/        # Product updates changelog
│   │   ├── login/          # Login form
│   │   └── signup/         # Signup form
│   ├── (app)/              # Authenticated app pages
│   │   ├── layout.tsx      # App layout with sidebar navigation
│   │   ├── dashboard/      # Dashboard with metrics and activity
│   │   ├── pipeline/       # Sales pipeline with Kanban board
│   │   ├── crm/            # CRM with client table
│   │   ├── planner/        # Agency planner with goals and tasks
│   │   ├── assistant/      # AI assistant chat interface
│   │   └── settings/       # User settings and preferences
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root page (redirects to public)
├── components/
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── navigation-menu.tsx
└── lib/
    └── utils.ts            # Utility functions
```

## Pages

### Public Pages
- **Homepage** (`/`): Hero section, features, and CTA
- **Pricing** (`/pricing`): 3-tier pricing with feature comparison
- **About** (`/about`): Mission, target audience, and founder info
- **Blog** (`/blog`): Featured posts and newsletter signup
- **Updates** (`/updates`): Product changelog and version history
- **Login** (`/login`): Authentication form with social login options
- **Signup** (`/signup`): Registration form with benefits list

### App Pages (Authenticated)
- **Dashboard** (`/dashboard`): Overview with metrics, recent activity, and quick actions
- **Pipeline** (`/pipeline`): Sales pipeline with 3-column Kanban board (Leads, Calls Booked, Clients)
- **CRM** (`/crm`): Client management with table view, status tracking, and metrics
- **Planner** (`/planner`): Agency planning with weekly goals, daily tasks, and notes
- **Assistant** (`/assistant`): AI chat interface for business help and document generation
- **Settings** (`/settings`): User profile, password management, and preferences

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Fonts**: Geist Sans & Geist Mono
- **Development**: Turbopack for fast refresh

## Design System

The application uses a consistent design system with:
- **Colors**: Blue and purple gradient theme
- **Typography**: Geist Sans for body text, Geist Mono for code
- **Components**: shadcn/ui components with custom styling
- **Layout**: Responsive grid system with mobile-first approach

## Next Steps

This is a frontend-only implementation. To make it a full SaaS application, you would need to add:

1. **Backend API**: Authentication, user management, data persistence
2. **Database**: User data, client information, project tracking
3. **Payment Processing**: Stripe integration for subscriptions
4. **Email Service**: Transactional emails and notifications
5. **File Storage**: Document and file upload capabilities
6. **Real-time Features**: WebSocket connections for live updates

## Development

- **Type Checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Build**: `npm run build`

## License

This project is open source and available under the [MIT License](LICENSE).
