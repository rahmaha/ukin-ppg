/* Konfigurasi Tailwind CDN: harus dimuat setelah skrip cdn.tailwindcss.com */
tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                        mono: ['Fira Code', 'monospace'],
                    },
                    colors: {
                        gg: {
                            bg: '#090a0f',
                            card: '#121622',
                            track: '#ede4d4',
                            accentPink: '#ff498b',
                            accentGreen: '#10b981',
                            accentYellow: '#facc15',
                            accentCyan: '#06b6d4',
                            accentPurple: '#a855f7'
                        }
                    }
                }
            }
        }
