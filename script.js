// This function runs when the entire HTML document is ready
document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC FOR THE 'Insider Trades' PAGE ---
    const tradesTableBody = document.getElementById('trades-table-body');
    if (tradesTableBody) {
        tradesTableBody.innerHTML = '<tr><td colspan="6">Loading latest trades...</td></tr>';
        fetch('./director_trades.json') // Using relative path
            .then(response => response.json())
            .then(data => {
                tradesTableBody.innerHTML = ''; // Clear loading message
                data.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime)); // Sort newest first

                data.forEach(trade => {
                    let row = tradesTableBody.insertRow();
                    row.insertCell(0).innerText = new Date(trade.DateTime).toISOString().split('T')[0];
                    row.insertCell(1).innerText = trade.Ticker;

                    // Create a styled span for the signal type
                    let signalCell = row.insertCell(2);
                    let signalSpan = document.createElement('span');
                    signalSpan.innerText = trade.SignalType;
                    signalSpan.className = `signal signal-${trade.SignalType.toLowerCase().replace(' ', '-')}`;
                    signalCell.appendChild(signalSpan);
                    
                    row.insertCell(3).innerText = trade.CompanyName;
                    row.insertCell(4).innerText = trade.Headline;
                    
                    let linkCell = row.insertCell(5);
                    let link = document.createElement('a');
                    link.href = trade.PdfLink;
                    link.innerText = "View PDF";
                    link.target = "_blank";
                    linkCell.appendChild(link);
                });
            })
            .catch(error => {
                console.error('Error fetching director trades:', error);
                tradesTableBody.innerHTML = '<tr><td colspan="6">Could not load trade data.</td></tr>';
            });
    }

    // --- LOGIC FOR THE 'AI Dashboard' PAGE ---
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        fetch('./dashboard_summary.json') // Using relative path
            .then(response => response.json())
            .then(data => {
                document.getElementById('last-updated').innerText = `Last Updated: ${new Date(data.last_updated).toLocaleString()}`;
                
                const topBuyCard = document.getElementById('top-buy-card');
                const topSellCard = document.getElementById('top-sell-card');

                if (data.top_buy_of_the_day) {
                    const buy = data.top_buy_of_the_day;
                    topBuyCard.innerHTML = `<h2>Top Buy Today</h2><div class="ticker">${buy.Ticker}</div><div class="value">$${buy.total_value.toLocaleString()}</div><div class="director-name">by ${buy.director_name}</div>`;
                } else {
                    topBuyCard.innerHTML = '<h2>Top Buy Today</h2><div class="value">None Analyzed</div>';
                }

                if (data.top_sell_of_the_day) {
                    const sell = data.top_sell_of_the_day;
                    topSellCard.innerHTML = `<h2>Top Sell Today</h2><div class="ticker">${sell.Ticker}</div><div class="value">$${sell.total_value.toLocaleString()}</div><div class="director-name">by ${sell.director_name}</div>`;
                } else {
                    topSellCard.innerHTML = '<h2>Top Sell Today</h2><div class="value">None Analyzed</div>';
                }
                
                const recentTradesTable = document.getElementById('recent-trades-table');
                if (data.recent_trades && data.recent_trades.length > 0) {
                    data.recent_trades.forEach(trade => {
                        let row = recentTradesTable.insertRow();
                        row.insertCell(0).innerText = trade.Ticker;
                        row.insertCell(1).innerText = trade.director_name;
                        row.insertCell(2).innerText = trade.trade_type;
                        row.insertCell(3).innerText = `$${trade.total_value.toLocaleString()}`;
                        let linkCell = row.insertCell(4);
                        let link = document.createElement('a');
                        link.href = trade.PdfLink;
                        link.innerText = "View PDF";
                        link.target = "_blank";
                        linkCell.appendChild(link);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                document.getElementById('last-updated').innerText = "Error loading dashboard data.";
            });
    }

    // --- LOGIC FOR THE 'Halal ETFs' PAGE ---
    const etfTableBody = document.getElementById('etf-table-body');
    if (etfTableBody) {
        // ... Logic to fetch and display etf_data.json would go here ...
    }
});