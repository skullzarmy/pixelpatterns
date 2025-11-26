"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PenrosePopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed this popup before
        const hasDismissed = localStorage.getItem("penrosePopupDismissed");

        if (!hasDismissed) {
            // Show popup after 5 seconds of browsing
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        localStorage.setItem("penrosePopupDismissed", "true");
    };

    const handleVisit = () => {
        window.open("https://penrose.fafolab.xyz", "_blank", "noopener,noreferrer");
    };

    if (!isVisible || isDismissed) return null;

    return (
        <aside
            className="fixed z-50 
                bottom-4 right-4 
                sm:bottom-6 sm:right-6
                max-sm:left-4 max-sm:right-4 max-sm:bottom-0 max-sm:rounded-b-none
                animate-in slide-in-from-bottom-4 fade-in duration-300"
            aria-label="PenRose promotion"
        >
            <div
                className="relative bg-card border border-border rounded-lg shadow-lg overflow-hidden
                    max-w-sm w-full
                    max-sm:rounded-b-none max-sm:border-b-0"
            >
                {/* Gradient accent bar */}
                <div className="h-1 bg-linear-to-r from-violet-500 via-pink-500 to-orange-400" />

                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                    aria-label="Dismiss PenRose promotion"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="p-4 pr-10">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                            <Image src="/penrose.svg" alt="PenRose" width={24} height={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground">Take it to PenRose! →</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Preview your patterns as tiled backgrounds with GIFs, images & video support.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={handleVisit} className="flex-1 gap-1.5 text-xs h-8">
                            <span>Try PenRose</span>
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDismiss}
                            className="text-xs h-8 text-muted-foreground hover:text-foreground"
                        >
                            Later
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
