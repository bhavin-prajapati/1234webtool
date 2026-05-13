'use client';

import React, { useMemo, useState } from 'react';

const flagOptions = [
  { name: 'g', label: 'Global' },
  { name: 'i', label: 'Ignore case' },
  { name: 'm', label: 'Multiline' },
  { name: 's', label: 'DotAll' },
  { name: 'u', label: 'Unicode' },
  { name: 'y', label: 'Sticky' },
];

const presets = [
  { label: 'Positive Integers', pattern: '^\\d+$' },
  { label: 'Negative Integers', pattern: '^\\-\\d+$' },
  { label: 'Integer', pattern: '^\\-?\\d+$' },
  { label: 'Positive Number', pattern: '^\\d*\\.?\\d+$' },
  { label: 'Negative Number', pattern: '^\\-\\d*\\.?\\d+$' },
  { label: 'Positive or Negative Number', pattern: '^\\-?\\d*\\.?\\d+$' },
  { label: 'Phone number', pattern: '^\\+?[\\d\\s]{3,}$' },
  { label: 'Phone with code', pattern: '^\\+?[\\d\\s]+\\(?[\\d\\s]{10,}$' },
  { label: 'Year 1900-2099', pattern: '^(19|20)\\d{2}$' },
  {
    label: 'Date (dd mm yyyy)',
    pattern: '^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$',
  },
  { label: 'IPv4', pattern: '^(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]){3}$' },
  { label: 'Personal Name', pattern: '^[\\w.\']{2,}(\\s[\\w.\']{2,})+$' },
  { label: 'Username', pattern: '^[\\w\\d_.]{4,}$' },
  { label: 'Password (min 6 chars)', pattern: '^.{6,}$' },
  { label: 'Password or empty', pattern: '^.{6,}$|^$' },
  { label: 'Email', pattern: '^[_]*([a-z0-9]+(\\.|_*)?)+@([a-z][a-z0-9-]+(\\.|-*\.))+[a-z]{2,6}$' },
  { label: 'Domain', pattern: '^([a-z][a-z0-9-]+(\\.|-*\.))+[a-z]{2,6}$' },
  { label: 'Match no input', pattern: '^$' },
  { label: 'Match blank input', pattern: '^\\s\\t*$' },
  { label: 'Match newline', pattern: '[\\r\\n]|$' },
  { label: 'Match whitespace', pattern: '^\\s+$' },
  { label: 'URL', pattern: '^http:\\/\\/[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$' },
];

function buildFlags(selected: Record<string, boolean>) {
  return flagOptions.filter((option) => selected[option.name]).map((option) => option.name).join('');
}

function extractMatches(regex: RegExp, text: string) {
  const result: Array<{ match: string; index: number; groups: string[] }> = [];
  if (!text) {
    return result;
  }

  const sourceRegex = regex;
  if (sourceRegex.global || sourceRegex.sticky) {
    sourceRegex.lastIndex = 0;
    let match;
    while ((match = sourceRegex.exec(text)) !== null) {
      result.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).map((group) => group ?? ''),
      });
      if (match[0].length === 0) {
        sourceRegex.lastIndex += 1;
      }
    }
  } else {
    const match = sourceRegex.exec(text);
    if (match) {
      result.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).map((group) => group ?? ''),
      });
    }
  }

  return result;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [text, setText] = useState('');
  const [selectedFlags, setSelectedFlags] = useState<Record<string, boolean>>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });

  const flags = useMemo(() => buildFlags(selectedFlags), [selectedFlags]);

  const regexResult = useMemo(() => {
    if (!pattern) {
      return { error: '', regex: null as RegExp | null };
    }

    try {
      const regex = new RegExp(pattern, flags);
      return { error: '', regex };
    } catch (error) {
      return { error: (error as Error).message, regex: null };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regexResult.regex || regexResult.error) {
      return [] as Array<{ match: string; index: number; groups: string[] }>;
    }
    return extractMatches(regexResult.regex, text);
  }, [regexResult, text]);

  const handleFlagChange = (name: string) => {
    setSelectedFlags((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const matchCount = matches.length;

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="w-full max-w-[600px] max-h-[600px]">
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
          <div className="space-y-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex gap-2">
                  <div className="text-sm font-medium text-gray-700 mt-3">Flags</div>
                  {flagOptions.map((option) => (
                    <label key={option.name} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFlags[option.name]}
                        onChange={() => handleFlagChange(option.name)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-3">
              <div>
                <div className="flex gap-2">
                  <select
                    value={selectedPreset}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedPreset(selected);
                      setPattern(selected);
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900"
                  >
                    <option value="">Choose a preset</option>
                    {presets.map((preset) => (
                      <option key={preset.label} value={preset.pattern}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g. \\\b\\w+\\b"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-mono text-sm"
                />
              </div>

              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-[120px] p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-mono text-sm resize-y"
                  placeholder="Type or paste text to test against the regular expression..."
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <div className="text-sm font-medium text-gray-700">Result</div>

                <div className="grid gap-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 border border-gray-200">
                    <span className="text-gray-500">Compiled</span>
                    <span className="font-mono text-sm text-gray-900">/{pattern}/{flags}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 border border-gray-200">
                    <span className="text-gray-500">Matches</span>
                    <span className="font-semibold text-gray-900">{pattern ? matchCount : 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 border border-gray-200">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-semibold ${regexResult.error ? 'text-red-600' : 'text-green-600'}`}>
                      {regexResult.error ? 'Invalid pattern' : pattern ? 'Valid pattern' : 'Awaiting input'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {regexResult.error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <span className="font-semibold">Error:</span> {regexResult.error}
            </div>
          ) : null}

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">Match details</div>
            {!pattern ? (
              <p className="text-sm text-gray-500">Enter a regex pattern to see matches.</p>
            ) : regexResult.error ? (
              <p className="text-sm text-gray-500">Fix the pattern above to test against the input text.</p>
            ) : matches.length === 0 ? (
              <p className="text-sm text-gray-500">No matches found.</p>
            ) : (
              <div className="space-y-4">
                {matches.map((matchItem, index) => (
                  <div key={`${matchItem.index}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Match {index + 1}</div>
                        <div className="text-xs text-gray-500">Index: {matchItem.index}</div>
                      </div>
                      <div className="font-mono text-sm text-indigo-600 break-all">{matchItem.match}</div>
                    </div>
                    {matchItem.groups.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-gray-600 font-medium">Capture groups</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {matchItem.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-mono break-all">
                              <span className="text-xs text-gray-500">Group {groupIndex + 1}:</span>
                              <div>{group || '<empty>'}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
