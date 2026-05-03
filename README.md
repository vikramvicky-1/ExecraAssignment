# VIKRAM — Studio-Grade Portfolio & CMS

[![Live Demo](https://img.shields.io/badge/Live-Demo-F63D18?style=for-the-badge&logo=vercel)](https://execra-assignment.vercel.app/)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20GSAP%20|%20Node.js-black?style=for-the-badge)](https://github.com/vikramvicky-1)

A high-fidelity, architectural portfolio ecosystem engineered for visual impact and technical precision. This project features a custom-built GSAP scroll engine, a bespoke typographic design system, and a robust real-time CMS for dynamic content orchestration.

## 🚀 Live Environment
**Production URL**: [https://execra-assignment.vercel.app/](https://execra-assignment.vercel.app/)

---

## 💎 Design Philosophy
The interface is built on a **"Studio-Grade"** aesthetic, prioritizing:
- **Architectural Typography**: Utilizing *Manrope Black* for headers and *Mosvita* for technical metadata.
- **Kinetic Physics**: Advanced GSAP-powered scrub reveals and parallax layers that respond to scroll velocity.
- **Brand Consistency**: A surgical focus on the signature `#F63D18` accent color and high-contrast dark/light modes.

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Animation**: GSAP (ScrollTrigger), Framer Motion
- **Styling**: TailwindCSS, CSS Variables (Custom Design System)
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend & CMS
- **Server**: Node.js / Express
- **Database**: MongoDB (Atlas)
- **Real-time**: Socket.io for instant CMS notifications
- **Architecture**: REST API with JWT Authentication

---

## ⚡ Core Features

### 1. Kinetic Portfolio
- **Custom Scroll Engine**: Smooth vertical reveals and scrub-based parallax interactions.
- **Curated Productions**: Dynamic project gallery with premium case-study cards.
- **Technical Arsenal**: Interactive skill orbiters and experience milestones.

### 2. High-Performance CMS
- **Real-time Inbox**: Instant socket notifications for new contact inquiries.
- **Content Orchestration**: Full CRUD capabilities for projects, skills, and about sections.
- **Secure Access**: Protected administrative routes with session persistence.

### 3. Professional Communications
- **Validation Engine**: Robust form validation with architectural toast feedback.
- **Notification System**: Audio-visual alerts (Global Audio Unlocker integrated).

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikramvicky-1/ExecraAssignment.git
   cd ExecraAssignment
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Backend**:
   ```bash
   cd ../backend
   npm install
   # Configure .env with MONGO_URI, JWT_SECRET, PORT
   npm run dev
   ```

## 📜 License
© 2025 Vikram. All Rights Reserved. Designed and Engineered with precision.

---
*Built by [Vikram](https://github.com/vikramvicky-1)*
