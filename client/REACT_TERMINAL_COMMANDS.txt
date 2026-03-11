# React Terminal Commands Reference

## Project Setup Commands

### Create New React App (Vite)
npm create vite@latest my-app -- --template react
# Creates a new React project using Vite (fast build tool)
# Replace 'my-app' with your project name
# Use --template react-ts for TypeScript

### Create New React App (Create React App)
npx create-react-app my-app
# Creates a new React project using Create React App
# Note: CRA is now in maintenance mode, Vite is recommended

### Create React App with TypeScript
npx create-react-app my-app --template typescript
# Creates a React project with TypeScript support

### Install Dependencies
npm install
# Installs all dependencies listed in package.json
# Run this after cloning a project

### Install Dependencies (Alternative)
npm ci
# Clean install - uses package-lock.json exactly
# Faster and more reliable for CI/CD pipelines

## Development Commands

### Start Development Server
npm run dev
# Starts the Vite development server (usually on http://localhost:5173)
# Hot reload enabled - changes reflect immediately

### Start Development Server (CRA)
npm start
# Starts Create React App development server (usually on http://localhost:3000)
# Opens browser automatically

### Start on Specific Port
npm run dev -- --port 3000
# Starts dev server on port 3000 instead of default
# Useful when default port is already in use

### Start with Host Access
npm run dev -- --host
# Allows access from network (not just localhost)
# Useful for testing on mobile devices

## Build Commands

### Build for Production
npm run build
# Creates optimized production build in /dist or /build folder
# Minifies code, optimizes assets, removes dev code

### Preview Production Build
npm run preview
# Serves the production build locally for testing
# Run after 'npm run build'

### Build with Environment Variables
npm run build -- --mode production
# Builds with specific environment mode
# Loads variables from .env.production

## Package Management

### Install a Package
npm install package-name
# Installs a package and adds it to dependencies
# Example: npm install axios

### Install a Dev Dependency
npm install --save-dev package-name
# Installs package as dev dependency (not needed in production)
# Example: npm install --save-dev eslint

### Install Specific Version
npm install package-name@1.2.3
# Installs a specific version of a package
# Example: npm install react@18.2.0

### Install Latest Version
npm install package-name@latest
# Installs the latest version of a package

### Uninstall a Package
npm uninstall package-name
# Removes a package from node_modules and package.json
# Example: npm uninstall lodash

### Update a Package
npm update package-name
# Updates a package to the latest version within semver range
# Example: npm update react

### Update All Packages
npm update
# Updates all packages to latest versions within semver ranges

### Check for Outdated Packages
npm outdated
# Shows which packages have newer versions available
# Displays current, wanted, and latest versions

### View Package Information
npm info package-name
# Shows detailed information about a package
# Example: npm info react

### List Installed Packages
npm list
# Shows tree of installed packages
# Use --depth=0 to show only top-level packages

### List Global Packages
npm list -g --depth=0
# Shows globally installed packages

## Code Quality Commands

### Run Linter
npm run lint
# Runs ESLint to check code for errors and style issues
# Helps maintain code quality

### Fix Linting Issues
npm run lint -- --fix
# Automatically fixes fixable linting issues
# Manual fixes needed for complex issues

### Run Prettier
npx prettier --write .
# Formats all files in project using Prettier
# Ensures consistent code formatting

### Check Prettier Formatting
npx prettier --check .
# Checks if files are formatted correctly
# Doesn't modify files

## Testing Commands

### Run Tests
npm test
# Runs test suite (Jest, Vitest, etc.)
# Watches for changes in test mode

### Run Tests Once
npm test -- --run
# Runs tests once without watch mode
# Useful for CI/CD pipelines

### Run Tests with Coverage
npm test -- --coverage
# Runs tests and generates coverage report
# Shows which code is tested

### Run Specific Test File
npm test -- ComponentName.test.jsx
# Runs only the specified test file
# Replace with your test file name

### Update Test Snapshots
npm test -- -u
# Updates Jest snapshots
# Use when component output intentionally changes

## Common React Package Installations

### React Router
npm install react-router-dom
# Adds routing capabilities to React app
# For navigation between pages

### State Management - Redux
npm install @reduxjs/toolkit react-redux
# Installs Redux Toolkit and React bindings
# For complex state management

### State Management - Zustand
npm install zustand
# Lightweight state management alternative
# Simpler than Redux

### HTTP Client - Axios
npm install axios
# Popular HTTP client for API requests
# Alternative to fetch API

### UI Framework - Material-UI
npm install @mui/material @emotion/react @emotion/styled
# Installs Material-UI component library
# Pre-built React components

### UI Framework - Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# Installs and initializes Tailwind CSS
# Utility-first CSS framework

### Form Handling - React Hook Form
npm install react-hook-form
# Performant form validation library
# Minimal re-renders

### Form Validation - Yup
npm install yup
# Schema validation library
# Works well with React Hook Form

### Icons - React Icons
npm install react-icons
# Popular icon library with multiple icon sets
# Font Awesome, Material Icons, etc.

### Date Handling - date-fns
npm install date-fns
# Modern date utility library
# Lightweight alternative to Moment.js

### Animation - Framer Motion
npm install framer-motion
# Production-ready animation library
# Easy to use, powerful animations

### Charts - Recharts
npm install recharts
# Composable charting library
# Built with React components

### Toast Notifications - React Toastify
npm install react-toastify
# Easy toast notifications
# Customizable and accessible

## Environment & Configuration

### Create Environment File
# Create .env file in project root
# Add variables with VITE_ prefix for Vite
# Example: VITE_API_URL=http://localhost:8000

### Load Environment Variables (Vite)
# Access in code: import.meta.env.VITE_API_URL
# Variables must start with VITE_ to be exposed

### Load Environment Variables (CRA)
# Access in code: process.env.REACT_APP_API_URL
# Variables must start with REACT_APP_

## Troubleshooting Commands

### Clear npm Cache
npm cache clean --force
# Clears npm cache
# Use when experiencing package installation issues

### Delete node_modules and Reinstall
rm -rf node_modules package-lock.json
npm install
# Complete reinstall of dependencies
# Fixes many dependency-related issues

### Check npm Version
npm --version
# Shows installed npm version

### Check Node Version
node --version
# Shows installed Node.js version

### Update npm
npm install -g npm@latest
# Updates npm to latest version globally

### Audit Dependencies for Vulnerabilities
npm audit
# Checks for security vulnerabilities in dependencies
# Shows severity and recommendations

### Fix Vulnerabilities
npm audit fix
# Automatically fixes vulnerabilities when possible
# May update package versions

### Force Fix Vulnerabilities
npm audit fix --force
# Aggressively fixes vulnerabilities
# May introduce breaking changes

## Performance & Analysis

### Analyze Bundle Size
npm run build
npx vite-bundle-visualizer
# Visualizes bundle size and composition
# Helps identify large dependencies

### Check Bundle Size (CRA)
npm run build
npx source-map-explorer 'build/static/js/*.js'
# Analyzes bundle size for Create React App

## Git & Version Control

### Initialize Git Repository
git init
# Initializes a new Git repository
# Run once when starting a new project

### Check Git Status
git status
# Shows modified, staged, and untracked files

### Stage All Changes
git add .
# Stages all changes for commit

### Commit Changes
git commit -m "Your commit message"
# Commits staged changes with a message

### Push to Remote
git push origin main
# Pushes commits to remote repository
# Replace 'main' with your branch name

### Pull Latest Changes
git pull origin main
# Pulls latest changes from remote repository

## Deployment Commands

### Build for Deployment
npm run build
# Creates production-ready build
# Deploy the /dist or /build folder

### Deploy to Vercel
npm install -g vercel
vercel
# Deploys to Vercel hosting platform
# Follow prompts for configuration

### Deploy to Netlify
npm install -g netlify-cli
netlify deploy
# Deploys to Netlify hosting platform
# Use --prod flag for production

### Deploy to GitHub Pages
npm install --save-dev gh-pages
# Add to package.json scripts:
# "predeploy": "npm run build"
# "deploy": "gh-pages -d dist"
npm run deploy
# Deploys to GitHub Pages

## Advanced Commands

### Run Custom Script
npm run script-name
# Runs custom script defined in package.json
# Example: npm run custom-build

### Run Multiple Commands
npm run build && npm run preview
# Runs commands sequentially
# Second command runs only if first succeeds

### Run Commands in Parallel
npm run dev & npm run server
# Runs commands simultaneously
# Both commands run at the same time

### Pass Arguments to Script
npm run dev -- --port 3000 --open
# Passes additional arguments to the script
# Everything after -- is passed to the command

### Set Environment Variable (Windows)
set NODE_ENV=production && npm run build
# Sets environment variable for single command
# Windows syntax

### Set Environment Variable (Linux/Mac)
NODE_ENV=production npm run build
# Sets environment variable for single command
# Unix syntax

## Package.json Scripts Examples

### Common Scripts Configuration
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}

## Useful Shortcuts

### Clear Terminal
clear
# Clears the terminal screen (Linux/Mac)
# Use 'cls' on Windows

### Stop Running Process
Ctrl + C
# Stops the currently running process
# Use in terminal where process is running

### View Command History
history
# Shows previously run commands (Linux/Mac)
# Use arrow up/down to navigate history

## Best Practices

### Development Workflow
1. npm install          # Install dependencies
2. npm run dev          # Start development server
3. Make changes         # Edit code
4. npm run lint         # Check for errors
5. npm test             # Run tests
6. npm run build        # Build for production
7. npm run preview      # Test production build

### Before Committing
1. npm run lint         # Check code quality
2. npm test             # Ensure tests pass
3. npm run build        # Verify build works
4. git add .            # Stage changes
5. git commit -m "..."  # Commit with message

### Updating Dependencies
1. npm outdated         # Check for updates
2. npm update           # Update within semver
3. npm test             # Test after updates
4. npm audit            # Check security

## Common Issues & Solutions

### Port Already in Use
# Error: Port 5173 is already in use
# Solution: Use different port
npm run dev -- --port 3000

### Module Not Found
# Error: Cannot find module 'package-name'
# Solution: Install the package
npm install package-name

### Permission Denied (Global Install)
# Error: EACCES permission denied
# Solution: Use sudo (Linux/Mac) or run as administrator (Windows)
sudo npm install -g package-name

### Dependency Conflicts
# Error: Unable to resolve dependency tree
# Solution: Use --legacy-peer-deps flag
npm install --legacy-peer-deps

### Out of Memory
# Error: JavaScript heap out of memory
# Solution: Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
