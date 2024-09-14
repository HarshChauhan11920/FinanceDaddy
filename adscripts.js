document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    const apiKey = '7qhSCPl7uifXsMB96CAHglBPrEcOgKUO'; // Replace with your actual API key
    const externalUserId = '66e2e59149f4dc096babeb4d'; // Replace with your external user ID

    // Function to append a message to the chat
    function appendMessage(content, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", sender);
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }

    // Function to create a chat session
    async function createChatSession() {
        try {
            const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    pluginIds: [],
                    externalUserId: externalUserId
                })
            });
            const data = await response.json();
            return data.data.id; // Extract session ID
        } catch (error) {
            console.error('Error creating chat session:', error);
            appendMessage('Error creating chat session. Please try again later.', 'bot');
            throw error;
        }
    }

    // Function to submit a query
    async function submitQuery(sessionId, query) {
        try {
            const response = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    endpointId: 'predefined-openai-gpt4o',
                    query: query,
                    pluginIds: ['plugin-1712327325', 'plugin-1713962163', 'plugin-1726226028'],
                    responseMode: 'sync'
                })
            });
            const data = await response.json();
            console.log('API Response:', data); // For debugging
            // Adjust this part based on the actual structure of your API response
            return data.data.answer || 'Sorry, I did not get a valid response.';
        } catch (error) {
            console.error('Error submitting query:', error);
            appendMessage('Error submitting query. Please try again later.', 'bot');
            throw error;
        }
    }

    // Function to handle user input and API interaction
    async function handleUserInput() {
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage(userText, 'user'); // Append user message
        chatInput.value = ""; // Clear input field

        try {
            const sessionId = await createChatSession();
            const response = await submitQuery(sessionId, userText);
            const botResponse = typeof response === 'string' ? response : JSON.stringify(response); // Handle response
            appendMessage(botResponse, 'bot');
        } catch (error) {
            appendMessage('An error occurred. Please try again later.', 'bot');
        }
    }

    // Event listeners
    sendBtn.addEventListener("click", handleUserInput);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserInput(); // Trigger the send button
        }
    });
});
