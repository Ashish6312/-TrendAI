# 🚀 TrendAI: Strategic Business Intelligence Terminal

**TrendAI** is a professional-grade AI platform that discovers high-profit business opportunities in any city. This guide explains exactly how the application works, how the search engine performs, and how to use every mode available.

---

## 📖 Table of Contents
1. [The Core Objective](#-the-core-objective)
2. [Step-by-Step User Journey](#-step-by-step-user-journey)
3. [How the "Search & Action" Works](#-how-the-search--action-works)
4. [Modes of Operation](#-modes-of-operation)
5. [Setup Guide (Beginner Friendly)](#-setup-guide)

---

## 🎯 The Core Objective
TrendAI solves the problem of "Business Blindness." Instead of guessing what business to start, the app uses **Artificial Intelligence** to listen to what local people are saying on the internet and tells you exactly what service is missing in their area.

---

## 🛰 Step-by-Step User Journey

### 1. The Entry Protocol (Home Page)
*   **Action**: You land on our high-tech terminal.
*   **Login**: You sign in with your **Google Account**. This secures your data and syncs your profile.

### 2. Physical Target Search (Dashboard)
*   **The Action**: You type a city name (e.g., "New York" or "New Delhi").
*   **The Search**: Our system uses a **Global Mapping Engine** (Nominatim) to find the exact coordinates of that city so the AI knows exactly where it is looking.

### 3. Neural Deep Scan (Discovery)
*   **The Process**: Once you click `Initiate Market Scan`, the app performs **parallel actions**:
    *   **Action A**: Scans **Reddit** for local complaints and needs.
    *   **Action B**: Scans **Google Trends** for rising search demands.
*   **The Result**: The AI "Synthesizes" this data and gives you **3 tailored business recommendations** with scorecards (Profit, Risk, and Capital needed).

### 4. Operational Roadmap (Planning)
*   **The Action**: You click on a business idea you like.
*   **The Blueprint**: The app shifts into "Directive Mode" and builds a **scroll-animated roadmap** that walks you through the next 6 months of starting that specific business.

---

## 🧠 How the "Search & Action" Works

As a developer, here is the "Logic Path" the app takes when you perform an action:

| Stage | Action Type | Technology Used | What happens? |
| :--- | :--- | :--- | :--- |
| **Search** | Data Retrieval | OpenStreetMap API | Converts city text into physical GPS coordinates. |
| **Extraction**| Web Scraping | DuckDuckGo Scraper | "Reads" public conversations from Reddit and news sites. |
| **Synthesis** | AI Logic | Pollinations AI (GPT-4) | Connects the dots between "What people want" and "How to make a business." |
| **Delivery** | Dynamic UI | Next.js & Framer Motion| Presents the data in a beautiful, animated terminal. |

---

## ⚙️ Modes of Operation

### 🌐 1. Multi-Language Intelligence Mode
The application can be used in **English, Hindi, Spanish, French, and German**. 
*   **How it works**: When you switch languages, the entire app (buttons, labels, and even the AI's complex reports) changes instantly.
*   **Persistence**: Once selected, the mode is "locked" to your browser using `localStorage`.

### 👤 2. Profile Synchronization Mode
Your business identity is handled automatically.
*   **Auto-Sync**: Your Google Name and Picture are pulled immediately.
*   **Manual Override**: You can enter the "Profile Configuration" and add your personal Bio and Tactical Phone Number to customize your reports.

### 🗺️ 3. Directive Blueprint Mode (Roadmap)
This isn't just a list; it's a phase-based system.
*   **Action**: Generates Milestones (Phase 1, 2, 3).
*   **Output**: Includes a "Printable Protocol" feature so you can extract your business plan as a formal document for your report.

---

## 🚀 Deployment (Render Guide)

You can deploy this entire system on **Render** in minutes using the provided `render.yaml` blueprint.

### Automatic Method (Blueprints)
1.  Connect your GitHub repository to [Render](https://render.com).
2.  Navigate to **Blueprints** and click **New Blueprint Instance**.
3.  Select your repository. Render will automatically detect `render.yaml` and set up:
    *   **FastAPI Backend** (Web Service)
    *   **Next.js Frontend** (Web Service)
    *   **PostgreSQL Database** (Instance)

### Environment Variable Setup
Before the app can run, go to the Render Dashboard and set these variables:
*   **Backend**: 
    *   `POLLINATION_API_KEY`: Your AI key.
    *   `FRONTEND_URL`: The URL of your deployed frontend.
*   **Frontend**: 
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend.

---

## 🛑 Local Installation (The Beginner Guide)

---

## 🛠 Tech Summary
*   **Frontend**: React, Next.js, Framer Motion (Animations), Tailwind CSS.
*   **Backend**: FastAPI (Python), SQL Alchemy (Database), DDGS (Scraper).
*   **AI**: Llama 3 / GPT-4 via Pollinations.
*   **Database**: PostgreSQL / Neon.

---
*Developed for the Future of Business Intelligence.*
