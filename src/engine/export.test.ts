import { describe, it, expect } from 'vitest';
import {
  stripMarkdown,
  markdownTableToCsv,
  markdownToLatex,
  generateAcademicHtml,
  sanitizeFilename
} from './export';

describe('export engine tests', () => {
  it('strips markdown syntax accurately to clean plain text', () => {
    const md = `# Physics Homework 1
**Force** is defined by Newton's Second Law:
* F = m * a
Here is a formula: \`E = mc^2\`
> Remember units: kg * m / s^2
`;
    const plain = stripMarkdown(md);
    expect(plain).toContain('Physics Homework 1');
    expect(plain).toContain('Force is defined by Newton\'s Second Law');
    expect(plain).toContain('• F = m * a');
    expect(plain).toContain('E = mc^2');
    expect(plain).not.toContain('#');
    expect(plain).not.toContain('**');
    expect(plain).not.toContain('>');
  });

  it('extracts and converts Markdown tables into valid RFC-4180 CSV', () => {
    const tableMd = `
Here is experimental velocity data:

| Time (s) | Velocity (m/s) | Notes |
|---|---|---|
| 0.0 | 0.0 | stationary |
| 1.5 | 4.2 | initial burst, accelerating |
| 3.0 | 8.8 | "constant" push |
`;
    const csv = markdownTableToCsv(tableMd);
    expect(csv).not.toBeNull();
    const lines = csv!.split('\r\n');
    expect(lines[0]).toBe('Time (s),Velocity (m/s),Notes');
    expect(lines[1]).toBe('0.0,0.0,stationary');
    expect(lines[2]).toBe('1.5,4.2,"initial burst, accelerating"');
    expect(lines[3]).toBe('3.0,8.8,"""constant"" push"');
  });

  it('returns null when no markdown table is present', () => {
    const nonTable = 'Just regular paragraph text without tables.';
    expect(markdownTableToCsv(nonTable)).toBeNull();
  });

  it('transforms Markdown into clean LaTeX structure', () => {
    const md = `# Quantum Foundations
## The Schrödinger Equation
The wave function is given by:
\`\`\`python
psi = calculate_wave_function()
\`\`\`
Important note: **wave-particle duality** applies to all matter.`;

    const latex = markdownToLatex(md, {
      title: 'Quantum Mechanics Problem Set',
      author: 'Euler Student',
      subject: 'PHYS 301'
    });

    expect(latex).toContain('\\documentclass[11pt,a4paper]{article}');
    expect(latex).toContain('\\title{Quantum Mechanics Problem Set}');
    expect(latex).toContain('\\author{Euler Student}');
    expect(latex).toContain('\\section{Quantum Foundations}');
    expect(latex).toContain('\\subsection{The Schrödinger Equation}');
    expect(latex).toContain('\\begin{verbatim}');
    expect(latex).toContain('\\textbf{wave-particle duality}');
    expect(latex).toContain('\\end{document}');
  });

  it('generates academic HTML with print styling and metadata header', () => {
    const html = generateAcademicHtml('### Method\nMix reagent A with reagent B.', {
      title: 'Lab Report 4',
      author: 'Marie Curie',
      subject: 'CHEM 202'
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Lab Report 4');
    expect(html).toContain('Marie Curie');
    expect(html).toContain('CHEM 202');
    expect(html).toContain('@media print');
    expect(html).toContain('Mix reagent A with reagent B.');
  });

  it('sanitizes filenames safely', () => {
    expect(sanitizeFilename('Physics Lab 01: Kinematics & Vectors!')).toBe('physics_lab_01_kinematics_vectors');
    expect(sanitizeFilename('')).toBe('document');
  });
});
