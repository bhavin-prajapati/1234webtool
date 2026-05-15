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
        title: 'Product Rule',
        latex: 'a^m \\cdot a^n = a^{m+n}',
        description: 'The product rule for exponents states that when multiplying two exponential expressions with the same base, you keep the base and add the exponents.',
        category: 'Algebra',
    },
    {
        title: 'Quotient Rule',
        latex: '\\frac{a^m}{a^n} = a^{m-n}',
        description: 'The quotient rule for exponents states that when dividing two exponential expressions with the same base, you keep the base and subtract the exponents.',
        category: 'Algebra',
    },
    {
        title: 'Power of a Power Rule',
        latex: '(a^m)^n = a^{mn}',
        description: 'The power of a power rule for exponents states that when raising an exponential expression to another power, you keep the base and multiply the exponents.',
        category: 'Algebra',
    },
    {
        title: 'Power of a Product Rule',
        latex: '(ab)^n = a^n b^n',
        description: 'The power of a product rule for exponents states that when raising a product to a power, you raise each factor to that power.',
        category: 'Algebra',
    },
    {
        title: 'Zero Exponent Rule',
        latex: 'a^0 = 1',
        description: 'Any non-zero number raised to the power of zero equals one.',
        category: 'Algebra',
    },
    {
        title: 'Negative Exponent Rule',
        latex: 'a^{-n} = \\frac{1}{a^n}',
        description: 'A negative exponent indicates the reciprocal of the base raised to the positive exponent.',
        category: 'Algebra',
    },
    {
        title: 'Difference of Squares',
        latex: 'a^2 - b^2 = (a+b)(a-b)',
        description: 'The difference of squares formula.',
        category: 'Algebra',
    },
    {
        title: 'Perfect Square Trinomial (Sum)',
        latex: '(a+b)^2 = a^2 + 2ab + b^2',
        description: 'The formula for the square of a binomial sum.',
        category: 'Algebra',
    },
    {
        title: 'Perfect Square Trinomial (Difference)',
        latex: '(a-b)^2 = a^2 - 2ab + b^2',
        description: 'The formula for the square of a binomial difference.',
        category: 'Algebra',
    },
    {
        title: 'Sum of Cubes',
        latex: 'a^3 + b^3 = (a+b)(a^2 - ab + b^2)',
        description: 'The formula for the sum of two cubes.',
        category: 'Algebra',
    },
    {
        title: 'Difference of Cubes',
        latex: 'a^3 - b^3 = (a-b)(a^2 + ab + b^2)',
        description: 'The formula for the difference of two cubes.',
        category: 'Algebra',
    },
    {
        title: 'Slope Formula',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
        description: 'Slope of a line through two points.',
        category: 'Algebra',
    },
    {
        title: 'Slope-Intercept Form',
        latex: 'y = mx + b',
        description: 'Equation of a line in slope-intercept form.',
        category: 'Algebra',
    },
    {
        title: 'Point-Slope Form',
        latex: 'y - y_1 = m(x - x_1)',
        description: 'Equation of a line in point-slope form.',
        category: 'Algebra',
    },
    {
        title: 'Standard Form',
        latex: 'Ax + By = C',
        description: 'Equation of a line in standard form.',
        category: 'Algebra',
    },
    {
        title: 'Quadratic Formula',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        description: 'Solve quadratic equations of the form ax² + bx + c = 0.',
        category: 'Algebra',
    },
    {
        title: 'Vertex Form of a Quadratic',
        latex: 'y = a(x - h)^2 + k',
        description: 'Equation of a quadratic function in vertex form.',
        category: 'Algebra',
    },
    {
        title: 'Discriminant of a Quadratic',
        latex: 'D = b^2 - 4ac',
        description: 'Determines the nature of the roots of a quadratic equation.',
        category: 'Algebra',
    },
    {
        title: 'Distance Formula',
        latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
        description: 'Distance between two points in the plane.',
        category: 'Geometry',
    },
    {
        title: 'Midpoint Formula',
        latex: 'M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)',
        description: 'Coordinates of the midpoint between two points.',
        category: 'Geometry',
    },
    {
        title: 'Square',
        latex: 'Area: A = s^2 \\,\\,\\, Perimeter: P = 4s',
        description: 'Properties of a square.',
        category: 'Geometry',
    },
    {
        title: 'Rectangle',
        latex: 'Area: A = l \\times w \\,\\,\\, Perimeter: P = 2(l + w)',
        description: 'Properties of a rectangle.',
        category: 'Geometry',
    },
    {
        title: 'Triangle',
        latex: 'Area: A = \\frac{1}{2}bh \\,\\,\\, Perimeter: P = a + b + c',
        description: 'Properties of a triangle.',
        category: 'Geometry',
    },
    {
        title: 'Circle',
        latex: 'Area: A = \\pi r^2 \\,\\,\\, Circumference: C = 2 \\pi r',
        description: 'Properties of a circle.',
        category: 'Geometry',
    },
    {
        title: 'Trapezoid',
        latex: 'Area: A = \\frac{1}{2}(a + b)h \\newline Perimeter: P = a + b + c + d',
        description: 'Properties of a trapezoid.',
        category: 'Geometry',
    },
    {
        title: 'Parallelogram',
        latex: 'Area: A = bh \\,\\,\\, Perimeter: P = 2(a + b)',
        description: 'Properties of a parallelogram.',
        category: 'Geometry',
    },
    {
        title: 'Cube',
        latex: 'Volume: V = s^3 \\,\\,\\, Surface Area: SA = 6s^2',
        description: 'Properties of a cube.',
        category: 'Geometry',
    },
    {
        title: 'Rectangular Prism / Box',
        latex: 'Volume: V = l \\times w \\times h \\newline Surface Area: SA = 2(lw + lh + wh)',
        description: 'Properties of a rectangular prism or box.',
        category: 'Geometry',
    },
    {
        title: 'Sphere',
        latex: 'Volume: V = \\frac{4}{3} \\pi r^3 \\newline Surface Area: SA = 4 \\pi r^2',
        description: 'Properties of a sphere with radius r.',
        category: 'Geometry',
    },
    {
        title: 'Cylinder',
        latex: 'Volume: V = \\pi r^2 h \\newline Surface Area: SA = 2 \\pi r(h + r)',
        description: 'Properties of a cylinder with radius r and height h.',
        category: 'Geometry',
    },
    {
        title: 'Cone',
        latex: 'Volume: V = \\frac{1}{3} \\pi r^2 h \\newline Surface Area: SA = \\pi r(r + l)',
        description: 'Properties of a cone with radius r and height h.',
        category: 'Geometry',
    },
    {
        title: 'Pythagorean Theorem',
        latex: 'a^2 + b^2 = c^2',
        description: 'Relates the sides of a right triangle.',
        category: 'Trigonometry',
    },
    {
        title: 'Right triangle definition',
        latex: '\\sin(\\theta) = \\frac{opposite}{hypotenuse} \\csc(\\theta) = \\frac{hypotenuse}{opposite} \\newline\\newline \\cos(\\theta) = \\frac{adjacent}{hypotenuse} \\sec(\\theta) = \\frac{hypotenuse}{adjacent} \\newline\\newline \\tan(\\theta) = \\frac{opposite}{adjacent} \\cot(\\theta) = \\frac{adjacent}{opposite}',
        description: 'Properties of a right triangle with angle θ.',
        category: 'Trigonometry',
    },
    {
        title: 'Unit Circle Definition',
        latex: '\\sin(\\theta) = y \\ csc(θ) = \\frac{1}{y} \\newline\\newline \\cos(\\theta) = x \\ sec(θ) = \\frac{1}{x} \\newline\\newline \\tan(\\theta) = \\frac{y}{x} \\ cot(θ) = \\frac{x}{y}',
        description: 'For this definition θ is any angle. The hypotenuse is always 1, the opposite is the y-coordinate, and the adjacent is the x-coordinate.',
        category: 'Trigonometry',
    },
    {
        title: 'Tangent and Cotangent Identities',
        latex: '\\tan(\\theta) = \\frac{\\sin(\\theta)}{\\cos(\\theta)} \\newline\\newline \\cot(\\theta) = \\frac{\\cos(\\theta)}{\\sin(\\theta)}',
        description: 'Tangent and cotangent in terms of sine and cosine.',
        category: 'Trigonometry',
    },
    {
        title: 'Reciprocal Identities',
        latex: '\\csc(\\theta) = \\frac{1}{\\sin(\\theta)} \\sec(\\theta) = \\frac{1}{\\cos(\\theta)} \\cot(\\theta) = \\frac{1}{\\tan(\\theta)} \\newline\\newline \\sin(\\theta) = \\frac{1}{\\csc(\\theta)} \\cos(\\theta) = \\frac{1}{\\sec(\\theta)} \\tan(\\theta) = \\frac{1}{\\cot(\\theta)}',
        description: 'Reciprocal identities for trigonometric functions.',
        category: 'Trigonometry',
    },
    {
        title: 'Pythagorean Identities',
        latex: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1 \\newline\\newline \\tan^2(\\theta) + 1 = \\sec^2(\\theta) \\newline\\newline 1 + \\cot^2(\\theta) = \\csc^2(\\theta)',
        description: 'Pythagorean identities for trigonometric functions.',
        category: 'Trigonometry',
    },
    {
        title: 'Even/Odd Formulas',
        latex: '\\sin(-\\theta) = -\\sin(\\theta) \\quad \\cos(-\\theta) = \\cos(\\theta) \\quad \\newline\\newline \\tan(-\\theta) = -\\tan(\\theta)',
        description: 'Properties of even and odd trigonometric functions.',
        category: 'Trigonometry',
    },
    {
        title: 'Periodic Formulas',
        latex: '\\sin(\\theta + 2\\pi) = \\sin(\\theta) \\quad \\cos(\\theta + 2\\pi) = \\cos(\\theta) \\quad \\newline\\newline \\tan(\\theta + \\pi) = \\tan(\\theta)',
        description: 'Properties of periodic trigonometric functions.',
        category: 'Trigonometry',
    },
    {
        title: 'Degrees to Radians Formulas',
        latex: '\\text{Radians} = \\text{Degrees} \\times \\frac{\\pi}{180} \\newline\\newline \\text{Degrees} = \\text{Radians} \\times \\frac{180}{\\pi}',
        description: 'Converting between degrees and radians. If x is an angle in degrees and t is an angle in radians.',
        category: 'Trigonometry',
    },
    {
        title: 'Half Angle Formulas',
        latex: '\\sin\\left(\\frac{\\theta}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(\\theta)}{2}} \\quad \\newline\\newline \\cos\\left(\\frac{\\theta}{2}\\right) = \\pm \\sqrt{\\frac{1 + \\cos(\\theta)}{2}} \\quad \\newline\\newline \\tan\\left(\\frac{\\theta}{2}\\right) = \\pm \\sqrt{\\frac{1 - \\cos(\\theta)}{1 + \\cos(\\theta)}}',
        description: 'Formulas for the sine, cosine, and tangent of half an angle.',
        category: 'Trigonometry',
    },
    {
        title: 'Sum and Difference Formulas',
        latex: '\\sin(\\alpha \\pm \\beta) = \\sin(\\alpha)\\cos(\\beta) \\pm \\cos(\\alpha)\\sin(\\beta) \\newline\\newline \\cos(\\alpha \\pm \\beta) = \\cos(\\alpha)\\cos(\\beta) \\mp \\sin(\\alpha)\\sin(\\beta)',
        description: 'Formulas for the sine and cosine of the sum or difference of two angles.',
        category: 'Trigonometry',
    },
    {
        title: 'Product to Sum Formulas',
        latex: '\\sin(\\alpha)\\cos(\\beta) = \\frac{1}{2}[\\sin(\\alpha + \\beta) + \\sin(\\alpha - \\beta)] \\newline\\newline \\cos(\\alpha)\\sin(\\beta) = \\frac{1}{2}[\\sin(\\alpha + \\beta) - \\sin(\\alpha - \\beta)] \\newline\\newline \\cos(\\alpha)\\cos(\\beta) = \\frac{1}{2}[\\cos(\\alpha + \\beta) + \\cos(\\alpha - \\beta)]',
        description: 'Formulas for converting products of trigonometric functions to sums.',
        category: 'Trigonometry',
    },
    {
        title: 'Sum to Product Formulas',
        latex: '\\sin(\\alpha) + \\sin(\\beta) = 2 \\sin\\left(\\frac{\\alpha + \\beta}{2}\\right) \\cos\\left(\\frac{\\alpha - \\beta}{2}\\right) \\newline\\newline \\sin(\\alpha) - \\sin(\\beta) = 2 \\cos\\left(\\frac{\\alpha + \\beta}{2}\\right) \\sin\\left(\\frac{\\alpha - \\beta}{2}\\right) \\newline\\newline \\cos(\\alpha) + \\cos(\\beta) = 2 \\cos\\left(\\frac{\\alpha + \\beta}{2}\\right) \\cos\\left(\\frac{\\alpha - \\beta}{2}\\right) \\newline\\newline \\cos(\\alpha) - \\cos(\\beta) = -2 \\sin\\left(\\frac{\\alpha + \\beta}{2}\\right) \\sin\\left(\\frac{\\alpha - \\beta}{2}\\right)',
        description: 'Formulas for converting sums of trigonometric functions to products.',
        category: 'Trigonometry',
    },
    {
        title: 'Cofunction Formulas',
        latex: '\\sin(\\alpha) = \\cos\\left(\\frac{\\pi}{2} - \\alpha\\right) \\quad \\cos(\\alpha) = \\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) \\newline\\newline \\tan(\\alpha) = \\cot\\left(\\frac{\\pi}{2} - \\alpha\\right) \\quad \\cot(\\alpha) = \\tan\\left(\\frac{\\pi}{2} - \\alpha\\right)',
        description: 'Formulas relating sine and cosine of complementary angles.',
        category: 'Trigonometry',
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
                                                        className="rounded-3xl mb-4 border border-slate-200 bg-white p-5 shadow-sm"
                                                    >
                                                        <div className="mb-3">
                                                            <div className="flex items-baseline justify-between gap-3">
                                                                <h2 className="text-xl font-semibold text-slate-900">{formula.title}</h2>
                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                                                                    {formula.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 text-center text-slate-900">
                                                            <TeX block>{formula.latex}</TeX>
                                                        </div>
                                                        <p className="text-slate-600">{formula.description}</p>
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
