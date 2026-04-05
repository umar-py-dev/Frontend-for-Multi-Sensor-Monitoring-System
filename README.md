# Multi-Sensor Monitoring System - Frontend

This is the **React-based Frontend** for the [Multi-Sensor Monitoring System](https://github.com). It provides an intuitive, real-time interface to monitor industrial devices, visualize sensor analytics, and manage system alerts.

## Core Features

*   **🖥️ Real-time Dashboard:** A high-level system overview including:
    *   Dynamic counts of **Active Devices** and **Active Sensors**.
    *   Weekly aggregation of **Critical Alerts**.
    *   Comprehensive **Device List** with real-time status tracking.
*   **📊 Advanced Sensor Analytics:**
    *   Interactive **Area Charts** displaying historical sensor data against established thresholds (Max/Min).
    *   Detailed **Sensor Lists** per device, including activity timeouts and unit measurements.
*   **📋 Custom Reporting:** 
    *   Filterable data visualization by date range, specific device, and sensor type.
*   **⚠️ Alert Management:**
    *   Full history of system alerts with filtering options for Device, Sensor, and Alert Status (Critical/Warning).
*   **🐞 Debug Logger:**
    *   A dedicated view for monitoring MQTT subscriber payloads and database insertion responses in real-time.

## 🛠️ Tech Stack

*   **Framework:** React.js (Vite)
*   **Styling:** Tailwind CSS (Responsive Design)
*   **Data Visualization:** Recharts
*   **API Integration:** RESTful architecture with JWT Authentication

## 📁 Project Structure

```text
/frontend
├── public/           # Static assets
└── src/
    ├── assets/       # Global styles and images 
    ├── components/   # Reusable UI elements (Tables, Cards, Charts) 
    ├── pages/        # Main View Pages: 
    │   ├── Login     # Secure Admin Entry 
    │   ├── Dashboard # System Overview 
    │   ├── Details   # Device & Sensor Analytics 
    │   ├── Reports   # Historical Data Generation 
    │   ├── Alerts    # Incident Logs 
    │   └── Debug     # MQTT Payload Logs 
    └── services/     # API Setup and Axios instances