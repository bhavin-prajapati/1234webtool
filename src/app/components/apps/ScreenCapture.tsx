'use client';
import React, { useState, useRef } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ScreenCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [screenshotDimensions, setScreenshotDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const screenshotImageRef = useRef<HTMLImageElement>(null);
  const [selection, setSelection] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const selectionRef = useRef({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

  // Minimize extension when capturing
  const minimizeExtension = () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chromeRuntime = (window as any).chrome?.runtime;
            chromeRuntime?.sendMessage({ action: 'minimizeExtension' }).catch(() => {
            // Extension not available, silently fail
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Not in extension context
        }
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    minimizeExtension();

    try {
      const canvas = await captureVisibleContent();
      if (canvas) {
        const screenshotData = canvas.toDataURL('image/png');
        setScreenshot(screenshotData);
        setScreenshotDimensions({ width: canvas.width, height: canvas.height });
        setIsSelecting(true);
      } else {
        throw new Error('Failed to capture screenshot');
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture screenshot. Please allow screen sharing and try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const captureVisibleContent = async (): Promise<HTMLCanvasElement | null> => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error('Screen capture is not supported by this browser.');
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });

    const track = stream.getVideoTracks()[0];
    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        video.onloadedmetadata = null;
        video.onerror = null;
      };

      video.onloadedmetadata = () => {
        cleanup();
        resolve();
      };

      video.onerror = () => {
        cleanup();
        reject(new Error('Unable to load screen capture stream'));
      };
    });

    await video.play();

    const width = video.videoWidth || window.innerWidth;
    const height = video.videoHeight || window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      track.stop();
      stream.getTracks().forEach((t) => t.stop());
      throw new Error('Unable to create canvas context');
    }

    ctx.drawImage(video, 0, 0, width, height);
    track.stop();
    stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;

    return canvas;
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect) return null;

    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    const { x, y } = coords;
    const updatedSelection = { startX: x, startY: y, endX: x, endY: y };
    setSelection(updatedSelection);
    selectionRef.current = updatedSelection;
    drawSelection(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const { x, y } = coords;
    const updatedSelection = { ...selectionRef.current, endX: x, endY: y };
    setSelection(updatedSelection);
    selectionRef.current = updatedSelection;
    drawSelection(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const drawSelection = (endX: number, endY: number) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startX = selectionRef.current.startX;
    const startY = selectionRef.current.startY;
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear selected area
    ctx.clearRect(x, y, width, height);

    // Draw selection border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw handles
    const handleSize = 6;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
  };

  const saveSelectedArea = () => {
    if (!screenshot || !canvasRef.current) return;

    const img = document.createElement('img');
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const x = Math.min(selection.startX, selection.endX);
      const y = Math.min(selection.startY, selection.endY);
      const width = Math.abs(selection.endX - selection.startX);
      const height = Math.abs(selection.endY - selection.startY);

      if (width === 0 || height === 0) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      }

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `screenshot-${Date.now()}.png`;
      link.click();

      resetCapture();
    };
    img.src = screenshot;
  };

  const resetCapture = () => {
    setScreenshot(null);
    setIsSelecting(false);
    const initialSelection = { startX: 0, startY: 0, endX: 0, endY: 0 };
    setSelection(initialSelection);
    selectionRef.current = initialSelection;
    setScreenshotDimensions({ width: 0, height: 0 });
  };

  return (
    <div className="flex flex-col items-center min-h-screen dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-2xl w-full">
        {!isSelecting ? (
          <button
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isCapturing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Capturing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Take Screenshot
              </>
            )}
          </button>
        ) : (
          <>
            <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Click and drag to select the area you want to capture
              </p>
            </div>
            <div className="relative mb-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: screenshotDimensions.height
                    ? `${(screenshotDimensions.height / screenshotDimensions.width) * 100}%`
                    : '100%',
                  backgroundColor: '#f3f4f6',
                }}
              >
                <img
                  ref={screenshotImageRef}
                  src={screenshot || ''}
                  alt="Screenshot"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
                <canvas
                  ref={overlayCanvasRef}
                  width={screenshotDimensions.width}
                  height={screenshotDimensions.height}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'crosshair',
                    display: screenshot ? 'block' : 'none',
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveSelectedArea}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Save Selection
              </button>
              <button
                onClick={resetCapture}
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            How to use:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>1. Click &quot;Take Screenshot&quot; to capture your screen</li>
            <li>2. Click and drag to select the area you want</li>
            <li>3. Click &quot;Save Selection&quot; to download as PNG</li>
          </ul>
        </div>
      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
