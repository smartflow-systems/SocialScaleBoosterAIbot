# Overview

Smart Flow Systems is a VPN management dashboard built with React and Express.js that provides comprehensive network monitoring, server management, and security testing capabilities. The application allows users to view their current IP information, connect to different VPN servers, run speed tests, monitor connection history, and perform security leak tests. It features a modern glass morphism UI design with real-time data updates and interactive components for managing VPN connections.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React 18 and TypeScript using Vite as the build tool. The architecture follows a component-based approach with:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with custom glass morphism design system using CSS variables for theming
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with React plugin and runtime error overlay for development

The frontend uses a modular component structure with dashboard panels for different features (IP info, speed testing, server list, connection history, security checks). Form handling is managed through React Hook Form with Zod validation.

## Backend Architecture

The server uses Express.js with TypeScript and follows a RESTful API design:

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Architecture Pattern**: In-memory storage with planned database migration
- **API Design**: RESTful endpoints with JSON responses
- **Middleware**: Custom logging, JSON parsing, and error handling

The backend implements a storage interface pattern with both memory storage (for development) and database storage implementations, allowing easy switching between data persistence methods.

## Data Storage Solutions

- **Primary Database**: PostgreSQL via Neon serverless platform
- **ORM**: Drizzle ORM with Drizzle Kit for schema management and migrations
- **Schema Design**: Separate tables for VPN servers, connection history, speed test results, and security checks
- **Development Storage**: In-memory storage implementation for quick development and testing
- **Migration Strategy**: Drizzle migrations stored in `/migrations` directory

The database schema includes tables for VPN servers with location and performance data, connection history tracking, speed test results with timestamps, and security check results for leak detection.

## Authentication and Authorization

Currently, the application does not implement authentication mechanisms. All API endpoints are publicly accessible, suggesting this is either a single-user application or authentication will be added in future iterations.

## External Service Integrations

- **IP Geolocation**: ipapi.co service for fetching real-time network information including IP address, location, ISP details, and geographic coordinates
- **Network Testing**: Custom implementation for ping tests and speed measurements
- **DNS/Security Testing**: Planned integration for DNS leak detection and WebRTC testing

The application uses external APIs to gather network information and performs client-side network testing for speed and connectivity measurements.

# External Dependencies

## Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Components**: Extensive Radix UI component library for accessible primitives
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Hookform resolvers
- **Utilities**: clsx for conditional classes, date-fns for date formatting
- **Development**: Vite, TypeScript, Wouter for routing

## Backend Dependencies
- **Server**: Express.js framework with TypeScript support
- **Database**: Drizzle ORM, Neon serverless PostgreSQL driver
- **Validation**: Zod for schema validation and type inference
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Development Tools
- **Build**: Vite with React plugin and Replit-specific plugins
- **TypeScript**: Full TypeScript setup with strict configuration
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer