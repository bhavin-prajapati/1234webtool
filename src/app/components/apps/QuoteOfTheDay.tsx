'use client';
import React, { useState, useCallback } from 'react';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "What we achieve inwardly will change outer reality.", author: "Plutarch" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
];

const bgColors = [
  'from-blue-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-pink-500',
  'from-indigo-500 to-blue-600',
  'from-rose-400 to-red-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-purple-600',
  'from-amber-400 to-orange-500',
];

export default function QuoteOfTheDay() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [bgIndex, setBgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(false);

  const quote = quotes[index];

  const nextQuote = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
      setBgIndex((prev) => (prev + 1) % bgColors.length);
      setFade(false);
    }, 300);
  }, []);

  const randomQuote = useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setIndex(Math.floor(Math.random() * quotes.length));
      setBgIndex((prev) => (prev + 1) % bgColors.length);
      setFade(false);
    }, 300);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-lg">
        {/* Quote card */}
        <div className={`bg-gradient-to-br ${bgColors[bgIndex]} rounded-2xl shadow-lg p-8 mb-6 transition-all duration-300 ${fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="text-white text-5xl mb-4 opacity-50">&ldquo;</div>
          <p className="text-white text-xl font-medium leading-relaxed mb-6">
            {quote.text}
          </p>
          <p className="text-white/80 text-right text-lg italic">
            — {quote.author}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={nextQuote}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow hover:shadow-md transition-all font-medium"
          >
            Next →
          </button>
          <button
            onClick={randomQuote}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow hover:shadow-md transition-all font-medium"
          >
            🎲 Random
          </button>
          <button
            onClick={copy}
            className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow hover:shadow-md transition-all font-medium"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
