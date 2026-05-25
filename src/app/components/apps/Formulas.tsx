'use client';

import { useEffect, useMemo, useState } from 'react';
import TeX from '@matejmazur/react-katex';

type Formula = {
    title: string;
    latex: string;
    description: string;
    category: string;
    subcategory?: string;
};

const formulas: Formula[] = [
    {
        title: 'Operators',
        latex: 'Addition: + \\newline Subtraction: - \\newline Multiplication: \\times \\newline Division: \\div \\newline Equality: = \\newline Inequality: \\neq \\newline Approximation: \\approx \\newline Greater Than: > \\newline Less Than: < \\newline Greater Than Or Equal To: \\geq \\newline Less Than Or Equal To: \\leq \\newline Equivalence: \\equiv \\newline Proportionality: \\propto \\newline Similarity: \\sim \\newline Asymptotic Equality: \\simeq \\newline Congruence: \\cong \\newline Square Root: \\sqrt{x} \\newline Cube Root: \\sqrt[3]{x} \\newline nth Root: \\sqrt[n]{x} \\newline Factorial: n! \\newline Modulo: a \\mod b',
        description: 'The basic mathematical operators for arithmetic, comparison, and other operations.',
        category: 'Symbols',
    },
    {
        title: 'Delta',
        latex: '\\Delta',
        description: 'The symbol Δ is used in mathematics to represent change or difference. It is often used to denote the difference between two values, such as Δx (the change in x) or Δy (the change in y).',
        category: 'Symbols',
    },
    {
        title: 'Differential',
        latex: 'd',
        description: 'The differential is a fundamental concept in calculus used to represent an infinitesimally small change in a variable.',
        category: 'Symbols',
    },
    {
        title: 'Integral',
        latex: '\\int',
        description: 'The integral is a fundamental concept in calculus used to calculate the area under a curve or the accumulation of a quantity.',
        category: 'Symbols',
    },
    {
        title: 'Summation',
        latex: '\\sum',
        description: 'The summation is a fundamental concept in mathematics used to calculate the sum of a sequence of numbers.',
        category: 'Symbols',
    },
    {
        title: 'Product',
        latex: '\\prod',
        description: 'The product is a fundamental concept in mathematics used to calculate the product of a sequence of numbers.',
        category: 'Symbols',
    },
    {
        title: 'Set',
        latex: '\\{ ... \\}',
        description: 'A collection of distinct objects, considered as an object in its own right.',
        category: 'Symbols',
    },
    {
        title: 'Intersection',
        latex: 'A \\cap B',
        description: 'The intersection of two sets A and B is the set of elements that are in both A and B.',
        category: 'Symbols',
    },
    {
        title: 'Union',
        latex: 'A \\cup B',
        description: 'The union of two sets A and B is the set of elements that are in either A or B (or both).',
        category: 'Symbols',
    },
    {
        title: 'Proper Subset',
        latex: 'A \\subset B',
        description: 'Set A is a proper subset of set B if every element of A is in B, but A is not equal to B.',
        category: 'Symbols',
    },
    {
        title: 'Subset',
        latex: 'A \\subseteq B',
        description: 'Set A is a subset of set B if every element of A is in B.',
        category: 'Symbols',
    },
    {
        title: 'Proper Superset',
        latex: 'A \\supset B',
        description: 'Set A is a proper superset of set B if every element of B is in A, but A is not equal to B.',
        category: 'Symbols',
    },
    {
        title: 'Superset',
        latex: 'A \\supseteq B',
        description: 'Set A is a superset of set B if every element of B is in A.',
        category: 'Symbols',
    },
    {
        title: 'Not Subset',
        latex: 'A \\nsubseteq B',
        description: 'Set A is not a subset of set B.',
        category: 'Symbols',
    },
    {
        title: 'Not Superset',
        latex: 'A \\nsupseteq B',
        description: 'Set A is not a superset of set B.',
        category: 'Symbols',
    },
    {
        title: 'Complement',
        latex: 'A^c',
        description: 'The complement of set A is the set of all elements in the universal set that are not in A.',
        category: 'Symbols',
    },
    {
        title: 'Relative Complement',
        latex: 'A \\setminus B',
        description: 'The relative complement of set B in set A is the set of elements that are in A but not in B.',
        category: 'Symbols',
    },
    {
        title: 'Symmetric Difference',
        latex: 'A \\bigoplus B',
        description: 'The symmetric difference of two sets A and B is the set of elements that are in either A or B, but not in both.',
        category: 'Symbols',
    },
    {
        title: 'Set Membership',
        latex: 'x \\in A',
        description: 'Element x is a member of set A.',
        category: 'Symbols',
    },
    {
        title: 'No Set Membership',
        latex: 'x \\notin A',
        description: 'Element x is not a member of set A.',
        category: 'Symbols',
    },
    {
        title: 'Ordered Pair',
        latex: '(x, y)',
        description: 'An ordered pair is a collection of two elements where the order matters.',
        category: 'Symbols',
    },
    {
        title: 'Cartesian Product',
        latex: 'A \\times B',
        description: 'The Cartesian product of two sets A and B is the set of all ordered pairs (a, b) where a is in A and b is in B.',
        category: 'Symbols',
    },
    {
        title: 'Cardinality',
        latex: '|A|',
        description: 'The cardinality of a set A is the number of elements in A.',
        category: 'Symbols',
    },
    {
        title: 'Empty Set',
        latex: '\\emptyset',
        description: 'The empty set is the set that contains no elements.',
        category: 'Symbols',
    },
    {
        title: 'Universal Set',
        latex: 'U',
        description: 'The universal set is the set that contains all elements under consideration.',
        category: 'Symbols',
    },
    {
        title: 'Natural Numbers',
        latex: '\\mathbb{N}',
        description: 'The set of all natural numbers.',
        category: 'Symbols',
    },
    {
        title: 'Rational Numbers',
        latex: '\\mathbb{Q}',
        description: 'The set of all rational numbers.',
        category: 'Symbols',
    },
    {
        title: 'Real Numbers',
        latex: '\\mathbb{R}',
        description: 'The set of all real numbers.',
        category: 'Symbols',
    },
    {
        title: 'Complex Numbers',
        latex: '\\mathbb{C}',
        description: 'The set of all complex numbers.',
        category: 'Symbols',
    },
    {
        title: 'Integer Numbers',
        latex: '\\mathbb{Z}',
        description: 'The set of all integer numbers.',
        category: 'Symbols',
    },
    {
        title: 'Pi',
        latex: '\\pi',
        description: 'The ratio of a circle\'s circumference to its diameter. Approximately equal to 3.141592653589793',
        category: 'Constants',
    },
    {
        title: 'Euler\'s Number',
        latex: 'e',
        description: 'The base of the natural logarithm, approximately equal to 2.718281828459045',
        category: 'Constants',
    },
    {
        title: 'Golden Ratio',
        latex: '\\phi',
        description: 'The golden ratio, approximately equal to 1.618033988749895',
        category: 'Constants',
    },
    {
        title: 'Imaginary Unit',
        latex: 'i',
        description: 'The imaginary unit, defined as the square root of -1.',
        category: 'Constants',
    },
    {
        title: 'Euler-Mascheroni Constant',
        latex: '\\gamma',
        description: 'The Euler-Mascheroni constant, approximately equal to 0.577215664915366',
        category: 'Constants',
    },
    {
        title: 'Speed of Light',
        latex: 'c',
        description: 'The speed of light in a vacuum, approximately equal to 299,792,458 meters per second.',
        category: 'Constants',
    },
    {
        title: 'Gravitational Constant',
        latex: 'G',
        description: 'The gravitational constant, approximately equal to 6.67430 × 10^-11 m^3 kg^-1 s^-2.',
        category: 'Constants',
    },
    {
        title: 'Planck’s Constant',
        latex: 'h',
        description: 'Planck’s constant, approximately equal to 6.62607015 × 10^-34 J·s.',
        category: 'Constants',
    },
    {
        title: 'Elementary Charge',
        latex: 'e',
        description: 'The elementary charge, approximately equal to 1.602176634 × 10^-19 coulombs.',
        category: 'Constants',
    },
    {
        title: 'Boltzmann Constant',
        latex: 'k_B',
        description: 'The Boltzmann constant, approximately equal to 1.380649 × 10^-23 J/K.',
        category: 'Constants',
    },
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
        title: 'Double-Angle Formulas',
        latex: '\\sin(2\\alpha) = 2\\sin(\\alpha)\\cos(\\alpha) \\quad \\cos(2\\alpha) = \\cos^2(\\alpha) - \\sin^2(\\alpha) = 2\\cos^2(\\alpha) - 1 = 1 - 2\\sin^2(\\alpha) \\quad \\tan(2\\alpha) = \\frac{2\\tan(\\alpha)}{1 - \\tan^2(\\alpha)}',
        description: 'Formulas for the sine, cosine, and tangent of double an angle.',
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
        title: 'Definition of Scalar, Vector, Matrix, and Tensor',
        latex: '\\text{Scalar: } s \\in \\mathbb{R} \\newline\\newline \\text{Vector: } \\mathbf{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{bmatrix} \\newline\\newline \\text{Matrix: } A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix} \\newline\\newline \\text{Tensor: } T = (t_{i_1 i_2 ... i_k})',
        description: 'Definitions of scalar, vector, matrix, and tensor.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Definition',
        latex: 'A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix}',
        description: 'A matrix is a rectangular array of numbers, symbols, or expressions arranged in rows and columns.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Addition',
        latex: 'A + B = \\begin{bmatrix} a_{11} + b_{11} & a_{12} + b_{12} & \\cdots & a_{1n} + b_{1n} \\\\ a_{21} + b_{21} & a_{22} + b_{22} & \\cdots & a_{2n} + b_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} + b_{m1} & a_{m2} + b_{m2} & \\cdots & a_{mn} + b_{mn} \\end{bmatrix}',
        description: 'The sum of two matrices of the same dimensions is obtained by adding corresponding elements.',
        category: 'Linear Algebra',
    },
    {
        title: 'Norm of a Matrix',
        latex: '\\|A\\| = \\sqrt{\\sum_{i=1}^{m} \\sum_{j=1}^{n} |a_{ij}|^2}',
        description: 'The norm of a matrix is a measure of its size, calculated as the square root of the sum of the squares of its elements.',
        category: 'Linear Algebra',
    },
    {
        title: 'Transpose of a Matrix A',
        latex: 'A^T = \\begin{bmatrix} a_{11} & a_{21} & \\cdots & a_{m1} \\\\ a_{12} & a_{22} & \\cdots & a_{m2} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{1n} & a_{2n} & \\cdots & a_{mn} \\end{bmatrix}',
        description: 'The transpose of a matrix is obtained by swapping its rows and columns.',
        category: 'Linear Algebra',
    },
    {
        title: 'Transpose Property of Matricies A and B',
        latex: '(A + B)^T = A^T + B^T',
        description: 'The transpose of the sum of two matrices is equal to the sum of their transposes.',
        category: 'Linear Algebra',
    },
    {
        title: 'Inverse Property of Matricies A and B',
        latex: '(AB)^{-1} = B^{-1}A^{-1}',
        description: 'The inverse of the product of two matrices is equal to the product of their inverses in reverse order.',
        category: 'Linear Algebra',
    },
    {
        title: 'Determinant Property of Matricies A and B',
        latex: '(AB) = |A||B|',
        description: 'The determinant of the product of two matrices is equal to the product of their determinants.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Determinant (2x2)',
        latex: '|A| = \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}',
        description: 'The determinant of a 2x2 matrix is calculated as the product of the diagonal elements minus the product of the off-diagonal elements.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Determinant (3x3) using the rule of Sarrus',
        latex: '|A| = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix} \\newline = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} \\newline - (a_{13}a_{22}a_{31} + a_{11}a_{23}a_{32} + a_{12}a_{21}a_{33})',
        description: 'The determinant of a 3x3 matrix is calculated using the rule of Sarrus or cofactor expansion.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Determinant (3x3) using cofactor expansion',
        latex: '|A| = a_{11} \\begin{vmatrix} a_{22} & a_{23} \\\\ a_{32} & a_{33} \\end{vmatrix} - a_{12} \\begin{vmatrix} a_{21} & a_{23} \\\\ a_{31} & a_{33} \\end{vmatrix} + a_{13} \\begin{vmatrix} a_{21} & a_{22} \\\\ a_{31} & a_{32} \\end{vmatrix}',
        description: 'The determinant of a 3x3 matrix is calculated using the rule of Sarrus or cofactor expansion.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Inverse',
        latex: 'A^{-1} = \\frac{1}{|A|} \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix}',
        description: 'The inverse of a matrix is a matrix that, when multiplied by the original matrix, gives the identity matrix.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Multiplication (2x2)',
        latex: 'AB = \\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix} \\begin{bmatrix} b_{11} & b_{12} \\\\ b_{21} & b_{22} \\end{bmatrix} \\newline = \\begin{bmatrix} a_{11}b_{11} + a_{12}b_{21} & a_{11}b_{12} + a_{12}b_{22} \\\\ a_{21}b_{11} + a_{22}b_{21} & a_{21}b_{12} + a_{22}b_{22} \\end{bmatrix}',
        description: 'The product of two matrices is obtained by multiplying corresponding elements and summing them.',
        category: 'Linear Algebra',
    },
    {
        title: 'Matrix Multiplication (3x3)',
        latex: 'AB = \\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{bmatrix} \\begin{bmatrix} b_{11} & b_{12} & b_{13} \\\\ b_{21} & b_{22} & b_{23} \\\\ b_{31} & b_{32} & b_{33} \\end{bmatrix} \\newline = \\begin{bmatrix} a_{11}b_{11} + a_{12}b_{21} + a_{13}b_{31} & a_{11}b_{12} + a_{12}b_{22} + a_{13}b_{32} & a_{11}b_{13} + a_{12}b_{23} + a_{13}b_{33} \\\\ a_{21}b_{11} + a_{22}b_{21} + a_{23}b_{31} & a_{21}b_{12} + a_{22}b_{22} + a_{23}b_{32} & a_{21}b_{13} + a_{22}b_{23}+a _{23 }b _{33 } \\\\ a _{31 }b _{11 }+a _{32 }b _{21 }+a _{33 }b _{31 }&a _{31 }b _{12 }+a _{32 }b _{22 }+a _{33 }b _{32 }&a _{31 }b _{13 }+a _{32 }b _{23}+a _{33 }b _{33 } \\end{bmatrix}',
        description: 'The product of two matrices is obtained by multiplying corresponding elements and summing them.',
        category: 'Linear Algebra',
    },
    {
        title: 'Dot Product of Matrices',
        latex: 'A \\cdot B = a_{11}b_{11} + a_{12}b_{12} + \\cdots + a_{mn}b_{mn}',
        description: 'The dot product of two matrices is the sum of the products of their corresponding components.',
        category: 'Linear Algebra',
    },
    {
        title: 'Cross Product of Matrices',
        latex: 'A \\times B = \\begin{bmatrix} a_{12}b_{13} - a_{13}b_{12} \\\\ a_{13}b_{11} - a_{11}b_{13} \\\\ a_{11}b_{12} - a_{12}b_{11} \\end{bmatrix}',
        description: 'The cross product of two matrices is a vector that is perpendicular to both matrices.',
        category: 'Linear Algebra',
    },
    {
        title: 'Projection of Matrices',
        latex: '\\text{proj}_B(A) = \\frac{A \\cdot B}{\\|B\\|^2} B',
        description: 'The projection of one matrix onto another is a measure of how much of the first matrix points in the direction of the second.',
        category: 'Linear Algebra',
    },
    {
        title: 'Eigenvalues of a Matrix',
        latex: 'Av = \\lambda v',
        description: 'Eigenvalues and eigenvectors are special values and vectors associated with a matrix.',
        category: 'Linear Algebra',
    },
    {
        title: 'Derivative Definition',
        latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
        description: 'Definition of the derivative of a function at a point.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of a Constant',
        latex: '\\frac{d}{dx} c = 0',
        description: 'The derivative of a constant is zero.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of a Constant Multiplied by a Function',
        latex: '\\frac{d}{dx} [cf(x)] = c f\'(x)',
        description: 'The derivative of a constant multiplied by a function is the constant times the derivative of the function.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of a Variable to a Power',
        latex: '\\frac{d}{dx} x^n = nx^{n-1}',
        description: 'The power rule for derivatives states that the derivative of x raised to the power of n is n times x raised to the power of n minus 1.',
        category: 'Calculus',
    },
    {
        title: 'Product Rule for Derivatives',
        latex: '\\frac{d}{dx} [f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
        description: 'The product rule for derivatives states that the derivative of the product of two functions is the derivative of the first function times the second function plus the first function times the derivative of the second function.',
        category: 'Calculus',
    },
    {
        title: 'Quotient Rule for Derivatives',
        latex: '\\frac{d}{dx} \\left( \\frac{f(x)}{g(x)} \\right) = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}',
        description: 'The quotient rule for derivatives states that the derivative of the quotient of two functions is the derivative of the numerator times the denominator minus the numerator times the derivative of the denominator, all divided by the square of the denominator.',
        category: 'Calculus',
    },
    {
        title: 'Chain Rule for Derivatives',
        latex: '\\frac{d}{dx} [f(g(x))] = f\'(g(x))g\'(x)',
        description: 'The chain rule for derivatives states that the derivative of a composite function is the derivative of the outer function evaluated at the inner function times the derivative of the inner function.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of a Addition of Subtraction of Functions',
        latex: '\\frac{d}{dx} [f(x) \\pm g(x)] = f\'(x) \\pm g\'(x)',
        description: 'The derivative of the sum or difference of two functions is the sum or difference of their derivatives.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of an Exponential Function',
        latex: '\\frac{d}{dx} e^x = e^x',
        description: 'The derivative of the exponential function is the exponential function itself.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of an Exponential To the Power of a Function',
        latex: '\\frac{d}{dx} e^{u(x)} = e^{u(x)} u\'(x)',
        description: 'The derivative of an exponential function with a variable exponent is the exponential function times the derivative of the exponent.',
        category: 'Calculus',
    },
    {
        title: 'Derivative of a Natural Logarithm of a Function',
        latex: '\\frac{d}{dx} \\ln(u(x)) = \\frac{u\'(x)}{u(x)}',
        description: 'The derivative of the natural logarithm of a function is the derivative of the function divided by the function itself.',
        category: 'Calculus',
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
    {
        title: 'Simple Probability',
        latex: 'P(A) = \\frac{\\text{Number of favorable outcomes}}{\\text{Total number of outcomes}}',
        description: 'The probability of an event A occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Complement Rule',
        latex: 'P(A^c) = 1 - P(A)',
        description: 'The probability of the complement of an event A occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Addition Rule (Any Events)',
        latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
        description: 'The probability of the union of two events A and B occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Addition Rule (Mutually Exclusive Events)',
        latex: 'P(A \\cup B) = P(A) + P(B)',
        description: 'The probability of the union of two mutually exclusive events A and B occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Multiplication Rule (Any Events)',
        latex: 'P(A \\cap B) = P(A) \\cdot P(B)',
        description: 'The probability of the intersection of two events A and B occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Multiplication Rule (Independent Events)',
        latex: 'P(A \\cap B) = P(A) \\cdot P(B)',
        description: 'The probability of the intersection of two independent events A and B occurring.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Conditional Probability (Bayes’ Theorem)',
        latex: 'P(A | B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(B | A) P(A)}{P(B)}',
        description: 'The probability of event A occurring given that event B has occurred.',
        category: 'Statistics and Probability',
        subcategory: 'Basic Probability',
    },
    {
        title: 'Factorials',
        latex: 'n! = n \\cdot (n-1) \\cdot (n-2) \\cdots 1',
        description: 'The factorial of a positive integer n is the product of all positive integers less than or equal to n.',
        category: 'Statistics and Probability',
        subcategory: 'Combinatorics',
    },
    {
        title: 'Permutations',
        latex: 'P(n, r) = \\frac{n!}{(n-r)!}',
        description: 'The number of ways to arrange r objects from a set of n distinct objects.',
        category: 'Statistics and Probability',
        subcategory: 'Combinatorics',
    },
    {
        title: 'Combinations',
        latex: 'C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}',
        description: 'The number of ways to choose r objects from a set of n distinct objects.',
        category: 'Statistics and Probability',
        subcategory: 'Combinatorics',
    },
    {
        title: 'Mean (Average)',
        latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i',
        description: 'The mean (average) of a set of n numbers is the sum of the numbers divided by n.',
        category: 'Statistics and Probability',
        subcategory: 'Statistics',
    },
    {
        title: 'Variance',
        latex: '\\sigma^2 = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2',
        description: 'The variance of a set of n numbers is the average of the squared differences from the mean.',
        category: 'Statistics and Probability',
        subcategory: 'Statistics',
    },
    {
        title: 'Standard Deviation',
        latex: '\\sigma = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}',
        description: 'The standard deviation of a set of n numbers is the square root of the variance.',
        category: 'Statistics and Probability',
        subcategory: 'Statistics',
    },
    {
        title: 'Z-Score',
        latex: 'z = \\frac{x - \\bar{x}}{\\sigma}',
        description: 'The Z-score of a data point is the number of standard deviations it is from the mean.',
        category: 'Statistics and Probability',
        subcategory: 'Statistics',
    },
    {
        title: 'Normal Distribution Formula',
        latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}',
        description: 'The probability density function of a normal distribution with mean μ and standard deviation σ.',
        category: 'Statistics and Probability',
        subcategory: 'Probability Distributions',
    },
    {
        title: 'Binomial Probability Formula',
        latex: 'P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}',
        description: 'The probability of getting exactly k successes in n independent Bernoulli trials, each with success probability p.',
        category: 'Statistics and Probability',
        subcategory: 'Probability Distributions',
    },
    {
        title: 'Binomial Mean & Standard Deviation',
        latex: '\\mu = np \\quad \\sigma = \\sqrt{np(1-p)}',
        description: 'The mean and standard deviation of a binomial distribution with n trials and success probability p.',
        category: 'Statistics and Probability',
        subcategory: 'Probability Distributions',
    },
    {
        title: 'Poisson Distribution Formula',
        latex: 'P(X = k) = \\frac{(\\lambda t)^k e^{-\\lambda t}}{k!}',
        description: 'The probability of observing k events in a fixed interval of time or space, given the average number of events (λt) in that interval.',
        category: 'Statistics and Probability',
        subcategory: 'Probability Distributions',
    },
    {
        title: 'Complex number and Conjugate',
        latex: 'z = a + bi \\newline \\bar{z} = a - bi',
        description: 'A complex number z consists of a real part a and an imaginary part b. The conjugate of z is denoted by \\bar{z} and is obtained by changing the sign of the imaginary part.',
        category: 'Complex Analysis',
    },
    {
        title: 'Modulus of a Complex Number',
        latex: '|z| = \\sqrt{a^2 + b^2}',
        description: 'The modulus of a complex number z = a + bi is the distance from the origin to the point (a, b) in the complex plane.',
        category: 'Complex Analysis',
    },
    {
        title: 'Euler’s Identity',
        latex: 'e^{i\\pi} + 1 = 0',
        description: 'A fundamental identity combining e, i, π, 1, and 0.',
        category: 'Complex Analysis',
    },
    {
        title: 'Euler’s Formula',
        latex: 'e^{ix} = \\cos(x) + i\\sin(x)',
        description: 'Relates complex exponentials to trigonometric functions.',
        category: 'Complex Analysis',
    },
    {
        title: 'Euler’s Formula in Polar Form',
        latex: 'z = |z| e^{i\\theta}',
        description: 'Represents a complex number in polar form, where |z| is the modulus and θ is the argument.',
        category: 'Complex Analysis',
    },
    {
        title: 'Contour Integral Definition',
        latex: '\\oint_{C} f(z) \\, dz',
        description: 'A contour integral of a complex function f(z) along a closed curve C in the complex plane.',
        category: 'Complex Analysis',
    },
    {
        title: 'Cauchy’s Theorem',
        latex: '\\oint_{C} f(z) \\, dz',
        description: 'If f(z) is analytic (holomorphic) on and inside a closed curve C, then the contour integral of f(z) around C is zero.',
        category: 'Complex Analysis',
    },
    {
        title: 'Cauchy’s Integral Formula',
        latex: 'f(a) = \\frac{1}{2\\pi i} \\oint_{C} \\frac{f(z)}{z-a} \\, dz',
        description: 'A fundamental formula in complex analysis that relates the value of an analytic function at a point to its values on a closed curve surrounding that point.',
        category: 'Complex Analysis',
    },
    {
        title: 'General Derivative Formula',
        latex: 'f^{(n)}(a) = \\frac{n!}{2\\pi i} \\oint_{C} \\frac{f(z)}{(z-a)^{n+1}} \\, dz',
        description: 'A generalization of Cauchy’s integral formula that gives the nth derivative of an analytic function at a point in terms of a contour integral around that point.',
        category: 'Complex Analysis',
    },
    {
        title: 'Residue Theorem',
        latex: '\\text{Res}(f, a) = \\frac{1}{(n-1)!} \\lim_{z \\to a} \\frac{d^{n-1}}{dz^{n-1}}[(z-a)^n f(z)]',
        description: 'A theorem in complex analysis that relates the residue of a function at a singularity to its behavior near that point.',
        category: 'Complex Analysis',
    },
    {
        title: 'Residue at a simple pole z0:',
        latex: '\\text{Res}(f, z_{0}) = \\lim_{z \\to z_{0}} (z - z_{0}) f(z)   ',
        description: 'The residue of a function f at a simple pole z₀ is the limit as z approaches z₀ of (z - z₀)f(z).',
        category: 'Complex Analysis',
    },
    {
        title: 'Taylor Series Expansion',
        latex: 'f(z) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (z-a)^n',
        description: 'A series expansion of a complex function that represents the function as an infinite sum of terms calculated from the derivatives of the function at a single point.',
        category: 'Complex Analysis',
    },
    {
        title: 'Laurent Series Expansion',
        latex: 'f(z) = \\sum_{n=-\\infty}^{\\infty} a_n (z-a)^n',
        description: 'A series expansion of a complex function that includes both positive and negative powers of (z - a), used to represent functions with singularities.',
        category: 'Complex Analysis',
    },
    {
        title: 'Average Velocity',
        latex: 'v_{avg} = \\frac{\\Delta x}{\\Delta t}',
        description: 'The average velocity of an object over a given time interval.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Average Acceleration',
        latex: 'a_{avg} = \\frac{\\Delta v}{\\Delta t}',
        description: 'The average acceleration of an object over a given time interval.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Displacement Formula',
        latex: 'x = x_0 + v_0 t + \\frac{1}{2} a t^2',
        description: 'A formula for calculating displacement when initial velocity and acceleration are known.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Final Velocity Formula',
        latex: 'v_f = v_0 + a t',
        description: 'A formula for calculating the final velocity of an object given its initial velocity, acceleration, and time.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Time Formula',
        latex: 't = \\frac{v_f - v_0}{a}',
        description: 'A formula for calculating the time taken for an object to reach a certain velocity given its initial velocity, acceleration, and final velocity.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Acceleration Formula',
        latex: 'a = \\frac{v_f - v_0}{t}',
        description: 'A formula for calculating the acceleration of an object given its initial and final velocities and the time taken.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Basic Kinematics',
    },
    {
        title: 'Newton’s First Law of Motion',
        latex: 'F = 0 \\implies v = \\text{constant}',
        description: 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Dynamics & Forces',
    },
    {
        title: 'Newton’s Second Law of Motion',
        latex: 'F = ma \\newline\\newline a = \\frac{F}{m}',
        description: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Dynamics & Forces',
    },
    {
        title: 'Weight (Force of Gravity)',
        latex: 'W = mg',
        description: 'The force exerted on an object due to gravity.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Dynamics & Forces',
    },
    {
        title: 'Friction (Kinetic)',
        latex: 'f_k = \\mu_k N',
        description: 'The force of kinetic friction acting on an object.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Dynamics & Forces',
    },
    {
        title: 'Friction (Static max)',
        latex: 'f_s \leq \\mu_s N',
        description: 'The maximum force of static friction acting on an object.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Dynamics & Forces',
    },
    {
        title: 'Work',
        latex: 'W = Fd \\cos(\\theta)',
        description: 'The work done by a constant force acting on an object.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Work, Energy, and Power',
    },
    {
        title: 'Kinetic Energy',
        latex: 'KE = \\frac{1}{2} mv^2',
        description: 'The energy possessed by an object due to its motion.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Work, Energy, and Power',
    },
    {
        title: 'Potential Energy (Gravitational)',
        latex: 'PE = mgh',
        description: 'The energy possessed by an object due to its position in a gravitational field.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Work, Energy, and Power',
    },
    {
        title: 'Work-Energy Theorem',
        latex: 'W = \\Delta KE',
        description: 'The work done by a net force acting on an object equals the change in its kinetic energy.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Work, Energy, and Power',
    },
    {
        title: 'Power',
        latex: 'P = \\frac{W}{t} \\newline\\newline P = Fv',
        description: 'The rate at which work is done or energy is transferred.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Work, Energy, and Power',
    },
    {
        title: 'Momentum',
        latex: 'p = mv',
        description: 'The product of an object\'s mass and velocity.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Momentum & Collisions',
    },
    {
        title: 'Impulse',
        latex: 'J = \\Delta p = F \\Delta t',
        description: 'The change in momentum of an object due to a force acting over a time interval.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Momentum & Collisions',
    },
    {
        title: 'Conservation of Linear Momentum',
        latex: 'p_{initial} = p_{final}',
        description: 'The total linear momentum of a closed system remains constant over time.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Momentum & Collisions',
    },
    {
        title: 'Angular Velocity',
        latex: '\\omega = \\frac{\\theta}{t}',
        description: 'The rate of change of angular displacement with respect to time.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Rotational Motion',
    },
    {
        title: 'Angular Acceleration',
        latex: '\\alpha = \\frac{\\Delta \\omega}{\\Delta t}',
        description: 'The rate of change of angular velocity with respect to time.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Rotational Motion',
    },
    {
        title: 'Linear to Rotational Conversion',
        latex: 'v = \\omega r',
        description: 'The relationship between linear and rotational quantities.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Rotational Motion',
    },
    {
        title: 'Centripetal Acceleration',
        latex: 'a_c = \\frac{v^2}{r} = \\omega^2 r',
        description: 'The acceleration of an object moving in a circular path.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Rotational Motion',
    },
    {
        title: 'Rotational Kinematic Equation',
        latex: '\\theta = \\omega_0 t + \\frac{1}{2} \\alpha t^2',
        description: 'The relationship between angular displacement, initial angular velocity, angular acceleration, and time.',
        category: 'Mechanics and Kinematics',
        subcategory: 'Rotational Motion',
    },
    {
        title: 'The Ideal Gas Law',
        latex: 'PV = nRT',
        description: 'The relationship between pressure, volume, temperature, and the amount of an ideal gas.',
        category: 'Thermodynamics',
    },
    {
        title: 'First Law of Thermodynamics',
        latex: '\\Delta U = Q - W',
        description: 'The change in internal energy of a system is equal to the heat added to the system minus the work done by the system.',
        category: 'Thermodynamics',
    },
    {
        title: 'Heat and Work in Thermodynamics',
        latex: 'Q = m c \\Delta T \\newline\\newline W = P \\Delta V',
        description: 'Relationships between heat, work, and internal energy in thermodynamics.',
        category: 'Thermodynamics',
    },
    {
        title: 'Second Law of Thermodynamics',
        latex: '\\Delta S = \\frac{Q_{rev}}{T}',
        description: 'The entropy of an isolated system always increases over time.',
        category: 'Thermodynamics',
    },
    {
        title: 'Enthalpy \(H\) and Gibbs Free Energy \(G\)',
        latex: 'H = U + PV \\newline\\newline G = H - TS',
        description: 'The enthalpy and Gibbs free energy of a system.',
        category: 'Thermodynamics',
    },
    {
        title: 'Coulomb’s Law',
        latex: 'F = k \\frac{q_1 q_2}{r^2}',
        description: 'The force between two point charges.',
        category: 'Electricity & Magnetism',
        subcategory: 'Electrostatics',
    },
    {
        title: 'Electric Field',
        latex: 'E = k \\frac{q}{r^2}',
        description: 'The electric field at a point in space due to a point charge.',
        category: 'Electricity & Magnetism',
        subcategory: 'Electrostatics',
    },
    {
        title: 'Gauss’s Law',
        latex: '\\Phi_E = \\frac{Q_{enc}}{\\varepsilon_0}',
        description: 'The electric flux through a closed surface is equal to the charge enclosed divided by the permittivity of free space.',
        category: 'Electricity & Magnetism',
        subcategory: 'Electrostatics',
    },
    {
        title: 'Electric Potential',
        latex: 'V = k \\frac{q}{r}',
        description: 'The electric potential at a point in space due to a point charge.',
        category: 'Electricity & Magnetism',
        subcategory: 'Electrostatics',
    },
    {
        title: 'Ohm’s Law',
        latex: 'V = IR',
        description: 'The relationship between voltage, current, and resistance in an electrical circuit.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Resistance',
        latex: 'R = \\frac{V}{I} \\newline\\newline R = \\rho \\frac{L}{A}',
        description: 'The resistance of an electrical component. The first formula relates resistance to voltage and current, while the second formula relates resistance to the material\'s resistivity, length, and cross-sectional area.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Electric Power',
        latex: 'P = VI \\newline\\newline P = I^2 R \\newline\\newline P = \\frac{V^2}{R}',
        description: 'The power dissipated in an electrical component. The first formula relates power to voltage and current, while the second and third formulas relate power to current and resistance, and voltage and resistance, respectively.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Capacitance',
        latex: 'C = \\frac{Q}{V} \\newline\\newline C = \\varepsilon_0 \\frac{A}{d}',
        description: 'The capacitance of a capacitor. The first formula relates capacitance to charge and voltage, while the second formula relates capacitance to the permittivity of free space, the area of the plates, and the distance between them.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Capacitors in Series/Parallel',
        latex: 'C_{\\text{series}} = \\frac{1}{\\frac{1}{C_1} + \\frac{1}{C_2} + \\cdots + \\frac{1}{C_n}} \\newline\\newline C_{\\text{parallel}} = C_1 + C_2 + \\cdots + C_n',
        description: 'The equivalent capacitance of capacitors connected in series or parallel. The first formula relates the equivalent capacitance to the individual capacitances in series, while the second formula relates the equivalent capacitance to the individual capacitances in parallel.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Resistors in Series/Parallel',
        latex: 'R_{\\text{series}} = R_1 + R_2 + \\cdots + R_n \\newline\\newline R_{\\text{parallel}} = \\frac{1}{\\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots + \\frac{1}{R_n}}',
        description: 'The equivalent resistance of resistors connected in series or parallel. The first formula relates the equivalent resistance to the individual resistances in series, while the second formula relates the equivalent resistance to the individual resistances in parallel.',
        category: 'Electricity & Magnetism',
        subcategory: 'Current & Circuits',
    },
    {
        title: 'Magnetic Force (Moving Charge)',
        latex: 'F = qvB \\sin(\\theta)',
        description: 'The magnetic force on a moving charged particle. The force is perpendicular to both the velocity of the particle and the magnetic field.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Magnetic Force (Current-Carrying Wire)',
        latex: 'F = I L B \\sin(\\theta)',
        description: 'The magnetic force on a current-carrying wire. The force is perpendicular to both the current and the magnetic field.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Ampère’s Law',
        latex: '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}',
        description: 'The line integral of the magnetic field around a closed loop is equal to the permeability of free space times the enclosed current.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Biot-Savart Law',
        latex: 'd\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{I d\\vec{l} \\times \\hat{r}}{r^2}',
        description: 'The magnetic field produced at a point in space by a small segment of current-carrying wire.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Magnetic Flux',
        latex: '\\Phi_B = \\int \\vec{B} \\cdot d\\vec{A}',
        description: 'The magnetic flux through a surface. It is the integral of the magnetic field over the area.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Faraday’s Law of Induction',
        latex: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt}',
        description: 'The induced electromotive force in a closed loop is equal to the negative rate of change of the magnetic flux through the loop.',
        category: 'Electricity & Magnetism',
        subcategory: 'Magnetism & Electromagnetism',
    },
    {
        title: 'Gauss’s Law (Electricity)',
        latex: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}',
        description: 'The electric flux through a closed surface is equal to the charge enclosed divided by the permittivity of free space.',
        category: 'Electricity & Magnetism',
        subcategory: 'Maxwell’s Equations',
    },
    {
        title: 'Gauss’s Law (Magnetism)',
        latex: '\\oint \\vec{B} \\cdot d\\vec{A} = 0',
        description: 'The magnetic flux through a closed surface is always zero.',
        category: 'Electricity & Magnetism',
        subcategory: 'Maxwell’s Equations',
    },
    {
        title: 'Faraday’s Law',
        latex: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt}',
        description: 'The induced electromotive force in a closed loop is equal to the negative rate of change of the magnetic flux through the loop.',
        category: 'Electricity & Magnetism',
        subcategory: 'Maxwell’s Equations',
    },
    {
        title: 'Ampère’s-Maxwell Law',
        latex: '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}} + \\mu_0 \\varepsilon_0 \\frac{d\\Phi_E}{dt}',
        description: 'The line integral of the magnetic field around a closed loop is equal to the permeability of free space times the enclosed current plus the displacement current.',
        category: 'Electricity & Magnetism',
        subcategory: 'Maxwell’s Equations',
    },
    {
        title: 'Wave Speed Formula',
        latex: 'v = f \\lambda',
        description: 'The speed of a wave is equal to the product of its frequency and wavelength.',
        category: 'Waves & Optics',
        subcategory: 'Basic Wave Properties',
    },
    {
        title: 'Period Formula',
        latex: 'T = \\frac{1}{f}',
        description: 'The period of a wave is equal to the reciprocal of its frequency.',
        category: 'Waves & Optics',
        subcategory: 'Basic Wave Properties',
    },
    {
        title: 'Angular Frequency Formula',
        latex: '\\omega = 2\\pi f',
        description: 'The angular frequency of a wave is equal to 2π times its frequency.',
        category: 'Waves & Optics',
        subcategory: 'Basic Wave Properties',
    },
    {
        title: 'Wave Number Formula',
        latex: 'k = \\frac{\\omega}{v}',
        description: 'The wave number is equal to the angular frequency divided by the wave speed.',
        category: 'Waves & Optics',
        subcategory: 'Basic Wave Properties',
    },
    {
        title: 'General Wave Equation',
        latex: '\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}',
        description: 'The general equation for a wave traveling in the x-direction with speed v.',
        category: 'Waves & Optics',
        subcategory: 'Basic Wave Properties',
    },
    {
        title: 'Index of Refraction',
        latex: 'n = \\frac{c}{v}',
        description: 'The index of refraction is equal to the speed of light in a vacuum divided by the speed of light in the material.',
        category: 'Waves & Optics',
        subcategory: 'Geometric Optics',
    },
    {
        title: 'Snell\'s Law',
        latex: 'n_1 \\sin \\theta_1 = n_2 \\sin \\theta_2',
        description: 'The relationship between the angles of incidence and refraction when light passes through the interface of two different media.',
        category: 'Waves & Optics',
        subcategory: 'Geometric Optics',
    },
    {
        title: 'Critical Angle',
        latex: '\\theta_c = \\sin^{-1}\\left(\\frac{n_2}{n_1}\\right)',
        description: 'The critical angle is the angle of incidence at which light is completely reflected at the interface of two different media.',
        category: 'Waves & Optics',
        subcategory: 'Geometric Optics',
    },
    {
        title: 'Spherical Mirror / Thin Lens Equation',
        latex: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
        description: 'The relationship between the focal length of a spherical mirror or thin lens and the object and image distances.',
        category: 'Waves & Optics',
        subcategory: 'Geometric Optics',
    },
    {
        title: 'Magnification Formula',
        latex: 'm = \\frac{h_i}{h_o} = -\\frac{d_i}{d_o}',
        description: 'The magnification of an image formed by a spherical mirror or thin lens.',
        category: 'Waves & Optics',
        subcategory: 'Geometric Optics',
    },
    {
        title: 'Constructive Interference',
        latex: '\\Delta L = m \\lambda',
        description: 'The condition for constructive interference in a double-slit experiment.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
    },
    {
        title: 'Destructive Interference',
        latex: '\\Delta L = \\left(m + \\frac{1}{2}\\right) \\lambda',
        description: 'The condition for destructive interference in a double-slit experiment.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
    },
    {
        title: 'Young’s Double-Slit Fringe Separation',
        latex: '\\Delta y = \\frac{\\lambda L}{d}',
        description: 'The separation between adjacent bright fringes in a double-slit experiment.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
    },
    {
        title: 'Single Slit Diffraction (Minima)',
        latex: 'a \\sin \\theta = m \\lambda',
        description: 'The condition for minima in a single-slit diffraction pattern.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
    },
    {
        title: 'Bragg’s Law (X-Ray Diffraction)',
        latex: 'n \\lambda = 2 d \\sin \\theta',
        description: 'The condition for constructive interference in X-ray diffraction.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
    },
    {
        title: 'Malus’s Law (Polarization)',
        latex: 'I = I_0 \\cos^2 \\theta',
        description: 'The intensity of polarized light after passing through a polarizer.',
        category: 'Waves & Optics',
        subcategory: 'Wave Optics',
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

                                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-none' : 'max-h-0'}`}>
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
                                                                {formula.subcategory && (
                                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
                                                                        {formula.subcategory}
                                                                    </span>
                                                                )}
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
