# DStrA - Data Structures and Algorithms for GTU Diploma (DI03000021)

**DStrA** is a structured and comprehensive web application designed for third-semester diploma students of Computer Engineering under Gujarat Technological University (GTU). It focuses on the subject **Data Structures (DI03000021)**, offering a complete learning platform including explanations, code examples, visualizations, and interactive coding.

## Why DStrA was made?
There are many DSA tools available online, but none are made specially for diploma students. At the diploma level, DSA is taught in a very simple way, and using big tools can feel confusing or too advanced. DStrA was made to fill this gap by giving diploma students an easy and clear platform to learn DSA with examples, visuals, and practice.

## Features

- Learn Mode: Step-by-step DSA topics with GTU syllabus alignment
- Theory Module: Read theories, visualize and get video links chapter wise 
- Visualizations: Graphs, Trees, Sorting animations
- Online IDE: In-browser Judge0-powered compiler
- Code library: Download or Run online pre-made codes 
- Auth System: Google & OTP-based authentication
- Admin Panel: Upload new lessons, quizzes, and programs  

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)  
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)  
![React](https://img.shields.io/badge/React-18+-blue?logo=react)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss)  
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)  
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)  
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-yellowgreen)  
![Judge0](https://img.shields.io/badge/Judge0-API-orange)  
![NextAuth](https://img.shields.io/badge/NextAuth-Auth-blueviolet)  
![GoogleAuth](https://img.shields.io/badge/Google-Auth-red?logo=google)  
![Markdown](https://img.shields.io/badge/Markdown-Rendering-black?logo=markdown)  
![React Hooks](https://img.shields.io/badge/React-Hooks-61DAFB?logo=react)  


## Folder Structure

```
public/                  # Static assets
src/
├── app/                 # Application pages & API routes (learn, library, programs, admin)
├── components/          # Reusable React components
├── lib/                 # Utility functions (auth, DB, tracking)
├── models/              # Type definitions and interfaces
├── types/               # Custom types and declarations
├── utils/               # Helper functions (OTP, email)
```

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- npm or yarn  
- MongoDB or your preferred DB (if applicable)  

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tanmay-mevada/DStrA.git
cd DStrA
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create `.env.local` file with your own credentials :

```env
MONGO_URI = ************
GOOGLE_CLIENT_ID = ************
GOOGLE_CLIENT_SECRET = ************
NEXTAUTH_SECRET = ************
NEXT_PUBLIC_JUDGE0_API_KEY = ************
API_BASE_URL = ************
NEXT_PUBLIC_API_BASE_URL = ************
NEXTAUTH_URL = ************
EMAIL_USER = ************
EMAIL_PASS = ************
NEXT_PUBLIC_BASE_URL = ************
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser.

## Scripts

- `dev` - Run the app in development mode  
- `build` - Build for production  
- `start` - Start production server  
- `lint` - Run ESLint  

## Contribution Guidelines

1. Fork the repository  
2. Create a new branch (`git checkout -b feature-name`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to the branch (`git push origin feature-name`)  
5. Open a pull request  

## To-Do / Future Improvements

- MCQs Tests Module
- Add offline mode using PWA  
- Add problem submission & evaluation logic  
- Mobile app version (React Native)  
- Integration of AI-based code assistant  

## License

This project is licensed under the MIT License.
