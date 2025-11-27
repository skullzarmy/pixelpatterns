"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Download, Trash2, FolderOpen, Save, Undo, Redo, Menu, Settings2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toolbar from "@/components/toolbar";
import PixelEditor from "@/components/pixel-editor";
import Preview from "@/components/preview";
import ExportModal from "@/components/export-modal";
import SaveDialog from "@/components/save-dialog";
import PromoPopup from "@/components/promo-popup";
import PenrosePopup from "@/components/penrose-popup";
import { SupportDialog } from "@/components/support-dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ThemeToggle } from "@/components/theme-toggle";

const PALETTE_PRESETS = {
    Default: [
        "#000000",
        "#ffffff",
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#84cc16",
        "#10b981",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#d946ef",
        "#f43f5e",
    ],
    Grayscale: [
        "#000000",
        "#1a1a1a",
        "#333333",
        "#4d4d4d",
        "#666666",
        "#808080",
        "#999999",
        "#b3b3b3",
        "#cccccc",
        "#e6e6e6",
        "#f2f2f2",
        "#ffffff",
    ],
    Reds: [
        "#450a0a",
        "#7f1d1d",
        "#991b1b",
        "#b91c1c",
        "#dc2626",
        "#ef4444",
        "#f87171",
        "#fca5a5",
        "#fecaca",
        "#fee2e2",
        "#fef2f2",
        "#fff5f5",
    ],
    Greens: [
        "#052e16",
        "#064e3b",
        "#065f46",
        "#047857",
        "#059669",
        "#10b981",
        "#34d399",
        "#6ee7b7",
        "#a7f3d0",
        "#d1fae5",
        "#ecfdf5",
        "#f0fdf4",
    ],
    Blues: [
        "#172554",
        "#1e3a8a",
        "#1e40af",
        "#1d4ed8",
        "#2563eb",
        "#3b82f6",
        "#60a5fa",
        "#93c5fd",
        "#bfdbfe",
        "#dbeafe",
        "#eff6ff",
        "#f0f9ff",
    ],
    Yellows: [
        "#422006",
        "#713f12",
        "#854d0e",
        "#a16207",
        "#ca8a04",
        "#d97706",
        "#ea580c",
        "#f59e0b",
        "#fbbf24",
        "#fcd34d",
        "#fde68a",
        "#fef3c7",
    ],
    Winter: [
        "#0f172a",
        "#1e293b",
        "#334155",
        "#475569",
        "#64748b",
        "#94a3b8",
        "#cbd5e1",
        "#e2e8f0",
        "#f1f5f9",
        "#f8fafc",
        "#0ea5e9",
        "#38bdf8",
    ],
    Spring: [
        "#f0fdf4",
        "#dcfce7",
        "#bbf7d0",
        "#86efac",
        "#4ade80",
        "#22c55e",
        "#16a34a",
        "#15803d",
        "#166534",
        "#14532d",
        "#a3e635",
        "#84cc16",
    ],
    Summer: [
        "#fefce8",
        "#fef9c3",
        "#fef08a",
        "#fde047",
        "#facc15",
        "#eab308",
        "#ca8a04",
        "#a16207",
        "#fb923c",
        "#f97316",
        "#ea580c",
        "#c2410c",
    ],
    Fall: [
        "#451a03",
        "#78350f",
        "#92400e",
        "#b45309",
        "#d97706",
        "#f59e0b",
        "#fbbf24",
        "#fcd34d",
        "#fef3c7",
        "#fffbeb",
        "#7f1d1d",
        "#991b1b",
    ],
};

export default function Home() {
    const [tool, setTool] = useState("pen");
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(16);
    const [brushSize, setBrushSize] = useState(1);

    const [palette, setPalette] = useState(PALETTE_PRESETS["Default"]);
    const [savedPalettes, setSavedPalettes] = useState({});
    const [currentPaletteName, setCurrentPaletteName] = useState("Custom Palette");

    // Mobile specific state
    const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview'

    // Load saved palettes after mount to avoid hydration issues
    useEffect(() => {
        try {
            const saved = localStorage.getItem("pixelPatterns_savedPalettes");
            if (saved) {
                setSavedPalettes(JSON.parse(saved) || {});
            }
        } catch (e) {
            console.error("Failed to load palettes", e);
        }
    }, []);

    const [imageData, setImageData] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    const pixelEditorRef = useRef(null);
    const loadFileInputRef = useRef(null);

    // Keyboard shortcuts for tool selection
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts if user is typing in an input
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            switch (e.key.toLowerCase()) {
                case "p":
                    setTool("pen");
                    break;
                case "e":
                    setTool("eraser");
                    break;
                case "f":
                    setTool("fill");
                    break;
                case "1":
                    setBrushSize(1);
                    break;
                case "2":
                    setBrushSize(2);
                    break;
                case "3":
                    setBrushSize(3);
                    break;
                case "4":
                    setBrushSize(4);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("pixelPatterns_savedPalettes", JSON.stringify(savedPalettes));
        }
    }, [savedPalettes]);

    const handleLoadPalette = (name) => {
        if (PALETTE_PRESETS[name]) {
            // Add preset colors to current palette (don't replace)
            const presetColors = PALETTE_PRESETS[name];
            const uniqueColors = [...new Set([...palette, ...presetColors])];
            setPalette(uniqueColors);
            setCurrentPaletteName(`${name} (Modified)`);
        } else if (savedPalettes[name]) {
            // Add saved palette colors to current palette
            const savedColors = savedPalettes[name];
            const uniqueColors = [...new Set([...palette, ...savedColors])];
            setPalette(uniqueColors);
            setCurrentPaletteName(name);
        }
    };

    const handleSavePalette = (name) => {
        if (!name) return;
        setSavedPalettes((prev) => ({
            ...prev,
            [name]: palette,
        }));
        setCurrentPaletteName(name);
    };

    const handleImportPalette = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.name && Array.isArray(imported.colors)) {
                    setSavedPalettes((prev) => ({
                        ...prev,
                        [imported.name]: imported.colors,
                    }));
                    // Add imported colors to current palette
                    const uniqueColors = [...new Set([...palette, ...imported.colors])];
                    setPalette(uniqueColors);
                    setCurrentPaletteName(imported.name);
                } else {
                    alert("Invalid palette file format");
                }
            } catch (err) {
                console.error("Failed to import palette", err);
                alert("Failed to import palette");
            }
        };
        reader.readAsText(file);
    };

    const handleExportPalette = () => {
        const data = {
            name: currentPaletteName,
            colors: palette,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const safeName = currentPaletteName.replace(/[^a-z0-9]/gi, "-").toLowerCase();
        link.download = `${safeName}_palette.json`;
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

    const handleClearCanvas = () => {
        if (pixelEditorRef.current) {
            pixelEditorRef.current.clear();
            setIsClearDialogOpen(false);
        }
    };

    const handleSaveProject = (filename) => {
        if (!pixelEditorRef.current) return;

        const projectData = {
            version: "1.0",
            canvas: {
                size: size,
                pixels: pixelEditorRef.current.getPixels(),
            },
            settings: {
                tool: tool,
                color: color,
                brushSize: brushSize,
            },
            palette: palette,
            timestamp: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.fafo`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleLoadProject = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const projectData = JSON.parse(e.target.result);

                if (!projectData.version || !projectData.canvas) {
                    alert("Invalid project file format");
                    return;
                }

                // Load canvas size first
                if (projectData.canvas.size) {
                    setSize(projectData.canvas.size);
                }

                // Wait for size to update, then load pixels
                setTimeout(() => {
                    if (pixelEditorRef.current && projectData.canvas.pixels) {
                        pixelEditorRef.current.loadPixels(projectData.canvas.pixels);
                    }
                }, 100);

                // Load settings
                if (projectData.settings) {
                    if (projectData.settings.tool) setTool(projectData.settings.tool);
                    if (projectData.settings.color) setColor(projectData.settings.color);
                    if (projectData.settings.brushSize) setBrushSize(projectData.settings.brushSize);
                }

                // Load palette
                if (projectData.palette && Array.isArray(projectData.palette)) {
                    setPalette(projectData.palette);
                }
            } catch (err) {
                console.error("Failed to load project", err);
                alert("Failed to load project file");
            }
        };
        reader.readAsText(file);
    };

    const currentYear = new Date().getFullYear();
    const yearDisplay = currentYear > 2025 ? `2025-${currentYear}` : "2025";

    const toolbarProps = {
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
        presets: Object.keys(PALETTE_PRESETS),
        savedPalettes: Object.keys(savedPalettes),
        onLoadPalette: handleLoadPalette,
        onSavePalette: handleSavePalette,
        onImportPalette: handleImportPalette,
        onExportPalette: handleExportPalette,
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-3 md:px-5 bg-card shrink-0 z-10">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Menu" className="-ml-2">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetTitle>Menu</SheetTitle>
                                <div className="flex flex-col gap-4 mt-6">
                                    <Button variant="outline" onClick={() => loadFileInputRef.current?.click()} className="justify-start gap-2 w-full">
                                        <FolderOpen className="h-4 w-4" />
                                        <span>Load Project</span>
                                    </Button>
                                    <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)} className="justify-start gap-2 w-full">
                                        <Save className="h-4 w-4" />
                                        <span>Save Project</span>
                                    </Button>
                                    <Button onClick={() => setIsExportModalOpen(true)} className="justify-start gap-2 w-full">
                                        <Download className="h-4 w-4" />
                                        <span>Export Pattern</span>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Image src="/icon0.svg" alt="PixelPatterns" width={24} height={24} className="w-6 h-6 md:w-8 md:h-8" />
                    <h1 className="text-lg md:text-2xl font-semibold tracking-tight font-(family-name:--font-pixelify)">
                        PixelPatterns
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" onClick={() => loadFileInputRef.current?.click()} className="gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span>Load</span>
                        </Button>
                        <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)} className="gap-2">
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                        </Button>
                        <input
                            type="file"
                            ref={loadFileInputRef}
                            className="hidden"
                            accept=".fafo,.json"
                            aria-label="Load project file input"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleLoadProject(e.target.files[0]);
                                e.target.value = null;
                            }}
                        />
                        <ThemeToggle />
                        <div aria-hidden="true" className="w-px h-6 bg-border mx-2"></div>
                        <Button onClick={() => setIsExportModalOpen(true)} className="gap-2" aria-label="Export pattern">
                            <Download className="h-4 w-4" aria-hidden="true" />
                            <span>Export</span>
                        </Button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-1">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden flex border-b border-border bg-card shrink-0">
                <button
                    onClick={() => setActiveTab("editor")}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "editor"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "preview"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Preview
                </button>
            </div>

            <main aria-label="Pixel editor workspace" className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Desktop Sidebar */}
                <div className="hidden md:block h-full w-72 shrink-0 border-r border-border">
                    <Toolbar {...toolbarProps} className="h-full w-full border-none" />
                </div>

                {/* Editor Section */}
                <section
                    aria-label="Canvas editor"
                    className={`flex-1 bg-background flex flex-col items-center justify-center relative overflow-hidden ${
                        activeTab === "editor" ? "flex" : "hidden md:flex"
                    }`}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-auto">
                        <div className="mt-4 mb-3 flex gap-2 z-10" role="toolbar" aria-label="Canvas controls">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUndo}
                            aria-label="Undo last action"
                            className="gap-2"
                        >
                            <Undo className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Undo</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRedo}
                            aria-label="Redo last undone action"
                            className="gap-2"
                        >
                            <Redo className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Redo</span>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setIsClearDialogOpen(true)}
                            aria-label="Clear entire canvas"
                            className="gap-2"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="hidden sm:inline">Clear</span>
                        </Button>
                        </div>
                        
                        <div className="w-full flex items-center justify-center p-4">
                            <div className="max-w-full max-h-full aspect-square shadow-lg">
                                <PixelEditor
                                    ref={pixelEditorRef}
                                    size={size}
                                    color={color}
                                    tool={tool}
                                    brushSize={brushSize}
                                    onUpdate={setImageData}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Toolbar FAB - Fixed bottom right */}
                    <div className="md:hidden fixed bottom-6 right-6 z-20">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="default" className="shadow-lg h-14 w-14 rounded-full">
                                    <Palette className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh] p-0">
                                <SheetTitle className="sr-only">Drawing Tools</SheetTitle>
                                <Toolbar {...toolbarProps} className="h-full w-full border-none" />
                            </SheetContent>
                        </Sheet>
                    </div>
                </section>

                {/* Preview Section */}
                <section 
                    aria-label="Pattern preview" 
                    className={`flex-1 bg-muted/30 flex items-center justify-center overflow-hidden ${
                        activeTab === "preview" ? "flex" : "hidden md:flex"
                    }`}
                >
                    <div className="w-full h-full p-4 flex items-center justify-center">
                        <Preview imageData={imageData} mode="grid" />
                    </div>
                </section>
            </main>

            <footer className="h-10 border-t border-border flex items-center justify-between px-5 bg-card text-xs text-muted-foreground shrink-0 hidden md:flex">
                <p>
                    © {yearDisplay} PixelPatterns. All rights reserved. a{" "}
                    <a
                        href="https://fafolab.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit FAFO lab website (opens in new tab)"
                        className="hover:text-foreground transition-colors"
                    >
                        FAFO{" "}
                        <span className="line-through" aria-hidden="true">
                            lab
                        </span>
                    </a>{" "}
                    joint.
                </p>
                <a
                    href="https://github.com/skullzarmy/pixelpatterns"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View source code on GitHub (opens in new tab)"
                    className="hover:text-foreground transition-colors"
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

            <SaveDialog
                isOpen={isSaveDialogOpen}
                onClose={() => setIsSaveDialogOpen(false)}
                onSave={handleSaveProject}
            />

            <SupportDialog isOpen={isSupportDialogOpen} onClose={() => setIsSupportDialogOpen(false)} />

            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear Canvas?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will clear all pixels from the canvas. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearCanvas} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Clear Canvas
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PromoPopup />
            <PenrosePopup />
        </div>
    );
}
