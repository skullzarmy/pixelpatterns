'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPromo = localStorage.getItem('hasSeenDitherPromo');
    
    if (!hasSeenPromo) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenDitherPromo', 'true');
  };

  const handleVisit = () => {
    localStorage.setItem('hasSeenDitherPromo', 'true');
    window.open('https://dither.fafolab.xyz/', '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <DialogTitle>Check Out Our Other Tool!</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Love pixel art? Try{' '}
            <span className="font-semibold text-violet-400">Dither Me Timbers</span>
            {' '}— apply classic dithering patterns to your media and create stunning retro effects.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-sm text-zinc-400 mb-3">
              Perfect companion to PixelPatterns for creating authentic retro artwork.
            </p>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Classic dithering algorithms</li>
              <li>• Multiple pattern styles</li>
              <li>• Easy-to-use interface</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleVisit} className="flex-1">
              Try Dither Me Timbers
            </Button>
            <Button onClick={handleClose} variant="outline">
              Maybe Later
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-zinc-600 mt-2">
          Another tool from{' '}
          <a 
            href="https://fafolab.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-zinc-400 transition-colors"
          >
            FAFO <span className="line-through">lab</span>
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
