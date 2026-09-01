/**
 * JSDoc type contract for the reusable <Reports /> analytics component.
 *
 * These typedefs document (a) the Props accepted by the component and (b) the
 * payload shape that the `fetchAnalytics` function must resolve to. They are
 * advisory only — this project uses plain JS, so there is no compile-time
 * enforcement — but they keep the contract explicit for all consumers.
 *
 * See README.md in this directory for a worked usage example.
 */

/**
 * A single KPI card configuration.
 *
 * @typedef {Object} ReportsKpiConfig
 * @property {string} key           - Metric key read from `data.kpis[key]`.
 * @property {string} label         - Human-readable card title.
 * @property {React.ComponentType} [icon] - Lucide-style icon component.
 * @property {'info'|'success'|'warning'|'danger'|'neutral'} [tone='info']
 * @property {'integer'|'currency'|'percent'} [format='integer']
 * @property {boolean} [countUp=true] - Whether the number animates on load.
 */

/**
 * A table column definition.
 *
 * @typedef {Object} ReportsTableColumn
 * @property {string} key    - Field key on each row.
 * @property {string} label  - Header text.
 * @property {function} [accessor] - Optional function to derive the cell value.
 */

/**
 * Table configuration.
 *
 * @typedef {Object} ReportsTableConfig
 * @property {boolean} [enabled=true]
 * @property {string} [title='Breakdown']
 * @property {ReportsTableColumn[]} [columns]
 */

/**
 * Chart enable/disable map.
 *
 * @typedef {Object} ReportsChartsConfig
 * @property {boolean} [registrations=true]
 * @property {boolean} [checkins=true]
 * @property {boolean} [perItem=true]
 * @property {boolean} [categories=true]
 */

/**
 * Label overrides for domain renaming.
 *
 * @typedef {Object} ReportsLabels
 * @property {string} [registrations]
 * @property {string} [checkins]
 * @property {string} [items]
 * @property {string} [categories]
 * @property {string} [emptyState]
 */

/**
 * Props accepted by the <Reports /> component.
 *
 * @typedef {Object} ReportsProps
 * @property {string} [title='Reports']
 * @property {string} [subtitle]
 * @property {string} [eyebrow]
 * @property {React.ComponentType} [icon]
 * @property {function(Object): Promise<ReportsPayload>} fetchAnalytics
 *   Async function called with `{ range }`; must resolve to the payload shape.
 * @property {Array<{value: string, label: string}>} [ranges]
 * @property {string} [defaultRange='30']
 * @property {'platform'|'self'} [scope='platform']
 * @property {ReportsKpiConfig[]} [kpis]
 * @property {ReportsChartsConfig} [charts]
 * @property {ReportsTableConfig} [table]
 * @property {string} [summary]
 * @property {ReportsLabels} [labels]
 * @property {string} [className]
 */

/**
 * A single per-item row (e.g. a platform category row).
 *
 * @typedef {Object} ReportsItem
 * @property {string|number} id
 * @property {string} name
 * @property {string} [status]
 * @property {number} [count]
 */

/**
 * A category slice.
 *
 * @typedef {Object} ReportsCategory
 * @property {string} name
 * @property {number} count
 * @property {number} [pct]
 */

/**
 * The payload resolved by `fetchAnalytics`.
 *
 * @typedef {Object} ReportsPayload
 * @property {Object<string, number>} kpis       - `{ key: number }` drivable by the kpis prop.
 * @property {Array<{date: string, count: number}>} [registrationsTrend]
 * @property {Array<{date: string, count: number}>} [checkinsTrend]
 * @property {ReportsItem[]} [items]
 * @property {ReportsCategory[]} [categories]
 * @property {Array<{label: string, value: number, color: string}>} [visitStatusBreakdown]
 */

export {};
