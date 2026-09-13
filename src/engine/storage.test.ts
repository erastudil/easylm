import { describe, it, expect } from 'vitest';
import { classifySessionLake, buildTriLakeExport, sanitizeSession, analyzeTriLakePatterns } from './storage';
import { Session } from '../types';

describe('Tri-Lake Memory Classification', () => {
  it('classifies empty or user-only sessions as purgatory', () => {
    const s1: Session = {
      id: 's1',
      title: 'Test 1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    expect(classifySessionLake(s1)).toBe('purgatory');

    const s2: Session = {
      id: 's2',
      title: 'Test 2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [{ id: 'm1', role: 'user', content: 'hello', timestamp: Date.now() }]
    };
    expect(classifySessionLake(s2)).toBe('purgatory');
  });

  it('classifies session as heaven if assistant reply is approved (thumbs up)', () => {
    const s: Session = {
      id: 's3',
      title: 'Good session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'What is 2+2?', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: '4', timestamp: Date.now(), rating: 'heaven' }
      ]
    };
    expect(classifySessionLake(s)).toBe('heaven');
  });

  it('classifies session as hell if assistant reply is rejected (thumbs down)', () => {
    const s: Session = {
      id: 's4',
      title: 'Bad session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Calculate', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'Hallucination', timestamp: Date.now(), rating: 'hell' }
      ]
    };
    expect(classifySessionLake(s)).toBe('hell');
  });

  it('fails closed to hell if session has any hell rating even with heaven present', () => {
    const s: Session = {
      id: 's5',
      title: 'Mixed session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Q1', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'A1', timestamp: Date.now(), rating: 'heaven' },
        { id: 'm3', role: 'user', content: 'Q2', timestamp: Date.now() },
        { id: 'm4', role: 'assistant', content: 'A2 (bad)', timestamp: Date.now(), rating: 'hell' }
      ]
    };
    expect(classifySessionLake(s)).toBe('hell');
  });
});

describe('buildTriLakeExport', () => {
  it('correctly categorizes sessions across heaven, purgatory, and hell', () => {
    const sessions: Session[] = [
      {
        id: 's-heaven',
        title: 'Heaven session',
        createdAt: 100,
        updatedAt: 100,
        messages: [{ id: 'm1', role: 'assistant', content: 'Verified', timestamp: 100, rating: 'heaven' }]
      },
      {
        id: 's-purgatory',
        title: 'Neutral session',
        createdAt: 200,
        updatedAt: 200,
        messages: [{ id: 'm2', role: 'assistant', content: 'Draft', timestamp: 200, rating: 'neutral' }]
      },
      {
        id: 's-hell',
        title: 'Hell session',
        createdAt: 300,
        updatedAt: 300,
        messages: [{ id: 'm3', role: 'assistant', content: 'Failed', timestamp: 300, rating: 'hell' }]
      }
    ];

    const allExport = buildTriLakeExport(sessions, 'all');
    expect(allExport.counts.total).toBe(3);
    expect(allExport.counts.heaven).toBe(1);
    expect(allExport.counts.purgatory).toBe(1);
    expect(allExport.counts.hell).toBe(1);
    expect(allExport.lakes.heaven[0].id).toBe('s-heaven');
    expect(allExport.lakes.purgatory[0].id).toBe('s-purgatory');
    expect(allExport.lakes.hell[0].id).toBe('s-hell');

    const heavenOnly = buildTriLakeExport(sessions, 'heaven');
    expect(heavenOnly.lakes.heaven.length).toBe(1);
    expect(heavenOnly.lakes.hell.length).toBe(0);
  });
});

describe('sanitizeSession Tri-Lake rating preservation', () => {
  it('preserves valid ratings and sanitizes invalid values', () => {
    const raw = {
      id: 'sess-1',
      title: 'Title',
      messages: [
        { id: 'm1', role: 'assistant', content: 'Good', rating: 'heaven' },
        { id: 'm2', role: 'assistant', content: 'Bad', rating: 'hell' },
        { id: 'm3', role: 'assistant', content: 'Neutral', rating: 'neutral' },
        { id: 'm4', role: 'assistant', content: 'Bogus', rating: 'invalid_rating' }
      ]
    };

    const sanitized = sanitizeSession(raw);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.messages[0].rating).toBe('heaven');
    expect(sanitized?.messages[1].rating).toBe('hell');
    expect(sanitized?.messages[2].rating).toBe('neutral');
    expect(sanitized?.messages[3].rating).toBeUndefined();
  });
});

describe('analyzeTriLakePatterns', () => {
  it('handles empty sessions gracefully without adding memories', () => {
    const res = analyzeTriLakePatterns([], 'parent');
    expect(res.totalRated).toBe(0);
    expect(res.insightsAdded).toBe(0);
    expect(res.message).toContain('No rated messages found');
  });

  it('detects concise code preference from approved heaven messages', () => {
    const testSessions: Session[] = [
      {
        id: 's-code',
        title: 'Python session',
        createdAt: 100,
        updatedAt: 100,
        messages: [
          { id: 'm1', role: 'user', content: 'fibonacci', timestamp: 100 },
          {
            id: 'm2',
            role: 'assistant',
            content: 'Here is the function:\n```python\ndef fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)\n```',
            timestamp: 101,
            rating: 'heaven'
          }
        ]
      }
    ];

    const res = analyzeTriLakePatterns(testSessions, 'test-profile-1');
    expect(res.totalRated).toBe(1);
    expect(res.approvedCount).toBe(1);
    expect(res.insightsAdded).toBeGreaterThanOrEqual(1);
    expect(res.insights.some(i => i.includes('runnable code') || i.includes('concise'))).toBe(true);
  });

  it('detects sycophancy dislike from rejected hell messages', () => {
    const testSessions: Session[] = [
      {
        id: 's-hell-apology',
        title: 'Apology session',
        createdAt: 200,
        updatedAt: 200,
        messages: [
          { id: 'm1', role: 'user', content: 'explain gravity', timestamp: 200 },
          {
            id: 'm2',
            role: 'assistant',
            content: 'I apologize, as an AI language model I am sorry for any confusion earlier!',
            timestamp: 201,
            rating: 'hell'
          }
        ]
      }
    ];

    const res = analyzeTriLakePatterns(testSessions, 'test-profile-2');
    expect(res.rejectedCount).toBe(1);
    expect(res.insights.some(i => i.includes('apologetic'))).toBe(true);
  });
});
