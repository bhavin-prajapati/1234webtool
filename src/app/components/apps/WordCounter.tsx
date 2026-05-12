'use client';
import React, { useState, useMemo } from 'react';

function analyze(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const readingTimeMin = Math.ceil(words / 200);
  const speakingTimeMin = Math.ceil(words / 130);

  // Word frequency
  const freq: Record<string, number> = {};
  if (text.trim()) {
    text.toLowerCase().match(/\b[a-z']+\b/g)?.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
  }
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTimeMin, speakingTimeMin, topWords };
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyze(text), [text]);

  const clear = () => setText('');
  const copy = () => {
    const summary = `Words: ${stats.words} | Characters: ${stats.chars} | Sentences: ${stats.sentences} | Reading time: ~${stats.readingTimeMin} min`;
    navigator.clipboard.writeText(summary);
  };

  const statCards = [
    { label: 'Words', value: stats.words, color: 'text-blue-600' },
    { label: 'Characters', value: stats.chars, color: 'text-emerald-600' },
    { label: 'No Spaces', value: stats.charsNoSpaces, color: 'text-teal-600' },
    { label: 'Sentences', value: stats.sentences, color: 'text-purple-600' },
    { label: 'Paragraphs', value: stats.paragraphs, color: 'text-orange-600' },
    { label: 'Lines', value: stats.lines, color: 'text-pink-600' },
  ];

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {statCards.map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
                <div className="text-[11px] text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Reading/speaking time */}
          <div className="flex gap-4 justify-center text-sm text-gray-500">
            <span>📖 ~{stats.readingTimeMin} min read</span>
            <span>🎤 ~{stats.speakingTimeMin} min speak</span>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-4 rounded-lg border border-gray-200 text-gray-800 bg-gray-50 text-sm resize-y"
              placeholder="Type or paste your text here..."
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button onClick={copy} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium">
                Copy Stats
              </button>
              <button onClick={clear} className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-xs font-medium">
                Clear
              </button>
            </div>
          </div>

          {/* Top words */}
          {stats.topWords.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Top Words</h3>
              <div className="flex flex-wrap gap-2">
                {stats.topWords.map(([word, count]) => (
                  <span key={word} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {word} <span className="text-blue-400 font-mono text-xs">×{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
