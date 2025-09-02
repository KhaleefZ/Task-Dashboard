# Task Management Dashboard

A feature-rich task & project management dashboard built with Next.js 15, TypeScript, Radix UI primitives, and Tailwind CSS. Includes multiple menu paradigms, advanced filtering, bulk actions, saved views, and extensible UI components.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript / React 18
- **Styling:** Tailwind CSS + custom theme
- **UI Primitives:** Radix UI (dropdown, dialog, menubar, context-menu, select, tabs, tooltip, etc.)
- **Icons:** lucide-react
- **Forms & Validation:** react-hook-form + zod (available)
- **Date & Calendar:** react-day-picker, custom calendar with context menu

## Key Features
- Sidebar + tabs navigation
- Menubar (File / View / Help)
- Floating Quick Add (FAB) dropdown
- Task create / edit dialogs
- Saved views (filters + sort state)
- Advanced filter presets
- Sort & filter dropdowns (status, priority, saved views)
- Bulk selection bar (change status, tag, delete)
- Bulk tag add menu
- Per-task action dropdown & context (right-click) menu
- Calendar day context menu (create task / filter date / week)
- Keyboard shortcuts dialog (modal)
- Theme toggle (light/dark)

## Menus Implemented
Navigation / Structure:
- Sidebar navigation
- Tabs view switcher
- Menubar (File, View, Help)
- Floating Quick Add menu (FAB)

Filters / Views:
- Status filter dropdown
- Priority filter dropdown
- Advanced presets dropdown
- Sort dropdown (Recent Tasks + tasks list)
- Saved Views dropdown & Menubar View section

Task / Selection:
- Task action (kebab) dropdown
- Task context menu (right click)
- Bulk actions bar (selection surface)
- Bulk Tag Assign dropdown
- Calendar day cell context menu

Utility / System:
- Notifications dropdown
- Profile/account dropdown
- Keyboard Shortcuts dialog (Help > Shortcuts + Quick Add)

Form Inputs:
- Select components (status, priority)

## Getting Started
### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm / yarn

### Install
```bash
pnpm install
# or
npm install
```

### Development
```bash
pnpm dev
# http://localhost:3000
```

### Production Build
```bash
pnpm build
pnpm start
```

## Project Structure (simplified)
```
app/            # Next.js app router pages/components
components/     # Reusable UI + wrappers around Radix primitives
hooks/          # Custom hooks
lib/            # Utilities
public/         # Static assets
styles/         # Global styles
```

## Adding a New Menu Type
1. Choose the Radix primitive (dropdown, context-menu, menubar, navigation-menu, command, etc.)
2. Create a small wrapper in `components/ui` if consistency needed.
3. Manage its state in the closest component (lift if reused).
4. Keep accessibility: keyboard focus, aria labels, visible trigger size.

## Extending Saved Views
You can persist `savedViews` to `localStorage` by adding an effect in `app/page.tsx`:
```ts
useEffect(() => { localStorage.setItem('savedViews', JSON.stringify(savedViews)) }, [savedViews])
useEffect(() => { const v = localStorage.getItem('savedViews'); if (v) setSavedViews(JSON.parse(v)) }, [])
```

## Calendar Day Context Actions
The calendar exposes callbacks: `onCreateTask`, `onFilterDate`, `onFilterWeek`. Pass handlers from a page to integrate with the task list.

## Keyboard Shortcuts (sample)
| Action | Key |
|--------|-----|
| New Task | N |
| Search | / |
| Toggle Theme | T |
| Next View | Alt + → |

Wire actual listeners in a `useEffect` as needed.

## Potential Next Improvements
- Command palette integration (cmdk) for global actions
- Kanban board with lane header menus (WIP limits)
- Breadcrumb with segment dropdowns
- LocalStorage persistence for settings and saved views
- Real backend (REST/GraphQL) wiring
- Tests (Playwright / Vitest) for critical flows

## License
Internal / Educational use. Add a license file if distributing.

---
Feel free to request additional documentation or implementation help.
