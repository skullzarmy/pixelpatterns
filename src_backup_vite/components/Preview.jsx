import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

const Preview = forwardRef(({ imageData, mode = 'single' }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);

  // Ref is no longer used for exports, but kept for compatibility if needed later
  useImperativeHandle(ref, () => ({}));

  // Load image when data changes
  useEffect(() => {
      if (imageData) {
          const img = new Image();
          img.onload = () => {
              setImageObj(img);
          };
          img.src = imageData;
      } else {
          setImageObj(null);
      }
  }, [imageData]);

  // Draw loop
  useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      
      // Handle resizing
      const resize = () => {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          draw();
      };
      
      window.addEventListener('resize', resize);
      resize(); // Initial size

      function draw() {
          if (!ctx || !canvas) return;
          
          const w = canvas.width;
          const h = canvas.height;
          
          // Background
          ctx.fillStyle = '#27272a';
          ctx.fillRect(0, 0, w, h);
          
          if (imageObj) {
              ctx.imageSmoothingEnabled = false;
              
              if (mode === 'single') {
                  // Scale up
                  const targetSize = 200;
                  const scale = imageObj.width > 0 ? Math.floor(targetSize / imageObj.width) : 10;
                  const dw = imageObj.width * scale;
                  const dh = imageObj.height * scale;
                  
                  const dx = (w - dw) / 2;
                  const dy = (h - dh) / 2;
                  
                  // Checkerboard background for transparency
                  ctx.fillStyle = '#333';
                  ctx.fillRect(dx, dy, dw, dh);

                  ctx.drawImage(imageObj, dx, dy, dw, dh);
                  
                  // Border
                  ctx.strokeStyle = '#666';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(dx, dy, dw, dh);
                  
              } else {
                  // Tiling
                  const tileScale = imageObj.width > 0 ? Math.max(1, Math.floor(100 / imageObj.width)) : 1;
                  const tw = imageObj.width * tileScale;
                  const th = imageObj.height * tileScale;
                  
                  const cols = Math.ceil(w / tw) + 1;
                  const rows = Math.ceil(h / th) + 1;
                  
                  for(let i=0; i<cols; i++) {
                      for(let j=0; j<rows; j++) {
                          ctx.drawImage(imageObj, i * tw, j * th, tw, th);
                      }
                  }
              }
          }
      }

      // Draw whenever image or mode changes
      draw();

      return () => {
          window.removeEventListener('resize', resize);
      };
  }, [imageObj, mode]);

  return (
    <div 
        ref={containerRef} 
        style={{ 
            width: '100%', 
            height: '100%', 
            overflow: 'hidden',
            position: 'relative'
        }}
    >
        <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
});

export default Preview;
