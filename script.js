// Global state management
const AppState = {
    currentUser: null,
    theme: localStorage.getItem('theme') || 'light',
    isLoggedIn: false
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial theme
    setTheme(AppState.theme);
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize features
    initializeFeatures();
}

function initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    loginBtn.addEventListener('click', () => openModal('loginModal'));
    signupBtn.addEventListener('click', () => openModal('signupModal'));
    logoutBtn.addEventListener('click', logout);
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const feature = e.currentTarget.getAttribute('data-feature');
            openFeatureModal(feature);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Theme Management
function toggleTheme() {
    const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    AppState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Authentication
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login (in real app, this would be an API call)
    if (email && password) {
        const user = {
            name: email.split('@')[0],
            email: email,
            loginTime: new Date().toISOString()
        };
        
        AppState.currentUser = user;
        AppState.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        updateUIForLoggedInUser();
        closeModal('loginModal');
        showNotification('Login successful!', 'success');
        
        // Reset form
        document.getElementById('loginForm').reset();
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (name && email && password) {
        const user = {
            name: name,
            email: email,
            signupTime: new Date().toISOString()
        };
        
        AppState.currentUser = user;
        AppState.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        updateUIForLoggedInUser();
        closeModal('signupModal');
        showNotification('Account created successfully!', 'success');
        
        // Reset form
        document.getElementById('signupForm').reset();
    }
}

function logout() {
    AppState.currentUser = null;
    AppState.isLoggedIn = false;
    localStorage.removeItem('currentUser');
    
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully!', 'info');
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('signupBtn').classList.add('hidden');
    document.getElementById('userMenu').classList.remove('hidden');
    document.getElementById('userName').textContent = AppState.currentUser.name;
    document.getElementById('dashboard').classList.remove('hidden');
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('signupBtn').classList.remove('hidden');
    document.getElementById('userMenu').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Feature Modal Management
function openFeatureModal(feature) {
    const modal = document.getElementById('featureModal');
    const title = document.getElementById('featureTitle');
    const content = document.getElementById('featureContent');
    
    const featureData = getFeatureData(feature);
    title.textContent = featureData.title;
    content.innerHTML = featureData.content;
    
    modal.style.display = 'block';
    
    // Initialize feature-specific functionality
    initializeFeatureContent(feature);
}

function getFeatureData(feature) {
    const features = {
        chat: {
            title: 'AI Chat Assistant',
            content: `
                <div class="chat-interface">
                    <div class="chat-messages" id="chatMessages">
                        <div class="chat-message bot">
                            <strong>AI Assistant:</strong> Hello! I'm your AI assistant. How can I help you today?
                        </div>
                    </div>
                    <div class="chat-input-group">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                        <button class="btn btn-primary" onclick="sendChatMessage()">Send</button>
                    </div>
                </div>
            `
        },
        analytics: {
            title: 'Data Analytics',
            content: `
                <div class="analytics-chart">
                    <div>
                        <h3>Analytics Dashboard</h3>
                        <p>Real-time data visualization and insights</p>
                        <div style="margin: 20px 0;">
                            <div class="usage-stats">
                                <div class="usage-item">
                                    <span>Total Users:</span>
                                    <span class="usage-value">1,247</span>
                                </div>
                                <div class="usage-item">
                                    <span>Active Sessions:</span>
                                    <span class="usage-value">89</span>
                                </div>
                                <div class="usage-item">
                                    <span>Data Processed:</span>
                                    <span class="usage-value">2.4 TB</span>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="generateReport()">Generate Report</button>
                    </div>
                </div>
            `
        },
        automation: {
            title: 'Task Automation',
            content: `
                <div>
                    <h3>Automation Center</h3>
                    <p>Create and manage automated workflows</p>
                    <div style="margin: 20px 0;">
                        <div class="form-group">
                            <label>Task Name:</label>
                            <input type="text" id="taskName" placeholder="Enter task name">
                        </div>
                        <div class="form-group">
                            <label>Trigger:</label>
                            <select id="taskTrigger" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                                <option>Time-based</option>
                                <option>Event-based</option>
                                <option>Manual</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" onclick="createAutomation()">Create Automation</button>
                    </div>
                </div>
            `
        },
        prediction: {
            title: 'Predictive Analysis',
            content: `
                <div>
                    <h3>AI Predictions</h3>
                    <p>Advanced forecasting and trend analysis</p>
                    <div style="margin: 20px 0;">
                        <div class="prediction-results">
                            <h4>Current Predictions:</h4>
                            <ul style="list-style: none; padding: 0;">
                                <li style="padding: 10px; margin: 5px 0; background: var(--surface-color); border-radius: 8px;">
                                    📈 User growth: +15% next month
                                </li>
                                <li style="padding: 10px; margin: 5px 0; background: var(--surface-color); border-radius: 8px;">
                                    💰 Revenue forecast: $125K next quarter
                                </li>
                                <li style="padding: 10px; margin: 5px 0; background: var(--surface-color); border-radius: 8px;">
                                    🎯 Conversion rate: 3.2% improvement expected
                                </li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="runPrediction()">Run New Prediction</button>
                    </div>
                </div>
            `
        },
        voice: {
            title: 'Voice Commands',
            content: `
                <div>
                    <h3>Voice Control Center</h3>
                    <p>Control the system using voice commands</p>
                    <div style="margin: 20px 0; text-align: center;">
                        <div style="margin: 20px 0;">
                            <button class="btn btn-primary" id="voiceBtn" onclick="toggleVoiceRecognition()">
                                <i class="fas fa-microphone"></i> Start Listening
                            </button>
                        </div>
                        <div id="voiceStatus" style="margin: 20px 0; font-weight: 500;">
                            Voice recognition is ready
                        </div>
                        <div id="voiceCommands" style="text-align: left; margin: 20px 0;">
                            <h4>Available Commands:</h4>
                            <ul>
                                <li>"Open dashboard"</li>
                                <li>"Switch theme"</li>
                                <li>"Show analytics"</li>
                                <li>"Start automation"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
        },
        security: {
            title: 'AI Security',
            content: `
                <div>
                    <h3>Security Dashboard</h3>
                    <p>Advanced threat detection and system protection</p>
                    <div style="margin: 20px 0;">
                        <div class="security-status">
                            <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
                                <span class="status-dot" style="background: #10b981;"></span>
                                <span>Firewall: Active</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
                                <span class="status-dot" style="background: #10b981;"></span>
                                <span>Malware Protection: Enabled</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; margin: 15px 0;">
                                <span class="status-dot" style="background: #f59e0b;"></span>
                                <span>Last Scan: 2 hours ago</span>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="runSecurityScan()">Run Security Scan</button>
                    </div>
                </div>
            `
        },
        translation: {
            title: 'Language Translation',
            content: `
                <div>
                    <h3>AI Translator</h3>
                    <p>Real-time multi-language translation</p>
                    <div style="margin: 20px 0;">
                        <div class="form-group">
                            <label>From:</label>
                            <select id="fromLang" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>To:</label>
                            <select id="toLang" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                                <option value="hi">Hindi</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Text to translate:</label>
                            <textarea id="translateInput" rows="3" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;" placeholder="Enter text to translate..."></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="translateText()">Translate</button>
                        <div id="translationResult" style="margin-top: 20px; padding: 15px; background: var(--surface-color); border-radius: 8px; display: none;">
                            <h4>Translation:</h4>
                            <p id="translatedText"></p>
                        </div>
                    </div>
                </div>
            `
        },
        ocr: {
            title: 'OCR Scanner',
            content: `
                <div>
                    <h3>Text Recognition</h3>
                    <p>Extract text from images and documents</p>
                    <div style="margin: 20px 0;">
                        <div class="form-group">
                            <label>Upload Image:</label>
                            <input type="file" id="ocrFile" accept="image/*" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                        </div>
                        <button class="btn btn-primary" onclick="processOCR()">Extract Text</button>
                        <div id="ocrResult" style="margin-top: 20px; padding: 15px; background: var(--surface-color); border-radius: 8px; display: none;">
                            <h4>Extracted Text:</h4>
                            <p id="extractedText">Sample extracted text would appear here...</p>
                        </div>
                    </div>
                </div>
            `
        },
        scheduler: {
            title: 'Smart Scheduler',
            content: `
                <div>
                    <h3>AI-Powered Scheduling</h3>
                    <p>Intelligent meeting and task management</p>
                    <div style="margin: 20px 0;">
                        <div class="form-group">
                            <label>Event Title:</label>
                            <input type="text" id="eventTitle" placeholder="Enter event title">
                        </div>
                        <div class="form-group">
                            <label>Date & Time:</label>
                            <input type="datetime-local" id="eventDateTime" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                        </div>
                        <div class="form-group">
                            <label>Duration (minutes):</label>
                            <input type="number" id="eventDuration" value="60" min="15" max="480">
                        </div>
                        <button class="btn btn-primary" onclick="scheduleEvent()">Schedule Event</button>
                        <div id="schedulerResult" style="margin-top: 20px;">
                            <h4>Upcoming Events:</h4>
                            <div id="eventsList" style="margin-top: 10px;">
                                <div style="padding: 10px; margin: 5px 0; background: var(--surface-color); border-radius: 8px;">
                                    📅 Team Meeting - Today 2:00 PM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        weather: {
            title: 'Weather Intelligence',
            content: `
                <div>
                    <h3>Advanced Weather Forecasting</h3>
                    <div class="weather-widget">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                            <i class="fas fa-sun" style="font-size: 3rem;"></i>
                            <div>
                                <div class="weather-temp">24°C</div>
                                <div class="weather-desc">Sunny</div>
                            </div>
                        </div>
                        <div style="margin-top: 20px;">
                            <p>Location: New Delhi, India</p>
                            <p>Humidity: 65% | Wind: 12 km/h</p>
                        </div>
                    </div>
                    <div style="margin: 20px 0;">
                        <div class="form-group">
                            <label>Search Location:</label>
                            <input type="text" id="weatherLocation" placeholder="Enter city name">
                        </div>
                        <button class="btn btn-primary" onclick="getWeather()">Get Weather</button>
                    </div>
                </div>
            `
        }
    };
    
    return features[feature] || { title: 'Feature', content: '<p>Feature content not available.</p>' };
}

// Feature-specific functions
function initializeFeatureContent(feature) {
    switch(feature) {
        case 'voice':
            initializeVoiceRecognition();
            break;
        case 'chat':
            initializeChatInterface();
            break;
    }
}

function initializeFeatures() {
    // Initialize any global feature functionality here
}

// Chat functionality
function initializeChatInterface() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    
    if (input && messages && input.value.trim()) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<strong>You:</strong> ${input.value}`;
        messages.appendChild(userMessage);
        
        // Simulate AI response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `<strong>AI Assistant:</strong> ${generateAIResponse(input.value)}`;
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
    }
}

function generateAIResponse(userMessage) {
    const responses = [
        "I understand your request. Let me help you with that.",
        "That's an interesting question! Here's what I think...",
        "Based on my analysis, I would recommend...",
        "I can definitely assist you with that task.",
        "Let me process that information for you.",
        "Great question! Here's my analysis..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Voice recognition functionality
let isListening = false;
let recognition = null;

function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(command);
        };
        
        recognition.onerror = function(event) {
            updateVoiceStatus('Error: ' + event.error);
        };
        
        recognition.onend = function() {
            isListening = false;
            updateVoiceButton();
        };
    }
}

function toggleVoiceRecognition() {
    if (!recognition) {
        showNotification('Voice recognition not supported in this browser', 'error');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        isListening = false;
    } else {
        recognition.start();
        isListening = true;
        updateVoiceStatus('Listening...');
    }
    updateVoiceButton();
}

function updateVoiceButton() {
    const btn = document.getElementById('voiceBtn');
    if (btn) {
        btn.innerHTML = isListening ? 
            '<i class="fas fa-stop"></i> Stop Listening' : 
            '<i class="fas fa-microphone"></i> Start Listening';
    }
}

function updateVoiceStatus(status) {
    const statusEl = document.getElementById('voiceStatus');
    if (statusEl) {
        statusEl.textContent = status;
    }
}

function processVoiceCommand(command) {
    updateVoiceStatus(`Command received: "${command}"`);
    
    if (command.includes('dashboard')) {
        closeModal('featureModal');
        document.getElementById('dashboard').scrollIntoView();
    } else if (command.includes('theme')) {
        toggleTheme();
    } else if (command.includes('analytics')) {
        closeModal('featureModal');
        openFeatureModal('analytics');
    } else if (command.includes('automation')) {
        closeModal('featureModal');
        openFeatureModal('automation');
    } else {
        updateVoiceStatus('Command not recognized. Try: "open dashboard", "switch theme", etc.');
    }
}

// Other feature functions
function generateReport() {
    showNotification('Analytics report generated successfully!', 'success');
}

function createAutomation() {
    const taskName = document.getElementById('taskName')?.value;
    if (taskName) {
        showNotification(`Automation "${taskName}" created successfully!`, 'success');
    } else {
        showNotification('Please enter a task name', 'error');
    }
}

function runPrediction() {
    showNotification('Running AI prediction analysis...', 'info');
    setTimeout(() => {
        showNotification('Prediction analysis completed!', 'success');
    }, 2000);
}

function runSecurityScan() {
    showNotification('Security scan initiated...', 'info');
    setTimeout(() => {
        showNotification('Security scan completed - No threats detected!', 'success');
    }, 3000);
}

function translateText() {
    const input = document.getElementById('translateInput')?.value;
    const result = document.getElementById('translationResult');
    const translatedText = document.getElementById('translatedText');
    
    if (input && result && translatedText) {
        // Simulate translation
        translatedText.textContent = `Translated: ${input} (Demo translation)`;
        result.style.display = 'block';
        showNotification('Text translated successfully!', 'success');
    }
}

function processOCR() {
    const file = document.getElementById('ocrFile')?.files[0];
    const result = document.getElementById('ocrResult');
    
    if (file && result) {
        result.style.display = 'block';
        showNotification('Text extraction completed!', 'success');
    } else {
        showNotification('Please select an image file', 'error');
    }
}

function scheduleEvent() {
    const title = document.getElementById('eventTitle')?.value;
    const dateTime = document.getElementById('eventDateTime')?.value;
    
    if (title && dateTime) {
        const eventsList = document.getElementById('eventsList');
        if (eventsList) {
            const eventDiv = document.createElement('div');
            eventDiv.style.cssText = 'padding: 10px; margin: 5px 0; background: var(--surface-color); border-radius: 8px;';
            eventDiv.innerHTML = `📅 ${title} - ${new Date(dateTime).toLocaleString()}`;
            eventsList.appendChild(eventDiv);
        }
        showNotification('Event scheduled successfully!', 'success');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function getWeather() {
    const location = document.getElementById('weatherLocation')?.value;
    if (location) {
        showNotification(`Getting weather for ${location}...`, 'info');
        setTimeout(() => {
            showNotification('Weather data updated!', 'success');
        }, 1500);
    } else {
        showNotification('Please enter a location', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: var(--shadow-lg);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .chat-message {
        margin-bottom: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        background: var(--surface-color);
    }
    
    .chat-message.user {
        background: var(--primary-color);
        color: white;
        margin-left: 20%;
    }
    
    .chat-message.bot {
        background: var(--surface-color);
        margin-right: 20%;
    }
`;
document.head.appendChild(style);
