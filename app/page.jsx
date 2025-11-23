'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize, Grid, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Toolbar from '@/components/toolbar';
import PixelEditor from '@/components/pixel-editor';
import Preview from '@/components/preview';
import ExportModal from '@/components/export-modal';
import PromoPopup from '@/components/promo-popup';
import { SupportDialog } from '@/components/support-dialog';

import { ThemeToggle } from '@/components/theme-toggle';

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

export default function Home() {
  const [viewMode, setViewMode] = useState('single');
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(16);
  const [brushSize, setBrushSize] = useState(1);

  const [palette, setPalette] = useState(PALETTE_PRESETS['Default']);
  const [savedPalettes, setSavedPalettes] = useState({});
  const [currentPaletteName, setCurrentPaletteName] = useState('Default');

  // Load saved palettes after mount to avoid hydration issues
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pixelPatterns_savedPalettes');
      if (saved) {
        setSavedPalettes(JSON.parse(saved) || {});
      }
    } catch (e) {
      console.error('Failed to load palettes', e);
    }
  }, []);

  const [imageData, setImageData] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

  const pixelEditorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixelPatterns_savedPalettes', JSON.stringify(savedPalettes));
    }
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

  const currentYear = new Date().getFullYear();
  const yearDisplay = currentYear > 2025 ? `2025-${currentYear}` : '2025';

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-50">
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-5 bg-zinc-900">
        <div className="flex items-center gap-3">
          <img src="/icon0.svg" alt="PixelPatterns" className="w-6 h-6" />
          <h1 className="text-lg font-semibold tracking-tight">PixelPatterns</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'single' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('single')}
            className="h-9 w-9"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-9 w-9"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <div className="w-px h-6 bg-zinc-700 mx-2"></div>
          <Button onClick={() => setIsExportModalOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
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

        <div className="flex-1 bg-zinc-950 flex items-center justify-center border-r border-zinc-800">
          <PixelEditor
            ref={pixelEditorRef}
            size={size}
            color={color}
            tool={tool}
            brushSize={brushSize}
            onUpdate={setImageData}
          />
        </div>

        <div className="flex-1 bg-zinc-900 flex items-center justify-center">
          <Preview imageData={imageData} mode={viewMode} />
        </div>
      </main>

      <footer className="h-10 border-t border-zinc-800 flex items-center justify-between px-5 bg-zinc-900 text-xs text-zinc-500">
        <p>
          © {yearDisplay} PixelPatterns. All rights reserved. a{' '}
          <a 
            href="https://fafolab.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            FAFO <span className="line-through">lab</span>
          </a>{' '}
          joint.
        </p>
        <a
          href="https://github.com/skullzarmy/pixelpatterns"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-400 transition-colors"
        >
          This project is open-source on GitHub
        </a>
      </footer>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        imageData={imageData}
        onExportComplete={() => setIsSupportDialogOpen(true)}
      />

      <SupportDialog 
        isOpen={isSupportDialogOpen} 
        onClose={() => setIsSupportDialogOpen(false)} 
      />

      <PromoPopup />
    </div>
  );
}
