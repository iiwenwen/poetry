/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'oklch(var(--background))',
				foreground: 'oklch(var(--foreground))',
				card: {
					DEFAULT: 'oklch(var(--card))',
					foreground: 'oklch(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'oklch(var(--popover))',
					foreground: 'oklch(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'oklch(var(--primary))',
					foreground: 'oklch(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'oklch(var(--secondary))',
					foreground: 'oklch(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'oklch(var(--muted))',
					foreground: 'oklch(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'oklch(var(--accent))',
					foreground: 'oklch(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'oklch(var(--destructive))',
					foreground: 'oklch(var(--destructive-foreground))'
				},
				border: 'oklch(var(--border))',
				input: 'oklch(var(--input))',
				ring: 'oklch(var(--ring))',
				// 绘本特色色彩 - OKLCH
				storybook: {
					pink: 'oklch(var(--storybook-pink))',
					blue: 'oklch(var(--storybook-blue))',
					yellow: 'oklch(var(--storybook-yellow))',
					green: 'oklch(var(--storybook-green))',
					purple: 'oklch(var(--storybook-purple))',
					orange: 'oklch(var(--storybook-orange))'
				},
				chart: {
					'1': 'oklch(var(--chart-1))',
					'2': 'oklch(var(--chart-2))',
					'3': 'oklch(var(--chart-3))',
					'4': 'oklch(var(--chart-4))',
					'5': 'oklch(var(--chart-5))'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
