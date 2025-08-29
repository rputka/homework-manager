# Homework Manager 📚

A sleek, modern homework manager with a sticky note design that helps you organize your assignments by class. Built with Next.js, TypeScript, and Tailwind CSS.

## Features ✨

- **Sticky Note Design**: Each class gets its own colorful sticky note interface
- **Class Management**: Create and organize classes with custom color themes
- **Assignment Tracking**: Add assignments with due dates, notes, and recurring options
- **Progress Tracking**: Visual progress bars and completion counters
- **Smart Reset**: Reset completed assignments (keeps recurring, removes non-recurring)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Local Storage**: Data persists in your browser (no server required)
- **Modern UI**: Beautiful animations and smooth interactions

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage 📖

### Creating Classes
1. Click "Add Class" in the header
2. Enter a class name
3. Choose a color theme (yellow, pink, blue, green, or purple)
4. Click "Add Class"

### Adding Assignments
1. Click "Add Assignment" on any class sticky note
2. Fill in the assignment details:
   - **Title**: Required
   - **Due Date**: Required
   - **Notes**: Optional additional information
   - **Recurring**: Check if this assignment repeats weekly
3. Click "Add Assignment"

### Managing Assignments
- **Complete**: Click the checkbox to mark as done (strikethrough effect)
- **View Notes**: Click the notes icon to expand/collapse assignment notes
- **Delete**: Click the X button to remove an assignment
- **Delete Class**: Click the trash icon on a class to remove it and all assignments

### Reset Functionality
- Click the "Reset" button in the header
- This will:
  - Remove all completed non-recurring assignments
  - Reset all completed recurring assignments to incomplete
  - Keep track of when the reset occurred

## Deployment 🌐

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings
4. Your app will be live at `https://your-app.vercel.app`

### Other Platforms

This is a static Next.js app that can be deployed to any platform that supports static hosting:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

## Tech Stack 🛠

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Local Storage (browser)
- **Deployment**: Vercel-ready

## Data Storage 💾

All data is stored locally in your browser's localStorage. This means:
- ✅ No server required
- ✅ Works offline
- ✅ Fast and private
- ❌ Data is not synced across devices
- ❌ Data is lost if you clear browser data

## Customization 🎨

### Colors
The sticky note colors can be customized in `tailwind.config.js`:

```javascript
colors: {
  sticky: {
    yellow: '#fef3c7',
    pink: '#fce7f3',
    blue: '#dbeafe',
    green: '#dcfce7',
    purple: '#f3e8ff',
  }
}
```

### Styling
All custom styles are in `app/globals.css` with Tailwind's `@layer` directive for easy customization.

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js and Tailwind CSS
