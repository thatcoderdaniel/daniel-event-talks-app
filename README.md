# ⚡️ BigQuery Release Explorer

An elegant, real-time web dashboard to explore, search, bookmark, and share Google Cloud BigQuery release notes. Built using Python Flask and vanilla HTML, CSS, and JavaScript.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🔄 Live Feed Ingestion** | Real-time parsing of the official Google Cloud BigQuery RSS/Atom feed. |
| **🏷️ Micro-Parsing** | Splits daily bulk updates into individual, color-coded item cards (Features, Issues, Announcements, Deprecations). |
| **🔍 Search & Filter** | Live client-side full-text search and category filtering with instantaneous response. |
| **🌓 Theme Toggle** | Smooth transition between premium Light and Dark modes, with automatic preference preservation. |
| **📋 Copy to Clipboard** | Quick, single-click copy of clean release note text with direct inline feedback. |
| **📥 Export to CSV** | Download the currently filtered list of release updates in a formatted CSV file. |
| **⭐️ Bookmarking System** | Star individual release notes to save them for later review, persisted locally. |
| **🕒 Relative Dates** | Contextual date headers showing `(Today)`, `(Yesterday)`, or `(x days ago)`. |
| **📡 Offline Cache** | Automatic fallback to offline storage if Google Cloud feeds or connections are unavailable. |
| **🐦 X (Twitter) Share** | Pre-formatted sharing intents that handle Twitter text length limits and link back to Google Cloud Docs. |

---

## 🛠️ Tech Stack

- **Backend:** Python 3, Flask
- **Frontend:** HTML5, Vanilla JavaScript (ES6+), Custom CSS3 variables
- **Data Source:** Official BigQuery Release Notes RSS Feed

---

## 💻 Getting Started

### Prerequisites

- Python 3.x
- \`pip\`

### Local Setup

1. **Clone the Repository:**
   \`\`\`bash
   git clone https://github.com/thatcoderdaniel/daniel-event-talks-app.git
   cd daniel-event-talks-app
   \`\`\`

2. **Configure Virtual Environment & Install Dependencies:**
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install Flask
   \`\`\`

3. **Run the Server:**
   \`\`\`bash
   python app.py
   \`\`\`

4. **Access the App:**
   Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

---

## 📂 Project Structure

\`\`\`
.
├── app.py                  # Flask Application Server
├── templates/
│   └── index.html          # Core Structured Dashboard
├── static/
│   ├── style.css           # Glassmorphic Style Rules
│   └── script.js           # Client Controller & Feed Parser
└── README.md               # Project Documentation
\`\`\`

---

## 📄 License

This project is open-source and available under the MIT License.
