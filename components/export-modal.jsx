'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ExportModal({ isOpen, onClose, imageData, onExportComplete }) {
  const [exportType, setExportType] = useState('tile');
  const [scale, setScale] = useState('10');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateCanvas = (type, scaleValue) => {
    if (!imageData) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageData;

    return new Promise((resolve) => {
      img.onload = () => {
        if (type === 'tile') {
          canvas.width = img.width * scaleValue;
          canvas.height = img.height * scaleValue;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else if (type === 'pattern') {
          const tileSize = img.width * scaleValue;
          canvas.width = tileSize * 2;
          canvas.height = tileSize * 2;
          ctx.imageSmoothingEnabled = false;

          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
              ctx.drawImage(img, i * tileSize, j * tileSize, tileSize, tileSize);
            }
          }
        }

        resolve(canvas);
      };
    });
  };

  const handleDownload = async () => {
    if (!imageData) return;

    if (scale === 'all') {
      setIsProcessing(true);
      const zip = new JSZip();
      const scales = [1, 10, 20];

      for (const s of scales) {
        const canvas = await generateCanvas(exportType, s);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        zip.file(`${exportType}_${s}x.png`, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `pixelpatterns_${exportType}_all.zip`);
      setIsProcessing(false);
      onClose();
      if (onExportComplete) onExportComplete();
    } else if (scale === 'full-pack') {
      setIsProcessing(true);
      const zip = new JSZip();
      const scales = [1, 10, 20];
      const types = ['tile', 'pattern'];

      for (const type of types) {
        for (const s of scales) {
          const canvas = await generateCanvas(type, s);
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
          zip.file(`${type}_${s}x.png`, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'pixelpatterns_full_pack.zip');
      setIsProcessing(false);
      onClose();
      if (onExportComplete) onExportComplete();
    } else {
      const canvas = await generateCanvas(exportType, parseInt(scale));
      canvas.toBlob((blob) => {
        saveAs(blob, `pixelpatterns_${exportType}_${scale}x.png`);
        onClose();
        if (onExportComplete) onExportComplete();
      }, 'image/png');
    }
  };

  const getDescription = () => {
    if (scale === 'all') return `Export ${exportType} at 1x, 10x, and 20x (ZIP)`;
    if (scale === 'full-pack') return 'Export tile and pattern at all sizes (ZIP)';
    return `Export ${exportType === 'tile' ? 'single tile' : 'tiling pattern'} at ${scale}x scale`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportType('tile')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  exportType === 'tile'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="font-medium">Single Tile</div>
                <div className="text-xs text-muted-foreground">One image</div>
              </button>
              <button
                onClick={() => setExportType('pattern')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  exportType === 'pattern'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="font-medium">Pattern</div>
                <div className="text-xs text-muted-foreground">2x2 tiled</div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold">Scale</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setScale('1')}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  scale === '1'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setScale('10')}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  scale === '10'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                10x
              </button>
              <button
                onClick={() => setScale('20')}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  scale === '20'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                20x
              </button>
            </div>
            
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setScale('all')}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  scale === 'all'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="font-medium">All Sizes (ZIP)</div>
                <div className="text-xs text-muted-foreground">1x, 10x, 20x of current type</div>
              </button>
              
              <button
                onClick={() => setScale('full-pack')}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  scale === 'full-pack'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className="font-medium">Full Pack (ZIP)</div>
                <div className="text-xs text-muted-foreground">Tile + Pattern at all sizes</div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isProcessing || !imageData}>
            <Download className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
