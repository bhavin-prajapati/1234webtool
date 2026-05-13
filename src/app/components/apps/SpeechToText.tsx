'use client';

import React, { useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

export default function SpeechToText() {
  const [copied, setCopied] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const transcript = results.map(result => typeof result === 'string' ? result : result.transcript).join(' ') + (interimResult ? ' ' + interimResult : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isSupported = !error || error !== 'not-allowed'; // rough check

  if (!isSupported) {
    return (
      <div className="flex justify-center px-4 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">Speech-to-Text</h1>
            <p className="text-red-600">
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={isRecording ? stopSpeechToText : startSpeechToText}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRecording ? 'Stop Listening' : 'Start Listening'}
            </button>
            <button
              onClick={() => setResults([])}
              className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Transcript</label>
            <div className="min-h-[120px] p-3 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm">
              {transcript || 'Start speaking to see the transcription here...'}
            </div>
          </div>

          {transcript && !isRecording && (
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium text-sm"
            >
              {copied ? '✓ Copied!' : 'Copy Transcript'}
            </button>
          )}

          {isRecording && (
            <div className="text-center text-sm text-green-600 font-medium">
              🎤 Listening...
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-red-600 font-medium">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
