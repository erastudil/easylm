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

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  kidSafe: boolean;
  onOpenDocument: (content: string, title: string) => void;
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

export const StudioModal: React.FC<StudioModalProps> = ({
  isOpen,
  onClose,
  profileId,
  kidSafe,
  onOpenDocument
}) => {
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
    setCourseId(loaded.activeCourseId);
    setLessonId(loaded.activeLessonId);
  }, [isOpen, profileId, today]);

  const persist = (next: Progress) => {
    saveProgress(next);
    setP(next);
  };

  if (!isOpen) return null;

  const courses = listCourses();
  const course = courseId ? getCourse(courseId) : undefined;
  const loc = courseId && lessonId ? lessonById(courseId, lessonId) : null;
  const activeItem = activeItemId ? getItem(activeItemId) : undefined;

  return (
    <div style={overlay}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          gap: '0.75rem',
          backgroundColor: '#09090e',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(139, 92, 246, 0.25)', paddingBottom: '0.7rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-mono)' }}>📚 Studio</h2>
            <div style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
              Walk a class. Pass / fail. As many tries as it takes. study record on this device
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {p.streak.count > 0 && (
              <span title="Local-day streak. Miss a day and the count restarts. Longest is kept." style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontSize: '0.8rem' }}>
                {p.streak.count} d
              </span>
            )}
            <button type="button" className="btn-pill" onClick={onClose} title="Close Studio">Close</button>
          </div>
        </div>

        <div style={{ display: 'flex', background: '#111118', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px', width: 'fit-content' }}>
          {(['catalog', 'walk', 'today', 'cards', 'record'] as Tab[]).map(t => (
            <button key={t} type="button" style={tabBtn(tab === t)} onClick={() => setTab(t)} title={t}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {tab === 'catalog' && (
            <Catalog
              courses={courses}
              p={p}
              kidSafe={kidSafe}
              onEnroll={id => {
                const next = enroll({ ...p, activeLessonId: null }, id, today);
                persist(next);
                setCourseId(id);
                setTab('walk');
              }}
            />
          )}
          {tab === 'walk' && (
            <Walk
              p={p}
              course={course}
              loc={loc}
              onPickCourse={id => {
                persist({ ...p, activeCourseId: id });
                setCourseId(id);
                setLessonId(null);
                setActiveItemId(null);
              }}
              onPickLesson={(cid, lid) => {
                persist({ ...p, activeCourseId: cid, activeLessonId: lid });
                setCourseId(cid);
                setLessonId(lid);
                setActiveItemId(null);
              }}
              onOpenItem={setActiveItemId}
            />
          )}
          {tab === 'today' && (
            <Today
              p={p}
              today={today}
              onOpenLesson={(cid, lid) => {
                persist({ ...p, activeCourseId: cid, activeLessonId: lid });
                setCourseId(cid);
                setLessonId(lid);
                setTab('walk');
              }}
              onAddTask={title => {
                persist({
                  ...p,
                  tasks: [...p.tasks, { id: 'task_' + Date.now(), title, done: false }]
                });
              }}
              onToggleTask={id => {
                persist({
                  ...p,
                  tasks: p.tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t))
                });
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

        {activeItem && loc && (
          <ItemRunner
            item={activeItem}
            p={p}
            today={today}
            kidSafe={kidSafe}
            onClose={() => setActiveItemId(null)}
            onChange={persist}
            onOpenDocument={onOpenDocument}
          />
        )}
      </div>
    </div>
  );
};

function Catalog({
  courses,
  p,
  kidSafe,
  onEnroll
}: {
  courses: CoursePack[];
  p: Progress;
  kidSafe: boolean;
  onEnroll: (id: string) => void;
}) {
  if (!courses.length) {
    return <div style={{ color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>enroll a course</div>;
  }
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
        High school / undergrad walks. The app is the teacher. AI coach is aimed at 14+.
        {kidSafe ? ' Kid Safe: local packs only — doors stay as URLs.' : ''}
      </div>
      {courses.map(c => {
        const in_ = p.enrolled.includes(c.id);
        return (
          <div key={c.id} className="card-elevated" style={{ padding: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>{c.title}</div>
                <div style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
                  {c.level} · Dewey {c.dewey} · {c.units.length} units · {c.license.spdx}
                </div>
              </div>
              <button
                type="button"
                className="btn-pill"
                title={in_ ? 'Open this walk' : 'Enroll on this device'}
                onClick={() => onEnroll(c.id)}
              >
                {in_ ? 'Open' : 'Enroll'}
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
  onPickCourse,
  onPickLesson,
  onOpenItem
}: {
  p: Progress;
  course?: CoursePack;
  loc: ReturnType<typeof lessonById>;
  onPickCourse: (id: string) => void;
  onPickLesson: (courseId: string, lessonId: string) => void;
  onOpenItem: (id: string) => void;
}) {
  if (!p.enrolled.length) {
    return <div style={{ color: '#a1a1aa' }}>enroll a course</div>;
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0.75rem', minHeight: '100%' }}>
      <div>
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
                marginBottom: '0.25rem'
              }}
            >
              {c.title}
            </button>
          );
        })}
      </div>
      <div>
        {!course && <div style={{ color: '#a1a1aa' }}>pick a course</div>}
        {course && !loc && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {course.units.map(u => {
              const up = unitProgress(course.id, u.id, p);
              return (
                <div key={u.id} className="card-elevated" style={{ padding: '0.7rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {u.title}
                    <span style={{ color: '#a1a1aa', marginLeft: '0.5rem' }}>
                      {up.done}/{up.total}
                    </span>
                  </div>
                  {u.lessons.map(l => (
                    <button
                      key={l.id}
                      type="button"
                      className="btn-pill"
                      style={{ marginTop: '0.4rem' }}
                      title={l.title}
                      onClick={() => onPickLesson(course.id, l.id)}
                    >
                      {l.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
        {course && loc && (
          <LessonView
            p={p}
            loc={loc}
            onBack={() => onPickLesson(course.id, '')}
            onOpenItem={onOpenItem}
          />
        )}
      </div>
    </div>
  );
}

function LessonView({
  p,
  loc,
  onBack,
  onOpenItem
}: {
  p: Progress;
  loc: NonNullable<ReturnType<typeof lessonById>>;
  onBack: () => void;
  onOpenItem: (id: string) => void;
}) {
  const { course, lesson } = loc;
  const items = itemsForLesson(lesson.items);
  return (
    <div>
      <button type="button" className="btn-pill" onClick={onBack} title="Back to units">Units</button>
      <h3 style={{ fontFamily: 'var(--font-mono)', margin: '0.6rem 0 0.3rem' }}>{lesson.title}</h3>
      <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
        Read: The Stacks · {lesson.reading.stack} · {lesson.reading.chapter}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#71717a', margin: '0.3rem 0 0.8rem' }}>
        {lesson.doors.map(d => (
          <div key={d}><a href={d} target="_blank" rel="noreferrer" style={{ color: '#c4b5fd' }}>{d}</a></div>
        ))}
      </div>
      {items.map(it => (
        <button
          key={it.id}
          type="button"
          className="btn-pill"
          style={{ display: 'block', marginBottom: '0.4rem' }}
          title={it.kind}
          onClick={() => onOpenItem(it.id)}
        >
          {itemComplete(p, it.id) ? '✓' : '○'} {it.kind} — {it.prompt.slice(0, 80)}
        </button>
      ))}
      <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.8rem' }}>{course.license.attribution}</div>
    </div>
  );
}

function Today({
  p,
  today,
  onOpenLesson,
  onAddTask,
  onToggleTask
}: {
  p: Progress;
  today: string;
  onOpenLesson: (courseId: string, lessonId: string) => void;
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const lessons = suggestedToday(p, today);
  return (
    <div>
      <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginBottom: '0.6rem' }}>
        Suggested today. If life happened, the plan already shifted. No due dates.
      </div>
      {lessons.length === 0 && <div style={{ color: '#a1a1aa' }}>Nothing queued. Enroll a course or tick a personal task.</div>}
      {lessons.map(lid => {
        for (const cid of p.enrolled) {
          const found = lessonById(cid, lid);
          if (found) {
            return (
              <button
                key={lid}
                type="button"
                className="btn-pill"
                style={{ display: 'block', marginBottom: '0.4rem' }}
                title={found.lesson.title}
                onClick={() => onOpenLesson(cid, lid)}
              >
                {found.course.title} · {found.lesson.title}
              </button>
            );
          }
        }
        return null;
      })}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="personal task"
          title="Add a personal task with no due date"
          style={{ flex: 1, background: '#111118', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.35)', borderRadius: '6px', padding: '0.4rem', fontFamily: 'var(--font-mono)' }}
        />
        <button
          type="button"
          className="btn-pill"
          title="Add task"
          onClick={() => {
            if (!title.trim()) return;
            onAddTask(title.trim());
            setTitle('');
          }}
        >
          Add
        </button>
      </div>
      {p.tasks.map(t => (
        <label key={t.id} style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.85rem' }}>
          <input type="checkbox" checked={t.done} onChange={() => onToggleTask(t.id)} title="Tick when done" /> {t.title}
        </label>
      ))}
    </div>
  );
}

function Cards({ p, today, onChange }: { p: Progress; today: string; onChange: (p: Progress) => void }) {
  const due = dueCards(p.leitner, today);
  const [idx, setIdx] = useState(0);
  const card = due[idx];
  if (!due.length) return <div style={{ color: '#a1a1aa' }}>No cards due. Misses from quizzes land here.</div>;
  return (
    <div>
      <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>{due.length} due · box {card.box}</div>
      <div className="card-elevated" style={{ padding: '1rem', marginTop: '0.6rem', minHeight: '8rem' }}>
        {card.prompt}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
        <button type="button" className="btn-pill" title="I still miss this" onClick={() => {
          const nextCard = reviewCard(card, false, today);
          onChange({ ...p, leitner: p.leitner.map(c => (c.id === card.id ? nextCard : c)) });
          setIdx(i => (due.length <= 1 ? 0 : (i + 1) % due.length));
        }}>Again</button>
        <button type="button" className="btn-pill" title="I remember" onClick={() => {
          const nextCard = reviewCard(card, true, today);
          onChange({ ...p, leitner: p.leitner.map(c => (c.id === card.id ? nextCard : c)) });
          setIdx(0);
        }}>Got it</button>
      </div>
    </div>
  );
}

function RecordPane({ p }: { p: Progress }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
        XP {p.xp} · streak {p.streak.count} (longest {p.streak.longest})
      </div>
      <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginBottom: '0.8rem' }}>study record on this device</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
        {BADGE_CATALOG.map(b => {
          const on = p.badges.includes(b.id);
          return (
            <div
              key={b.id}
              className="card-elevated"
              title={b.blurb}
              style={{ padding: '0.6rem', opacity: on ? 1 : 0.35 }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: on ? '#c4b5fd' : '#71717a' }}>{b.title}</div>
              <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{b.blurb}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemRunner({
  item,
  p,
  today,
  kidSafe,
  onClose,
  onChange,
  onOpenDocument
}: {
  item: PublicItem;
  p: Progress;
  today: string;
  kidSafe: boolean;
  onClose: () => void;
  onChange: (p: Progress) => void;
  onOpenDocument: (content: string, title: string) => void;
}) {
  const done = itemComplete(p, item.id);
  return (
    <div
      style={{
        borderTop: '1px solid rgba(139, 92, 246, 0.3)',
        paddingTop: '0.7rem',
        maxHeight: '46%',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong style={{ fontFamily: 'var(--font-mono)' }}>{item.kind}</strong>
        <button type="button" className="btn-pill" onClick={onClose} title="Close item">Back</button>
      </div>
      <p style={{ fontSize: '0.85rem' }}>{item.prompt}</p>
      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{item.source.work} · {item.source.loc}</div>
      {item.kind === 'reading' && !done && (
        <button
          type="button"
          className="btn-pill"
          style={{ marginTop: '0.6rem' }}
          title="Mark this chapter read"
          onClick={() => onChange(completeItem(p, item.id, 'reading', today))}
        >
          I read this
        </button>
      )}
      {(item.kind === 'quiz' || item.kind === 'exam') && item.questions && (
        <QuestionSet item={item} p={p} today={today} onChange={onChange} />
      )}
      {(item.kind === 'essay' || item.kind === 'project' || item.kind === 'assignment') && (
        <RubricItem item={item} p={p} today={today} kidSafe={kidSafe} onChange={onChange} onOpenDocument={onOpenDocument} />
      )}
      {done && <div style={{ color: '#34d399', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>complete</div>}
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
  const lockedHints = isExam && !itemComplete(p, item.id) && Object.values(feedback).every(v => v === undefined);

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
    if (allPass) next = completeItem(next, item.id, item.kind, today);
    setFeedback(fb);
    onChange(next);
  };

  const submitAll = () => {
    let next = p;
    const fb: Record<string, boolean | undefined> = {};
    let anyFail = false;
    for (const q of qs) {
      const res = gradeQuestion(q.id, parseAnswer(q));
      fb[q.id] = res.pass;
      next = markQuestion(next, q.id, res.pass, q.qtype === 'numeric');
      if (!res.pass) {
        anyFail = true;
        next = { ...next, leitner: upsertMiss(next.leitner, item.id, q.id, q.prompt, today) };
      }
    }
    if (anyFail) next = recordAttempt(next, item.id);
    const allPass = qs.every(q => fb[q.id]);
    if (isExam) next = recordExamSitting(next, item.id, allPass);
    if (allPass) next = completeItem(next, item.id, item.kind, today);
    setFeedback(fb);
    onChange(next);
  };

  return (
    <div>
      {isExam && item.suggestedMinutes ? (
        <div style={{ fontSize: '0.78rem', color: seconds === 0 ? '#c4b5fd' : '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
          suggested {item.suggestedMinutes} min · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          {seconds === 0 ? ' — keep going' : ''}
        </div>
      ) : null}
      {qs.map(q => (
        <div key={q.id} style={{ margin: '0.7rem 0' }}>
          <div style={{ fontSize: '0.85rem' }}>{q.prompt}</div>
          {q.choices ? (
            q.choices.map(ch => (
              <label key={ch} style={{ display: 'block', fontSize: '0.8rem' }}>
                <input
                  type={q.qtype === 'multi' ? 'checkbox' : 'radio'}
                  name={q.id}
                  checked={q.qtype === 'multi' ? (answers[q.id] || '').split('\n').includes(ch) : answers[q.id] === ch}
                  onChange={() => {
                    if (q.qtype === 'multi') {
                      const cur = new Set((answers[q.id] || '').split('\n').filter(Boolean));
                      if (cur.has(ch)) cur.delete(ch);
                      else cur.add(ch);
                      setAnswers(a => ({ ...a, [q.id]: Array.from(cur).join('\n') }));
                    } else {
                      setAnswers(a => ({ ...a, [q.id]: ch }));
                    }
                  }}
                />{' '}
                {ch}
              </label>
            ))
          ) : (
            <input
              value={answers[q.id] || ''}
              onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              title="Your answer"
              style={{ width: '100%', background: '#111118', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.35)', borderRadius: '6px', padding: '0.35rem', fontFamily: 'var(--font-mono)' }}
            />
          )}
          {!isExam && q.hint && (
            <div style={{ fontSize: '0.72rem', color: '#71717a' }} title="Hint">{q.hint}</div>
          )}
          {isExam && !lockedHints && q.hint && (
            <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{q.hint}</div>
          )}
          {feedback[q.id] === true && <div style={{ color: '#34d399', fontSize: '0.75rem' }}>pass</div>}
          {feedback[q.id] === false && <div style={{ color: '#f0abfc', fontSize: '0.75rem' }}>not yet — try again</div>}
          {!isExam && (
            <button type="button" className="btn-pill" style={{ marginTop: '0.3rem' }} onClick={() => submitOne(q.id)} title="Check this item">
              Try
            </button>
          )}
        </div>
      ))}
      {isExam && (
        <button type="button" className="btn-pill" onClick={submitAll} title="Submit this sitting">
          Submit sitting
        </button>
      )}
    </div>
  );
}

function RubricItem({
  item,
  p,
  today,
  kidSafe,
  onChange,
  onOpenDocument
}: {
  item: PublicItem;
  p: Progress;
  today: string;
  kidSafe: boolean;
  onChange: (p: Progress) => void;
  onOpenDocument: (content: string, title: string) => void;
}) {
  const [ticks, setTicks] = useState<Record<string, boolean>>({});
  const rows = item.rubric || [];
  const steps = item.steps || [];
  const ready = rows.every(r => ticks[r.id]) && steps.every((_, i) => ticks['s' + i] || steps.length === 0);
  return (
    <div>
      {steps.map((s, i) => (
        <label key={s} style={{ display: 'block', fontSize: '0.8rem' }}>
          <input type="checkbox" checked={!!ticks['s' + i]} onChange={() => setTicks(t => ({ ...t, ['s' + i]: !t['s' + i] }))} /> {s}
        </label>
      ))}
      {rows.map(r => (
        <label key={r.id} style={{ display: 'block', fontSize: '0.8rem' }}>
          <input type="checkbox" checked={!!ticks[r.id]} onChange={() => setTicks(t => ({ ...t, [r.id]: !t[r.id] }))} /> {r.criterion}
        </label>
      ))}
      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn-pill"
          title="Write in Document Studio"
          onClick={() => onOpenDocument(`# ${item.prompt}\n\n`, item.kind)}
        >
          Write
        </button>
        <button
          type="button"
          className="btn-pill"
          disabled={!ready || itemComplete(p, item.id)}
          title="Self-score complete when every rubric row is ticked"
          onClick={() => {
            let next = recordAttempt(p, item.id);
            next = completeItem(next, item.id, item.kind, today);
            onChange(next);
          }}
        >
          Complete
        </button>
      </div>
      {kidSafe ? <div style={{ fontSize: '0.72rem', color: '#71717a' }}>Coach in chat stays Socratic.</div> : null}
    </div>
  );
}
