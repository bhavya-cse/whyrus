# WhyRus

**Find the cause. Restore confidence.**

WhyRus is an evidence-grounded production incident analysis tool that helps engineers investigate application failures using logs, stack traces, service context, and optional Git diffs.

It combines deterministic analysis with optional Google Gemini-assisted reasoning to identify plausible root causes, explain supporting evidence, and recommend practical verification steps.

## Features

- **Structured log parsing** — Converts raw logs into chronological incident timelines.
- **Root-cause analysis** — Ranks plausible causes using deterministic analysis.
- **Evidence traceability** — Connects hypotheses to supporting and contradictory evidence IDs.
- **AI-assisted reasoning** — Uses Google Gemini to enrich incident findings when configured.
- **Git diff correlation** — Identifies potentially relevant code changes.
- **Secret redaction** — Detects and redacts sensitive values before analysis.
- **Actionable recommendations** — Provides verification steps and prioritized actions.
- **Transparent results** — Reports severity, confidence levels, missing evidence, and parsing warnings.
- **Deterministic fallback** — Continues to work when Gemini is unavailable or not configured.

## Technology Stack

**Frontend**
- React 19
- Vite 6
- Tailwind CSS 4
- Lucide React

**Backend**
- Python
- FastAPI
- Pydantic
- Google GenAI SDK

## Project Structure

```text
whyrus/
├── backend/
│   ├── analyzer/
│   │   ├── ai_engine.py
│   │   ├── git_diff.py
│   │   ├── parser.py
│   │   ├── ranker.py
│   │   └── redactor.py
│   ├── models/
│   │   └── schemas.py
│   ├── tests/
│   │   ├── test_analyzer.py
│   │   ├── test_api.py
│   │   └── verify_scenarios.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/bhavya-cse/whyrus.git
cd whyrus
```

### 2. Set up the backend

Create and activate a virtual environment:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Create your local environment file:

```bash
cp backend/.env.example backend/.env
```

To enable Gemini-assisted analysis, add your Google Gemini API key to `backend/.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

Gemini is optional. Without a configured key, WhyRus automatically uses its deterministic analysis engine.

### 3. Start the backend

```bash
cd backend
source .venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Backend:

`http://127.0.0.1:8001`

Interactive API documentation:

`http://127.0.0.1:8001/docs`

### 4. Set up the frontend

Open a second terminal:

```bash
cd ~/Downloads/whyrus/frontend
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

The local frontend API configuration defaults to `http://127.0.0.1:8001`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend and AI configuration status |
| GET | `/api/presets` | Returns available sample incident data |
| POST | `/api/analyze` | Analyzes submitted incident logs |
| POST | `/api/redact-preview` | Previews secret redaction |

### Incident Analysis Request

`POST /api/analyze`

Example request:

```json
{
  "raw_logs": "2026-11-14 10:00:01 ERROR payment-service: Database connection timeout",
  "service_context": "Production payment service",
  "git_diff": "",
  "use_ai": true
}
```

The analysis response includes:

- Incident overview and severity
- Structured event timeline
- Ranked root-cause hypotheses
- Supporting and contradictory evidence
- Recommended actions and verification checks
- Git diff findings, when supplied
- Redaction information
- Analysis engine details

## Running Tests

Activate the backend virtual environment and run:

```bash
cd backend
source .venv/bin/activate
python -m unittest discover -s tests -v
```

The test suite covers:

- Deterministic incident analysis
- Gemini fallback behavior
- Log parsing and stack trace folding
- Missing timestamp handling
- Database failure scenarios
- JVM memory exhaustion
- JWT expiry and clock skew
- Comprehensive secret redaction
- API request validation
- CORS preflight handling
- Health, presets, and redaction endpoints

**Latest verified result: 14 tests passed.**

## Production Deployment

WhyRus uses a React/Vite frontend and a FastAPI backend.

A single-project Vercel deployment can use **Vercel Services**, subject to account availability.

The intended routing is:

| Path | Service |
|---|---|
| `/` and frontend routes | React/Vite frontend |
| `/api/*` | FastAPI backend |

The deployment requires a root-level `vercel.json` defining both services and their routing rules.

Configure `GEMINI_API_KEY` as a server-side environment variable in Vercel. Never expose backend credentials through frontend environment variables.

The production frontend should use same-origin `/api` requests rather than a localhost API URL.

Documentation: [Vercel Services](https://vercel.com/docs/services)

## Security and Privacy

- Keep API keys and credentials in environment variables.
- Never commit `.env` files.
- Backend redaction processes submitted logs and optional Git diffs before analysis.
- When Gemini is enabled, redacted analysis inputs may be sent to Google's Gemini service.
- Review sensitive production data before submitting it.
- Treat generated root-cause hypotheses as findings to verify, not guaranteed diagnoses.

## Design Principles

**Evidence first:** Findings should be traceable to actual incident evidence.

**Transparency:** Confidence levels and missing evidence should be visible.

**Practical guidance:** Recommendations should help engineers decide what to investigate next.

**Resilience:** Deterministic analysis remains available without external AI services.

---

**WhyRus — Evidence-grounded incident analysis.**