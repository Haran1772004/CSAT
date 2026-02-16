# CSAT SaaS Frontend Template

A premium, industry-standard React frontend for the Customer Satisfaction (CSAT) system.

## 🚀 Overview
This frontend is designed to be a high-performance "Control Center" for business owners. It is built using **React**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

### ✨ Features Included
- **Dynamic Dashboard**: KPI cards for Avg Rating, Total Submissions, and Trends.
- **Form Management**: UI for creating and managing feedback forms.
- **Advanced Submission Viewer**: Data table with IP tracking, sentiment coloring, and S3 screenshot previews.
- **Analytics Module**: Deep-dive reporting with moving averages and rating distribution charts.
- **Mock Data Engine**: Fully satisfies all your CSAT backend endpoints without needing a live connection yet.

## 📂 Project Structure
```text
frontend/
├── src/
│   ├── services/mockData.ts  # Simulates your Backend APIs
│   ├── components/           # UI Components
│   ├── App.tsx               # Main SaaS Logic & Routes
│   └── index.css             # Tailwind & SaaS Theme
└── package.json              # Modern SaaS Tech Stack
```

## 🛠️ How to Preview
1.  Navigate to the folder: `cd frontend`
2.  Install dependencies: `npm install`
3.  Run the dev server: `npm run dev`
4.  Open your browser to the local URL provided.

## 🔗 Connecting to your Backend
When you are ready to use your "error-free" backend:
1.  We will replace `src/services/mockData.ts` with an Axios/Fetch service.
2.  We will update the `.env` in the frontend to point to `https://apihari.duckdns.org`.
3.  **Strict Neutrality**: This frontend will never modify your backend logic; it only consumes the APIs.
