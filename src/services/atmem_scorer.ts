// src/services/atmem_scorer.ts
import { MemoryAtom, ScoredAtom } from '../types';

/**
 * BM25 parameters
 */
const BM25_K1 = 1.2;
const BM25_B = 0.75;

/**
 * PII detection regex patterns
 */
const PII_PATTERNS = {
  phone: /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/,
  address: /\b\d+\s+[A-Za-z0-9\s,.'-]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Square|Sq|Trail|Trl|Parkway|Pkwy|Circle|Cir|Terrace|Ter)\b/i
};

/**
 * Calculate BM25 score for a query against a document
 */
function calculateBM25Score(
  query: string,
  document: string,
  avgDocLength: number,
  termFrequencies: Map<string, number>,
  documentFrequency: Map<string, number>,
  totalDocuments: number
): number {
  const queryTerms = query.toLowerCase().match(/\b\w+\b/g) || [];
  const docTerms = document.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Term frequency in document
  const tfMap: Map<string, number> = new Map();
  for (const term of docTerms) {
    tfMap.set(term, (tfMap.get(term) || 0) + 1);
  }
  
  const docLength = docTerms.length;
  const k1 = BM25_K1;
  const b = BM25_B;
  
  let score = 0;
  
  for (const term of queryTerms) {
    const tf = tfMap.get(term) || 0;
    const df = documentFrequency.get(term) || 0;
    
    if (df === 0) continue;
    
    const idf = Math.log((totalDocuments - df + 0.5) / (df + 0.5) + 1);
    const numerator = tf * (k1 + 1);
    const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength));
    
    score += idf * (numerator / denominator);
  }
  
  return score;
}

/**
 * Check if text contains PII using regex patterns
 */
function containsPII(text: string): boolean {
  return Object.values(PII_PATTERNS).some(pattern => pattern.test(text));
}

/**
 * Approximate token count (4 characters per token)
 */
function approximateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Score memory atoms using BM25 relevance scoring with governance prioritization
 * and PII flagging, respecting token budget constraints.
 */
export function scoreMemoryAtoms(
  query: string,
  atoms: MemoryAtom[],
  maxTokens: number = 256
): ScoredAtom[] {
  if (atoms.length === 0) return [];
  
  // Calculate average document length for BM25
  const totalLength = atoms.reduce((sum, atom) => sum + approximateTokenCount(atom.text), 0);
  const avgDocLength = totalLength / atoms.length;
  
  // Build term frequency and document frequency maps
  const termFrequencies: Map<string, number> = new Map();
  const documentFrequency: Map<string, number> = new Map();
  
  // First pass: collect all terms and document frequencies
  const atomTerms: string[][] = [];
  
  for (const atom of atoms) {
    const terms = atom.text.toLowerCase().match(/\b\w+\b/g) || [];
    atomTerms.push(terms);
    
    // Term frequency in this document
    const tfMap: Map<string, number> = new Map();
    for (const term of terms) {
      tfMap.set(term, (tfMap.get(term) || 0) + 1);
    }
    
    // Update document frequency (count unique terms per document)
    const uniqueTerms = new Set<string>(terms);
    for (const term of uniqueTerms) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    }
    
    // Store term frequencies for this atom (we'll reuse in scoring)
    termFrequencies.set(atom.id, tfMap.size); // This is a simplification - we actually need per-term TF
  }
  
  // Second pass: calculate BM25 scores
  const scoredAtoms: ScoredAtom[] = atoms.map((atom, index) => {
    // Recalculate term frequencies for this specific atom
    const terms = atomTerms[index];
    const tfMap: Map<string, number> = new Map();
    for (const term of terms) {
      tfMap.set(term, (tfMap.get(term) || 0) + 1);
    }
    
    const bm25Score = calculateBM25Score(
      query,
      atom.text,
      avgDocLength,
      tfMap, // This should be the term frequencies for this document
      documentFrequency,
      atoms.length
    );
    
    const hasPII = containsPII(atom.text);
    const tokenCount = approximateTokenCount(atom.text);
    
    return {
      ...atom,
      score: bm25Score,
      isGoverned: atom.isGoverned ?? false,
      hasPII,
      tokenCount
    };
  });
  
  // Sort: governed atoms first (by score descending), then non-governed (by score descending)
  scoredAtoms.sort((a, b) => {
    // Governed atoms always come first
    if (a.isGoverned && !b.isGoverned) return -1;
    if (!a.isGoverned && b.isGoverned) return 1;
    
    // Otherwise sort by score descending
    return b.score - a.score;
  });
  
  // Apply token budget constraint
  const result: ScoredAtom[] = [];
  let currentTokenCount = 0;
  
  for (const atom of scoredAtoms) {
    if (currentTokenCount + atom.tokenCount <= maxTokens) {
      result.push(atom);
      currentTokenCount += atom.tokenCount;
    } else {
      // If we can't fit the whole atom, we could truncate it,
      // but for simplicity we'll skip it (as per typical retrieval behavior)
      break;
    }
  }
  
  return result;
}
