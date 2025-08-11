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
        const userInput = input.value.trim();
        
        // Store conversation history
        storeChatHistory(userInput, 'user');
        
        // Add user message with timestamp
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `
            <div class="message-header">
                <strong>You</strong>
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${userInput}</div>
        `;
        messages.appendChild(userMessage);
        
        // Show advanced typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot typing';
        typingIndicator.innerHTML = `
            <div class="message-header">
                <strong>AI Assistant</strong>
                <span class="ai-status">Processing...</span>
            </div>
            <div class="message-content">
                <span class="typing-animation">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </span>
                <span class="processing-text">Analyzing your request...</span>
            </div>
        `;
        messages.appendChild(typingIndicator);
        messages.scrollTop = messages.scrollHeight;
        
        // Generate extraordinary AI response
        setTimeout(() => {
            messages.removeChild(typingIndicator);
            const response = generateExtraordinaryResponse(userInput);
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `
                <div class="message-header">
                    <strong>AI Assistant</strong>
                    <span class="timestamp">${new Date().toLocaleTimeString()}</span>
                    <span class="confidence">Confidence: ${response.confidence}%</span>
                </div>
                <div class="message-content">${response.message}</div>
                ${response.actions ? `<div class="message-actions">${response.actions}</div>` : ''}
            `;
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
            
            // Store AI response
            storeChatHistory(response.message, 'ai');
            
            // Execute any suggested actions
            if (response.executeAction) {
                setTimeout(() => response.executeAction(), 1000);
            }
        }, Math.random() * 1000 + 1500);
        
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
    }
}

// Extraordinary AI Response System
function generateExtraordinaryResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    const context = getChatContext();
    const sentiment = analyzeSentiment(userMessage);
    const intent = detectIntent(userMessage);
    
    let response = {
        message: '',
        confidence: 95,
        actions: null,
        executeAction: null
    };
    
    // Advanced contextual responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        response.message = `Hello! 👋 I'm your advanced AI assistant powered by neural networks. I've analyzed ${context.totalMessages} previous messages and I'm ready to help you with intelligent solutions. What challenge can I solve for you today?`;
        response.actions = `<button class="action-btn" onclick="openFeatureModal('analytics')">📊 View Analytics</button> <button class="action-btn" onclick="openFeatureModal('automation')">🤖 Setup Automation</button>`;
    }
    else if (msg.includes('weather')) {
        response.message = `🌤️ I can provide real-time weather intelligence for any location worldwide! I have access to weather data for 14+ major cities with 5-day forecasts, weather alerts, and auto-updates. Which location would you like me to analyze?`;
        response.executeAction = () => openFeatureModal('weather');
        response.actions = `<button class="action-btn" onclick="openFeatureModal('weather')">🌤️ Open Weather Intelligence</button>`;
    }
    else if (msg.includes('analytics') || msg.includes('data')) {
        const stats = generateRealTimeStats();
        response.message = `📊 **Real-Time Analytics Dashboard**\n\n🔥 **Live Metrics:**\n• Active Users: ${stats.activeUsers}\n• Data Processed: ${stats.dataProcessed}\n• System Performance: ${stats.performance}%\n• Revenue Today: ${stats.revenue}\n\nI can generate comprehensive reports, create visualizations, and provide predictive insights. What specific analytics would you like to explore?`;
        response.actions = `<button class="action-btn" onclick="generateReport()">📈 Generate Report</button> <button class="action-btn" onclick="openFeatureModal('analytics')">📊 Full Dashboard</button>`;
        response.confidence = 98;
    }
    else if (msg.includes('automation') || msg.includes('task')) {
        response.message = `🤖 **Intelligent Task Automation**\n\nI can create sophisticated automation workflows with:\n• Time-based triggers (schedules)\n• Event-based triggers (conditions)\n• AI-powered decision making\n• Multi-step processes\n• Performance monitoring\n\nCurrently managing ${getAutomationCount()} active automations. What process would you like me to automate?`;
        response.executeAction = () => openFeatureModal('automation');
        response.actions = `<button class="action-btn" onclick="openFeatureModal('automation')">⚙️ Create Automation</button>`;
    }
    else if (msg.includes('prediction') || msg.includes('forecast')) {
        response.message = `🔮 **AI Predictive Analysis**\n\nMy neural networks have analyzed historical patterns and current trends to generate:\n• User growth predictions: +15.3% next month\n• Revenue forecasting: $125K+ next quarter\n• Market trend analysis: 67% automation adoption\n• Risk assessment: Low risk profile\n\nWould you like me to run a detailed prediction model for specific metrics?`;
        response.executeAction = () => runPrediction();
        response.actions = `<button class="action-btn" onclick="runPrediction()">🔮 Run Prediction</button>`;
        response.confidence = 92;
    }
    else if (msg.includes('security') || msg.includes('threat')) {
        response.message = `🛡️ **Advanced Security Analysis**\n\n✅ **System Status: SECURE**\n• Firewall: Active & Updated\n• Threat Detection: Real-time monitoring\n• Vulnerability Scan: 0 critical issues\n• Access Control: Multi-factor enabled\n• Last Security Audit: 2 hours ago\n\nI can perform comprehensive security scans, threat analysis, and generate security reports. Need a security assessment?`;
        response.actions = `<button class="action-btn" onclick="runSecurityScan()">🔍 Run Security Scan</button>`;
    }
    else if (msg.includes('translate') || msg.includes('language')) {
        response.message = `🌐 **Advanced Language Translation**\n\nI support professional translation between:\n• English ↔ Hindi (नमस्ते)\n• English ↔ Spanish (Hola)\n• English ↔ French (Bonjour)\n• English ↔ German (Guten Tag)\n• And many more languages!\n\nFeatures: Context-aware translation, cultural adaptation, and professional formatting. What would you like me to translate?`;
        response.executeAction = () => openFeatureModal('translation');
        response.actions = `<button class="action-btn" onclick="openFeatureModal('translation')">🌐 Open Translator</button>`;
    }
    else if (msg.includes('schedule') || msg.includes('meeting')) {
        response.message = `📅 **Smart Scheduling Assistant**\n\nI can intelligently schedule:\n• Meetings with conflict detection\n• Recurring events with optimization\n• Task deadlines with priority analysis\n• Resource allocation planning\n\nMy AI considers time zones, availability patterns, and productivity metrics. What would you like to schedule?`;
        response.executeAction = () => openFeatureModal('scheduler');
        response.actions = `<button class="action-btn" onclick="openFeatureModal('scheduler')">📅 Smart Schedule</button>`;
    }
    else if (msg.includes('help') || msg.includes('what can you do')) {
        response.message = `🚀 **Futuristic AID Capabilities**\n\n**Core AI Features:**\n📊 **Analytics** - Real-time data insights & reports\n🤖 **Automation** - Intelligent workflow creation\n🔮 **Predictions** - Advanced forecasting models\n🛡️ **Security** - Comprehensive threat analysis\n🌐 **Translation** - Multi-language AI translation\n📅 **Scheduling** - Smart calendar management\n🌤️ **Weather** - Global weather intelligence\n👁️ **OCR** - Advanced text extraction\n🎤 **Voice** - Natural language commands\n💬 **Chat** - This advanced AI conversation\n\nI'm powered by advanced neural networks and can learn from our conversations. What would you like to explore?`;
        response.confidence = 100;
    }
    else if (msg.includes('thank')) {
        response.message = `You're very welcome! 😊 I'm designed to continuously learn and improve from our interactions. I've processed ${context.totalMessages} messages in our conversation and I'm getting better at understanding your needs.\n\nIs there anything else I can help you with? I'm here 24/7 with advanced AI capabilities!`;
    }
    else if (detectQuestion(msg)) {
        response = generateIntelligentAnswer(userMessage, context, sentiment);
    }
    else if (detectProblem(msg)) {
        response = generateProblemSolution(userMessage, context);
    }
    else {
        // Advanced contextual response
        response.message = generateContextualResponse(userMessage, context, sentiment, intent);
        response.confidence = Math.floor(Math.random() * 20) + 80;
    }
    
    return response;
}

// Supporting AI functions
function getChatContext() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    return {
        totalMessages: history.length,
        recentTopics: extractTopics(history.slice(-10)),
        userPreferences: analyzePreferences(history),
        conversationFlow: analyzeFlow(history)
    };
}

function storeChatHistory(message, sender) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({
        message: message,
        sender: sender,
        timestamp: new Date().toISOString(),
        sentiment: analyzeSentiment(message)
    });
    
    // Keep only last 100 messages
    if (history.length > 100) {
        history.splice(0, history.length - 100);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'pleased'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'problem', 'issue', 'error'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

function detectIntent(text) {
    const intents = {
        question: ['what', 'how', 'why', 'when', 'where', 'which', '?'],
        request: ['can you', 'please', 'help me', 'i need', 'i want'],
        command: ['show me', 'open', 'start', 'run', 'execute'],
        information: ['tell me', 'explain', 'describe', 'about']
    };
    
    const lowerText = text.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intents)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
            return intent;
        }
    }
    
    return 'general';
}

function generateRealTimeStats() {
    return {
        activeUsers: 89 + Math.floor(Math.random() * 20),
        dataProcessed: (2.4 + Math.random()).toFixed(1) + ' TB',
        performance: 95 + Math.floor(Math.random() * 5),
        revenue: '$' + (1250 + Math.floor(Math.random() * 500)).toLocaleString()
    };
}

function getAutomationCount() {
    const automations = JSON.parse(localStorage.getItem('automations') || '[]');
    return automations.length;
}

function detectQuestion(text) {
    return text.includes('?') || text.toLowerCase().startsWith('what') || text.toLowerCase().startsWith('how') || text.toLowerCase().startsWith('why');
}

function detectProblem(text) {
    const problemWords = ['problem', 'issue', 'error', 'bug', 'not working', 'broken', 'help'];
    return problemWords.some(word => text.toLowerCase().includes(word));
}

function generateIntelligentAnswer(question, context, sentiment) {
    return {
        message: `🤔 **Analyzing your question...**\n\nBased on my neural network analysis and ${context.totalMessages} previous interactions, here's my intelligent response:\n\n"${question}"\n\nI've processed this query through multiple AI models and can provide detailed insights. Would you like me to break this down into specific actionable steps or provide more detailed analysis?`,
        confidence: 88,
        actions: `<button class="action-btn" onclick="showNotification('Detailed analysis coming soon!', 'info')">🔍 Detailed Analysis</button>`
    };
}

function generateProblemSolution(problem, context) {
    return {
        message: `🛠️ **Problem Solving Mode Activated**\n\nI've identified this as a problem-solving request. Let me analyze:\n\n**Problem:** "${problem}"\n\n**AI Analysis:**\n• Problem category: Technical/Functional\n• Urgency level: Medium\n• Suggested approach: Step-by-step resolution\n\n**Recommended Actions:**\n1. Identify root cause\n2. Implement solution\n3. Test and verify\n4. Monitor results\n\nWould you like me to guide you through the solution process?`,
        confidence: 91,
        actions: `<button class="action-btn" onclick="showNotification('Solution guide activated!', 'success')">🚀 Start Solution</button>`
    };
}

function generateContextualResponse(message, context, sentiment, intent) {
    const responses = [
        `🧠 **Advanced AI Analysis**\n\nI've processed "${message}" through my neural networks considering:\n• Your conversation history (${context.totalMessages} messages)\n• Sentiment: ${sentiment}\n• Intent: ${intent}\n• Context patterns\n\nBased on this analysis, I recommend exploring our advanced features that align with your interests. What specific area would you like to dive deeper into?`,
        
        `🚀 **Intelligent Response**\n\nYour message "${message}" has been analyzed using advanced NLP algorithms. I've detected ${sentiment} sentiment and ${intent} intent.\n\nI can help you achieve your goals more efficiently using our AI-powered tools. Would you like me to suggest the most relevant features for your current needs?`,
        
        `💡 **Smart Insights**\n\nProcessing "${message}" through my knowledge base...\n\nI've identified several ways I can assist you based on our conversation pattern and your preferences. My AI models suggest focusing on practical solutions that deliver immediate value.\n\nShall I recommend specific actions you can take right now?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function extractTopics(messages) {
    // Simple topic extraction
    const topics = [];
    messages.forEach(msg => {
        if (msg.message.includes('weather')) topics.push('weather');
        if (msg.message.includes('analytics')) topics.push('analytics');
        if (msg.message.includes('automation')) topics.push('automation');
    });
    return [...new Set(topics)];
}

function analyzePreferences(history) {
    // Analyze user preferences from history
    return {
        preferredFeatures: ['analytics', 'automation'],
        communicationStyle: 'detailed',
        responseTime: 'immediate'
    };
}

function analyzeFlow(history) {
    return {
        averageMessageLength: history.reduce((acc, msg) => acc + msg.message.length, 0) / history.length || 0,
        topicSwitches: 0,
        engagementLevel: 'high'
    };
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

// Enhanced Analytics with real functionality
function generateReport() {
    showNotification('Generating comprehensive analytics report...', 'info');
    
    // Simulate report generation with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 20;
        showNotification(`Report generation: ${progress}% complete`, 'info');
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            // Create and download a sample report
            const reportData = generateAnalyticsData();
            downloadReport(reportData);
            showNotification('Analytics report generated and downloaded!', 'success');
        }
    }, 500);
}

function generateAnalyticsData() {
    const currentDate = new Date();
    return {
        reportDate: currentDate.toISOString().split('T')[0],
        totalUsers: 1247 + Math.floor(Math.random() * 100),
        activeSessions: 89 + Math.floor(Math.random() * 20),
        dataProcessed: '2.4 TB',
        conversionRate: (3.2 + Math.random()).toFixed(2) + '%',
        revenue: '$' + (125000 + Math.floor(Math.random() * 25000)).toLocaleString(),
        topFeatures: ['AI Chat', 'Analytics', 'Automation', 'Predictions'],
        userGrowth: '+15.3%',
        systemUptime: '99.9%'
    };
}

function downloadReport(data) {
    const reportContent = `
FUTURISTIC AID - ANALYTICS REPORT
================================
Generated: ${data.reportDate}

KEY METRICS:
- Total Users: ${data.totalUsers}
- Active Sessions: ${data.activeSessions}
- Data Processed: ${data.dataProcessed}
- Conversion Rate: ${data.conversionRate}
- Revenue: ${data.revenue}
- User Growth: ${data.userGrowth}
- System Uptime: ${data.systemUptime}

TOP FEATURES:
${data.topFeatures.map(f => `- ${f}`).join('\n')}

This report was generated by Futuristic AID Analytics Engine.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futuristic-aid-report-${data.reportDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function createAutomation() {
    const taskName = document.getElementById('taskName')?.value;
    const trigger = document.getElementById('taskTrigger')?.value;
    
    if (taskName && trigger) {
        // Store automation in localStorage
        const automations = JSON.parse(localStorage.getItem('automations') || '[]');
        const newAutomation = {
            id: Date.now(),
            name: taskName,
            trigger: trigger,
            status: 'Active',
            created: new Date().toISOString(),
            executions: 0
        };
        
        automations.push(newAutomation);
        localStorage.setItem('automations', JSON.stringify(automations));
        
        showNotification(`Automation "${taskName}" created and activated!`, 'success');
        
        // Clear form
        document.getElementById('taskName').value = '';
        
        // Start automation simulation
        simulateAutomationExecution(newAutomation.id);
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function simulateAutomationExecution(automationId) {
    // Simulate automation running every 30 seconds
    setInterval(() => {
        const automations = JSON.parse(localStorage.getItem('automations') || '[]');
        const automation = automations.find(a => a.id === automationId);
        
        if (automation) {
            automation.executions++;
            automation.lastRun = new Date().toISOString();
            localStorage.setItem('automations', JSON.stringify(automations));
            
            if (automation.executions % 5 === 0) {
                showNotification(`Automation "${automation.name}" executed ${automation.executions} times`, 'info');
            }
        }
    }, 30000);
}

function runPrediction() {
    showNotification('Initializing AI prediction models...', 'info');
    
    setTimeout(() => {
        const predictions = generatePredictions();
        displayPredictions(predictions);
        showNotification('AI prediction analysis completed!', 'success');
    }, 2000);
}

function generatePredictions() {
    const baseGrowth = 15;
    const baseRevenue = 125000;
    const baseConversion = 3.2;
    
    return {
        userGrowth: {
            nextMonth: (baseGrowth + (Math.random() * 10 - 5)).toFixed(1) + '%',
            nextQuarter: (baseGrowth * 3 + (Math.random() * 20 - 10)).toFixed(1) + '%',
            confidence: (85 + Math.random() * 10).toFixed(1) + '%'
        },
        revenue: {
            nextMonth: '$' + (baseRevenue * 0.33 + (Math.random() * 10000 - 5000)).toLocaleString(),
            nextQuarter: '$' + (baseRevenue + (Math.random() * 50000 - 25000)).toLocaleString(),
            confidence: (82 + Math.random() * 12).toFixed(1) + '%'
        },
        conversion: {
            improvement: '+' + (baseConversion * 0.1 + Math.random()).toFixed(2) + '%',
            newRate: (baseConversion + Math.random()).toFixed(2) + '%',
            confidence: (78 + Math.random() * 15).toFixed(1) + '%'
        },
        trends: [
            'AI feature usage increasing by 23%',
            'Mobile traffic growing 18% faster',
            'User engagement up 31% this quarter',
            'Automation adoption rate: 67%'
        ]
    };
}

function displayPredictions(predictions) {
    const content = `
        <div class="prediction-results">
            <h4>🔮 AI Predictions Updated:</h4>
            <div style="display: grid; gap: 15px; margin: 20px 0;">
                <div style="padding: 15px; background: var(--surface-color); border-radius: 8px; border-left: 4px solid #10b981;">
                    <strong>📈 User Growth</strong><br>
                    Next Month: ${predictions.userGrowth.nextMonth}<br>
                    Next Quarter: ${predictions.userGrowth.nextQuarter}<br>
                    <small>Confidence: ${predictions.userGrowth.confidence}</small>
                </div>
                <div style="padding: 15px; background: var(--surface-color); border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <strong>💰 Revenue Forecast</strong><br>
                    Next Month: ${predictions.revenue.nextMonth}<br>
                    Next Quarter: ${predictions.revenue.nextQuarter}<br>
                    <small>Confidence: ${predictions.revenue.confidence}</small>
                </div>
                <div style="padding: 15px; background: var(--surface-color); border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <strong>🎯 Conversion Rate</strong><br>
                    Expected Improvement: ${predictions.conversion.improvement}<br>
                    New Rate: ${predictions.conversion.newRate}<br>
                    <small>Confidence: ${predictions.conversion.confidence}</small>
                </div>
                <div style="padding: 15px; background: var(--surface-color); border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <strong>📊 Key Trends</strong><br>
                    ${predictions.trends.map(trend => `• ${trend}`).join('<br>')}
                </div>
            </div>
        </div>
    `;
    
    // Update the prediction content in the modal
    const predictionContainer = document.querySelector('#featureContent .prediction-results');
    if (predictionContainer) {
        predictionContainer.innerHTML = content;
    }
}

function runSecurityScan() {
    showNotification('Security scan initiated...', 'info');
    setTimeout(() => {
        showNotification('Security scan completed - No threats detected!', 'success');
    }, 3000);
}

function translateText() {
    const input = document.getElementById('translateInput')?.value;
    const fromLang = document.getElementById('fromLang')?.value;
    const toLang = document.getElementById('toLang')?.value;
    const result = document.getElementById('translationResult');
    const translatedText = document.getElementById('translatedText');
    
    if (input && result && translatedText && fromLang && toLang) {
        showNotification('Translating text...', 'info');
        
        // Simulate translation with realistic delay
        setTimeout(() => {
            const translation = performTranslation(input, fromLang, toLang);
            translatedText.innerHTML = `
                <div style="background: var(--background-color); padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <strong>Original (${getLanguageName(fromLang)}):</strong><br>
                    <em>${input}</em>
                </div>
                <div style="background: var(--primary-color); color: white; padding: 15px; border-radius: 8px;">
                    <strong>Translation (${getLanguageName(toLang)}):</strong><br>
                    ${translation}
                </div>
                <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">
                    <i class="fas fa-robot"></i> Translated by Futuristic AID AI
                </div>
            `;
            result.style.display = 'block';
            showNotification('Translation completed successfully!', 'success');
        }, 1500);
    } else {
        showNotification('Please enter text and select languages', 'error');
    }
}

function performTranslation(text, fromLang, toLang) {
    // Enhanced translation simulation with more realistic results
    const translations = {
        'en_to_hi': {
            'hello': 'नमस्ते',
            'how are you': 'आप कैसे हैं',
            'thank you': 'धन्यवाद',
            'good morning': 'सुप्रभात',
            'artificial intelligence': 'कृत्रिम बुद्धिमत्ता'
        },
        'en_to_es': {
            'hello': 'hola',
            'how are you': '¿cómo estás?',
            'thank you': 'gracias',
            'good morning': 'buenos días',
            'artificial intelligence': 'inteligencia artificial'
        },
        'en_to_fr': {
            'hello': 'bonjour',
            'how are you': 'comment allez-vous',
            'thank you': 'merci',
            'good morning': 'bonjour',
            'artificial intelligence': 'intelligence artificielle'
        }
    };
    
    const key = `${fromLang}_to_${toLang}`;
    const lowerText = text.toLowerCase();
    
    if (translations[key] && translations[key][lowerText]) {
        return translations[key][lowerText];
    }
    
    // Fallback realistic translation
    return `[AI Translation: ${text}] - Professional translation by Futuristic AID`;
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German'
    };
    return languages[code] || code;
}

function processOCR() {
    const file = document.getElementById('ocrFile')?.files[0];
    const result = document.getElementById('ocrResult');
    const extractedText = document.getElementById('extractedText');
    
    if (file && result && extractedText) {
        showNotification('Processing image for text extraction...', 'info');
        
        // Simulate OCR processing
        setTimeout(() => {
            const mockExtractedText = generateMockOCRText(file.name);
            extractedText.innerHTML = `
                <div style="background: var(--background-color); padding: 15px; border-radius: 8px;">
                    <h4>📄 Extracted Text:</h4>
                    <div style="border: 1px solid var(--border-color); padding: 15px; border-radius: 8px; margin: 10px 0; background: white; color: black; font-family: monospace;">
                        ${mockExtractedText}
                    </div>
                    <div style="margin-top: 15px;">
                        <button class="btn btn-primary" onclick="copyExtractedText()">📋 Copy Text</button>
                        <button class="btn btn-secondary" onclick="downloadExtractedText()">💾 Download</button>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);">
                        <i class="fas fa-eye"></i> Processed by Futuristic AID OCR Engine<br>
                        File: ${file.name} | Size: ${(file.size/1024).toFixed(1)} KB
                    </div>
                </div>
            `;
            result.style.display = 'block';
            showNotification('Text extraction completed successfully!', 'success');
        }, 2500);
    } else {
        showNotification('Please select an image file', 'error');
    }
}

function generateMockOCRText(filename) {
    const sampleTexts = [
        "FUTURISTIC AID\\nAdvanced Intelligence Dashboard\\n\\nWelcome to the future of AI technology.\\nThis document contains important information\\nabout our advanced systems and capabilities.\\n\\nFeatures include:\\n• Real-time analytics\\n• Predictive modeling\\n• Automated workflows\\n• Multi-language support\\n\\nFor more information, visit our website.",
        "INVOICE\\n\\nDate: ${new Date().toLocaleDateString()}\\nInvoice #: FA-2024-001\\n\\nBill To:\\nFuturistic AID Client\\n123 Tech Street\\nSilicon Valley, CA\\n\\nDescription: AI Services\\nAmount: $1,299.00\\nTax: $129.90\\nTotal: $1,428.90\\n\\nThank you for your business!",
        "MEETING NOTES\\n\\nDate: ${new Date().toLocaleDateString()}\\nAttendees: AI Team\\n\\nAgenda:\\n1. System performance review\\n2. New feature deployment\\n3. User feedback analysis\\n4. Security updates\\n\\nAction Items:\\n- Optimize prediction algorithms\\n- Enhance user interface\\n- Implement new security protocols\\n\\nNext meeting: Next week"
    ];
    
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)].replace(/\\n/g, '<br>');
}

function copyExtractedText() {
    const textElement = document.querySelector('#extractedText div div');
    if (textElement) {
        navigator.clipboard.writeText(textElement.textContent).then(() => {
            showNotification('Text copied to clipboard!', 'success');
        });
    }
}

function downloadExtractedText() {
    const textElement = document.querySelector('#extractedText div div');
    if (textElement) {
        const blob = new Blob([textElement.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted-text-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Text file downloaded!', 'success');
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
        
        // Simulate API call with realistic delay
        setTimeout(() => {
            const weatherData = generateWeatherData(location);
            updateWeatherDisplay(weatherData);
            showNotification(`Weather updated for ${location}!`, 'success');
        }, 1500);
    } else {
        showNotification('Please enter a location', 'error');
    }
}

function generateWeatherData(location) {
    // Realistic weather data based on different cities
    const weatherDatabase = {
        'mumbai': { temp: 28, condition: 'Humid', icon: 'fa-cloud-rain', humidity: 85, wind: 15 },
        'delhi': { temp: 24, condition: 'Sunny', icon: 'fa-sun', humidity: 65, wind: 12 },
        'bangalore': { temp: 22, condition: 'Pleasant', icon: 'fa-cloud-sun', humidity: 70, wind: 8 },
        'chennai': { temp: 30, condition: 'Hot', icon: 'fa-sun', humidity: 78, wind: 18 },
        'kolkata': { temp: 26, condition: 'Cloudy', icon: 'fa-cloud', humidity: 82, wind: 10 },
        'hyderabad': { temp: 25, condition: 'Clear', icon: 'fa-sun', humidity: 60, wind: 14 },
        'pune': { temp: 23, condition: 'Pleasant', icon: 'fa-cloud-sun', humidity: 68, wind: 11 },
        'ahmedabad': { temp: 29, condition: 'Warm', icon: 'fa-sun', humidity: 55, wind: 16 },
        'london': { temp: 15, condition: 'Rainy', icon: 'fa-cloud-rain', humidity: 90, wind: 20 },
        'new york': { temp: 18, condition: 'Cloudy', icon: 'fa-cloud', humidity: 75, wind: 22 },
        'tokyo': { temp: 20, condition: 'Mild', icon: 'fa-cloud-sun', humidity: 72, wind: 13 },
        'paris': { temp: 16, condition: 'Cool', icon: 'fa-cloud', humidity: 80, wind: 18 },
        'dubai': { temp: 35, condition: 'Very Hot', icon: 'fa-sun', humidity: 45, wind: 25 },
        'singapore': { temp: 27, condition: 'Tropical', icon: 'fa-cloud-rain', humidity: 88, wind: 12 }
    };
    
    const locationKey = location.toLowerCase();
    
    if (weatherDatabase[locationKey]) {
        return {
            location: location,
            ...weatherDatabase[locationKey],
            forecast: generateForecast(weatherDatabase[locationKey])
        };
    } else {
        // Generate random realistic weather for unknown locations
        const conditions = [
            { condition: 'Sunny', icon: 'fa-sun', tempRange: [20, 35] },
            { condition: 'Cloudy', icon: 'fa-cloud', tempRange: [15, 25] },
            { condition: 'Rainy', icon: 'fa-cloud-rain', tempRange: [12, 22] },
            { condition: 'Pleasant', icon: 'fa-cloud-sun', tempRange: [18, 28] }
        ];
        
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * (randomCondition.tempRange[1] - randomCondition.tempRange[0])) + randomCondition.tempRange[0];
        
        return {
            location: location,
            temp: temp,
            condition: randomCondition.condition,
            icon: randomCondition.icon,
            humidity: Math.floor(Math.random() * 40) + 50,
            wind: Math.floor(Math.random() * 20) + 5,
            forecast: generateForecast({ temp, condition: randomCondition.condition, icon: randomCondition.icon })
        };
    }
}

function generateForecast(baseWeather) {
    const days = ['Tomorrow', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Pleasant', 'Clear'];
    const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun', 'fa-sun'];
    
    return days.map((day, index) => ({
        day: day,
        temp: baseWeather.temp + Math.floor(Math.random() * 10 - 5),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: icons[Math.floor(Math.random() * icons.length)]
    }));
}

function updateWeatherDisplay(weatherData) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
        weatherWidget.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <i class="fas ${weatherData.icon}" style="font-size: 3rem;"></i>
                <div>
                    <div class="weather-temp">${weatherData.temp}°C</div>
                    <div class="weather-desc">${weatherData.condition}</div>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <p><strong>📍 Location:</strong> ${weatherData.location}</p>
                <p><strong>💧 Humidity:</strong> ${weatherData.humidity}% | <strong>💨 Wind:</strong> ${weatherData.wind} km/h</p>
                <p><strong>🕐 Updated:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
            <div style="margin-top: 20px;">
                <h4>📅 5-Day Forecast:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 15px;">
                    ${weatherData.forecast.map(day => `
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                            <div style="font-size: 0.8em; margin-bottom: 5px;">${day.day}</div>
                            <i class="fas ${day.icon}" style="font-size: 1.5rem; margin: 5px 0;"></i>
                            <div style="font-weight: bold;">${day.temp}°C</div>
                            <div style="font-size: 0.8em;">${day.condition}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Also update any weather alerts
    checkWeatherAlerts(weatherData);
}

function checkWeatherAlerts(weatherData) {
    let alertMessage = '';
    let alertType = 'info';
    
    if (weatherData.temp > 35) {
        alertMessage = `⚠️ Heat Alert: Very high temperature (${weatherData.temp}°C) in ${weatherData.location}. Stay hydrated!`;
        alertType = 'warning';
    } else if (weatherData.temp < 5) {
        alertMessage = `❄️ Cold Alert: Very low temperature (${weatherData.temp}°C) in ${weatherData.location}. Stay warm!`;
        alertType = 'warning';
    } else if (weatherData.condition.toLowerCase().includes('rain')) {
        alertMessage = `🌧️ Rain Alert: Rainy conditions expected in ${weatherData.location}. Carry an umbrella!`;
        alertType = 'info';
    } else if (weatherData.wind > 25) {
        alertMessage = `💨 Wind Alert: Strong winds (${weatherData.wind} km/h) in ${weatherData.location}. Be cautious!`;
        alertType = 'warning';
    }
    
    if (alertMessage) {
        setTimeout(() => {
            showNotification(alertMessage, alertType);
        }, 2000);
    }
}

// Auto-update weather every 5 minutes for the current location
function startWeatherAutoUpdate() {
    setInterval(() => {
        const currentLocation = document.querySelector('.weather-widget p')?.textContent;
        if (currentLocation && currentLocation.includes('Location:')) {
            const location = currentLocation.split('Location: ')[1];
            if (location && location !== 'New Delhi, India') {
                const weatherData = generateWeatherData(location);
                updateWeatherDisplay(weatherData);
                showNotification(`Weather auto-updated for ${location}`, 'info');
            }
        }
    }, 300000); // 5 minutes
}

// Initialize weather auto-update when the app starts
document.addEventListener('DOMContentLoaded', function() {
    startWeatherAutoUpdate();
});

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
    
    .chat-message {
        margin-bottom: 15px;
        padding: 0;
        border-radius: 12px;
        max-width: 85%;
        animation: messageSlideIn 0.3s ease;
    }
    
    .chat-message.user {
        background: var(--primary-color);
        color: white;
        margin-left: auto;
        margin-right: 0;
    }
    
    .chat-message.bot {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        margin-left: 0;
        margin-right: auto;
    }
    
    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 15px 5px;
        font-size: 0.85em;
        opacity: 0.8;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .message-content {
        padding: 10px 15px;
        line-height: 1.5;
        white-space: pre-wrap;
    }
    
    .message-actions {
        padding: 10px 15px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .action-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: inherit;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .action-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-1px);
    }
    
    .timestamp {
        font-size: 0.75em;
        opacity: 0.6;
    }
    
    .confidence {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 0.7em;
    }
    
    .ai-status {
        color: #3b82f6;
        font-size: 0.75em;
    }
    
    .typing-animation {
        display: inline-flex;
        gap: 3px;
    }
    
    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary-color);
        animation: typingDot 1.4s infinite ease-in-out;
    }
    
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typingDot {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes messageSlideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .processing-text {
        margin-left: 10px;
        font-style: italic;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);
