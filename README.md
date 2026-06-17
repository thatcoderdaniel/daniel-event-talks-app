# BigQuery Release Explorer

An elegant, real-time web application to explore, filter, and share Google Cloud BigQuery release notes. Built using Python Flask and vanilla HTML, CSS, and JavaScript.

## Features

- **Live Feed Fetching:** Real-time parsing of the official Google Cloud BigQuery RSS/Atom feed.
- **Interactive Dashboard:** Dynamic counts of total updates, feature releases, issue fixes, and announcements.
- **Search & Filter:** Instantly filter updates by text search or category tags (Features, Issues, Announcements, Deprecations).
- **Twitter/X Sharing:** Easily select and tweet individual release notes with a pre-filled Twitter Intent including a link back to Google Cloud documentation.
- **Modern Design:** High-fidelity glassmorphic dark theme with skeleton loader states and smooth hover micro-animations.

## Tech Stack

- **Backend:** Python, Flask
- **Frontend:** Plain HTML5, Vanilla JavaScript, Custom CSS3 Variables
- **Data Source:** Official BigQuery Release Notes RSS Feed

## Getting Started

### Prerequisites

- Python 3.x
- \`pip\`

### Local Development Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/thatcoderdaniel/daniel-event-talks-app.git
   cd daniel-event-talks-app
   \`\`\`

2. Create a virtual environment and install Flask:
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install Flask
   \`\`\`

3. Start the Flask server:
   \`\`\`bash
   python app.py
   \`\`\`

4. Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

## License

This project is open-source and available under the MIT License.
