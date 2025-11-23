import React, { useState, useEffect } from 'react';
import { X, Download, Image as ImageIcon, Grid, Package, Layers } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ExportModal = ({ isOpen, onClose, imageData }) => {
  const [type, setType] = useState('tile'); // 'tile', 'pattern', 'full'
  const [scale, setScale] = useState(20); // 1, 10, 20, 'all'
  const [imageObj, setImageObj] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (imageData) {
      const img = new Image();
      img.onload = () => setImageObj(img);
      img.src = imageData;
    }
  }, [imageData]);

  if (!isOpen) return null;

  const generateCanvas = (img, s, t) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const baseW = img.width;
    const baseH = img.height;
    
    const cols = t === 'pattern' ? 3 : 1;
    const rows = t === 'pattern' ? 3 : 1;

    const finalW = baseW * s * cols;
    const finalH = baseH * s * rows;

    canvas.width = finalW;
    canvas.height = finalH;
    ctx.imageSmoothingEnabled = false;

    const tileW = baseW * s;
    const tileH = baseH * s;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        ctx.drawImage(img, i * tileW, j * tileH, tileW, tileH);
      }
    }
    return canvas;
  };

  const handleDownload = async () => {
    if (!imageObj) return;
    setIsProcessing(true);

    try {
        if (type === 'full' || scale === 'all') {
            const zip = new JSZip();
            const tasks = [];
            
            const typesToExport = type === 'full' ? ['tile', 'pattern'] : [type];
            const scalesToExport = scale === 'all' ? [1, 10, 20] : [scale];
            
            typesToExport.forEach(t => {
                scalesToExport.forEach(s => {
                    const canvas = generateCanvas(imageObj, s, t);
                    const filename = `pixeltile_${t}_${s}x.png`;
                    tasks.push(new Promise(resolve => {
                        canvas.toBlob(blob => {
                            zip.file(filename, blob);
                            resolve();
                        });
                    }));
                });
            });
            
            await Promise.all(tasks);
            const content = await zip.generateAsync({type: "blob"});
            saveAs(content, "pixeltile_export.zip");
        } else {
            const canvas = generateCanvas(imageObj, scale, type);
            const link = document.createElement('a');
            link.download = `pixeltile_${type}_${scale}x.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        onClose();
    } catch (error) {
        console.error("Export failed:", error);
        alert("Export failed. See console for details.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export Artwork</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <div className="option-group">
            <label>Export Type</label>
            <div className="toggle-group">
              <button 
                className={`toggle-btn ${type === 'tile' ? 'active' : ''}`}
                onClick={() => setType('tile')}
              >
                <ImageIcon size={16} />
                <span>Single Tile</span>
              </button>
              <button 
                className={`toggle-btn ${type === 'pattern' ? 'active' : ''}`}
                onClick={() => setType('pattern')}
              >
                <Grid size={16} />
                <span>3x3 Pattern</span>
              </button>
              <button 
                className={`toggle-btn ${type === 'full' ? 'active' : ''}`}
                onClick={() => setType('full')}
              >
                <Package size={16} />
                <span>Full Pack</span>
              </button>
            </div>
          </div>

          <div className="option-group">
            <label>Resolution / Scale</label>
            <div className="scale-options">
              <button 
                className={`scale-btn ${scale === 1 ? 'active' : ''}`}
                onClick={() => setScale(1)}
              >
                <span className="scale-val">1x</span>
                <span className="scale-desc">Raw</span>
              </button>
              <button 
                className={`scale-btn ${scale === 10 ? 'active' : ''}`}
                onClick={() => setScale(10)}
              >
                <span className="scale-val">10x</span>
                <span className="scale-desc">Large</span>
              </button>
              <button 
                className={`scale-btn ${scale === 20 ? 'active' : ''}`}
                onClick={() => setScale(20)}
              >
                <span className="scale-val">20x</span>
                <span className="scale-desc">High Res</span>
              </button>
              <button 
                className={`scale-btn ${scale === 'all' ? 'active' : ''}`}
                onClick={() => setScale('all')}
              >
                <span className="scale-val">All</span>
                <span className="scale-desc">Zip Bundle</span>
              </button>
            </div>
          </div>
          
          <div className="preview-info">
             {type === 'full' || scale === 'all' ? (
                 <p>Generates a <strong>ZIP archive</strong> containing multiple files.</p>
             ) : (
                 <p>Output Size: <strong>{imageObj ? imageObj.width * scale * (type === 'pattern' ? 3 : 1) : 0} x {imageObj ? imageObj.height * scale * (type === 'pattern' ? 3 : 1) : 0} px</strong></p>
             )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="download-btn" onClick={handleDownload} disabled={isProcessing}>
            <Download size={18} />
            {isProcessing ? 'Processing...' : (type === 'full' || scale === 'all' ? 'Download ZIP' : 'Download PNG')}
          </button>
        </div>
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 12px;
          width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        
        .close-btn:hover {
          background: #27272a;
          color: #fff;
        }
        
        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .option-group label {
          display: block;
          color: #a1a1aa;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .toggle-group {
          display: flex;
          background: #27272a;
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }
        
        .toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border: none;
          background: transparent;
          color: #a1a1aa;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }
        
        .toggle-btn.active {
          background: #3f3f46;
          color: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .scale-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        
        .scale-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: #27272a;
          border: 1px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .scale-btn:hover {
          border-color: #52525b;
        }
        
        .scale-btn.active {
          background: #3f3f46;
          border-color: var(--accent);
          color: #fff;
        }
        
        .scale-val {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
        
        .scale-desc {
          font-size: 10px;
          color: #a1a1aa;
          margin-top: 2px;
        }
        
        .preview-info {
            text-align: center;
            font-size: 13px;
            color: #71717a;
            padding-top: 8px;
            border-top: 1px solid #27272a;
        }
        
        .preview-info strong {
            color: #d4d4d8;
        }
        
        .modal-footer {
          padding: 16px 20px;
          background: #27272a;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .cancel-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid transparent;
          color: #a1a1aa;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
        }
        
        .cancel-btn:hover {
          color: #fff;
        }
        
        .download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: var(--accent);
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s;
        }
        
        .download-btn:hover {
          background: var(--accent-hover);
        }
        
        .download-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ExportModal;
