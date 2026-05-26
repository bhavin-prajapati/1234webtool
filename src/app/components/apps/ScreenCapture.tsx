'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useReactMediaRecorder } from 'react-media-recorder';

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
  const recordingVideoRef = useRef<HTMLVideoElement>(null);
  const [recordingHeight, setRecordingHeight] = useState<number | null>(null);

  const {
    status: recordingStatus,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl,
    previewStream,
    error: recordingError,
  } = useReactMediaRecorder({
    screen: true,
    audio: true,
    blobPropertyBag: { type: 'video/webm' },
  });

  // Capture preview display height while recording so we can reuse it for
  // the recorded blob player and keep the same visual height.
  useEffect(() => {
    const video = recordingVideoRef.current;
    if (!video) return;

    if (previewStream) {
      video.onloadedmetadata = () => {
        video.muted = true;
        video.play().catch(() => {});

        const intrinsicW = video.videoWidth || 0;
        const intrinsicH = video.videoHeight || 0;
        const clientW = video.clientWidth || video.getBoundingClientRect().width || 0;

        if (intrinsicW && intrinsicH && clientW) {
          setRecordingHeight(Math.round((intrinsicH / intrinsicW) * clientW));
        } else {
          const measured = Math.round(video.getBoundingClientRect().height || video.clientHeight || 0);
          setRecordingHeight(measured || null);
        }
      };

      video.srcObject = previewStream;
      video.src = '';
    }

    return () => {
      if (video) video.onloadedmetadata = null;
    };
  }, [previewStream]);

  // When the recording blob is ready, attach it and apply the captured height
  // so the recorded video displays with the same height as the preview.
  useEffect(() => {
    const video = recordingVideoRef.current;
    if (!video) return;

    if (mediaBlobUrl) {
      video.onloadedmetadata = () => {
        if (recordingHeight) {
          video.style.height = `${recordingHeight}px`;
        } else {
          video.style.height = '';
        }
        video.muted = false;
        video.play().catch(() => {});
      };

      video.srcObject = null;
      video.src = mediaBlobUrl;
    } else if (!previewStream) {
      video.srcObject = null;
      video.src = '';
      video.style.height = recordingHeight ? `${recordingHeight}px` : '';
    }

    return () => {
      if (video) video.onloadedmetadata = null;
    };
  }, [mediaBlobUrl, previewStream, recordingHeight]);

  const downloadRecording = () => {
    if (!mediaBlobUrl) return;

    const link = document.createElement('a');
    link.href = mediaBlobUrl;
    link.download = `screen-recording-${Date.now()}.webm`;
    link.click();
  };

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

        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                Screen + Microphone Recording
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Record your screen with microphone audio and download the recording as WebM.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 text-xs font-semibold">
              {recordingStatus}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={startRecording}
              disabled={recordingStatus === 'recording' || recordingStatus === 'acquiring_media'}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Start Recording
            </button>
            <button
              onClick={stopRecording}
              disabled={recordingStatus !== 'recording' && recordingStatus !== 'paused'}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Stop Recording
            </button>
            {pauseRecording && (
              <button
                onClick={pauseRecording}
                disabled={recordingStatus !== 'recording'}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Pause
              </button>
            )}
            {resumeRecording && (
              <button
                onClick={resumeRecording}
                disabled={recordingStatus !== 'paused'}
                className="w-full bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Resume
              </button>
            )}
          </div>

          <div className="mt-4">
            <video
              ref={recordingVideoRef}
              controls
              className="w-full rounded-lg"
              style={{ height: recordingHeight ? `${recordingHeight}px` : undefined, maxHeight: 480 }}
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadRecording}
              disabled={!mediaBlobUrl}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Download Recording
            </button>
            {recordingError && (
              <div className="flex-1 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                {recordingError}
              </div>
            )}
          </div>
        </div>      </div>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
