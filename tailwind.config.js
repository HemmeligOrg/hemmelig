const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./client/**/*.{js,jsx}', './client/**/*.html'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                hemmelig: {
                    DEFAULT: '#2a9d8f',
                    50: '#ffffff',
                    100: '#eaf5f4',
                    200: '#d4ebe9',
                    300: '#bfe2dd',
                    400: '#aad8d2',
                    500: '#95cec7',
                    600: '#7fc4bc',
                    700: '#6abab1',
                    800: '#55b1a5',
                    900: '#3fa79a',
                },
                'hemmelig-orange': {
                    DEFAULT: '#ff9769',
                    50: '#ffffff',
                    100: '#fff5f0',
                    200: '#ffeae1',
                    300: '#ffe0d2',
                    400: '#ffd5c3',
                    500: '#ffcbb4',
                    600: '#ffc1a5',
                    700: '#ffb696',
                    800: '#ffac87',
                    900: '#ffa178',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
