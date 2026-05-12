'use client';
import React, { useState, useCallback } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const copy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [output]);

  const loadSample = () => {
    const sample = JSON.stringify({
      name: "John Doe", age: 30, active: true,
      address: { street: "123 Main St", city: "Springfield", zip: "62701" },
      hobbies: ["reading", "coding", "hiking"],
    });
    setInput(sample);
  };

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={format} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
              Format
            </button>
            <button onClick={minify} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
              Minify
            </button>
            <button onClick={copy} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button onClick={loadSample} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
              Sample
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-500">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="p-1 rounded border border-gray-200 text-gray-700 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 tab</option>
              </select>
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 p-3 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 font-mono text-sm resize-y"
              placeholder="Paste your JSON here..."
              spellCheck={false}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-mono">
              ✗ {error}
            </div>
          )}

          {/* Output */}
          {output && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Output</label>
              <pre className="w-full p-3 rounded-lg border border-gray-200 bg-gray-900 text-green-400 font-mono text-sm overflow-auto max-h-80">
                {output}
              </pre>
            </div>
          )}

          {/* Validation status */}
          {input.trim() && !error && output && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium">
              ✓ Valid JSON
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
