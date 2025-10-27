// This function runs when the HTML document has fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC FOR THE INSIDER TRADES PAGE ---
    const tradesTableBody = document.getElementById('trades-table-body');
    if (tradesTableBody) {
        fetch('director_trades.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(trade => {
                    let row = tradesTableBody.insertRow();
                    
                    // Format the date to be more readable (YYYY-MM-DD)
                    let date = new Date(trade.DateTime).toISOString().split('T')[0];
                    
                    row.insertCell(0).innerText = date;
                    row.insertCell(1).innerText = trade.Ticker;
                    row.insertCell(2).innerText = trade.CompanyName;
                    row.insertCell(3).innerText = trade.Headline;
                    
                    // Create a clickable link for the PDF
                    let linkCell = row.insertCell(4);
                    let link = document.createElement('a');
                    link.href = trade.PdfLink;
                    link.innerText = "View PDF";
                    link.target = "_blank"; // Open in a new tab
                    linkCell.appendChild(link);
                });
            });
    }

    // --- LOGIC FOR THE HALAL ETFs PAGE ---
    const etfTableBody = document.getElementById('etf-table-body');
    if (etfTableBody) {
        fetch('etf_data.json') // Assumes you created this file
            .then(response => response.json())
            .then(data => {
                data.forEach(etf => {
                    let row = etfTableBody.insertRow();
                    row.insertCell(0).innerText = etf.Ticker;
                    row.insertCell(1).innerText = etf.CompanyName;
                    row.insertCell(2).innerText = etf.MER;
                    
                    // Create a clickable link for the provider
                    let linkCell = row.insertCell(3);
                    let link = document.createElement('a');
                    link.href = etf.ProviderWebsite;
                    link.innerText = "Official Site";
                    link.target = "_blank";
                    linkCell.appendChild(link);
                });
            });
    }
});