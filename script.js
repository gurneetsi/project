const proxyUrl = "https://cors-anywhere.herokuapp.com";
const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";
const apiUrlWithProxy = proxyUrl + apiUrl;

document.addEventListener("DOMContentLoaded", function () {
    // Elements for the search section
    const cryptoTableBody = document.querySelector(".crypto-table-body");
    const searchButton = document.getElementById("search-button");
    const cryptoInput = document.getElementById("crypto-input");
    const cryptoResult = document.getElementById("crypto-result");

    // Elements for the prediction section
    const predictionButton = document.getElementById("prediction-button");
    const cryptoInputPrediction = document.getElementById("crypto-input-prediction");
    const cryptoPredictionResult = document.getElementById("crypto-prediction-result");

    // Elements for the crypto table
    const cryptoTable = document.getElementById("crypto-table");

    // Function to create and display the price table
    function createPriceTable(priceData, targetElement) {
        const priceTableBody = targetElement.querySelector(".price-table-body");
        // Clear the table before adding new data
        priceTableBody.innerHTML = "";

        // Limit the priceData to the first 10 entries
        const limitedPriceData = priceData.slice(0, 10);

        for (let i = 0; i < limitedPriceData.length; i++) {
            const entry = limitedPriceData[i];
            const date = new Date(entry[0]).toLocaleDateString();
            const price = entry[1];

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${date}</td>
                <td>$${price.toFixed(2)}</td>
            `;

            priceTableBody.appendChild(row);
        }
    }

    // Function to create and display the price chart
    function createPriceChart(priceData, targetElement) {
        const ctx = targetElement.querySelector(".price-line-chart").getContext("2d");

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

    // Function to create and display the list of cryptocurrencies
    function createCryptoList(cryptoList) {
        cryptoTableBody.innerHTML = ""; // Clear the table before adding new data

        for (let i = 0; i < cryptoList.length; i++) {
            const crypto = cryptoList[i];
            const name = crypto.name;
            const symbol = crypto.symbol.toUpperCase();
            const priceInUSD = crypto.current_price;
            const sevenDayPrediction = generate7DayPrediction(); // Generate a 7-day prediction
            const oneMonthPrediction = generate1MonthPrediction(); // Generate a 1-month prediction

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${name}</td>
                <td>${symbol}</td>
                <td>$${priceInUSD.toFixed(2)}</td>
                <td>${sevenDayPrediction}%</td>
                <td>${oneMonthPrediction}%</td>
            `;

            cryptoTableBody.appendChild(row);
        }
    }

    // Function to generate a random prediction for a cryptocurrency's 7-day price change
    function generate7DayPrediction() {
        const randomChange = (Math.random() - 0.5) * 10; // Generate a random change between -5 and 5
        return randomChange.toFixed(2);
    }

    // Function to generate a random prediction for a cryptocurrency's 1-month price change
    function generate1MonthPrediction() {
        const randomChange = (Math.random() - 0.5) * 50; // Generate a random change between -25 and 25
        return randomChange.toFixed(2);
    }

    // Function to fetch data using the CORS proxy
    function fetchDataWithProxy(url, targetElement) {
        const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

        fetch(apiUrlWithProxy)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here
            // You can update the DOM with the cryptocurrency data
        })
        .catch(error => {
            console.error('Error:', error);
            cryptoTableBody.innerHTML = 'An error occurred while fetching cryptocurrency data.';
        });
    }

    // Function to fetch and display the list of cryptocurrencies on page load
    function fetchAndDisplayCryptoList() {
        // Change the 'per_page' parameter to specify the number of cryptocurrencies to fetch
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Display the list of cryptocurrencies
                createCryptoList(data);
            })
            .catch(error => {
                console.error('Error:', error);
                cryptoTableBody.innerHTML = 'An error occurred while fetching cryptocurrency data.';
            });
    }

    fetchAndDisplayCryptoList();

    // Function to handle cryptocurrency search
    function handleCryptoSearch() {
        const cryptoSymbol = cryptoInput.value.trim().toLowerCase();

        if (cryptoSymbol === "") {
            cryptoResult.innerHTML = "Please enter a cryptocurrency name or symbol.";
            return;
        }

        fetch(`https://api.coingecko.com/api/v3/coins/${cryptoSymbol}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.id) {
                    const name = data.name;
                    const symbol = data.symbol.toUpperCase();
                    const priceInUSD = data.market_data.current_price.usd;
                    const logoURL = data.image.small;

                    // Create the card structure with the chart and price table
                    cryptoResult.innerHTML = `
                        <div class="card">
                           <img src="${logoURL}" alt="${name} Logo" class="card-img-top crypto-logo-small">
                            <div class="card-body">
                                <h5 class="card-title">${name} (${symbol})</h5>
                                <p class="card-text">Price in USD: $${priceInUSD.toFixed(2)}</p>
                                <canvas class="price-line-chart" width="400" height="200"></canvas>
                                <h4 class="mt-3, text-dark"">Price Data Table</h4>
                                <table class="table table-bordered table-light table-striped table-hover mt-2">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Price (USD)</th>
                                        </tr>
                                    </thead>
                                    <tbody class="price-table-body">
                                        <!-- Price data will be displayed here -->
                                    </tbody>
                                </table>
                               
                            </div>
                            
                        </div>
                    `;

                    // Fetch historical price data for the last 365 days from CoinGecko API
                    fetch(`https://api.coingecko.com/api/v3/coins/${cryptoSymbol}/market_chart?vs_currency=usd&days=365`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(chartData => {
                            const priceData = chartData.prices;
                            // Display price table
                            createPriceTable(priceData, cryptoResult);
                            // Create and display the price chart
                            createPriceChart(priceData, cryptoResult);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    cryptoResult.innerHTML = `Cryptocurrency "${cryptoSymbol}" not found.`;
                    // Clear the price table and chart if the cryptocurrency is not found
                    cryptoResult.querySelector(".price-table-body").innerHTML = "";
                    cryptoResult.querySelector(".price-line-chart").remove();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                cryptoResult.innerHTML = 'An error occurred while fetching data.';
                // Clear the price table and chart in case of an error
                cryptoResult.querySelector(".price-table-body").innerHTML = "";
                cryptoResult.querySelector(".price-line-chart").remove();
            });
    }

    // Function to calculate the moving average (MA) of price data
    function calculateMovingAverage(priceData, period) {
        const prices = priceData.map(entry => entry[1]); // Extract price values
        if (prices.length < period) {
            return 0; // Not enough data for calculation
        }

        // Calculate the MA as the average of the last 'period' prices
        const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
        return sum / period;
    }

    // Function to predict cryptocurrency price based on average daily change
    async function predictCryptoPrice(cryptoSymbol) {
        const MA_SHORT_PERIOD = 7; // Short-term MA period (days)
        const MA_LONG_PERIOD = 365; // Long-term MA period (days)

        try {
            // Fetch historical price data for the last 365 days from CoinGecko API
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoSymbol}/market_chart?vs_currency=usd&days=365`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const chartData = await response.json();
            const priceData = chartData.prices;

            // Calculate the short-term MA
            const shortTermMA = calculateMovingAverage(priceData, MA_SHORT_PERIOD);

            // Calculate the long-term MA
            const longTermMA = calculateMovingAverage(priceData, MA_LONG_PERIOD);

            // Calculate the average daily price change
            const averageDailyChange = (shortTermMA - longTermMA) / MA_SHORT_PERIOD;

            // Project the next day's price based on the average daily change
            const lastPrice = priceData[priceData.length - 1][1];
            const nextDayPrice = lastPrice + averageDailyChange;

            // Make a prediction based on the projected next day's price
            if (nextDayPrice > lastPrice) {
                return `Prediction: The price of ${cryptoSymbol.toUpperCase()} is expected to go up to approximately $${nextDayPrice.toFixed(2)} tomorrow.`;
            } else if (nextDayPrice < lastPrice) {
                return `Prediction: The price of ${cryptoSymbol.toUpperCase()} is expected to go down to approximately $${nextDayPrice.toFixed(2)} tomorrow.`;
            } else {
                return `Prediction: The price of ${cryptoSymbol.toUpperCase()} is expected to remain approximately the same at $${nextDayPrice.toFixed(2)} tomorrow.`;
            }
        } catch (error) {
            throw error;
        }
    }

    // Function to handle cryptocurrency price prediction
    async function handleCryptoPrediction() {
        const cryptoSymbolPrediction = cryptoInputPrediction.value.trim().toLowerCase();

        if (cryptoSymbolPrediction === "") {
            cryptoPredictionResult.innerHTML = "Please enter a cryptocurrency name or symbol for prediction.";
            return;
        }

        try {
            // Implement your cryptocurrency price prediction logic here
            const predictionResult = await predictCryptoPrice(cryptoSymbolPrediction);

            // Display the prediction result
            cryptoPredictionResult.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${predictionResult}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            cryptoPredictionResult.innerHTML = `An error occurred while fetching data for prediction: ${error.message}`;
        }
    }

    // Event listeners for search and prediction buttons
    searchButton.addEventListener("click", handleCryptoSearch);
    predictionButton.addEventListener("click", handleCryptoPrediction);

    // Fetch and display the list of cryptocurrencies on page load
});
