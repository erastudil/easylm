/**
 * topic : alice mind trust model.
 *
 * comment : host whitelist evaluation for citation doors; deny overrides allow; suffix match on registrable roots only.
 */

import { hostOf } from './text.js';

/** createTrust : build trust predicates from a whitelist document plus compile-time host additions. */
export function createTrust(doc, extra = {}) {
  const hosts = new Map();
  for (const [cls, list] of Object.entries((doc && doc.classes) || {})) {
    for (const h of list) hosts.set(h.toLowerCase(), cls);
  }
  for (const [h, cls] of Object.entries(extra)) if (!hosts.has(h)) hosts.set(h.toLowerCase(), cls);
  const deny = new Set(((doc && doc.deny) || []).map(h => h.toLowerCase()));
  const seedOnly = new Set((doc && doc.seedOnly) || []);

  const match = (set, h) => {
    if (set.has(h)) return h;
    const parts = h.split('.');
    for (let i = 1; i < parts.length - 1; i++) {
      const root = parts.slice(i).join('.');
      if (set.has(root)) return root;
    }
    return null;
  };

  function classOf(url) {
    const h = hostOf(url);
    if (!h) return null;
    if (match(deny, h)) return null;
    const root = match(hosts, h);
    return root ? hosts.get(root) : null;
  }

  return {
    classOf,
    isTrusted: url => classOf(url) !== null,
    isSeedOnly: url => seedOnly.has(classOf(url)),
    isDenied: url => { const h = hostOf(url); return !!(h && match(deny, h)); },
    toJSON: () => ({ hosts: Object.fromEntries(hosts), deny: [...deny], seedOnly: [...seedOnly] })
  };
}

/** trustFromBundle : rehydrate trust predicates from a compiled bundle whitelist snapshot. */
export function trustFromBundle(snapshot) {
  const doc = { classes: {}, deny: (snapshot && snapshot.deny) || [], seedOnly: (snapshot && snapshot.seedOnly) || [] };
  for (const [h, cls] of Object.entries((snapshot && snapshot.hosts) || {})) {
    (doc.classes[cls] = doc.classes[cls] || []).push(h);
  }
  return createTrust(doc);
}
