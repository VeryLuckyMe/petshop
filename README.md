# Petshop Project: Setup & Development Guide

Follow these steps to set up, run, and update the `petshop` project on any computer.

## Prerequisites
Before you begin, ensure you have the following installed:
- **Git**: [Download and Install Git](https://git-scm.com/downloads)
- **Node.js** (LTS version recommended): [Download and Install Node.js](https://nodejs.org/)

## Step 1: Initial Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/VeryLuckyMe/petshop.git
   cd petshop
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   > [!IMPORTANT]
   > You must use the same Supabase keys used in the original project to keep the data connected.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## Step 2: How to Update Your Code (Git Workflow)
Whenever you make changes and want to save them to GitHub, follow these 3 steps:

1. **Stage Changes**
   ```bash
   git add .
   ```

2. **Commit Changes** (Save locally)
   ```bash
   git commit -m "Description of what you changed"
   ```

3. **Push Changes** (Send to GitHub)
   ```bash
   git push origin main
   ```

---

## Troubleshooting
- **Missing Dependencies**: Run `npm install` again if you see "module not found" errors.
- **Tailwind Issues**: If styles look broken, ensure you ran `npm install` and restart the dev server.
- **Syncing Issues**: If you work on different machines, run `git pull origin main` before you start working.
