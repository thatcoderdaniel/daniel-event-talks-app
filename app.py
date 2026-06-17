from flask import Flask, jsonify, render_template
import urllib.request
import xml.etree.ElementTree as ET

app = Flask(__name__)

namespaces = {'atom': 'http://www.w3.org/2005/Atom'}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/release-notes')
def get_release_notes():
    try:
        url = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        entries = []
        for entry in root.findall('atom:entry', namespaces):
            title = entry.find('atom:title', namespaces)
            updated = entry.find('atom:updated', namespaces)
            link = entry.find('atom:link[@rel="alternate"]', namespaces)
            if link is None:
                link = entry.find('atom:link', namespaces)
            content = entry.find('atom:content', namespaces)
            
            entries.append({
                'title': title.text if title is not None else '',
                'updated': updated.text if updated is not None else '',
                'link': link.attrib.get('href', '') if link is not None else '',
                'content': content.text if content is not None else ''
            })
        return jsonify({'status': 'success', 'data': entries})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
