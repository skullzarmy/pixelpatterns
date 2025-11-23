'use client';

import { useRef, useEffect } from 'react';

export default function Preview({ imageData, mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'single') {
        // Single tile - center it
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      } else {
        // Grid mode - tile it
        ctx.imageSmoothingEnabled = false;
        const tileWidth = canvas.width / 4;
        const tileHeight = canvas.height / 4;
        
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            ctx.drawImage(img, i * tileWidth, j * tileHeight, tileWidth, tileHeight);
          }
        }
      }
    };
  }, [imageData, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="max-w-[600px] max-h-[600px]"
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated'
      }}
    />
  );
}
