'use client';
import React, { useState, useCallback, useEffect } from 'react';

function generatePassword(length: number, options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };
  let pool = '';
  if (options.upper) pool += chars.upper;
  if (options.lower) pool += chars.lower;
  if (options.numbers) pool += chars.numbers;
  if (options.symbols) pool += chars.symbols;
  if (!pool) pool = chars.lower;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => pool[v % pool.length]).join('');
}

function getStrength(password: string): { label: string; color: string; percent: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', percent: 25 };
  if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', percent: 50 };
  if (score <= 4) return { label: 'Good', color: 'bg-blue-500', percent: 75 };
  return { label: 'Strong', color: 'bg-green-500', percent: 100 };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    const pw = generatePassword(length, options);
    setPassword(pw);
    setHistory((prev) => [pw, ...prev].slice(0, 5));
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = getStrength(password);
  const toggleOption = (key: keyof typeof options) => setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Password Generator</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          {/* Password display */}
          <div className="relative">
            <div className="w-full p-4 pr-20 rounded-lg bg-gray-900 text-green-400 font-mono text-lg break-all min-h-[60px]">
              {password}
            </div>
            <button
              onClick={() => copy(password)}
              className="absolute top-3 right-3 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs font-medium"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          {/* Strength meter */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Strength</span>
              <span className="font-medium text-gray-700">{strength.label}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: `${strength.percent}%` }} />
            </div>
          </div>

          {/* Length slider */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="text-gray-500">Length</label>
              <span className="font-medium text-gray-700">{length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Character options */}
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'upper' as const, label: 'Uppercase (A-Z)' },
              { key: 'lower' as const, label: 'Lowercase (a-z)' },
              { key: 'numbers' as const, label: 'Numbers (0-9)' },
              { key: 'symbols' as const, label: 'Symbols (!@#$)' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  options[key]
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          >
            Generate New Password
          </button>

          {/* History */}
          {history.length > 1 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent</h3>
              <div className="space-y-1">
                {history.slice(1).map((pw, i) => (
                  <button
                    key={i}
                    onClick={() => copy(pw)}
                    className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 font-mono text-xs truncate transition-colors"
                  >
                    {pw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
