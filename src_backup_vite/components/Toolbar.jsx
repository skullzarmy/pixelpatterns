import React, { useState, useRef } from 'react';
import { Pen, Eraser, PaintBucket, Undo, Redo, Plus, Trash2, Save, Upload, Download, ChevronDown, Check } from 'lucide-react';

const Toolbar = ({ 
    tool, setTool, 
    color, setColor, 
    size, setSize,
    brushSize, setBrushSize,
    palette, setPalette,
    onUndo, onRedo,
    presets, savedPalettes, currentPaletteName,
    onLoadPalette, onSavePalette, onDeletePalette,
    onImportPalette, onExportPalette
}) => {
  const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [isSaveMode, setIsSaveMode] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddColor = () => {
    if (!palette.includes(color)) {
      setPalette([...palette, color]);
    }
  };

  const handleRemoveColor = (e, colorToRemove) => {
    e.preventDefault();
    setPalette(palette.filter(c => c !== colorToRemove));
  };

  const handleSaveSubmit = (e) => {
      e.preventDefault();
      if (newPaletteName.trim()) {
          onSavePalette(newPaletteName.trim());
          setNewPaletteName('');
          setIsSaveMode(false);
      }
  };

  return (
    <div className="toolbar">
      <div className="tool-section">
        <h3>Tools</h3>
        <div className="tool-grid">
          <button 
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Pen (P)"
          >
            <Pen size={20} />
          </button>
          <button 
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser (E)"
          >
            <Eraser size={20} />
          </button>
          <button 
            className={`tool-btn ${tool === 'fill' ? 'active' : ''}`}
            onClick={() => setTool('fill')}
            title="Bucket Fill (F)"
          >
            <PaintBucket size={20} />
          </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>History</h3>
        <div className="tool-grid">
            <button className="tool-btn" onClick={onUndo} title="Undo (Cmd+Z)">
                <Undo size={20} />
            </button>
            <button className="tool-btn" onClick={onRedo} title="Redo (Cmd+Shift+Z)">
                <Redo size={20} />
            </button>
        </div>
      </div>

      <div className="tool-section">
        <h3>Brush Size</h3>
        <div className="size-selector">
            {[1, 2, 3].map(s => (
                <button
                    key={s}
                    className={`size-btn ${brushSize === s ? 'active' : ''}`}
                    onClick={() => setBrushSize(s)}
                >
                    {s}x
                </button>
            ))}
        </div>
      </div>

      <div className="tool-section">
        <h3>Palette</h3>
        
        <div className="palette-dropdown">
            <button 
                className="dropdown-trigger"
                onClick={() => setIsPaletteMenuOpen(!isPaletteMenuOpen)}
            >
                <span>{currentPaletteName}</span>
                <ChevronDown size={14} />
            </button>
            
            {isPaletteMenuOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-group">
                        <h4>Presets</h4>
                        {presets.map(name => (
                            <button 
                                key={name} 
                                className={`dropdown-item ${currentPaletteName === name ? 'active' : ''}`}
                                onClick={() => {
                                    onLoadPalette(name);
                                    setIsPaletteMenuOpen(false);
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    {savedPalettes.length > 0 && (
                        <div className="dropdown-group">
                            <h4>Saved</h4>
                            {savedPalettes.map(name => (
                                <div key={name} className="saved-item-row">
                                    <button 
                                        className={`dropdown-item ${currentPaletteName === name ? 'active' : ''}`}
                                        onClick={() => {
                                            onLoadPalette(name);
                                            setIsPaletteMenuOpen(false);
                                        }}
                                    >
                                        {name}
                                    </button>
                                    <button 
                                        className="delete-palette-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeletePalette(name);
                                        }}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
        
        
        <div className="palette-actions">
            <button className="icon-btn" onClick={() => setIsSaveMode(!isSaveMode)} title="Save Palette">
                <Save size={12} />
            </button>
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="Import Palette">
                <Upload size={12} />
            </button>
            <button className="icon-btn" onClick={onExportPalette} title="Export Palette">
                <Download size={12} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".json" 
                onChange={(e) => {
                    if (e.target.files?.[0]) onImportPalette(e.target.files[0]);
                    e.target.value = null;
                }}
            />
        </div>

        {isSaveMode && (
            <form className="save-form" onSubmit={handleSaveSubmit}>
                <input 
                    type="text" 
                    placeholder="Palette Name" 
                    value={newPaletteName}
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    autoFocus
                />
                <button type="submit"><Check size={14} /></button>
            </form>
        )}

        <div className="color-picker-row">
            <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
            />
            <button className="add-color-btn" onClick={handleAddColor} title="Add current color">
                <Plus size={16} />
            </button>
        </div>

        <div className="palette-grid">
          {palette.map((c, i) => (
            <button
              key={i}
              className={`palette-color ${color === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => handleRemoveColor(e, c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="tool-section">
        <h3>Grid Size</h3>
        <div className="size-selector">
          {[8, 16, 32].map((s) => (
            <button
              key={s}
              className={`size-btn ${size === s ? 'active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .toolbar {
          width: 260px;
          background: #18181b;
          border-right: 1px solid #27272a;
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 24px;
          overflow-y: auto;
        }

        .tool-section h3 {
          color: #a1a1aa;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .tool-btn {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #27272a;
          border: 1px solid transparent;
          border-radius: 8px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-btn:hover {
          background: #3f3f46;
          color: #fff;
        }

        .tool-btn.active {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }

        .section-header {
            display: flex;

        .palette-dropdown {
            position: relative;
            width: 100%;
            margin-bottom: 8px;
        }

        .dropdown-trigger {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 10px;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 6px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #18181b;
            border: 1px solid #3f3f46;
            border-radius: 6px;
            margin-top: 4px;
            z-index: 100;
            max-height: 200px;
            overflow-y: auto;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }

        .dropdown-group h4 {
            padding: 8px 12px 4px;
            margin: 0;
            font-size: 10px;
            color: #71717a;
            text-transform: uppercase;
        }

        .dropdown-item {
            width: 100%;
            text-align: left;
            padding: 6px 12px;
            background: none;
            border: none;
            color: #d4d4d8;
            font-size: 12px;
            cursor: pointer;
        }

        .dropdown-item:hover {
            background: #27272a;
            color: #fff;
        }

        .dropdown-item.active {
            color: var(--accent);
        }

        .saved-item-row {
            display: flex;
            align-items: center;
        }

        .delete-palette-btn {
            background: none;
            border: none;
            color: #71717a;
            padding: 6px;
            cursor: pointer;
        }

        .delete-palette-btn:hover {
            color: #ef4444;
        }

        .palette-actions {
            display: flex;
            justify-content: flex-start;
            gap: 4px;
            margin-bottom: 12px;
        }

        .icon-btn {
            width: 24px !important;
            height: 24px !important;
            padding: 4px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: #27272a !important;
            border: 1px solid #3f3f46 !important;
            border-radius: 4px !important;
            color: #a1a1aa !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .icon-btn:hover {
            background: #3f3f46 !important;
            color: #fff !important;
            border-color: #52525b !important;
        }

        .save-form {
            display: flex;
            gap: 4px;
            margin-bottom: 12px;
        }

        .save-form input {
            flex: 1;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 4px;
            padding: 4px 8px;
            color: #fff;
            font-size: 12px;
        }

        .save-form button {
            background: var(--accent);
            border: none;
            border-radius: 4px;
            color: #fff;
            padding: 0 8px;
            cursor: pointer;
        }

        .color-picker-row {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            height: 32px;
        }

        .color-input {
            flex: 1;
            height: 100%;
            padding: 0;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            background: transparent;
        }

        .add-color-btn {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 6px;
            color: #a1a1aa;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .add-color-btn:hover {
            background: #3f3f46;
            color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Toolbar;
