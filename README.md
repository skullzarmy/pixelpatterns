# PixelPatterns

PixelPatterns is a free online pixel art editor designed for creating seamless tiling patterns. It provides intuitive tools, color palettes, and export options to help you design pixel art tiles with ease.

## Features

- **Seamless Pattern Editing**: Visualize your pattern in real-time with a 2x2 grid preview.
- **Intuitive Tools**: Pen, Eraser, Fill Bucket, and Color Picker.
- **Customizable Grid**: Adjustable canvas size (e.g., 16x16, 32x32).
- **Color Palettes**: Built-in presets (Default, Grayscale, Reds, Greens, Blues, etc.) and support for custom palettes.
- **Import/Export**:
    - Export as single tile or 2x2 pattern.
    - Export at multiple scales (1x, 10x, 20x).
    - Import and export custom palettes.
- **Theme Support**: Light, Dark, and System themes.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`
- **Zip Generation**: `jszip`
- **File Saving**: `file-saver`

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/skullzarmy/pixelpatterns.git
   cd pixelpatterns
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [FAFO Lab](https://fafolab.xyz).
