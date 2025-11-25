"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function SaveDialog({ isOpen, onClose, onSave }) {
    const [filename, setFilename] = useState("");

    const handleSave = () => {
        const finalName = filename.trim() || "untitled";
        onSave(finalName);
        setFilename("");
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Save Project</DialogTitle>
                    <DialogDescription>
                        Enter a name for your project file. It will be saved as a .fafo file.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="filename"
                            placeholder="Enter filename (e.g., my-pattern)"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
