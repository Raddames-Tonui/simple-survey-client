# Simple Survey Client

A simple, clean survey application built with **React**, **TypeScript**, and **TailwindCSS**. Users can create and fill in surveys, upload certificates (PDF), and submit responses. Authenticated access is handled using **JWT tokens**.

🔗 **Live site:** [https://simple-survey-client-alpha.vercel.app/survey/user-surveys](https://simple-survey-client-alpha.vercel.app/survey/user-surveys)

🔗 **Backend API:** [https://simple-survey-api-fqyt.onrender.com](https://simple-survey-api-fqyt.onrender.com)

---

## Features
- 🔐 JWT-based Authentication
- 📋 Survey creation and answering with multiple input types
- 📄 Viewing survey responses
- 🧾 File (PDF certificate) uploads
- 💾 LocalStorage support for resuming surveys
- 🧠 Review screen before final submission
- 🎯 Final confirmation page after submitting

---

## Technologies Used
- **React** (Frontend library)
- **TypeScript** (Static typing)
- **TailwindCSS** (Utility-first styling)
- **JWT** (Authentication)
- **Vercel** (Deployment)

---

## Project Structure
```
src/
├── auth/             # Authentication logic and helpers
├── components/       # Reusable UI components
├── context/          # React Context for survey and auth
├── layout/           # Layout components and wrappers
├── pages/            # Main page components
├── utils/            # Helper functions
├── config.json       # API configuration
├── main.tsx          # App entry
└── app.tsx           # Routes
```

### Sample config.json
```json
{
  "server_url": "https://simple-survey-api-fqyt.onrender.com"
}
```

---

## Deployment Guide (Vercel)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Import simple survey client GitHub repository
3. Set up build settings if needed (`npm run build`)
4.Deploy

> ✅ Make sure `config.json` has the correct API URL.

---

## Contribution & Feedback
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## License
[MIT](LICENSE)

---

If it works, thank Raddames Tonui. If it doesn't, blame the spec. 🤓

