"use client";

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

const PixelEditor = forwardRef(({ size, color, tool, brushSize = 1, onUpdate }, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [pixels, setPixels] = useState(Array(size * size).fill("transparent"));

    // History Stack
    const [history, setHistory] = useState([Array(size * size).fill("transparent")]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Reset history when size changes
    useEffect(() => {
        const initialPixels = Array(size * size).fill("transparent");
        setPixels(initialPixels);
        setHistory([initialPixels]);
        setHistoryIndex(0);
    }, [size]);

    // Expose Undo/Redo/Clear/GetPixels/LoadPixels to parent
    useImperativeHandle(ref, () => ({
        undo: () => {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setPixels(history[newIndex]);
            }
        },
        redo: () => {
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setPixels(history[newIndex]);
            }
        },
        clear: () => {
            const clearedPixels = Array(size * size).fill("transparent");
            setPixels(clearedPixels);
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(clearedPixels);
            if (newHistory.length > 50) newHistory.shift();
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        },
        getPixels: () => {
            return pixels;
        },
        loadPixels: (newPixels) => {
            if (Array.isArray(newPixels) && newPixels.length === size * size) {
                setPixels(newPixels);
                const newHistory = [newPixels];
                setHistory(newHistory);
                setHistoryIndex(0);
            }
        },
    }));

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    if (historyIndex < history.length - 1) {
                        const newIndex = historyIndex + 1;
                        setHistoryIndex(newIndex);
                        setPixels(history[newIndex]);
                    }
                } else {
                    if (historyIndex > 0) {
                        const newIndex = historyIndex - 1;
                        setHistoryIndex(newIndex);
                        setPixels(history[newIndex]);
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [history, historyIndex]);

    // Draw pixels to canvas whenever they change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const pixelSize = canvas.width / size;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw checkerboard background
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? "#27272a" : "#3f3f46";
                ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
            }
        }

        // Draw pixels
        pixels.forEach((color, index) => {
            if (color !== "transparent") {
                const x = (index % size) * pixelSize;
                const y = Math.floor(index / size) * pixelSize;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, pixelSize, pixelSize);
            }
        });

        // Draw grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= size; i++) {
            const pos = i * pixelSize;
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, canvas.height);
            ctx.moveTo(0, pos);
            ctx.lineTo(canvas.width, pos);
        }
        ctx.stroke();

        // Notify parent of update
        if (!isDrawing && onUpdate) {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext("2d");

            pixels.forEach((c, i) => {
                if (c !== "transparent") {
                    const x = i % size;
                    const y = Math.floor(i / size);
                    tempCtx.fillStyle = c;
                    tempCtx.fillRect(x, y, 1, 1);
                }
            });
            onUpdate(tempCanvas.toDataURL());
        }
    }, [pixels, size, isDrawing, onUpdate]);

    const saveToHistory = (newPixels) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newPixels);
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const getPixelIndex = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pixelSizeX = rect.width / size;
        const pixelSizeY = rect.height / size;
        const col = Math.floor(x / pixelSizeX);
        const row = Math.floor(y / pixelSizeY);
        return { row, col, index: row * size + col };
    };

    const paint = (row, col) => {
        if (row < 0 || row >= size || col < 0 || col >= size) return;

        setPixels((prev) => {
            const newPixels = [...prev];

            if (tool === "fill") {
                const targetColor = newPixels[row * size + col];
                if (targetColor === color) return prev;

                const stack = [[row, col]];

                while (stack.length) {
                    const [r, c] = stack.pop();
                    const idx = r * size + c;

                    if (r < 0 || r >= size || c < 0 || c >= size || newPixels[idx] !== targetColor) continue;

                    newPixels[idx] = color;

                    stack.push([r - 1, c]);
                    stack.push([r + 1, c]);
                    stack.push([r, c - 1]);
                    stack.push([r, c + 1]);
                }
            } else {
                const paintColor = tool === "eraser" ? "transparent" : color;
                const startOffset = Math.floor((brushSize - 1) / 2);

                for (let i = 0; i < brushSize; i++) {
                    for (let j = 0; j < brushSize; j++) {
                        const r = row - startOffset + i;
                        const c = col - startOffset + j;

                        if (r >= 0 && r < size && c >= 0 && c < size) {
                            newPixels[r * size + c] = paintColor;
                        }
                    }
                }
            }
            return newPixels;
        });
    };

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { row, col } = getPixelIndex(e);
        paint(row, col);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        if (tool === "fill") return;
        const { row, col } = getPixelIndex(e);
        paint(row, col);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        saveToHistory(pixels);
    };

    const cursorClass = tool === "pen" ? "cursor-crosshair" : tool === "eraser" ? "cursor-cell" : "cursor-copy";

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={600}
            role="img"
            aria-label={`Pixel art canvas, ${size} by ${size} pixels. Use mouse to draw. Current tool: ${tool}, current color: ${color}`}
            className={`max-w-[600px] max-h-[600px] ${cursorClass}`}
            style={{
                width: "100%",
                height: "100%",
                imageRendering: "pixelated",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            tabIndex={0}
        />
    );
});

PixelEditor.displayName = "PixelEditor";

export default PixelEditor;
