// ============================================
// OFFLINE SURVIVAL AI - FRONTEND LOGIC
// ============================================

// Use relative URL for same-origin requests
const API_BASE_URL = '';

// DOM Elements
const questionInput = document.getElementById('question-input');
const askBtn = document.getElementById('ask-btn');
const chatMessages = document.getElementById('chat-messages');
const navigateBtn = document.getElementById('navigate-btn');
const startLatInput = document.getElementById('start-lat');
const startLonInput = document.getElementById('start-lon');
const endLatInput = document.getElementById('end-lat');
const endLonInput = document.getElementById('end-lon');
const navigationResult = document.getElementById('navigation-result');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateMessageTime();
    setInterval(updateMessageTime, 60000); // Update time every minute
});

// Event Listeners
function initializeEventListeners() {
    // Ask question
    askBtn.addEventListener('click', handleAskQuestion);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskQuestion();
        }
    });

    // Navigate
    navigateBtn.addEventListener('click', handleNavigate);
    
    // Enter key for navigation inputs
    [startLatInput, startLonInput, endLatInput, endLonInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleNavigate();
            }
        });
    });
}

// Handle Ask Question
async function handleAskQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) {
        showError('Please enter a question.');
        return;
    }

    // Add user message
    addMessage('user', question);
    questionInput.value = '';
    
    // Show loading
    showLoading();
    askBtn.classList.add('loading');

    try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: question,
                training_mode: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add AI response
        addMessage('ai', data.answer || 'No response received.');
        
    } catch (error) {
        console.error('Error asking question:', error);
        addMessage(
            'ai',
            `Error: ${error.message}. Make sure the backend API is running.`
        );
    } finally {
        hideLoading();
        askBtn.classList.remove('loading');
        questionInput.focus();
    }
}


// Handle Navigation
async function handleNavigate() {
    const startLat = parseFloat(startLatInput.value);
    const startLon = parseFloat(startLonInput.value);
    const endLat = parseFloat(endLatInput.value);
    const endLon = parseFloat(endLonInput.value);

    // Validate inputs
    if (isNaN(startLat) || isNaN(startLon) || isNaN(endLat) || isNaN(endLon)) {
        showNavigationError('Please enter valid coordinates for both start and destination.');
        return;
    }

    // Show loading
    showLoading();
    navigateBtn.classList.add('loading');
    navigationResult.classList.add('hidden');

    try {
        const response = await fetch(
            `${API_BASE_URL}/navigate?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayNavigationResult(data);
        
    } catch (error) {
        console.error('Error navigating:', error);
        showNavigationError(`Error: ${error.message}. Make sure GraphHopper is running on port 8989.`);
    } finally {
        hideLoading();
        navigateBtn.classList.remove('loading');
    }
}

// Add Message to Chat
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const senderName = type === 'user' ? 'USER' : type === 'ai' ? 'AI ASSISTANT' : 'SYSTEM';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${senderName}</span>
            <span class="message-time">${currentTime}</span>
        </div>
        <div class="message-content">
            ${formatMessageContent(content)}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate message
    messageDiv.style.animation = 'messageSlide 0.3s ease';
}

// Format Message Content
function formatMessageContent(content) {
    // Convert markdown-style formatting to HTML
    let formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!formatted.startsWith('<')) {
        formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
}

// Display Navigation Result
function displayNavigationResult(data) {
    navigationResult.classList.remove('hidden');
    
    let html = `
        <h3>ROUTE CALCULATED</h3>
        <div class="route-info">
            <div class="route-stat">
                <span class="route-stat-label">DISTANCE</span>
                <span class="route-stat-value">${data.distance_km} km</span>
            </div>
            <div class="route-stat">
                <span class="route-stat-label">ESTIMATED TIME</span>
                <span class="route-stat-value">${data.time_minutes} min</span>
            </div>
        </div>
    `;
    
    if (data.steps && data.steps.length > 0) {
        html += `
            <div class="route-steps">
                <h4>NAVIGATION STEPS</h4>
                ${data.steps.map((step, index) => `
                    <div class="route-step">
                        <strong>${index + 1}.</strong> ${step}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        html += `
            <div class="route-steps">
                <p style="color: var(--text-secondary); font-size: 13px;">
                    No detailed steps available. Route calculated successfully.
                </p>
            </div>
        `;
    }
    
    navigationResult.innerHTML = html;
}

// Show Navigation Error
function showNavigationError(message) {
    navigationResult.classList.remove('hidden');
    navigationResult.innerHTML = `
        <div class="error-message">
            <strong>ERROR:</strong> ${message}
        </div>
    `;
}

// Show Error Message
function showError(message) {
    addMessage('system', `⚠️ ${message}`);
}

// Show Loading
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide Loading
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Update Message Times
function updateMessageTime() {
    const timeElements = document.querySelectorAll('.message-time');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Only update if time has actually changed
    timeElements.forEach(el => {
        if (el.textContent !== currentTime) {
            el.textContent = currentTime;
        }
    });
}

// Health Check on Load
async function checkSystemHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('System health:', data);
        }
    } catch (error) {
        console.warn('Health check failed:', error);
        addMessage('system', '⚠️ Warning: Unable to connect to server. Make sure the API is running.');
    }
}

// Run health check after a short delay
setTimeout(checkSystemHealth, 1000);

