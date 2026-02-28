# Dynasty

AI-powered formwork kitting and Bill of Quantities (BoQ) optimization platform for construction projects.

## What It Does

Dynasty integrates BIM models, project schedules, and historical data to automate three key construction workflows:

- **Automated Quantity Takeoff** — AI extracts formwork components from BIM/IFC models, generating a BoQ in seconds (~80% faster than manual takeoff, ~98% accuracy)
- **Smart Kitting** — Optimization engine groups formwork items into kits per scheduled task, maximizing reuse across floors and minimizing inventory
- **Inventory Forecasting** — Predictive analytics forecast material demand, flag shortages weeks in advance, and recommend just-in-time procurement

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React (Vite) |
| Styling | Vanilla CSS |
| Charts | Chart.js |
| Icons | Lucide React |
| Routing | React Router v6 |

## Pages

| Page | Description |
|------|-------------|
| Dashboard | KPIs, forecast charts, cost breakdown, activity feed |
| BIM Upload | Drag-drop model upload with AI extraction pipeline |
| Repetition Analytics | Pattern detection, reuse heatmap, standard templates |
| Kit Planning | Optimization sliders, kit assignments, utilization chart |
| Inventory Forecast | Demand curves, shortage alerts, order recommendations |
| BoQ Generator | AI vs manual comparison, accuracy metrics, export |
| Schedule View | Gantt chart, kit timeline, what-if scenario simulator |

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173/`

## License

MIT
