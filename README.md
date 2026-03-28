# Purpose Matrix: Intent-to-App Platform

## Problem Statement
Users today face a highly fragmented digital experience, constantly switching between multiple specialized applications to complete different tasks—whether planning travel, managing personal finances, tracking healthcare, or organizing education. This constant context switching leads to reduced productivity, disjointed workflows, and a poor overall user experience.

## Solution Overview
The **Purpose Matrix Platform** introduces an adaptive "Intent-to-App" solution. Powered by a robust backend NLP engine, the platform dynamically detects the user's goals from their natural language input across five core domains (Travel, Finance, Healthcare, Education, and Event Planning). Rather than making the user find the right app, the platform instantly generates a tailored micro-app workspace, automatically pre-filling fields and delivering a unified, seamless "wow-moment" without ever leaving the page. 

🚀 Key Features
🧠 Intent-based UI generation
⚡ Real-time dynamic interface creation
🔄 Adaptive UI (based on user behavior)
🌐 Multi-domain support (travel, finance, fitness, etc.)
🧩 Modular micro-app architecture
🔗 Multi-intent merging (hybrid apps)
📱 Responsive and user-friendly design
🔍 Minimal input → Maximum output

## Tech Stack Used
- **Frontend**: HTML5, Vanilla JavaScript, CSS3 (Custom Glassmorphism styling, responsive layouts)
- **Backend**: Python, Flask (Robust routing and intent processing engine)
- **Database**: SQLite (Secure user registration and persistent data storage)
- **APIs**: Amadeus API (Live flight data integration), Native Fetch API

## How to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VEDASHREE-123/Embedded_Rockers.git
   cd Embedded_Rockers
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd BMS/IntentToApp
   ```

3. **Start the Backend Server**
   Ensure you have Python installed, then run the Flask server:
   ```bash
   cd backend
   python app.py
   ```
   *The backend will start running on `http://127.0.0.1:5000` or a similar local port.*

4. **Launch the Frontend Application**
   Open a new terminal window or simply locate the `frontend` folder in your file explorer.
   - Open `BMS/IntentToApp/frontend/index.html` in any modern web browser.
   - For the best development experience, you can use the VS Code "Live Server" extension.
