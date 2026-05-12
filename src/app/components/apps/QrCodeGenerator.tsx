'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) { setQrDataUrl(''); setError(''); return; }
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);
      setError('');
    } catch {
      setError('Failed to generate QR code');
      setQrDataUrl('');
    }
  }, [text, size, fgColor, bgColor]);

  useEffect(() => {
    generate();
  }, [generate]);

  const download = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const copy = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch {
      // fallback: copy the data URL as text
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Text input */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Text or URL</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-24 p-3 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 text-sm resize-y"
              placeholder="Enter text or URL..."
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-gray-200 text-gray-700 text-sm"
              >
                <option value={128}>128px</option>
                <option value={256}>256px</option>
                <option value={512}>512px</option>
                <option value={1024}>1024px</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Foreground</label>
              <div className="flex items-center gap-1">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs text-gray-600 font-mono">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Background</label>
              <div className="flex items-center gap-1">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
                <span className="text-xs text-gray-600 font-mono">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* QR Code display */}
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR Code" className="mx-auto" style={{ width: Math.min(size, 256), height: Math.min(size, 256) }} />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-2">
                <button onClick={download} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  Download PNG
                </button>
                <button onClick={copy} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                  Copy Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
