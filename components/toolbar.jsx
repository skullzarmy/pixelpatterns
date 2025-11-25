"use client";

import { useState, useRef } from "react";
import {
    Pen,
    Eraser,
    PaintBucket,
    Plus,
    Save,
    Upload,
    Download,
    Palette as PaletteIcon,
    ChevronUp,
    ChevronDown,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SavePalettePopover from "@/components/save-palette-dialog";

export default function Toolbar({
    tool,
    setTool,
    color,
    setColor,
    size,
    setSize,
    brushSize,
    setBrushSize,
    palette,
    setPalette,
    currentPaletteName,
    presets,
    savedPalettes,
    onLoadPalette,
    onSavePalette,
    onImportPalette,
    onExportPalette,
}) {
    const [customSize, setCustomSize] = useState(size);
    const [clearPaletteOpen, setClearPaletteOpen] = useState(false);
    const [removeColorOpen, setRemoveColorOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleAddColor = () => {
        if (!palette.includes(color)) {
            setPalette([...palette, color]);
        }
    };

    const handleClearPalette = () => {
        setPalette(["#000000"]);
        setColor("#000000");
        setClearPaletteOpen(false);
    };

    const handleRemoveSelectedColor = () => {
        const newPalette = palette.filter((c) => c !== color);
        setPalette(newPalette);
        setColor(newPalette[0]);
        setRemoveColorOpen(false);
    };

    const handleCustomSizeChange = (newSize) => {
        const clamped = Math.max(4, Math.min(64, newSize));
        setCustomSize(clamped);
        setSize(clamped);
    };

    const handleSizeIncrement = () => {
        handleCustomSizeChange(customSize + 1);
    };

    const handleSizeDecrement = () => {
        handleCustomSizeChange(customSize - 1);
    };

    return (
        <aside
            aria-label="Drawing tools and options"
            className="w-72 bg-card border-r border-border flex flex-col gap-5 p-6 overflow-y-auto"
        >
            {/* Tools */}
            <section>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tools</h2>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant={tool === "pen" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setTool("pen")}
                        aria-label="Pen tool (Keyboard shortcut: P)"
                        aria-pressed={tool === "pen"}
                        className="h-12 w-full"
                    >
                        <Pen className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant={tool === "eraser" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setTool("eraser")}
                        aria-label="Eraser tool (Keyboard shortcut: E)"
                        aria-pressed={tool === "eraser"}
                        className="h-12 w-full"
                    >
                        <Eraser className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    <Button
                        variant={tool === "fill" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setTool("fill")}
                        aria-label="Bucket fill tool (Keyboard shortcut: F)"
                        aria-pressed={tool === "fill"}
                        className="h-12 w-full"
                    >
                        <PaintBucket className="h-5 w-5" aria-hidden="true" />
                    </Button>
                </div>
            </section>

            {/* Brush Size */}
            <section>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Brush Size
                </h2>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((s) => (
                        <Button
                            key={s}
                            variant={brushSize === s ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBrushSize(s)}
                            aria-label={`${s} pixel brush`}
                            aria-pressed={brushSize === s}
                            className="flex-1"
                        >
                            {s}px
                        </Button>
                    ))}
                </div>
            </section>

            {/* Grid Size */}
            <section>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Canvas Size
                </h2>
                <div className="flex gap-2 mb-2">
                    {[8, 16, 32].map((s) => (
                        <Button
                            key={s}
                            variant={size === s ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                setSize(s);
                                setCustomSize(s);
                            }}
                            className="flex-1"
                        >
                            {s}×{s}
                        </Button>
                    ))}
                </div>
                <div className="flex gap-1">
                    <Input
                        type="number"
                        min="4"
                        max="64"
                        value={customSize}
                        onChange={(e) => handleCustomSizeChange(parseInt(e.target.value) || 4)}
                        aria-label="Custom canvas size (4-64 pixels)"
                        className="flex-1 h-9 text-center"
                    />
                    <div className="flex flex-col gap-0">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSizeIncrement}
                            aria-label="Increase canvas size"
                            className="h-[18px] w-8 rounded-b-none p-0"
                            disabled={customSize >= 64}
                        >
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSizeDecrement}
                            aria-label="Decrease canvas size"
                            className="h-[18px] w-8 rounded-t-none p-0 border-t-0"
                            disabled={customSize <= 4}
                        >
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </section>

            <hr className="border-t border-border" />

            {/* Color Palette */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Color Palette
                    </h2>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAddColor}
                            aria-label="Add current color to palette"
                            className="h-6 w-6"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Popover open={removeColorOpen} onOpenChange={setRemoveColorOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Remove selected color from palette"
                                    disabled={palette.length === 1}
                                    className="h-6 w-6"
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" side="bottom" align="end">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Remove Color?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Remove <span className="font-mono font-semibold">{color}</span> from the
                                            palette?
                                        </p>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" onClick={() => setRemoveColorOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleRemoveSelectedColor}>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Current Color Display */}
                <div className="flex gap-2 mb-3">
                    <button
                        type="button"
                        className="h-12 flex-1 rounded border-2 border-border cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                            const input = document.createElement("input");
                            input.type = "color";
                            input.value = color;
                            input.onchange = (e) => setColor(e.target.value);
                            input.click();
                        }}
                        title="Click to change color"
                    />
                    <div className="flex flex-col justify-center">
                        <span className="text-xs font-mono text-muted-foreground">{color.toUpperCase()}</span>
                    </div>
                </div>

                {/* Palette Grid */}
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                    {palette.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={`aspect-square w-full rounded border-2 ${
                                color === c
                                    ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                    : "border-border"
                            } transition-all hover:scale-105`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                            aria-label={`Select color ${c}`}
                            aria-pressed={color === c}
                        />
                    ))}
                </div>

                {/* Clear Palette Button */}
                <Popover open={clearPaletteOpen} onOpenChange={setClearPaletteOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full gap-2 mb-2">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Clear Palette</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" side="right" align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Clear Palette?</h4>
                                <p className="text-sm text-muted-foreground">
                                    This will reset the palette to a single black color. This cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => setClearPaletteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button size="sm" variant="destructive" onClick={handleClearPalette}>
                                    Clear Palette
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Preset Palettes */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                            <PaletteIcon className="h-4 w-4" />
                            <span className="truncate">Load Preset Colors</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                        <DropdownMenuLabel>Color Presets</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {presets.map((name) => (
                            <DropdownMenuItem key={name} onClick={() => onLoadPalette(name)}>
                                {name}
                            </DropdownMenuItem>
                        ))}
                        {savedPalettes.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Your Saved Palettes</DropdownMenuLabel>
                                {savedPalettes.map((name) => (
                                    <DropdownMenuItem
                                        key={name}
                                        onClick={() => onLoadPalette(name)}
                                        className="justify-between"
                                    >
                                        <span>{name}</span>
                                    </DropdownMenuItem>
                                ))}
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Palette Management */}
                <div className="flex gap-1">
                    <SavePalettePopover
                        onSave={onSavePalette}
                        currentName={currentPaletteName}
                        savedPalettes={savedPalettes}
                    >
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                            <Save className="h-3.5 w-3.5" />
                            <span>Save</span>
                        </Button>
                    </SavePalettePopover>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Import</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onExportPalette}>
                        <Download className="h-3.5 w-3.5" />
                        <span>Export</span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".json"
                        aria-label="Import palette JSON file"
                        onChange={(e) => {
                            if (e.target.files?.[0]) onImportPalette(e.target.files[0]);
                            e.target.value = null;
                        }}
                    />
                </div>
            </section>
        </aside>
    );
}
