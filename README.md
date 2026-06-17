# BigQuery Release Explorer

Real-time parser and dashboard for Google Cloud BigQuery release notes. Flask backend, vanilla HTML5/JS/CSS3 frontend.

---

## Technical Features

| Feature | Implementation Details |
| :--- | :--- |
| **Feed Ingestion** | Asynchronous RSS/Atom parsing via Python `xml.etree.ElementTree` |
| **Entry Segmentation** | Client-side HTML parsing to isolate categorized updates (Feature, Issue, Announcement, Deprecation) |
| **Search & Filter** | Client-side keyword index and category state filtering |
| **Theme Toggle** | CSS root variables override with local storage persistence |
| **Copy Action** | Clipboard API integration with temporary inline status |
| **CSV Export** | Client-side Blob creation for local CSV downloads |
| **Bookmarking** | Local storage state mapping for saved elements |
| **Date Formatting** | Relative label calculations (Today, Yesterday, x days ago) |
| **Offline Fallback** | Local storage cache mapping for network timeouts |
| **External Sharing** | Sanitized Web Intent integration targeting X |

---

## Technical Stack

- **Backend:** Python 3, Flask
- **Frontend:** HTML5, JavaScript (ES6+), CSS3 Variables
- **Source Feed:** Google Cloud BigQuery RSS

---

## Deployment & Setup

```bash
# Clone repository
git clone https://github.com/thatcoderdaniel/daniel-event-talks-app.git
cd daniel-event-talks-app

# Setup environment & dependencies
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install Flask

# Run application
python app.py
```
Access the application viewport at `http://127.0.0.1:5000`.

---

## Directory Structure

```
├── app.py
├── README.md
├── static/
│   ├── script.js
│   └── style.css
└── templates/
    └── index.html
```

---

## License

This project is licensed under the MIT License.
