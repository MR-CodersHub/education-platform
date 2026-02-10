// Configure Tailwind for custom colors and font
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary-blue': '#2C7BE5',
                'secondary-pink': '#FF7A59', // Updated to Orange as accent
                'light-lavender': '#F9F9F9', // Updated to Neutral Light Gray
                'dark-slate': '#1E293B',
            },
            fontFamily: {
                sans: ['Poppins', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #2C7BE5 0%, #60A5FA 100%)',
            }
        }
    }
}
