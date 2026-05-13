'use client';
import React, { useState, useEffect, useCallback } from 'react';

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
  { text: "Whatever you hold in your mind on a consistent basis is exactly what you will experience in life.", author: "Tony Robbins" },
  { text: "We aim above the mark, to hit the mark.", author: "Ralph Waldo Emerson" },
  { text: "The worst thing I can be is the same as everybody else, I hate that.", author: "Arnold Schwarzenegger" },
  { text: "Only those who will risk going too far can possibly find out how far one can go.", author: "T.S. Eliot" },
  { text: "Leap and the net will appear.", author: "Zen Proverb" },
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd" },
  { text: "Don't worry about failures, worry about the chances you miss when you don't even try.", author: "Jack Canfield" },
  { text: "Those who dare to fail miserably can achieve greatly.", author: "John F. Kennedy" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "We may encounter many defeats, but we must not be defeated.", author: "Maya Angelou" },
  { text: "The true measure of a man is how he treats someone who can do him absolutely no good.", author: "Samuel Johnson" },
  { text: "You got to be careful if you don't know where you're going, because you might not get there.", author: "Yogi Berra" },
  { text: "You must expect great things of yourself before you can do them.", author: "Michael Jordan" },
  { text: "Never let your past decisions determine your future outcome.", author: "Mark Dudley" },
  { text: "Short cuts make long delays.", author: "J.R.R. Tolkien" },
  { text: "No one can give you your goals. This is your journey.", author: "Warren Philip Gates" },
  { text: "The world is what you think of it, so think of it differently and your world will change.", author: "Paul Arden" },
  { text: "The future belongs to those who prepare for it, today.", author: "Malcolm X" },
  { text: "Don't give up what you want most for what you want now.", author: "Richard G. Scott" },
  { text: "Don't tell me how talented you are, tell me how hard you work.", author: "Artur Rubinstein" },
  { text: "How you think when you lose determines how long it will be until you win.", author: "Gilbert Chesterton" },
  { text: "Whenever a person decides success has been attained, progress stops.", author: "Thomas J. Watson" },
  { text: "No problem can withstand the assault of sustained thinking.", author: "Voltaire" },
  { text: "Luck is when an opportunity comes along and you're prepared for it.", author: "Denzel Washington" },
  { text: "It's hard to beat a person who never gives up.", author: "Babe Ruth" },
  { text: "Write it. Shoot it. Publish it. Crochet it, sauté it. Whatever, make!", author: "Joss Whedon" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
  { text: "Happiness is not something ready made, it comes from your own actions.", author: "Dalai Lama" },
  { text: "Smart people learn from everything and everyone.", author: "Socrates" },
  { text: "Impossible is just an opinion.", author: "Paulo Coelho" },
  { text: "Your passion is waiting on your courage to catch up.", author: "Isabelle LaFleche" },
  { text: "People who wonder if the glass is half empty or full miss the point. The glass is refillable.", author: "Unknown" },
  { text: "One day or day one; you decide.", author: "Unknown" },
  { text: "Things may come to those who wait, but only the things left by those who hustle.", author: "Abraham Lincoln" },
  { text: "Everything comes to him who hustles while he waits.", author: "Thomas Edison" },
  { text: "Work like there is someone working 24 hours a day to take it away from you.", author: "Mark Cuban" },
  { text: "No one has ever made a difference by being like everyone else.", author: "The Greatest Showman" },
  { text: "You'll have bad times, but it'll always wake you up to the good stuff you weren't paying attention to.", author: "Robin Williams" },
  { text: "Be a first rate version of yourself, not a second rate version of someone else.", author: "Judy Garland" },
  { text: "Learn from the mistakes of others. You can't live long enough to make them all yourself.", author: "Eleanor Roosevelt" },
  { text: "If you are tired, then do it tired.", author: "Unknown" },
  { text: "A man is not finished when he is defeated, he is finished when he quits.", author: "Richard Nixon" },
  { text: "The world is changed by your example, not by your opinion.", author: "Paulo Coelho" },
  { text: "Life is like riding a bicycle. To keep your balance you must keep moving.", author: "Albert Einstein" },
  { text: "No amount of guilt can change the past, no amount of anxiety can change the future.", author: "Unknown" },
  { text: "A negative mind will never give you a positive life.", author: "Unknown" },
  { text: "Everything is hard before it is easy.", author: "Goethe" },
  { text: "Take the risk, or lose the chance.", author: "Unknown" },
  { text: "Never stop learning, because life never stops teaching.", author: "Unknown" },
  { text: "The man who does not read has no advantage over the man who can't read.", author: "Mark Twain" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { text: "Be thankful for what you have; you'll end up with more. Concentrate on what you don't have and you'll never have enough.", author: "Oprah Winfrey" },
  { text: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
  { text: "Many of life's failures are people who did not realize how close they were when they gave up.", author: "Thomas Edison" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill" },
  { text: "Our greatest glory isn't in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "Don't be pushed around by the fears in your mind; be led by the dreams in your heart.", author: "Roy T. Bennett" },
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
  const [index, setIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * quotes.length));
  }, []);

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
