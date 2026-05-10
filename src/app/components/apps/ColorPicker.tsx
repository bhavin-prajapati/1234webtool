'use client';
import React, { useState, useCallback } from 'react';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
      case g1: h = ((b1 - r1) / d + 2) / 6; break;
      case b1: h = ((r1 - g1) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function generatePalette(hex: string): string[] {
  const { h, s } = hexToHsl(hex);
  return [10, 25, 40, 55, 70, 85].map((l) => {
    const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return rgbToHex(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    );
  });
}

function generateHarmony(hex: string): { name: string; colors: string[] }[] {
  const { h, s, l } = hexToHsl(hex);
  const hslToHex = (h: number, s: number, l: number) => {
    const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;
    const hh = ((h % 360) + 360) % 360;
    if (hh < 60) { r = c; g = x; }
    else if (hh < 120) { r = x; g = c; }
    else if (hh < 180) { g = c; b = x; }
    else if (hh < 240) { g = x; b = c; }
    else if (hh < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
  };
  return [
    { name: 'Complementary', colors: [hex, hslToHex((h + 180) % 360, s, l)] },
    { name: 'Triadic', colors: [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)] },
    { name: 'Analogous', colors: [hslToHex((h - 30 + 360) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)] },
  ];
}

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState('');

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);
  const palette = generatePalette(color);
  const harmonies = generateHarmony(color);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  const ColorSwatch = ({ hex, size = 'md' }: { hex: string; size?: string }) => (
    <button
      onClick={() => copy(hex)}
      className={`rounded-lg transition-transform hover:scale-110 relative group ${
        size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      }`}
      style={{ backgroundColor: hex }}
      title={hex}
    >
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {hex}
      </span>
    </button>
  );

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Color Picker</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {/* Color input */}
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16 rounded-xl cursor-pointer border-0 p-0"
            />
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={color}
                onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setColor(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 text-gray-800 font-mono text-lg"
              />
            </div>
          </div>

          {/* Color values */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'HEX', value: color },
              { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
              { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => copy(item.value)}
                className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-[10px] text-gray-400 font-medium">{item.label}</div>
                <div className="text-xs text-gray-700 font-mono truncate">{item.value}</div>
              </button>
            ))}
          </div>

          {copied && (
            <div className="text-center text-sm text-green-600 font-medium">
              Copied: {copied}
            </div>
          )}

          {/* Shades */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Shades</h3>
            <div className="flex gap-2 justify-center">
              {palette.map((c, i) => <ColorSwatch key={i} hex={c} />)}
            </div>
          </div>

          {/* Harmonies */}
          {harmonies.map((harmony) => (
            <div key={harmony.name}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{harmony.name}</h3>
              <div className="flex gap-2 justify-center">
                {harmony.colors.map((c, i) => <ColorSwatch key={i} hex={c} size="lg" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
