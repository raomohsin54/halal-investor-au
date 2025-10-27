document.addEventListener('DOMContentLoaded', () => {
    const repoName = 'halal-investor-au';

    fetch(`/${repoName}/dashboard_summary.json`)
        .then(response => response.json())
        .then(data => {
            // Update the last updated timestamp
            document.getElementById('last-updated').innerText = `Last Updated: ${new Date(data.last_updated).toLocaleString()}`;

            const topBuyCard = document.getElementById('top-buy-card');
            const topSellCard = document.getElementById('top-sell-card');

            // Populate Top Buy Card
            if (data.top_buy_of_the_day) {
                const buy = data.top_buy_of_the_day;
                topBuyCard.innerHTML = `
                    <h2>Top Buy of the Day</h2>
                    <div class="ticker">${buy.Ticker}</div>
                    <div class="value">$${buy.total_value.toLocaleString()}</div>
                    <div class="director-name">by ${buy.director_name}</div>
                `;
            } else {
                topBuyCard.innerHTML = '<h2>Top Buy of the Day</h2><div class="value">None Analyzed</div>';
            }

            // Populate Top Sell Card
            if (data.top_sell_of_the_day) {
                const sell = data.top_sell_of_the_day;
                topSellCard.innerHTML = `
                    <h2>Top Sell of the Day</h2>
                    <div class="ticker">${sell.Ticker}</div>
                    <div class="value">$${sell.total_value.toLocaleString()}</div>
                    <div class="director-name">by ${sell.director_name}</div>
                `;
            } else {
                topSellCard.innerHTML = '<h2>Top Sell of the Day</h2><div class="value">None Analyzed</div>';
            }
            
            // Populate Recent Trades Table
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
});