export interface BadgeDef {
  id: string;
  title: string;
  blurb: string;
}

export const BADGE_CATALOG: BadgeDef[] = [
  { id: 'first-lesson', title: 'First lesson', blurb: 'You opened a chapter and marked it read.' },
  { id: 'first-quiz', title: 'First quiz', blurb: 'Every item in a quiz, right. Tries did not count against you.' },
  { id: 'first-unit', title: 'Unit clear', blurb: 'A whole unit, complete.' },
  { id: 'first-course', title: 'Course clear', blurb: 'You finished a course on this device.' },
  { id: 'streak-7', title: 'Seven days', blurb: 'Showed up seven local days in a row.' },
  { id: 'streak-30', title: 'Thirty days', blurb: 'A month of showing up.' },
  { id: 'calc-hand', title: 'Calc hand', blurb: 'Ten numeric items passed. The calculator does the arithmetic.' },
  { id: 'essay-desk', title: 'Essay desk', blurb: 'First essay artifact submitted.' },
  { id: 'early-riser', title: 'Early riser', blurb: 'Completed work before 08:00 local. Day students.' },
  { id: 'night-scholar', title: 'Night scholar', blurb: 'Completed work at or after 20:00 local.' },
  { id: 'exam-persistence', title: 'Still here', blurb: 'Three exam sittings that were not yet a pass. You stayed.' },
  { id: 'exam-overcome', title: 'Overcame', blurb: 'Passed an exam after three or more unfinished sittings.' },
  { id: 'curiosity-unbound', title: 'Curiosity unbound', blurb: 'Enrolled in three or more distinct disciplines. Learning across boundaries.' },
  { id: 'patient-mind', title: 'The patient mind', blurb: 'Completed twenty-five study items. Knowledge is a steady walk, not a sprint.' },
  { id: 'sovereign-scholar', title: 'Sovereign scholar', blurb: 'Finished a course completely on local hardware. Free forever, answering only to truth.' }
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGE_CATALOG.find(b => b.id === id);
}
