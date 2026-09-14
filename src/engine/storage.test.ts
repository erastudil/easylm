import { describe, it, expect } from 'vitest';
import { classifySessionLake, buildTriLakeExport, sanitizeSession, analyzeTriLakePatterns } from './storage';
import { Session } from '../types';

describe('Tri-Lake Memory Classification', () => {
  it('classifies empty or user-only sessions as candidate', () => {
    const s1: Session = {
      id: 's1',
      title: 'Test 1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    expect(classifySessionLake(s1)).toBe('candidate');

    const s2: Session = {
      id: 's2',
      title: 'Test 2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [{ id: 'm1', role: 'user', content: 'hello', timestamp: Date.now() }]
    };
    expect(classifySessionLake(s2)).toBe('candidate');
  });

  it('classifies session as approved if assistant reply is approved (thumbs up)', () => {
    const s: Session = {
      id: 's3',
      title: 'Good session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'What is 2+2?', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: '4', timestamp: Date.now(), rating: 'approved' }
      ]
    };
    expect(classifySessionLake(s)).toBe('approved');
  });

  it('classifies legacy session with heaven rating as approved', () => {
    const s: Session = {
      id: 's3-legacy',
      title: 'Legacy good session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'What is 2+2?', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: '4', timestamp: Date.now(), rating: 'heaven' }
      ]
    };
    expect(classifySessionLake(s)).toBe('approved');
  });

  it('classifies session as rejected if assistant reply is rejected (thumbs down)', () => {
    const s: Session = {
      id: 's4',
      title: 'Bad session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Calculate', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'Hallucination', timestamp: Date.now(), rating: 'rejected' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });

  it('classifies legacy session with hell rating as rejected', () => {
    const s: Session = {
      id: 's4-legacy',
      title: 'Legacy bad session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Calculate', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'Hallucination', timestamp: Date.now(), rating: 'hell' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });

  it('fails closed to rejected if session has any rejected rating even with approved present', () => {
    const s: Session = {
      id: 's5',
      title: 'Mixed session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Q1', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'A1', timestamp: Date.now(), rating: 'approved' },
        { id: 'm3', role: 'user', content: 'Q2', timestamp: Date.now() },
        { id: 'm4', role: 'assistant', content: 'A2 (bad)', timestamp: Date.now(), rating: 'rejected' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });
});

describe('buildTriLakeExport', () => {
  it('correctly categorizes sessions across approved, candidate, and rejected', () => {
    const sessions: Session[] = [
      {
        id: 's-approved',
        title: 'Approved session',
        createdAt: 100,
        updatedAt: 100,
        messages: [{ id: 'm1', role: 'assistant', content: 'Verified', timestamp: 100, rating: 'approved' }]
      },
      {
        id: 's-candidate',
        title: 'Neutral candidate session',
        createdAt: 200,
        updatedAt: 200,
        messages: [{ id: 'm2', role: 'assistant', content: 'Draft', timestamp: 200, rating: 'neutral' }]
      },
      {
        id: 's-rejected',
        title: 'Rejected session',
        createdAt: 300,
        updatedAt: 300,
        messages: [{ id: 'm3', role: 'assistant', content: 'Failed', timestamp: 300, rating: 'rejected' }]
      }
    ];

    const allExport = buildTriLakeExport(sessions, 'all');
    expect(allExport.counts.total).toBe(3);
    expect(allExport.counts.approved).toBe(1);
    expect(allExport.counts.candidate).toBe(1);
    expect(allExport.counts.rejected).toBe(1);
    expect(allExport.lakes.approved[0].id).toBe('s-approved');
    expect(allExport.lakes.candidate[0].id).toBe('s-candidate');
    expect(allExport.lakes.rejected[0].id).toBe('s-rejected');

    // Backwards-compatibility aliases
    expect(allExport.counts.heaven).toBe(1);
    expect(allExport.counts.purgatory).toBe(1);
    expect(allExport.counts.hell).toBe(1);
    expect(allExport.lakes.heaven?.[0].id).toBe('s-approved');

    const approvedOnly = buildTriLakeExport(sessions, 'approved');
    expect(approvedOnly.lakes.approved.length).toBe(1);
    expect(approvedOnly.lakes.rejected.length).toBe(0);
  });
});

describe('sanitizeSession Tri-Lake rating preservation & normalization', () => {
  it('preserves valid neutral ratings, normalizes legacy ratings, and strips invalid values', () => {
    const raw = {
      id: 'sess-1',
      title: 'Title',
      messages: [
        { id: 'm1', role: 'assistant', content: 'Good', rating: 'approved' },
        { id: 'm2', role: 'assistant', content: 'Bad', rating: 'rejected' },
        { id: 'm3', role: 'assistant', content: 'Neutral', rating: 'neutral' },
        { id: 'm4', role: 'assistant', content: 'Legacy Heaven', rating: 'heaven' },
        { id: 'm5', role: 'assistant', content: 'Legacy Hell', rating: 'hell' },
        { id: 'm6', role: 'assistant', content: 'Bogus', rating: 'invalid_rating' }
      ]
    };

    const sanitized = sanitizeSession(raw);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.messages[0].rating).toBe('approved');
    expect(sanitized?.messages[1].rating).toBe('rejected');
    expect(sanitized?.messages[2].rating).toBe('neutral');
    expect(sanitized?.messages[3].rating).toBe('approved'); // normalized from heaven
    expect(sanitized?.messages[4].rating).toBe('rejected'); // normalized from hell
    expect(sanitized?.messages[5].rating).toBeUndefined();
  });
});

describe('analyzeTriLakePatterns', () => {
  it('handles empty sessions gracefully without adding memories', () => {
    const res = analyzeTriLakePatterns([], 'parent');
    expect(res.totalRated).toBe(0);
    expect(res.insightsAdded).toBe(0);
    expect(res.message).toContain('No rated messages found');
  });

  it('detects concise code preference from approved messages', () => {
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
            rating: 'approved'
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

  it('detects sycophancy dislike from rejected messages', () => {
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
            rating: 'rejected'
          }
        ]
      }
    ];

    const res = analyzeTriLakePatterns(testSessions, 'test-profile-2');
    expect(res.rejectedCount).toBe(1);
    expect(res.insights.some(i => i.includes('apologetic'))).toBe(true);
  });
});
