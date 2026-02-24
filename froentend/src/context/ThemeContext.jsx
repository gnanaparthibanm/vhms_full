import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // Custom Color State
    const [primaryColor, setPrimaryColor] = useState(
        localStorage.getItem('dashboard-primary') || '#4051c0'
    );

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove both classes to start fresh
        root.classList.remove('light', 'dark');

        // Add the current theme class
        root.classList.add(theme);

        // Save preference
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Apply Custom Colors
    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--dashboard-primary', primaryColor);

        // Calculate a hover variant (optional basic logic, can be refined)
        // For simplicity, we just set the hover to the same or let CSS handle opacity if used with rgb/hsl. 
        // But the CSS has a hex variable: --dashboard-primary-hover: #7C3AED;
        // We can just set it to the same for now or leave it static if not critical. 
        // Let's set it to the picked color for consistency in this implementation.
        root.style.setProperty('--dashboard-primary-hover', primaryColor);
        root.style.setProperty('--sidebar-active-bg', primaryColor); // Sidebar active uses this variable

        localStorage.setItem('dashboard-primary', primaryColor);
    }, [primaryColor]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const updatePrimaryColor = (color) => {
        setPrimaryColor(color);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, updatePrimaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
