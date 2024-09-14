const chatContent = document.getElementById('chat-content');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-btn');

const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your Alpha Vantage API key
const API_URL = 'https://www.alphavantage.co/query';

// Function to display messages
function addMessageToChat(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', className);
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Function to call Alpha Vantage API for stock prices
async function getStockPrice(stockSymbol) {
    const url = `${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=1min&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timeSeries = data['Time Series (1min)'];
        if (timeSeries) {
            const latestTime = Object.keys(timeSeries)[0];
            const latestData = timeSeries[latestTime];
            const price = latestData['1. open'];
            return `The latest stock price of ${stockSymbol.toUpperCase()} is $${price}`;
        } else {
            return `Sorry, I couldn't retrieve stock data for ${stockSymbol}. Please check the symbol and try again.`;
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return `Sorry, an error occurred while fetching stock data.`;
    }
}

// Function to process the user's message and determine the response
async function handleUserMessage(userMessage) {
    addMessageToChat(userMessage, 'outgoing');

    let botResponse;

    // Check if the message is asking for a stock price
    const stockPattern = /(\w+)/i;
    const match = userMessage.match(stockPattern);

    if (match) {
        const stockSymbol = match[1];
        botResponse = await getStockPrice(stockSymbol);
    } else {
        botResponse = "Sorry, I can only help with stock prices at the moment. Try asking for 'stock price of AAPL'.";
    }

    // Display the bot response
    addMessageToChat(botResponse, 'incoming');
}

// Function to handle sending a message
function sendMessage() {
    const userMessage = chatInput.value.trim();

    if (userMessage === '') {
        return;
    }

    // Process the user's message
    handleUserMessage(userMessage);

    // Clear the input field
    chatInput.value = '';
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
