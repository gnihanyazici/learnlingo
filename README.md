# LearnLingo - Language Tutor Booking Platform

LearnLingo is a modern, responsive web application designed to connect students with expert language tutors. Users can browse a comprehensive list of teachers, filter them by language, proficiency level, and price, add their preferred tutors to a favorites list, and seamlessly book trial lessons.

## 🚀 Live Demo
**[Live Project URL]** https://learnlingo-five.vercel.app/

## 🎨 Design & Technical Specifications
- **UI Design (Figma):** figma.com/design/dewf5jVviSTuWMMyU3d8Mc/Learn-Lingo?node-id=0-1&t=0thHhkrKywpUBQuF-0
- **Technical Task:** https://docs.google.com/document/d/1Nx8eEc3_2aFd9eedrGW-WxQBF1IQLXp-THqyOdEPLdc/edit?tab=t.0

## ✨ Features
- **User Authentication:** Secure registration and login flows using Firebase Authentication. Form validations handled via React Hook Form and Yup.
- **Tutor Catalog & Pagination:** Displays a list of language teachers with a "Load More" functionality pulling data efficiently from Firebase Realtime Database.
- **Advanced Filtering:** Client-side filtering mechanism to sort tutors by specific languages, learning levels, and hourly rates.
- **Favorites System:** Authenticated users can save teachers to their favorites. Built with an Optimistic UI approach for instant feedback without waiting for the database response.
- **Interactive Modals:** "Book Trial Lesson" and "Authentication" modals that can be dismissed via an intuitive UI (close button, backdrop click, or ESC key).
- **Responsive Design:** Fully responsive layout optimized for mobile, tablet, and desktop viewing.

## 🛠️ Built With
- **Framework:** React 18
- **Bundler:** Vite
- **Routing:** React Router v6
- **Database & Auth:** Firebase (Authentication & Realtime Database)
- **Form Handling & Validation:** React Hook Form + Yup
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, Responsive Media Queries)
- **Notifications:** React Hot Toast

## ⚙️ Local Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gnihanyazici/learnlingo.git
   cd learnlingo