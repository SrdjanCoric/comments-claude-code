# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack comments application with a React/TypeScript frontend and Node.js/Express backend. The project demonstrates Claude AI integration with GitHub Actions for automated PR reviews.

## Commands

### Frontend (run from `client/` directory)
```bash
npm run dev          # Start Vite dev server (proxies /api to backend)
npm run build        # Type-check and build for production
npm run lint         # Run ESLint
npm test             # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
```

### Backend (run from `server/` directory)
```bash
npm start            # Start Express server on port 3001
```

### Running the full stack
Start both servers: backend on port 3001, frontend dev server will proxy API requests.

## Architecture

### Frontend (`client/`)
- **React 19 + TypeScript + Vite**
- **Zod** for runtime API response validation with inferred TypeScript types
- Components in `src/components/`, API service in `src/services/comments.ts`, types in `src/types/`
- State managed via React hooks in App.tsx, passed down via props
- Vite config proxies `/api` requests to `http://localhost:3001`

### Backend (`server/`)
- **Express** with file-based JSON storage (`data/comments.json`)
- API routes defined in `server.js`, data access in `data/data.js`

### API Endpoints
- `GET /api/comments` - Fetch all comments with first reply
- `GET /api/comment_replies?comment_id={id}` - Fetch additional replies
- `POST /api/comments` - Create comment
- `POST /api/comment_replies` - Add reply (partially implemented)

## Testing

- **Vitest** + **React Testing Library** with jsdom environment
- Test files co-located with components (`.test.tsx` suffix)
- Mock API services using `vi.mock()`
- Setup file: `client/setupTests.ts`

## Code Patterns

- Props interfaces named after component (e.g., `CommentThreadProps`)
- `handle*` for internal event handlers, `on*` for callback props
- API responses validated through Zod schemas before use
- TypeScript strict mode enabled with all lint checks

## Coding Styles

- Only add comments for complex logic; code should be self-explanatory
