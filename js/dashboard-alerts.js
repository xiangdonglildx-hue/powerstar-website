/**
 * Dashboard Alerts Module
 * Handles alert banner display and anomaly highlighting for SEO Dashboard
 */

// Session storage key for dismissed alerts
const ALERT_DISMISSED_KEY = 'dashboard_alert_dismissed';

/**
 * Load anomalies from data file and render alerts
 */
async function loadAnomalies() {
    try {
        const response = await fetch('./data/anomalies.json');

        if (!response.ok) {
            console.warn('No anomalies data available:', response.status);
            hideAlertBanner();
            return null;
        }

        const data = await response.json();
        console.log('Anomalies data loaded:', data);

        // Check if user dismissed this alert session
        const dismissedAt = sessionStorage.getItem(ALERT_DISMISSED_KEY);
        if (dismissedAt && data.detectedAt) {
            const dismissedTime = new Date(dismissedAt).getTime();
            const detectedTime = new Date(data.detectedAt).getTime();
            // If dismissed after detection, keep hidden
            if (dismissedTime > detectedTime) {
                console.log('Alert was dismissed this session');
                hideAlertBanner();
                return data;
            }
        }

        // Render alerts if anomalies exist
        if (data.anomalies && data.anomalies.length > 0) {
            renderAlertBanner(data.anomalies, data.totalAnomalies);
            highlightAnomalyMetrics(data.anomalies);
        } else {
            hideAlertBanner();
        }

        return data;

    } catch (error) {
        console.error('Error loading anomalies:', error);
        hideAlertBanner();
        return null;
    }
}

/**
 * Render the critical alert banner
 * @param {Array} anomalies - Array of anomaly objects
 * @param {number} totalCount - Total number of anomalies
 */
function renderAlertBanner(anomalies, totalCount) {
    const banner = document.getElementById('alertBanner');
    const countEl = banner?.querySelector('.alert-count');
    const severityEl = banner?.querySelector('.alert-severity');

    if (!banner) {
        console.warn('Alert banner element not found');
        return;
    }

    // Update count
    if (countEl) {
        countEl.textContent = `${totalCount || anomalies.length} anomalies detected`;
    }

    // Update severity breakdown
    if (severityEl) {
        const p1Count = anomalies.filter(a => a.severity === 'P1').length;
        const p2Count = anomalies.filter(a => a.severity === 'P2').length;
        severityEl.textContent = `(P1: ${p1Count}, P2: ${p2Count})`;
    }

    // Show banner
    banner.classList.remove('hidden');

    console.log(`Alert banner displayed: ${totalCount} anomalies`);
}

/**
 * Hide the alert banner
 */
function hideAlertBanner() {
    const banner = document.getElementById('alertBanner');
    if (banner) {
        banner.classList.add('hidden');
    }
}

/**
 * Dismiss alert banner and store in session
 */
function dismissAlert() {
    hideAlertBanner();
    sessionStorage.setItem(ALERT_DISMISSED_KEY, new Date().toISOString());
    console.log('Alert dismissed for this session');
}

/**
 * Highlight metric cards and table rows affected by anomalies
 * @param {Array} anomalies - Array of anomaly objects
 */
function highlightAnomalyMetrics(anomalies) {
    if (!anomalies || anomalies.length === 0) return;

    anomalies.forEach(anomaly => {
        switch (anomaly.type) {
            case 'traffic_drop':
                highlightTrafficDrop(anomaly);
                break;
            case 'indexing_drop':
                highlightIndexingDrop(anomaly);
                break;
            case 'position_drop':
                highlightPositionDrop(anomaly);
                break;
            default:
                console.warn('Unknown anomaly type:', anomaly.type);
        }
    });
}

/**
 * Highlight traffic drop (clicks metric card)
 * @param {Object} anomaly - Anomaly object
 */
function highlightTrafficDrop(anomaly) {
    // Highlight clicks card
    const clicksCard = document.getElementById('clicks7Days')?.closest('.metric-card');
    const clicksChange = document.getElementById('clicksChange');

    if (clicksCard) {
        clicksCard.classList.add('anomaly');
    }

    if (clicksChange) {
        clicksChange.classList.remove('neutral', 'positive');
        clicksChange.classList.add('negative', 'anomaly');
        // Update change indicator
        const changePercent = Math.abs(anomaly.change);
        clicksChange.innerHTML = `<span class="change-indicator drop">${changePercent}%</span> vs previous`;
    }

    console.log('Highlighted traffic drop anomaly');
}

/**
 * Highlight indexing drop (indexed pages card)
 * @param {Object} anomaly - Anomaly object
 */
function highlightIndexingDrop(anomaly) {
    // Highlight indexed pages card
    const indexedCard = document.getElementById('indexedPages')?.closest('.metric-card');
    const indexedChange = document.getElementById('indexedPagesChange');

    if (indexedCard) {
        indexedCard.classList.add('anomaly');
    }

    if (indexedChange) {
        indexedChange.classList.remove('neutral', 'positive');
        indexedChange.classList.add('negative', 'anomaly');
        // Show indexing gap from details
        indexedChange.innerHTML = `<span class="change-indicator drop">${anomaly.details}</span>`;
    }

    console.log('Highlighted indexing drop anomaly');
}

/**
 * Highlight position drop (keyword in table)
 * @param {Object} anomaly - Anomaly object
 */
function highlightPositionDrop(anomaly) {
    // Find keyword in table and highlight row
    const keyword = anomaly.metric;
    const tbody = document.getElementById('keywordsTableBody');

    if (!tbody || !keyword) return;

    // Find the row containing this keyword
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const keywordCell = row.querySelector('.keyword');
        if (keywordCell && keywordCell.textContent.toLowerCase().includes(keyword.toLowerCase())) {
            row.classList.add('anomaly');

            // Add change indicator to position cell
            const positionCell = row.querySelector('.position');
            if (positionCell) {
                const currentPosition = positionCell.textContent;
                const dropAmount = Math.abs(anomaly.change);
                positionCell.innerHTML = `${currentPosition} <span class="change-indicator drop">${dropAmount}</span>`;
            }
        }
    });

    console.log('Highlighted position drop anomaly for:', keyword);
}

/**
 * Clear all anomaly highlights
 */
function clearAnomalyHighlights() {
    // Remove anomaly class from all elements
    document.querySelectorAll('.anomaly').forEach(el => {
        el.classList.remove('anomaly');
    });

    // Clear session storage
    sessionStorage.removeItem(ALERT_DISMISSED_KEY);

    console.log('Cleared all anomaly highlights');
}

// Export functions for use in dashboard.html
window.loadAnomalies = loadAnomalies;
window.dismissAlert = dismissAlert;
window.clearAnomalyHighlights = clearAnomalyHighlights;