import { getActiveProfile } from './family';
import { listCourses, studioStatusLine } from './course';
import { loadProgress } from './progress';

export function execStudio(query: string): string {
  const q = String(query || '').trim().toLowerCase();
  const profile = getActiveProfile();
  const p = loadProgress(profile.id);
  if (q === 'list' || q === 'catalog') {
    const rows = listCourses().map(c => `• ${c.id} · ${c.title} (${c.level})`);
    return ['Studio catalog — local walks. No account. No diploma.', ...rows].join('\n');
  }
  return studioStatusLine({
    enrolled: p.enrolled,
    activeCourseId: p.activeCourseId,
    activeLessonId: p.activeLessonId
  });
}
