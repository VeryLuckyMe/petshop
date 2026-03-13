# Petshop Project: New Machine Setup Guide

Follow these steps to set up and run the `petshop` project on a different computer.

## Prerequisites
Before you begin, ensure you have the following installed:
- **Git**: [Download and Install Git](https://git-scm.com/downloads)
- **Node.js** (LTS version recommended): [Download and Install Node.js](https://nodejs.org/)

## Step-by-Step Instructions

### 1. Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Terminal) and run:
```bash
git clone https://github.com/VeryLuckyMe/petshop.git
```

### 2. Navigate to the Project Folder
```bash
cd petshop
```

### 3. Install Dependencies
Install all the necessary libraries defined in `package.json`:
```bash
npm install
```

### 4. Configure Environment Variables
The project requires Supabase configuration. 
1. Create a file named `.env` in the root of the project.
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
> [!IMPORTANT]
> Since `.env` files are typically ignored by Git (for security), you'll need to manually copy these values from your original project or your Supabase dashboard.

### 5. Start the Development Server
Run the project locally:
```bash
npm run dev
```
Once started, the terminal will provide a local URL (usually `http://localhost:5173`). Open this URL in your browser to view the application.

## Troubleshooting
- **Missing Dependencies**: If you see errors about missing modules, try running `npm install` again.
- **Environment Variables**: Ensure the `.env` file is named correctly and contains the right keys.
- **Node Version**: If you encounter version conflicts, ensure you are using a compatible Node.js version.
