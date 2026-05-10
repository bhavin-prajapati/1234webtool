'use client';
import React, { useState, useCallback } from 'react';

type Category = 'length' | 'weight' | 'temperature' | 'volume';

const units: Record<Category, { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { name: 'Meters', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilometers', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Miles', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { name: 'Feet', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: 'Inches', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { name: 'Centimeters', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
    { name: 'Yards', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  ],
  weight: [
    { name: 'Kilograms', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Grams', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Pounds', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: 'Ounces', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { name: 'Milligrams', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
  ],
  temperature: [
    { name: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { name: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { name: 'Liters', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Milliliters', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Gallons (US)', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: 'Cups', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { name: 'Fluid Ounces', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  ],
};

const categories: { key: Category; label: string; emoji: string }[] = [
  { key: 'length', label: 'Length', emoji: '📏' },
  { key: 'weight', label: 'Weight', emoji: '⚖️' },
  { key: 'temperature', label: 'Temperature', emoji: '🌡️' },
  { key: 'volume', label: 'Volume', emoji: '🧪' },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [inputValue, setInputValue] = useState('1');

  const convert = useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';
    const from = units[category][fromUnit];
    const to = units[category][toUnit];
    const base = from.toBase(val);
    const result = to.fromBase(base);
    return Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');
  }, [category, fromUnit, toUnit, inputValue]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Unit Converter</h1>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key); setFromUnit(0); setToUnit(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(Number(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 mb-2"
            >
              {units[category].map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 text-lg"
              placeholder="Enter value"
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={swap}
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors text-blue-500 text-xl"
            >
              ⇅
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(Number(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 mb-2"
            >
              {units[category].map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
            <div className="w-full p-3 rounded-lg border border-gray-200 bg-blue-50 text-lg font-semibold text-blue-700 min-h-[50px]">
              {convert() || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
