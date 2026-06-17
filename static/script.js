document.addEventListener('DOMContentLoaded', () => {
    // App State
    let allUpdates = [];
    let activeFilter = 'all';
    let searchQuery = '';

    // DOM Elements
    const timeline = document.getElementById('timeline');
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = document.getElementById('refresh-icon');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statusBanner = document.getElementById('status-banner');
    
    // Stats Elements
    const statTotal = document.getElementById('stat-total');
    const statFeatures = document.getElementById('stat-features');
    const statIssues = document.getElementById('stat-issues');
    const statAnnouncements = document.getElementById('stat-announcements');

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

    // Render Timeline Feed
    function renderFeed() {
        // Filter and Search
        const query = searchQuery.toLowerCase().trim();
        const filteredItems = allUpdates.filter(item => {
            const matchType = matchesFilter(item, activeFilter);
            const matchQuery = query === '' || 
                               item.textContent.toLowerCase().includes(query) || 
                               item.type.toLowerCase().includes(query) || 
                               item.date.toLowerCase().includes(query);
            return matchType && matchQuery;
        });

        if (filteredItems.length === 0) {
            timeline.innerHTML = `
                <div class="no-results">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <h4>No Release Notes Found</h4>
                    <p>Try refining your search or filter categories.</p>
                </div>
            `;
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
