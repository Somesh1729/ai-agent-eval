# AI Agent Evaluation Dashboard - Design Guidelines

## Design Approach
**Design System:** Modern Data Dashboard Pattern (inspired by Linear, Vercel Analytics, and PostHog)
- **Justification:** Utility-focused enterprise application requiring clarity, efficiency, and sophisticated data visualization
- **Core Principle:** Information clarity first, visual polish second. Every element serves the data story.

## Color Palette

**Dark Mode (Primary):**
- Background Base: 222 47% 11% (deep slate)
- Background Elevated: 217 33% 17% (card surfaces)
- Primary Brand: 217 91% 60% (professional blue)
- Success/Positive: 142 76% 36% (metrics up)
- Warning: 38 92% 50% (attention items)
- Danger/Error: 0 84% 60% (critical alerts)
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%
- Border Subtle: 217 33% 24%

**Light Mode:**
- Background: 0 0% 100%
- Background Elevated: 210 20% 98%
- Primary: 217 91% 60%
- Text: 222 47% 11%
- Borders: 214 32% 91%

## Typography
- **Primary Font:** Inter (via Google Fonts)
- **Display/Headers:** font-semibold to font-bold, tracking-tight
- **Body:** font-normal, leading-relaxed
- **Data/Metrics:** font-mono for numerical precision
- **Scale:** text-xs (labels) → text-sm (body) → text-base (subheadings) → text-2xl/text-3xl (page titles) → text-4xl/text-5xl (hero metrics)

## Layout System
**Spacing Units:** Consistent rhythm using 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mb-8, py-12)
- **Container:** max-w-7xl mx-auto px-6 lg:px-8
- **Dashboard Grid:** 12-column grid with responsive breakpoints
- **Card Spacing:** p-6 for standard cards, p-8 for feature areas
- **Section Gaps:** space-y-8 for related content, space-y-12 for section breaks

## Component Library

**Navigation:**
- Sidebar navigation (fixed left, dark elevated background)
- Top bar with user profile, settings access
- Breadcrumb trail for nested views
- Active states: subtle accent border-l-2 + background highlight

**Dashboard Cards:**
- Elevated background with subtle border (border border-border/50)
- Rounded corners (rounded-lg)
- KPI Cards: Large metric display (text-4xl font-bold) + trend indicator + sparkline
- Chart Cards: Header with filter controls + responsive chart area + legend

**Data Visualization:**
- Line Charts: Smooth curves, gradient fills below lines, interactive tooltips
- Trend Indicators: Arrows (↑↓) with color-coded percentages
- Color Scale: Sequential blues for neutral data, diverging green/red for performance
- Chart Grid: Subtle horizontal guidelines, no vertical lines

**Tables:**
- Sticky header row with sort indicators
- Alternating row backgrounds (hover: bg-accent/50)
- Compact density: py-3 px-4
- Pagination controls at bottom (show 20/50/100 per page)
- Expandable rows for detailed views (slide-down animation)

**Forms (Evaluation Config):**
- Grouped sections with subtle dividers
- Label-above-input pattern (text-sm font-medium mb-2)
- Input styling: bg-background border-input focus:ring-2 focus:ring-primary
- Toggle switches for booleans (obfuscate_pii)
- Numeric inputs with increment/decrement buttons
- Inline validation feedback

**Filters & Controls:**
- Horizontal filter bar (sticky below header)
- Dropdown filters (Shadcn Select component)
- Date range picker with presets (7d, 30d, custom)
- Tag-based flag filters (removable chips)
- Clear all filters button (ghost variant)

**Detail Views:**
- Modal overlay (backdrop-blur-sm bg-background/80)
- Slide-in panel from right for evaluation details
- Syntax highlighting for prompt/response code blocks
- Metadata grid: label-value pairs in 2-column layout
- Close button (top-right X icon)

**Authentication:**
- Centered card layout (max-w-md)
- Clean form with social login options
- Subtle background pattern or gradient
- Error states: red border + helper text

## Interaction Patterns
- **Loading States:** Skeleton screens for cards, shimmer effect for tables
- **Empty States:** Centered illustration + helpful CTA ("No evaluations yet - ingest your first evaluation")
- **Animations:** Minimal, purposeful (fade-in on load, slide for modals, 200-300ms durations)
- **Micro-interactions:** Scale on button press (active:scale-95), smooth transitions

## Dashboard Layout Structure
1. **Top Bar:** Logo + navigation + user menu (h-16, sticky)
2. **Sidebar:** Links + settings (w-64, hidden on mobile)
3. **Main Content Area:** 
   - Page title + action buttons
   - KPI grid (4 cards on desktop, 2 on tablet, 1 on mobile)
   - Charts section (2-column grid on desktop, stack on mobile)
   - Evaluation table (full width with horizontal scroll)
4. **Footer:** Minimal, copyright + version

## Responsive Behavior
- **Desktop (lg+):** Full sidebar, multi-column KPIs and charts
- **Tablet (md):** Collapsible sidebar, 2-column layouts
- **Mobile:** Bottom navigation, stacked single-column, swipeable cards

## Performance Considerations
- Virtual scrolling for tables with 1000+ rows
- Lazy load charts on scroll
- Memoized chart components
- Debounced filter inputs (300ms)
- Optimistic UI updates for configuration changes

This design creates a professional, data-focused dashboard that prioritizes information density and analytical clarity while maintaining visual polish through consistent spacing, typography, and subtle interactive details.
