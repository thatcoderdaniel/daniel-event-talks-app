document.addEventListener('DOMContentLoaded', () => {
    // App State
    let allUpdates = [];
    let activeFilter = 'all';
    let searchQuery = '';

    // DOM Elements
    const timeline = document.getElementById('timeline');
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = document.getElementById('refresh-icon');
    const exportBtn = document.getElementById('export-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statusBanner = document.getElementById('status-banner');
    
    // Stats Elements
    const statTotal = document.getElementById('stat-total');
    const statFeatures = document.getElementById('stat-features');
    const statIssues = document.getElementById('stat-issues');
    const statAnnouncements = document.getElementById('stat-announcements');

    // Theme Toggle Initialization
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        if (isLight) {
            localStorage.setItem('theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            showToast('Swapped to Light theme');
        } else {
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            showToast('Swapped to Dark theme');
        }
    });

    // Keyboard Shortcut: press '/' to search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });

    // Parse RSS HTML content into typed items
    function parseEntryContent(contentHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentHtml;
        
        const items = [];
        let currentItem = null;
        
        for (let child of tempDiv.children) {
            if (child.tagName === 'H3') {
                if (currentItem) {
                    items.push(currentItem);
                }
                currentItem = {
                    type: child.innerText.trim(),
                    htmlContent: ''
                };
            } else {
                if (!currentItem) {
                    currentItem = {
                        type: 'Update',
                        htmlContent: ''
                    };
                }
                currentItem.htmlContent += child.outerHTML;
            }
        }
        if (currentItem) {
            items.push(currentItem);
        }
        return items;
    }

    // Process API Response
    function processRawData(data) {
        allUpdates = [];
        data.forEach(entry => {
            const parsedItems = parseEntryContent(entry.content);
            parsedItems.forEach(item => {
                const temp = document.createElement('div');
                temp.innerHTML = item.htmlContent;
                const textContent = temp.innerText || '';
                
                allUpdates.push({
                    date: entry.title,
                    link: entry.link,
                    type: item.type,
                    htmlContent: item.htmlContent,
                    textContent: textContent
                });
            });
        });
        
        updateStats();
        renderFeed();
    }

    // Update Overview Stats Dashboard
    function updateStats() {
        statTotal.textContent = allUpdates.length;
        
        const features = allUpdates.filter(item => item.type.toLowerCase().includes('feature')).length;
        const issues = allUpdates.filter(item => item.type.toLowerCase().includes('issue') || item.type.toLowerCase().includes('fix')).length;
        const announcements = allUpdates.filter(item => item.type.toLowerCase().includes('announcement')).length;
        
        statFeatures.textContent = features;
        statIssues.textContent = issues;
        statAnnouncements.textContent = announcements;
    }

    // Helper to matches filter type
    function matchesFilter(item, filter) {
        if (filter === 'all') return true;
        const typeLower = item.type.toLowerCase();
        if (filter === 'Feature') return typeLower.includes('feature');
        if (filter === 'Issue') return typeLower.includes('issue') || typeLower.includes('fix');
        if (filter === 'Announcement') return typeLower.includes('announcement');
        if (filter === 'Deprecation') return typeLower.includes('deprecation');
        return false;
    }

    // Group items by date for timeline rendering
    function groupItemsByDate(items) {
        const groups = {};
        items.forEach(item => {
            if (!groups[item.date]) {
                groups[item.date] = {
                    date: item.date,
                    link: item.link,
                    items: []
                };
            }
            groups[item.date].items.push(item);
        });
        return Object.values(groups);
    }

    // Get currently filtered list of items
    function getFilteredItems() {
        const query = searchQuery.toLowerCase().trim();
        return allUpdates.filter(item => {
            const matchType = matchesFilter(item, activeFilter);
            const matchQuery = query === '' || 
                               item.textContent.toLowerCase().includes(query) || 
                               item.type.toLowerCase().includes(query) || 
                               item.date.toLowerCase().includes(query);
            return matchType && matchQuery;
        });
    }

    // Render Timeline Feed
    function renderFeed() {
        const filteredItems = getFilteredItems();

        if (filteredItems.length === 0) {
            timeline.innerHTML = `
                <div class="no-results">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <h4>No Release Notes Found</h4>
                    <p>Try refining your search or filter categories.</p>
                    <button id="clear-search-btn" class="btn btn-secondary" style="margin-top: 16px;">Clear Filters & Search</button>
                </div>
            `;
            
            // Attach Clear button event listener
            document.getElementById('clear-search-btn').addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                activeFilter = 'all';
                filterButtons.forEach(b => {
                    if (b.dataset.filter === 'all') b.classList.add('active');
                    else b.classList.remove('active');
                });
                renderFeed();
            });
            return;
        }

        const grouped = groupItemsByDate(filteredItems);
        
        timeline.innerHTML = '';
        
        grouped.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'timeline-group';
            
            // Date marker
            groupEl.innerHTML = `
                <div class="timeline-date-marker">
                    <div class="timeline-dot">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <span class="timeline-date-text">${group.date}</span>
                </div>
                <div class="timeline-cards"></div>
            `;
            
            const cardsContainer = groupEl.querySelector('.timeline-cards');
            
            group.items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'release-card';
                
                // Get appropriate badge class
                let badgeClass = 'badge-default';
                const typeLower = item.type.toLowerCase();
                if (typeLower.includes('feature')) badgeClass = 'badge-feature';
                else if (typeLower.includes('issue') || typeLower.includes('fix')) badgeClass = 'badge-issue';
                else if (typeLower.includes('announcement')) badgeClass = 'badge-announcement';
                else if (typeLower.includes('deprecation')) badgeClass = 'badge-deprecation';
                
                card.innerHTML = `
                    <div class="card-meta">
                        <span class="badge ${badgeClass}">${item.type}</span>
                        <div class="card-actions">
                            <button class="btn-copy" title="Copy text to clipboard">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span class="copy-text">Copy</span>
                            </button>
                            <button class="btn-tweet" title="Share this update on X / Twitter">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                Tweet Update
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        ${item.htmlContent}
                    </div>
                `;
                
                // Copy Button Event
                const copyBtn = card.querySelector('.btn-copy');
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(item.textContent.replace(/\s+/g, ' ').trim());
                    showToast('Copied to clipboard!');
                    
                    // Visual Copy Feedback
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span style="color: #10b981;">Copied!</span>
                    `;
                    copyBtn.disabled = true;
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.disabled = false;
                    }, 2000);
                });

                // Tweet Button Event
                card.querySelector('.btn-tweet').addEventListener('click', () => {
                    tweetUpdate(item.date, item.type, item.textContent, item.link);
                });
                
                cardsContainer.appendChild(card);
            });
            
            timeline.appendChild(groupEl);
        });
    }

    // Tweet functionality
    function tweetUpdate(date, type, textContent, link) {
        let text = textContent.replace(/\s+/g, ' ').trim();
        const prefix = `BigQuery ${type} (${date}): `;
        const suffix = `\n\nRead more: `;
        const maxTextLen = 280 - prefix.length - suffix.length - 23;
        
        if (text.length > maxTextLen) {
            text = text.substring(0, maxTextLen - 3) + '...';
        }
        
        const fullTweet = `${prefix}"${text}"${suffix}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullTweet)}&url=${encodeURIComponent(link)}`;
        
        window.open(twitterUrl, '_blank', 'width=550,height=420,menubar=no,toolbar=no,scrollbars=yes');
        showToast('Opening Twitter/X share window...');
    }

    // Export to CSV Function
    function exportToCSV() {
        const filteredItems = getFilteredItems();

        if (filteredItems.length === 0) {
            showToast('No items to export.');
            return;
        }

        let csvRows = [];
        // Header Row
        csvRows.push(['Date', 'Type', 'Content', 'Link'].map(h => `"${h.replace(/"/g, '""')}"`).join(','));
        
        filteredItems.forEach(item => {
            const date = item.date;
            const type = item.type;
            const content = item.textContent.replace(/\s+/g, ' ').trim();
            const link = item.link;
            const row = [date, type, content, link].map(val => `"${val.replace(/"/g, '""')}"`);
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `bigquery_release_notes_${activeFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV export downloaded!');
    }

    // Toast notifications helper
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Show status banner
    function showStatusBanner(message, type = 'info') {
        statusBanner.className = `status-banner ${type}`;
        statusBanner.textContent = message;
        statusBanner.classList.remove('hidden');
    }

    // Hide status banner
    function hideStatusBanner() {
        statusBanner.classList.add('hidden');
    }

    // Fetch data from API
    async function fetchReleaseNotes() {
        refreshIcon.classList.add('spinning');
        refreshBtn.disabled = true;
        hideStatusBanner();
        
        // Show loading skeletons
        timeline.innerHTML = `
            <div class="skeleton-timeline">
                <div class="skeleton-node">
                    <div class="skeleton-date"></div>
                    <div class="skeleton-card"></div>
                </div>
                <div class="skeleton-node">
                    <div class="skeleton-date"></div>
                    <div class="skeleton-card"></div>
                </div>
            </div>
        `;

        try {
            const response = await fetch('/api/release-notes');
            const result = await response.json();
            
            if (result.status === 'success') {
                processRawData(result.data);
                showToast('Release notes loaded successfully.');
            } else {
                throw new Error(result.message || 'Unknown backend error.');
            }
        } catch (error) {
            console.error(error);
            showStatusBanner(`Failed to fetch release notes: ${error.message}. Please try again later.`, 'error');
            timeline.innerHTML = `
                <div class="no-results">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ef4444" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h4>Error Fetching Data</h4>
                    <p>Unable to load release notes feed. Check backend logs or try again.</p>
                </div>
            `;
        } finally {
            refreshIcon.classList.remove('spinning');
            refreshBtn.disabled = false;
        }
    }

    // Setup Event Listeners
    refreshBtn.addEventListener('click', fetchReleaseNotes);
    exportBtn.addEventListener('click', exportToCSV);
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderFeed();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderFeed();
        });
    });

    // Initial load
    fetchReleaseNotes();
});
