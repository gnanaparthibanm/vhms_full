# 🐾 AtelierVet - Veterinary Practice Management System

AtelierVet is a modern, responsive frontend application designed for veterinary clinics to manage their day-to-day operations efficiently. Built with the latest web technologies, it offers a premium user experience with a focus on aesthetics, usability, and performance.

## ✨ Key Features

- **📊 Interactive Dashboard**: Real-time overview of appointments, active patients, financial stats, and staff availability.
- **🌗 Dark & Light Mode**: Seamless theme switching with persistent user preference.
- **🔐 Secure Authentication**: fully styled Login, Registration, and Forgot Password pages with OTP flows.
- **🎨 Dynamic Theming**: Centralized CSS variable-based theming engine allowing for easy brand color customization.
- **📱 Responsive Design**: optimized for desktops, tablets, and mobile devices.
- **📈 Data Visualization**: Integrated charts for patient distribution and financial insights.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Atelier-Creation/ateliervetFE.git
    cd ateliervetFE
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Header, Sidebar, Button, etc.)
├── context/        # React Contexts (ThemeContext)
├── layout/         # Layout wrappers (MainLayout)
├── pages/          # Application views (Dashboard, Auth, Register, etc.)
├── index.css       # Global styles and theme variables
└── App.jsx         # Main application entry and routing
```

## 🎨 Customization

You can easily change the primary brand color by editing `src/index.css`:

```css
:root {
  --dashboard-primary: #4051c0; /* Change this hex code */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
