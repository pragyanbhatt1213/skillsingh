# SkillSingh

A powerful resume parsing and skill matching platform built with Next.js, Express, and Supabase.

## Technology Stack

### Frontend
* React.js
* Tailwind CSS
* Next.js

### Backend
* Node.js with Express
* Supabase (Database)

### Document Processing
* resume-parser npm package
* pdf.js
* docx

### AI/ML Models
* Hugging Face's LayoutLM
* Fine-tuned BERT models
* mBART-50
* XLM-RoBERTa
* TF-IDF, Word2Vec/GloVe
* Tesseract OCR
* ResNet-based models

## Getting Started

Follow these steps to get the project running on your local machine:

### Prerequisites

- Node.js (v16.0 or higher)
- npm (v7.0 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillsingh.git
   cd skillsingh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   
   **Windows PowerShell:**
   ```powershell
   echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" | Out-File -FilePath ".env.local" -Encoding utf8
   ```
   
   **Mac/Linux:**
   ```bash
   echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" > .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Start the Express backend server** (in a new terminal)
   ```bash
   npm run server
   ```

6. **Or run both frontend and backend together**
   ```bash
   npm run dev:all
   ```

7. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

## Project Structure

```
skillsingh/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Dashboard route group
│   │   │   ├── candidates/
│   │   │   ├── jobs/
│   │   │   ├── matching/
│   │   │   ├── resume-parser/
│   │   │   └── settings/
│   │   ├── api/                # API routes
│   │   ├── page.tsx            # Home page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # UI components
│   │   ├── forms/              # Form components
│   │   └── dashboard/          # Dashboard components
│   └── lib/                    # Utility functions and clients
│       ├── utils/              # Utility functions
│       ├── supabase/           # Supabase client
│       └── ai/                 # AI models and utilities
├── server/                     # Express backend
│   ├── routes/                 # API routes
│   ├── controllers/            # Route controllers
│   ├── middlewares/            # Express middlewares
│   ├── models/                 # Data models
│   └── index.js                # Server entry point
├── public/                     # Static files
├── .env.local                  # Environment variables
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "server": "node server/index.js",
  "dev:all": "concurrently \"npm run dev\" \"npm run server\""
}
```

## Features

- **Resume Parsing**: Extract structured data from resumes in multiple formats
- **Skill Identification**: AI-powered identification of skills from resume text
- **Multilingual Support**: Process resumes in different languages
- **Job Matching**: Match candidate skills with job requirements
- **Interactive Dashboard**: View and manage candidates and job listings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
