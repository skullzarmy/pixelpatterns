'use client';

import React, { useState, useRef } from 'react';
import { Pen, Eraser, PaintBucket, Undo, Redo, Plus, Trash2, Save, Upload, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export default function Toolbar({
  tool, setTool,
  color, setColor,
  size, setSize,
  brushSize, setBrushSize,
  palette, setPalette,
  onUndo, onRedo,
  presets, savedPalettes, currentPaletteName,
  onLoadPalette, onSavePalette, onDeletePalette,
  onImportPalette, onExportPalette
}) {
  const [isSaveMode, setIsSaveMode] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
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
    <aside className="w-64 bg-card border-r border-border flex flex-col gap-6 p-5 overflow-y-auto">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tools</h3>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('pen')}
            title="Pen (P)"
            className="h-10 w-full"
          >
            <Pen className="h-5 w-5" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('eraser')}
            title="Eraser (E)"
            className="h-10 w-full"
          >
            <Eraser className="h-5 w-5" />
          </Button>
          <Button
            variant={tool === 'fill' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTool('fill')}
            title="Bucket Fill (F)"
            className="h-10 w-full"
          >
            <PaintBucket className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onUndo} title="Undo (Cmd+Z)" className="flex-1">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onRedo} title="Redo (Cmd+Shift+Z)" className="flex-1">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Brush Size</h3>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <Button
              key={s}
              variant={brushSize === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBrushSize(s)}
              className="flex-1"
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Palette</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start mb-2">
              <span className="truncate">{currentPaletteName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Presets</DropdownMenuLabel>
            {presets.map(name => (
              <DropdownMenuItem
                key={name}
                onClick={() => onLoadPalette(name)}
                className={currentPaletteName === name ? 'bg-accent' : ''}
              >
                {name}
              </DropdownMenuItem>
            ))}
            {savedPalettes.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Saved</DropdownMenuLabel>
                {savedPalettes.map(name => (
                  <DropdownMenuItem
                    key={name}
                    onClick={() => onLoadPalette(name)}
                    className={`justify-between ${currentPaletteName === name ? 'bg-accent' : ''}`}
                  >
                    <span>{name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePalette(name);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-1 mb-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsSaveMode(!isSaveMode)} title="Save Palette">
            <Save className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()} title="Import Palette">
            <Upload className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={onExportPalette} title="Export Palette">
            <Download className="h-3 w-3" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={(e) => {
              if (e.target.files?.[0]) onImportPalette(e.target.files[0]);
              e.target.value = null;
            }}
          />
        </div>

        {isSaveMode && (
          <form onSubmit={handleSaveSubmit} className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Palette Name"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              autoFocus
              className="flex-1 h-8"
            />
            <Button type="submit" size="icon" className="h-8 w-8">
              <Check className="h-3 w-3" />
            </Button>
          </form>
        )}

        <div className="flex gap-2 mb-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 h-8 rounded cursor-pointer bg-transparent"
          />
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleAddColor} title="Add current color">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-6 gap-1">
          {palette.map((c, i) => (
            <button
              key={i}
              className={`aspect-square rounded border-2 ${color === c ? 'border-foreground' : 'border-transparent'} transition-all hover:scale-110`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => handleRemoveColor(e, c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Grid Size</h3>
        <div className="flex gap-2">
          {[8, 16, 32].map((s) => (
            <Button
              key={s}
              variant={size === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSize(s)}
              className="flex-1"
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
