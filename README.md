# Purpose Matrix: Intent-to-App Platform

## Problem Statement
Users today face a highly fragmented digital experience, constantly switching between multiple specialized applications to complete different tasks—whether planning travel, managing personal finances, tracking healthcare, or organizing education. This constant context switching leads to reduced productivity, disjointed workflows, and a poor overall user experience.

## Solution Overview
The **Purpose Matrix Platform** introduces an adaptive "Intent-to-App" solution. Powered by a robust backend NLP engine, the platform dynamically detects the user's goals from their natural language input across five core domains (Travel, Finance, Healthcare, Education, and Event Planning). Rather than making the user find the right app, the platform instantly generates a tailored micro-app workspace, automatically pre-filling fields and delivering a unified, seamless "wow-moment" without ever leaving the page. 

## Key Feature
- **Dynamic Intent Detection**: A built-in keyword-scoring NLP engine that instantly categorizes plain text inputs into appropriate business domains.
- **Adaptive Micro-Apps**: Generates an isolated, interactive workspace specifically designed for the detected domain (e.g., loading the Finance tracker when a user types about saving, or the Travel planner for flights).
- **Full-Stack Integration Architecture**: Features a production-ready setup with real-world user authentication, SQLite database management, and live data API integration (such as Amadeus for flights).
- **Premium Glassmorphism Design**: High-fidelity, state-of-the-art UI with responsive micro-animations that feels premium, modern, and engaging.

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
