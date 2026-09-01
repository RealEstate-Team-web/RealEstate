# Reports — reusable analytics component

A prop-driven reports/analytics component for the admin console. It is built to
be reusable: every chart, KPI, range option, and the data source are driven by
props, and it does **not** know about the platform's API — you pass in a
`fetchAnalytics` function.

`recharts` is used internally and never leaks out of this component. Consumers
import only the component and (optionally) icons.

## Install

`recharts` must be present in the frontend dependencies:

```bash
npm install recharts
```

## Minimal usage

```jsx
import Reports from '../../components/admin/analytics/Reports';
import { getAnalytics } from '../../../services/admin.service';
import { Building2, CalendarCheck, Users } from 'lucide-react';

const ReportsPage = () => (
  <Reports
    title="Platform insights"
    subtitle="Everything happening across the platform"
    eyebrow="Analytics"
    fetchAnalytics={getAnalytics}
    ranges={[
      { value: '7', label: '7d' },
      { value: '30', label: '30d' },
      { value: '90', label: '90d' },
    ]}
    defaultRange="30"
    kpis={[
      { key: 'users', label: 'Users', icon: Users, tone: 'info' },
      { key: 'agents', label: 'Agents', tone: 'success' },
      { key: 'properties', label: 'Properties', icon: Building2, tone: 'warning' },
      { key: 'visits', label: 'Visits', icon: CalendarCheck, tone: 'neutral' },
    ]}
    labels={{ registrations: 'New users', checkins: 'Visit requests', items: 'Categories' }}
  />
);

export default ReportsPage;
```

## Props contract

See `reports.types.js` for full JSDoc typedefs. The important ones:

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `fetchAnalytics` | `(params) => Promise<Payload>` | **required** | Called with `{ range }`; must resolve to the payload shape. |
| `title` | string | `'Reports'` | Page/heading title. |
| `subtitle` | string | — | Secondary heading text. |
| `eyebrow` | string | — | Small uppercase label above the title. |
| `icon` | component | — | Icon shown beside the title. |
| `ranges` | array | `7d/30d/90d` | Range options shown in the picker. |
| `defaultRange` | string | `'30'` | Initially selected range. |
| `kpis` | array | 4 defaults | KPI card configs (key, label, icon, tone, format, countUp). |
| `charts` | object | all on | Enable/disable `registrations`, `checkins`, `perItem`, `categories`. |
| `table` | object | — | Optional data-table config (columns + title). Omit to hide. |
| `scope` | string | `'platform'` | Affects the summary hint only (`self` vs `platform`). |
| `labels` | object | — | Rename metric labels (e.g. `registrations`), empty-state text. |

## Payload shape returned by `fetchAnalytics`

```js
{
  kpis: { [key]: number },              // keys must match the `kpis` prop `key`s
  registrationsTrend: [{ date, count }],
  checkinsTrend: [{ date, count }],
  items: [{ id, name, status, count }],
  categories: [{ name, count, pct }],
}
```

## States

The component renders dedicated loading skeletons, an error state with a retry
button (shown when `fetchAnalytics` rejects), and an empty state when there is
no data yet. Numbers animate up on load unless the user has
`prefers-reduced-motion` enabled.

## Reusing for a scoped/self view

Pass a `scope="self"` prop and swap `fetchAnalytics` for an endpoint scoped to
the current user (e.g. an agent's own listings). The component stays identical —
only the data source and KPI config change.
