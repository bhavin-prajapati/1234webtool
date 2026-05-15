'use client';

import { useEffect, useMemo, useState } from 'react';
import TeX from '@matejmazur/react-katex';

type Formula = {
  title: string;
  latex: string;
  description: string;
  category: string;
};

const formulas: Formula[] = [
  {
    title: 'Quadratic Formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'Solve quadratic equations of the form ax² + bx + c = 0.',
    category: 'Algebra',
  },
  {
    title: 'Pythagorean Theorem',
    latex: 'a^2 + b^2 = c^2',
    description: 'Relates the sides of a right triangle.',
    category: 'Geometry',
  },
  {
    title: 'Circle Area',
    latex: 'A = \\pi r^2',
    description: 'Area of a circle with radius r.',
    category: 'Geometry',
  },
  {
    title: 'Circle Circumference',
    latex: 'C = 2 \\pi r',
    description: 'Circumference of a circle with radius r.',
    category: 'Geometry',
  },
  {
    title: 'Slope Formula',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    description: 'Slope of a line through two points.',
    category: 'Algebra',
  },
  {
    title: 'Distance Formula',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    description: 'Distance between two points in the plane.',
    category: 'Geometry',
  },
  {
    title: 'Euler’s Identity',
    latex: 'e^{i\\pi} + 1 = 0',
    description: 'A fundamental identity combining e, i, π, 1, and 0.',
    category: 'Complex Analysis',
  },
  {
    title: 'Derivative of Sine',
    latex: '\\frac{d}{dx} \\sin(x) = \\cos(x)',
    description: 'Basic derivative rule from calculus.',
    category: 'Calculus',
  },
  {
    title: 'Integral of e^x',
    latex: '\\int e^x \\, dx = e^x + C',
    description: 'Indefinite integral of the exponential function.',
    category: 'Calculus',
  },
];

export default function Formulas() {
  const [query, setQuery] = useState('');
  const categories = useMemo(
    () => Array.from(new Set(formulas.map((formula) => formula.category))),
    []
  );
  const [openCategories, setOpenCategories] = useState<string[]>(categories);

  const filteredFormulas = useMemo(
    () =>
      formulas.filter((formula) =>
        [formula.title, formula.description, formula.category]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase().trim())
      ),
    [query]
  );

  const formulasByCategory = useMemo(
    () =>
      filteredFormulas.reduce<Record<string, Formula[]>>((groups, formula) => {
        if (!groups[formula.category]) {
          groups[formula.category] = [];
        }
        groups[formula.category].push(formula);
        return groups;
      }, {} as Record<string, Formula[]>),
    [filteredFormulas]
  );

  const visibleCategories = useMemo(
    () => Object.keys(formulasByCategory).sort(),
    [formulasByCategory]
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  useEffect(() => {
    // Automatically close all categories that have results when the query changes
    setOpenCategories([]);
  }, [visibleCategories]);

  return (
    <div className="flex justify-center px-4 pb-10">
      <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl p-8">
        <div className="mb-8">
          <label htmlFor="formula-search" className="sr-only">
            Search formulas
          </label>
          <input
            id="formula-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search formulas..."
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {visibleCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            No formulas matched your search. Try a different term like &#34;algebra&#34;, &#34;geometry&#34;, or &#34;calculus&#34;.
          </div>
        ) : (
          <div className="space-y-4">
            {visibleCategories.map((category) => {
              const categoryFormulas = formulasByCategory[category] || [];
              const isOpen = openCategories.includes(category);

              return (
                <div key={category} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full px-6 py-5 text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{category}</p>
                        <p className="text-lg font-semibold text-slate-900">{categoryFormulas.length} formulas</p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[4000px]' : 'max-h-0'}`}>
                    <div className="space-y-4 border-t border-slate-200 px-6 py-6">
                      <div>
                        {categoryFormulas.map((formula) => (
                          <div
                            key={formula.title}
                            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                          >
                            <div className="mb-3">
                              <div className="flex items-baseline justify-between gap-3">
                                <h2 className="text-xl font-semibold text-slate-900">{formula.title}</h2>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                                  {formula.category}
                                </span>
                              </div>
                            </div>
                            <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-900">
                              <TeX block>{formula.latex}</TeX>
                            </div>
                            <p className="mb-4 text-slate-600">{formula.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
