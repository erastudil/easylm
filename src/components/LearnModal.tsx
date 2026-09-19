import React, { useEffect, useState } from 'react';
import { BADGE_CATALOG } from '../data/badges';
import {
  CoursePack,
  PublicItem,
  getCourse,
  getItem,
  itemsForLesson,
  lessonById,
  listCourses,
  localDay
} from '../engine/course';
import { gradeQuestion } from '../engine/grade';
import { dueCards, reviewCard, upsertMiss } from '../engine/leitner';
import {
  Progress,
  adjustSchedule,
  completeItem,
  enroll,
  itemComplete,
  loadProgress,
  markQuestion,
  recordAttempt,
  recordExamSitting,
  saveProgress,
  suggestedToday,
  unitProgress
} from '../engine/progress';

type Tab = 'catalog' | 'walk' | 'today' | 'cards' | 'record';

export interface StudioTarget {
  tool: 'read' | 'write' | 'code' | 'graph' | 'draw';
  stackId?: string;
  chapterQuery?: string;
  title?: string;
  initialContent?: string;
}

interface LearnModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  kidSafe: boolean;
  variant?: 'overlay' | 'page';
  onOpenStudio?: (target: StudioTarget) => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.88)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 150,
  padding: '1rem'
};

const tabBtn = (on: boolean): React.CSSProperties => ({
  background: on ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
  border: 'none',
  color: on ? '#ffffff' : '#a1a1aa',
  padding: '0.3rem 0.7rem',
  fontSize: '0.78rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)'
});

export const LearnModal: React.FC<LearnModalProps> = ({
  isOpen,
  onClose,
  profileId,
  kidSafe,
  variant = 'overlay',
  onOpenStudio,
  onNavigateBack,
  onNavigateForward,
  canNavigateBack,
  canNavigateForward
}) => {
  const page = variant === 'page';
  const [tab, setTab] = useState<Tab>('catalog');
  const [p, setP] = useState<Progress>(() => loadProgress(profileId));
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const today = localDay();

  useEffect(() => {
    if (!isOpen) return;
    const loaded = adjustSchedule(loadProgress(profileId), today);
    saveProgress(loaded);
    setP(loaded);
    if (page && loaded.enrolled.length > 0) {
      setTab((prev) => (prev === 'catalog' ? 'today' : prev));
    }
  }, [isOpen, profileId, today, page]);

  if (!isOpen) return null;

  const persist = (next: Progress) => {
    saveProgress(next);
    setP(next);
  };

  const allCourses = listCourses();
  const currentCourse = courseId ? getCourse(courseId) : undefined;
  const loc = courseId && lessonId ? lessonById(courseId, lessonId) : undefined;
  const activeItem = activeItemId ? getItem(activeItemId) : undefined;

  const hideList = page && Boolean(activeItem);

  const inner = (
    <>
      {!page && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                className="btn-pill"
                disabled={!canNavigateBack}
                onClick={onNavigateBack}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem', opacity: canNavigateBack ? 1 : 0.4 }}
                title="Browse Back (in-app)"
              >
                ◀
              </button>
              <button
                type="button"
                className="btn-pill"
                disabled={!canNavigateForward}
                onClick={onNavigateForward}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem', opacity: canNavigateForward ? 1 : 0.4 }}
                title="Browse Forward (in-app)"
              >
                ▶
              </button>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🎓</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff', fontSize: '1.05rem' }}>
                  EasyLM Learn
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {onOpenStudio && (
              <button
                type="button"
                className="btn-pill"
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#c4b5fd', fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
                title="Open Studio"
                onClick={() => onOpenStudio({ tool: 'read' })}
              >
                Studio
              </button>
            )}
            <button
              type="button"
              className="btn-pill"
              onClick={onClose}
              style={{ fontSize: '1.2rem', padding: '0.1rem 0.5rem', lineHeight: 1 }}
              title="Close Learn"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {page && !hideList && <div className="learn-page-title">Learn</div>}

      {!hideList && (
        <div className={page ? 'seg-row' : undefined} style={page ? undefined : { display: 'flex', gap: '0.4rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '0.4rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          <button type="button" className={page && tab === 'catalog' ? 'seg-on' : undefined} style={page ? undefined : tabBtn(tab === 'catalog')} onClick={() => { setTab('catalog'); setActiveItemId(null); }}>
            Catalog
          </button>
          <button type="button" className={page && tab === 'walk' ? 'seg-on' : undefined} style={page ? undefined : tabBtn(tab === 'walk')} onClick={() => { setTab('walk'); setActiveItemId(null); }}>
            Walk
          </button>
          <button type="button" className={page && tab === 'today' ? 'seg-on' : undefined} style={page ? undefined : tabBtn(tab === 'today')} onClick={() => { setTab('today'); setActiveItemId(null); }}>
            Today
          </button>
          <button type="button" className={page && tab === 'cards' ? 'seg-on' : undefined} style={page ? undefined : tabBtn(tab === 'cards')} onClick={() => { setTab('cards'); setActiveItemId(null); }}>
            Cards
          </button>
          <button type="button" className={page && tab === 'record' ? 'seg-on' : undefined} style={page ? undefined : tabBtn(tab === 'record')} onClick={() => { setTab('record'); setActiveItemId(null); }}>
            Record
          </button>
        </div>
      )}

      {!hideList && (
        <div className={page ? 'learn-body' : undefined} style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {tab === 'catalog' && (
            <Catalog
              courses={allCourses}
              p={p}
              kidSafe={kidSafe}
              compact={page}
              onEnroll={id => {
                const next = enroll(p, id, today);
                persist(next);
                setCourseId(id);
                setTab('walk');
              }}
            />
          )}
          {tab === 'walk' && (
            <Walk
              p={p}
              course={currentCourse}
              loc={loc}
              phone={page}
              onPickCourse={id => {
                setCourseId(id || null);
                setLessonId(null);
                setActiveItemId(null);
              }}
              onPickLesson={(cid, lid) => {
                setCourseId(cid);
                setLessonId(lid);
                setActiveItemId(null);
              }}
              onOpenItem={id => setActiveItemId(id)}
            />
          )}
          {tab === 'today' && (
            <TodayPane
              p={p}
              today={today}
              onOpenLesson={(cid, lid) => {
                setCourseId(cid);
                setLessonId(lid);
                setActiveItemId(null);
                setTab('walk');
              }}
            />
          )}
          {tab === 'cards' && (
            <Cards
              p={p}
              today={today}
              onChange={persist}
            />
          )}
          {tab === 'record' && <RecordPane p={p} />}
        </div>
      )}

      {activeItem && loc && (
        <ItemRunner
          item={activeItem}
          courseSlug={loc.course.id}
          p={p}
          today={today}
          kidSafe={kidSafe}
          page={page}
          onClose={() => setActiveItemId(null)}
          onChange={persist}
          onOpenStudio={onOpenStudio}
        />
      )}
    </>
  );

  if (page) {
    return <div className="learn-page">{inner}</div>;
  }

  return (
    <div className="modal-overlay" style={overlay} onClick={onClose}>
      <div
        className="card-elevated modal-sheet"
        style={{
          width: '96vw',
          maxWidth: '1480px',
          height: '94vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          position: 'relative',
          backgroundColor: '#0c0c12',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {inner}
      </div>
    </div>
  );
};

function Catalog({
  courses,
  p,
  kidSafe,
  compact,
  onEnroll
}: {
  courses: CoursePack[];
  p: Progress;
  kidSafe: boolean;
  compact?: boolean;
  onEnroll: (id: string) => void;
}) {
  if (!courses.length) {
    return <div style={{ color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>No courses available.</div>;
  }
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {!compact && (
        <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
          Undergraduate collegiate walks. The app is the patient teacher. Self-paced, pass/fail, zero rent on knowledge.
          {kidSafe ? ' Kid Safe mode active: all network tools and external requests are blocked.' : ''}
        </div>
      )}
      {courses.map(c => {
        const in_ = p.enrolled.includes(c.id);
        return (
          <div key={c.id} className="card-elevated" style={{ padding: '0.9rem', backgroundColor: '#111118', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600, fontSize: '0.95rem' }}>{c.title}</div>
                <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
                  {c.level} · Dewey {c.dewey} · {c.units.length} units · {c.license.spdx}
                </div>
              </div>
              <button
                type="button"
                className="btn-pill"
                title={in_ ? 'Open this course' : 'Enroll on this device'}
                onClick={() => onEnroll(c.id)}
                style={{
                  backgroundColor: in_ ? 'rgba(139, 92, 246, 0.25)' : 'rgba(52, 211, 153, 0.15)',
                  borderColor: in_ ? '#8b5cf6' : '#34d399',
                  color: in_ ? '#ffffff' : '#34d399',
                  fontSize: '0.75rem'
                }}
              >
                {in_ ? 'Open Syllabus ↗' : '+ Enroll Free'}
              </button>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.4rem' }}>{c.license.attribution}</div>
          </div>
        );
      })}
    </div>
  );
}

function Walk({
  p,
  course,
  loc,
  phone,
  onPickCourse,
  onPickLesson,
  onOpenItem
}: {
  p: Progress;
  course?: CoursePack;
  loc: ReturnType<typeof lessonById>;
  phone?: boolean;
  onPickCourse: (id: string) => void;
  onPickLesson: (courseId: string, lessonId: string) => void;
  onOpenItem: (id: string) => void;
}) {
  if (!p.enrolled.length) {
    return <div style={{ color: '#a1a1aa', padding: '1.5rem', textAlign: 'center' }}>Enroll in a course from Catalog.</div>;
  }
  const showCourseList = !phone || !course;
  return (
    <div className={phone ? 'learn-walk-phone' : undefined} style={phone ? undefined : { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem', minHeight: '100%' }}>
      {showCourseList && (
      <div style={phone ? undefined : { borderRight: '1px solid rgba(255, 255, 255, 0.06)', paddingRight: '0.5rem' }}>
        <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#71717a', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Enrolled Courses
        </div>
        {p.enrolled.map(id => {
          const c = getCourse(id);
          if (!c) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPickCourse(id)}
              title={c.title}
              style={{
                ...tabBtn(course?.id === id),
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: '0.25rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {c.title}
            </button>
          );
        })}
      </div>
      )}
      <div>
        {phone && course && (
          <button type="button" className="btn-pill" style={{ marginBottom: '0.6rem', minHeight: 36 }} onClick={() => onPickCourse('')}>
            Courses
          </button>
        )}
        {!course && <div style={{ color: '#a1a1aa' }}>Select a course to view the syllabus.</div>}
        {course && !loc && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {course.units.map(u => {
              const up = unitProgress(course.id, u.id, p);
              const pct = up.total > 0 ? Math.round((up.done / up.total) * 100) : 0;
              return (
                <div key={u.id} className="card-elevated" style={{ padding: '0.75rem', backgroundColor: '#111118', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#ffffff' }}>
                    <span>Unit: {u.title}</span>
                    <span style={{ color: '#c4b5fd' }}>{up.done}/{up.total} ({pct}%)</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                    {u.lessons.map(l => (
                      <button
                        key={l.id}
                        type="button"
                        className="btn-pill"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => onPickLesson(course.id, l.id)}
                      >
                        {l.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {course && loc && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600 }}>
                {loc.unit.title} / {loc.lesson.title}
              </div>
              <button type="button" className="btn-pill" onClick={() => onPickLesson(course.id, '')} style={{ fontSize: '0.72rem' }}>
                All Units
              </button>
            </div>
            <div style={{ display: 'grid', gap: '0.4rem' }}>
              {itemsForLesson(loc.lesson.items).map(it => {
                const done = itemComplete(p, it.id);
                return (
                  <div
                    key={it.id}
                    className="card-elevated"
                    style={{
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#111118',
                      borderRadius: '6px'
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#a78bfa', marginRight: '0.4rem' }}>
                        [{it.kind}]
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#ffffff' }}>{it.prompt.slice(0, 65)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {done && <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ Done</span>}
                      <button
                        type="button"
                        className="btn-pill"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => onOpenItem(it.id)}
                      >
                        {done ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TodayPane({
  p,
  today,
  onOpenLesson
}: {
  p: Progress;
  today: string;
  onOpenLesson: (courseId: string, lessonId: string) => void;
}) {
  const ids = suggestedToday(p, today);
  if (!ids.length) {
    return (
      <div style={{ color: '#a1a1aa', padding: '2rem 1rem', textAlign: 'center' }}>
        <div>All caught up for today! Streak is active.</div>
        <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.4rem' }}>
          Explore new lessons in the Syllabus Walk or review flashcards.
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <div style={{ fontSize: '0.78rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
        Recommended Study Queue ({ids.length} lessons due):
      </div>
      {ids.map(lid => {
        for (const cid of p.enrolled) {
          const found = lessonById(cid, lid);
          if (found) {
            return (
              <div key={lid} className="card-elevated" style={{ padding: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111118', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#a78bfa', marginRight: '0.4rem' }}>
                    [{found.course.title}]
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#ffffff' }}>{found.lesson.title}</span>
                </div>
                <button type="button" className="btn-pill btn-pill-primary" style={{ fontSize: '0.74rem' }} onClick={() => onOpenLesson(cid, lid)}>
                  Begin
                </button>
              </div>
            );
          }
        }
        return null;
      })}
    </div>
  );
}

function Cards({
  p,
  today,
  onChange
}: {
  p: Progress;
  today: string;
  onChange: (p: Progress) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const cards = dueCards(p.leitner, today);
  const [cardIdx, setCardIdx] = useState(0);
  const c = cards[cardIdx];

  if (!c) {
    return (
      <div style={{ color: '#a1a1aa', padding: '2.5rem 1rem', textAlign: 'center' }}>
        <div>Zero flashcards due today. Great work!</div>
        <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.4rem' }}>
          Missed questions from quizzes and exams will automatically populate your spaced-repetition deck.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '520px', margin: '1rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '0.72rem', color: '#71717a', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
        Leitner Box {c.box} · {cards.length} cards remaining
      </div>
      <div
        className="card-elevated"
        style={{
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          cursor: 'pointer',
          backgroundColor: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px'
        }}
        onClick={() => setFlipped(!flipped)}
      >
        <div style={{ fontSize: '0.9rem', color: '#ffffff' }}>
          {c.prompt}
        </div>
      </div>
      <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn-pill"
          style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
          onClick={() => {
            setFlipped(false);
            const nextCard = reviewCard(c, false, today);
            onChange({ ...p, leitner: p.leitner.map(card => (card.id === c.id ? nextCard : card)) });
            setCardIdx(i => (cards.length <= 1 ? 0 : (i + 1) % cards.length));
          }}
        >
          Again
        </button>
        <button
          type="button"
          className="btn-pill"
          style={{ borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399' }}
          onClick={() => {
            setFlipped(false);
            const nextCard = reviewCard(c, true, today);
            onChange({ ...p, leitner: p.leitner.map(card => (card.id === c.id ? nextCard : card)) });
            setCardIdx(0);
          }}
        >
          Good
        </button>
      </div>
    </div>
  );
}

function RecordPane({ p }: { p: Progress }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', marginBottom: '0.6rem', fontSize: '0.9rem', color: '#c4b5fd' }}>
        XP: {p.xp} · Current Streak: {p.streak.count} days · Longest: {p.streak.longest} days
      </div>
      <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginBottom: '0.8rem' }}>
        Sovereign study record stored entirely on this device.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.65rem' }}>
        {BADGE_CATALOG.map(b => {
          const on = p.badges.includes(b.id);
          return (
            <div
              key={b.id}
              className="card-elevated"
              title={b.blurb}
              style={{
                padding: '0.75rem',
                opacity: on ? 1 : 0.35,
                backgroundColor: on ? 'rgba(139, 92, 246, 0.15)' : '#111118',
                border: on ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: on ? '#c4b5fd' : '#71717a', fontWeight: 600 }}>
                {on ? '🏅 ' : '🔒 '}{b.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '0.2rem', lineHeight: 1.35 }}>
                {b.blurb}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemRunner({
  item,
  courseSlug,
  p,
  today,
  kidSafe,
  onClose,
  onChange,
  onOpenStudio,
  page
}: {
  item: PublicItem;
  courseSlug: string;
  p: Progress;
  today: string;
  kidSafe: boolean;
  onClose: () => void;
  onChange: (p: Progress) => void;
  onOpenStudio?: (target: StudioTarget) => void;
  page?: boolean;
}) {
  const done = itemComplete(p, item.id);
  return (
    <div
      className={page ? 'learn-item-page' : undefined}
      style={page ? { padding: '0.25rem 0.15rem' } : {
        borderTop: '1px solid rgba(139, 92, 246, 0.3)',
        paddingTop: '0.75rem',
        marginTop: '0.5rem',
        maxHeight: '48%',
        overflow: 'auto',
        backgroundColor: '#09090e',
        padding: '0.75rem 1rem',
        borderRadius: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd', textTransform: 'uppercase', fontSize: '0.78rem' }}>
          {item.kind}
        </strong>
        <button type="button" className="btn-pill" onClick={onClose} title="Back to syllabus">
          Back
        </button>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: '0.4rem 0' }}>{item.prompt}</p>
      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
        Source: {item.source.work} · {item.source.loc}
      </div>

      {item.kind === 'reading' && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          {onOpenStudio && (
            <button
              type="button"
              className="btn-pill"
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.25)', borderColor: '#8b5cf6', color: '#c4b5fd', fontSize: '0.75rem' }}
              title="Open full textbook in Studio (Read)"
              onClick={() => onOpenStudio({
                tool: 'read',
                stackId: courseSlug,
                chapterQuery: item.source.loc,
                title: item.prompt.slice(0, 40)
              })}
            >
              📖 Open Textbook in Studio
            </button>
          )}
          {!done && (
            <button
              type="button"
              className="btn-pill btn-pill-primary"
              style={{ fontSize: '0.75rem' }}
              title="Mark this chapter read"
              onClick={() => onChange(completeItem(p, item.id, 'reading', today))}
            >
              ✓ Mark Chapter Completed
            </button>
          )}
        </div>
      )}

      {(item.kind === 'quiz' || item.kind === 'exam') && item.questions && (
        <QuestionSet item={item} p={p} today={today} onChange={onChange} />
      )}

      {(item.kind === 'essay' || item.kind === 'project' || item.kind === 'assignment') && (
        <RubricItem
          item={item}
          p={p}
          today={today}
          kidSafe={kidSafe}
          onChange={onChange}
          onOpenStudio={onOpenStudio}
        />
      )}

      {done && <div style={{ color: '#34d399', marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>✓ Completed</div>}
    </div>
  );
}

function QuestionSet({
  item,
  p,
  today,
  onChange
}: {
  item: PublicItem;
  p: Progress;
  today: string;
  onChange: (p: Progress) => void;
}) {
  const qs = item.questions || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | undefined>>({});
  const [seconds, setSeconds] = useState((item.suggestedMinutes || 0) * 60);
  const isExam = item.kind === 'exam';

  useEffect(() => {
    if (!isExam || !item.suggestedMinutes) return;
    const t = window.setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [isExam, item.suggestedMinutes]);

  const parseAnswer = (q: (typeof qs)[number]) => {
    const raw = answers[q.id] ?? '';
    return q.qtype === 'multi' ? raw.split('\n').filter(Boolean) : raw;
  };

  const submitOne = (qid: string) => {
    const q = qs.find(x => x.id === qid);
    if (!q) return;
    const res = gradeQuestion(qid, parseAnswer(q));
    let next = p;
    if (!res.pass) next = recordAttempt(next, item.id);
    next = markQuestion(next, qid, res.pass, q.qtype === 'numeric');
    const fb = { ...feedback, [qid]: res.pass };
    if (!res.pass) next = { ...next, leitner: upsertMiss(next.leitner, item.id, qid, q.prompt, today) };
    const allPass = qs.every(x => fb[x.id] || next.questionPass[x.id]);
    if (allPass) {
      next = completeItem(next, item.id, item.kind, today);
      if (isExam) next = recordExamSitting(next, item.id, allPass);
    }
    setFeedback(fb);
    onChange(next);
  };

  return (
    <div style={{ marginTop: '0.6rem' }}>
      {isExam && (
        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', marginBottom: '0.4rem' }}>
          ⏱️ Exam Timer: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>
      )}
      {qs.map(q => {
        const passed = p.questionPass[q.id] || feedback[q.id] === true;
        const failed = feedback[q.id] === false;
        return (
          <div key={q.id} style={{ marginBottom: '0.6rem', padding: '0.5rem', backgroundColor: '#111118', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.8rem', color: '#ffffff', marginBottom: '0.3rem' }}>{q.prompt}</div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && submitOne(q.id)}
                disabled={passed}
                placeholder="Enter answer..."
                style={{
                  flex: 1,
                  backgroundColor: '#07070a',
                  border: passed ? '1px solid #34d399' : failed ? '1px solid #f87171' : '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '4px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.78rem',
                  color: '#ffffff'
                }}
              />
              <button
                type="button"
                className="btn-pill"
                onClick={() => submitOne(q.id)}
                disabled={passed}
                style={{ fontSize: '0.72rem' }}
              >
                {passed ? '✓ Passed' : 'Check'}
              </button>
            </div>
            {failed && <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '0.2rem' }}>Incorrect. Added to flashcard review queue.</div>}
          </div>
        );
      })}
    </div>
  );
}

function RubricItem({
  item,
  p,
  today,
  kidSafe,
  onChange,
  onOpenStudio
}: {
  item: PublicItem;
  p: Progress;
  today: string;
  kidSafe: boolean;
  onChange: (p: Progress) => void;
  onOpenStudio?: (target: StudioTarget) => void;
}) {
  const [text, setText] = useState('');
  const rubric = item.rubric || [];
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const allChecked = rubric.length > 0 && rubric.every((_, idx) => checked[idx]);

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div style={{ fontSize: '0.74rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>
        Rubric &amp; Verification Checklist:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.6rem' }}>
        {rubric.map((r, idx) => (
          <label key={r.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#a1a1aa', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(checked[idx])}
              onChange={e => setChecked({ ...checked, [idx]: e.target.checked })}
            />
            <span>{r.criterion}</span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {onOpenStudio && (
          <button
            type="button"
            className="btn-pill"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.25)', borderColor: '#8b5cf6', color: '#c4b5fd', fontSize: '0.75rem' }}
            title="Open workspace in Studio to write essay or code project"
            onClick={() => onOpenStudio({
              tool: item.kind === 'project' ? 'code' : 'write',
              title: item.prompt.slice(0, 40),
              initialContent: `# Course Project\n\n${item.prompt}\n\n## Rubric\n${rubric.map(r => `- [ ] ${r.criterion}`).join('\n')}\n\n`
            })}
          >
            ✍️ Open Workspace in Studio
          </button>
        )}
        <button
          type="button"
          className="btn-pill btn-pill-primary"
          style={{ fontSize: '0.75rem' }}
          disabled={!allChecked && rubric.length > 0}
          onClick={() => onChange(completeItem(p, item.id, item.kind, today))}
        >
          Submit &amp; Mark Complete
        </button>
      </div>
    </div>
  );
}
