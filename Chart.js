function createPriceChart(priceData, card) {
    const ctx = card.querySelector(".price-line-chart").getContext("2d");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: priceData.map(entry => new Date(entry[0]).toLocaleDateString()), // Convert timestamp to date
            datasets: [{
                label: "Price (USD)",
                data: priceData.map(entry => entry[1]), // Extract price values
                borderColor: "blue",
                borderWidth: 2,
                fill: false,
            }],
        },
        options: {
            responsive: false, // Disable chart responsiveness
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Date",
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: "Price (USD)",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
            },
            elements: {
                point: {
                    radius: 0, // Set point radius to 0 to hide data points
                },
            },
        },
    });
}
