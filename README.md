# Guinea Pig Simulator

A text-based browser game where you care for a virtual guinea pig! Built with Vue 3, Vite, and Pinia.

## Features
- Care for your guinea pig: manage hunger, thirst, cleanliness, and more
- Interactive cage grid with movable guinea pig and droppable poops
- Inventory system for food and items
- Market, currency, and user profile
- All game state is saved in your browser (localStorage)
- Modern, modular UI with panels and menubar

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Tech Stack
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) (state management)

## Project Structure
- `src/components/` — UI components (Cage, GuineaPig, MainScreen, etc.)
- `src/stores/` — Pinia stores for user, inventory, guinea pig, and cage
- `public/favicon.svg` — Guinea pig emoji favicon

## License
MIT
