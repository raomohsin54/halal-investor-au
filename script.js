document.addEventListener('DOMContentLoaded', () => {

    const homepageContainer = document.getElementById('homepage-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const tradesTableBody = document.getElementById('trades-table-body');
    const etfTableBody = document.getElementById('etf-table-body');

    // --- LOGIC FOR THE NEW HOMEPAGE ---
    if (homepageContainer) {
        // Fetch dashboard data to show highlights on the homepage
        fetch('./dashboard_summary.json')
            .then(response => response.json())
            .then(data => {
                const topBuyCard = document.getElementById('top-buy-card');
                const topSellCard = document.getElementById('top-sell-card');

                if (data.top_buy_of_the_day) {
                    const buy = data.top_buy_of_the_day;
                    topBuyCard.innerHTML = `<h2>Top Buy This Week</h2><div class="ticker">${buy.Ticker}</div><div class="value">$${buy.total_value.toLocaleString()}</div><div class="director-name">by ${buy.director_name}</div>`;
                } else {
                    topBuyCard.innerHTML = '<h2>Top Buy This Week</h2><div class="value">None Analyzed</div>';
                }

                if (data.top_sell_of_the_day) {
                    const sell = data.top_sell_of_the_day;
                    topSellCard.innerHTML = `<h2>Top Sell This Week</h2><div class="ticker">${sell.Ticker}</div><div class="value">$${sell.total_value.toLocaleString()}</div><div class="director-name">by ${sell.director_name}</div>`;
                } else {
                    topSellCard.innerHTML = '<h2>Top Sell This Week</h2><div class="value">None Analyzed</div>';
                }
            });

        // Fetch director trades to show a short list on the homepage
        fetch('./director_trades.json')
            .then(response => response.json())
            .then(data => {
                const latestTradesTable = document.getElementById('latest-trades-table');
                latestTradesTable.innerHTML = '';
                data.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));
                
                const latestFive = data.slice(0, 5);

                latestFive.forEach(trade => {
                    let row = latestTradesTable.insertRow();
                    row.insertCell(0).innerText = new Date(trade.DateTime).toISOString().split('T')[0];
                    row.insertCell(1).innerText = trade.Ticker;
                    row.insertCell(2).innerText = trade.CompanyName;
                    
                    let signalCell = row.insertCell(3);
                    let signalSpan = document.createElement('span');
                    signalSpan.innerText = trade.SignalType;
                    signalSpan.className = `signal signal-${trade.SignalType.toLowerCase().replace(' ', '-')}`;
                    signalCell.appendChild(signalSpan);
                    
                    row.insertCell(4).innerText = trade.Headline;
                });
            });
    }

    // --- LOGIC FOR THE 'AI Dashboard' PAGE ---
    if (dashboardContainer) {
        fetch('./dashboard_summary.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('last-updated').innerText = `Last Updated: ${new Date(data.last_updated).toLocaleString()}`;
                const topBuyCard = document.getElementById('top-buy-card');
                const topSellCard = document.getElementById('top-sell-card');

                // --- THIS IS THE CORRECTED PART ---
                if (data.top_buy_of_the_day) { 
                    const buy = data.top_buy_of_the_day; 
                    topBuyCard.innerHTML = `<h2>Top Buy This Week</h2><div class="ticker">${buy.Ticker}</div><div class="value">$${buy.total_value.toLocaleString()}</div><div class="director-name">by ${buy.director_name}</div>`; 
                } else { 
                    topBuyCard.innerHTML = '<h2>Top Buy This Week</h2><div class="value">None Analyzed</div>'; 
                }
                
                if (data.top_sell_of_the_day) { 
                    const sell = data.top_sell_of_the_day; 
                    topSellCard.innerHTML = `<h2>Top Sell This Week</h2><div class="ticker">${sell.Ticker}</div><div class="value">$${sell.total_value.toLocaleString()}</div><div class="director-name">by ${sell.director_name}</div>`; 
                } else { 
                    topSellCard.innerHTML = '<h2>Top Sell This Week</h2><div class="value">None Analyzed</div>'; 
                }
                // --- END OF CORRECTION ---

                const recentTradesTable = document.getElementById('recent-trades-table');
                if (data.recent_trades && data.recent_trades.length > 0) {
                    data.recent_trades.forEach(trade => {
                        let row = recentTradesTable.insertRow();
                        row.insertCell(0).innerText = trade.Ticker;
                        row.insertCell(1).innerText = trade.director_name;
                        row.insertCell(2).innerText = trade.trade_type;
                        row.insertCell(3).innerText = `$${trade.total_value.toLocaleString()}`;
                        let linkCell = row.insertCell(4); let link = document.createElement('a'); link.href = trade.PdfLink; link.innerText = "View PDF"; link.target = "_blank"; linkCell.appendChild(link);
                    });
                }
            });
    }

    // --- LOGIC FOR THE 'Insider Trades' PAGE ---
    if (tradesTableBody) {
        tradesTableBody.innerHTML = '<tr><td colspan="6">Loading latest trades...</td></tr>';
        fetch('./director_trades.json')
            .then(response => response.json())
            .then(data => {
                tradesTableBody.innerHTML = '';
                data.sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime));
                data.forEach(trade => {
                    let row = tradesTableBody.insertRow();
                    row.insertCell(0).innerText = new Date(trade.DateTime).toISOString().split('T')[0];
                    row.insertCell(1).innerText = trade.Ticker;
                    let signalCell = row.insertCell(2); let signalSpan = document.createElement('span'); signalSpan.innerText = trade.SignalType; signalSpan.className = `signal signal-${trade.SignalType.toLowerCase().replace(' ', '-')}`; signalCell.appendChild(signalSpan);
                    row.insertCell(3).innerText = trade.CompanyName;
                    row.insertCell(4).innerText = trade.Headline;
                    let linkCell = row.insertCell(5); let link = document.createElement('a'); link.href = trade.PdfLink; link.innerText = "View PDF"; link.target = "_blank"; linkCell.appendChild(link);
                });
            });
    }

    // --- LOGIC FOR THE 'Halal ETFs' PAGE ---
    if (etfTableBody) {
        fetch('./etf_data.json')
            .then(response => response.json())
            .then(data => {
                etfTableBody.innerHTML = '';
                data.forEach(etf => {
                    let row = etfTableBody.insertRow();
                    row.insertCell(0).innerText = etf.Ticker;
                    row.insertCell(1).innerText = etf.CompanyName;
                    row.insertCell(2).innerText = etf.MER;
                    let linkCell = row.insertCell(3); let link = document.createElement('a'); link.href = etf.ProviderWebsite; link.innerText = "Official Site"; link.target = "_blank"; linkCell.appendChild(link);
                });
            });
    }
});