import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Grid, Download } from 'lucide-react';
import PixelEditor from './components/PixelEditor';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import ExportModal from './components/ExportModal';

function App() {
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'grid'
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(16);
  const [brushSize, setBrushSize] = useState(1);
  
  const PALETTE_PRESETS = {
    'Default': ['#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'],
    'Grayscale': ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#f2f2f2', '#ffffff'],
    'Reds': ['#450a0a', '#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2', '#fff5f5'],
    'Greens': ['#052e16', '#064e3b', '#065f46', '#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5', '#f0fdf4'],
    'Blues': ['#172554', '#1e3a8a', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#f0f9ff'],
    'Yellows': ['#422006', '#713f12', '#854d0e', '#a16207', '#ca8a04', '#d97706', '#ea580c', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    'Winter': ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc', '#0ea5e9', '#38bdf8'],
    'Spring': ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#a3e635', '#84cc16'],
    'Summer': ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#fb923c', '#f97316', '#ea580c', '#c2410c'],
    'Fall': ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7', '#fffbeb', '#7f1d1d', '#991b1b'],
  };

  const [palette, setPalette] = useState(PALETTE_PRESETS['Default']);
  const [savedPalettes, setSavedPalettes] = useState(() => {
    try {
      const saved = localStorage.getItem('pixelTile_savedPalettes');
      return (saved ? JSON.parse(saved) : {}) || {};
    } catch (e) {
      console.error('Failed to load palettes', e);
      return {};
    }
  });
  const [currentPaletteName, setCurrentPaletteName] = useState('Default');

  useEffect(() => {
    localStorage.setItem('pixelTile_savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const handleLoadPalette = (name) => {
    if (PALETTE_PRESETS[name]) {
      setPalette(PALETTE_PRESETS[name]);
      setCurrentPaletteName(name);
    } else if (savedPalettes[name]) {
      setPalette(savedPalettes[name]);
      setCurrentPaletteName(name);
    }
  };

  const handleSavePalette = (name) => {
    if (!name) return;
    setSavedPalettes(prev => ({
      ...prev,
      [name]: palette
    }));
    setCurrentPaletteName(name);
  };

  const handleDeletePalette = (name) => {
    setSavedPalettes(prev => {
      const newSaved = { ...prev };
      delete newSaved[name];
      return newSaved;
    });
    if (currentPaletteName === name) {
        setPalette(PALETTE_PRESETS['Default']);
        setCurrentPaletteName('Default');
    }
  };

  const handleImportPalette = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const imported = JSON.parse(e.target.result);
              if (imported.name && Array.isArray(imported.colors)) {
                  setSavedPalettes(prev => ({
                      ...prev,
                      [imported.name]: imported.colors
                  }));
                  setPalette(imported.colors);
                  setCurrentPaletteName(imported.name);
              } else {
                  alert('Invalid palette file format');
              }
          } catch (err) {
              console.error('Failed to import palette', err);
              alert('Failed to import palette');
          }
      };
      reader.readAsText(file);
  };

  const handleExportPalette = () => {
      const data = {
          name: currentPaletteName,
          colors: palette
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentPaletteName}_palette.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  
  const [imageData, setImageData] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const pixelEditorRef = useRef(null);

  const handleUndo = () => {
    if (pixelEditorRef.current) {
      pixelEditorRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (pixelEditorRef.current) {
      pixelEditorRef.current.redo();
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>PixelTile</h1>
        </div>
        <div className="controls">
          <button 
            className={`control-btn ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => setViewMode('single')}
            title="Single Tile"
          >
            <Maximize size={18} />
          </button>
          <button 
            className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Tiling Grid"
          >
            <Grid size={18} />
          </button>
          <div className="divider"></div>
          <button className="action-btn primary" onClick={() => setIsExportModalOpen(true)}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </header>
      
      <main className="main-content">
        <Toolbar 
            tool={tool} 
            setTool={setTool} 
            color={color} 
            setColor={setColor} 
            size={size} 
            setSize={setSize}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            palette={palette}
            setPalette={setPalette}
            onUndo={handleUndo}
            onRedo={handleRedo}
            presets={Object.keys(PALETTE_PRESETS)}
            savedPalettes={Object.keys(savedPalettes)}
            currentPaletteName={currentPaletteName}
            onLoadPalette={handleLoadPalette}
            onSavePalette={handleSavePalette}
            onDeletePalette={handleDeletePalette}
            onImportPalette={handleImportPalette}
            onExportPalette={handleExportPalette}
        />
        <div className="editor-pane">
          <PixelEditor 
            ref={pixelEditorRef}
            size={size} 
            color={color} 
            tool={tool} 
            brushSize={brushSize}
            onUpdate={setImageData} 
          />
        </div>
        <div className="preview-pane">
          <Preview imageData={imageData} mode={viewMode} />
        </div>
      </main>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        imageData={imageData}
      />

      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg-primary);
        }

        .header {
          height: 60px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: var(--bg-secondary);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, var(--accent), #f43f5e);
          border-radius: 6px;
        }

        .logo h1 {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: transparent;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .control-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .control-btn.active {
          background: var(--bg-tertiary);
          color: var(--accent);
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--border);
          margin: 0 8px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          height: 36px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .action-btn:hover {
            background: var(--border);
        }

        .action-btn.primary {
          background: var(--accent);
          color: white;
        }

        .action-btn.primary:hover {
          background: var(--accent-hover);
        }

        .main-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .editor-pane {
          flex: 1;
          background: #18181b;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--border);
        }

        .preview-pane {
          flex: 1;
          background: #27272a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
      `}</style>
    </div>
  );
}

export default App;
