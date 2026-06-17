# BigQuery Release Explorer

A lightweight, real-time dashboard application designed to parse, aggregate, search, and export Google Cloud BigQuery release logs. Built on a Flask backend with a decoupled vanilla HTML5/JS/CSS3 frontend.

---

## Key Features

| Feature | Technical Description |
| :--- | :--- |
| **Live Feed Ingestion** | Asynchronous XML ingestion and parser mapping for official RSS/Atom documents. |
| **Micro-Parsing** | Extracts atomic log segments from bulk day entries based on document boundaries (Features, Issues, Announcements, Deprecations). |
| **Search & Filter** | Low-latency client-side indexing for keyword queries and state-based category filtering. |
| **Theme Toggle** | Interoperable Light/Dark scheme selector with local state persistence. |
| **Copy to Clipboard** | Clipboard API integration providing direct copy commands and visual state feedback. |
| **Export to CSV** | Local MIME-type Blob generation to export filtered logs directly to local storage. |
| **Bookmarking System** | Persistent bookmark state stored in local browser state. |
| **Relative Dates** | Dynamic time-difference calculations rendering relative date offsets (Today, Yesterday, x days ago). |
| **Offline Cache** | Local fallback buffer mapping cached feed logs when network fetch operations fail. |
| **External Sharing** | Sanitized Web Intent routing mapping documentation links and snippet lengths to standard X sharing criteria. |

---

## Technical Stack

- **Backend Run-time:** Python 3, Flask
- **Frontend Architecture:** HTML5, JavaScript (ES6+), CSS3 custom properties
- **Data Source:** Google Cloud Platform RSS/Atom Feed Service

---

## Deployment & Setup

### Prerequisites

- Python 3.x
- \`pip\` package manager

### Local Environment Setup

1. **Clone Repository:**
   \`\`\`bash
   git clone https://github.com/thatcoderdaniel/daniel-event-talks-app.git
   cd daniel-event-talks-app
   \`\`\`

2. **Initialize Virtual Environment & Install Dependencies:**
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install Flask
   \`\`\`

3. **Start Flask Server:**
   \`\`\`bash
   python app.py
   \`\`\`

4. **Access UI:**
   Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in a browser.

---

## Directory Structure

\`\`\`
.
├── app.py                  # Server application router and parser core
├── templates/
│   └── index.html          # Frontend viewport structure
├── static/
│   ├── style.css           # Global stylesheets and layout definitions
│   └── script.js           # Frontend application controller and XML mapping logic
└── README.md               # Project technical documentation
\`\`\`

---

## License

This project is licensed under the MIT License.
