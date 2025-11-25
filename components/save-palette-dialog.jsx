"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Save, AlertCircle } from "lucide-react";

export default function SavePalettePopover({ children, onSave, currentName, savedPalettes }) {
    const [open, setOpen] = useState(false);
    const [paletteName, setPaletteName] = useState("");
    const [showOverwrite, setShowOverwrite] = useState(false);

    useEffect(() => {
        if (open) {
            // Pre-fill with current name if it exists and isn't a preset name
            if (currentName && !currentName.includes("(Modified)")) {
                setPaletteName(currentName);
            } else {
                setPaletteName("");
            }
            setShowOverwrite(false);
        }
    }, [open, currentName]);

    const handleSave = () => {
        const finalName = paletteName.trim() || "untitled";

        // Check if name exists in saved palettes
        if (savedPalettes.includes(finalName) && !showOverwrite) {
            setShowOverwrite(true);
            return;
        }

        onSave(finalName);
        setPaletteName("");
        setShowOverwrite(false);
        setOpen(false);
    };

    const handleSaveAsNew = () => {
        // Add a number suffix to make it unique
        let newName = paletteName.trim() || "untitled";
        let counter = 2;
        while (savedPalettes.includes(newName)) {
            newName = `${paletteName.trim() || "untitled"} (${counter})`;
            counter++;
        }
        onSave(newName);
        setPaletteName("");
        setShowOverwrite(false);
        setOpen(false);
    };

    const handleExistingClick = (name) => {
        setPaletteName(name);
        setShowOverwrite(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80" side="right" align="start">
                {!showOverwrite ? (
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Save Palette</h4>
                            <p className="text-sm text-muted-foreground">
                                Enter a new name or select an existing palette to overwrite.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Input
                                placeholder="Enter palette name"
                                value={paletteName}
                                onChange={(e) => setPaletteName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                        {savedPalettes.length > 0 && (
                            <div className="grid gap-1">
                                <p className="text-xs text-muted-foreground">Or overwrite existing:</p>
                                <div className="max-h-32 overflow-y-auto space-y-1">
                                    {savedPalettes.map((name) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => handleExistingClick(name)}
                                            className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSave} className="gap-2">
                                <Save className="h-3.5 w-3.5" />
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Overwrite Palette?</h4>
                            <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded">
                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    "{paletteName}" already exists
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShowOverwrite(false)}>
                                Back
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSaveAsNew} className="gap-2">
                                <Save className="h-3.5 w-3.5" />
                                Save as New
                            </Button>
                            <Button size="sm" onClick={handleSave} className="gap-2">
                                <Save className="h-3.5 w-3.5" />
                                Overwrite
                            </Button>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
