import { Report } from '../types/database';

export interface MatchScoreResult {
  score: number;
  reasons: string[];
  confidence: 'Excellent Match' | 'Strong Match' | 'Possible Match' | 'Low Match';
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with', 'my', 'i', 'found', 'lost',
  'item', 'please', 'help', 'near', 'some', 'this', 'there'
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function calculateJaccard(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersectionCount = 0;
  setA.forEach(token => {
    if (setB.has(token)) intersectionCount++;
  });
  const unionCount = new Set([...tokensA, ...tokensB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export function calculateSimilarity(reportA: Report, reportB: Report): MatchScoreResult {
  const reasons: string[] = [];
  let totalScore = 0;

  // 1. Category Matching (Max 25 pts)
  const catA = reportA.category.toLowerCase().trim();
  const catB = reportB.category.toLowerCase().trim();

  if (catA === catB) {
    totalScore += 25;
    reasons.push(`Identical category: ${reportA.category}`);
  } else if (
    (catA === 'jewelry' && catB === 'accessories') ||
    (catA === 'accessories' && catB === 'jewelry') ||
    (catA === 'documents' && catB === 'id_card') ||
    (catA === 'id_card' && catB === 'documents') ||
    (catA === 'bag' && catB === 'accessories')
  ) {
    totalScore += 15;
    reasons.push(`Closely related categories (${reportA.category} & ${reportB.category})`);
  } else {
    // Categories completely mismatch -> penalize heavily
    totalScore += 0;
  }

  // 2. Item Name Similarity (Max 30 pts)
  const nameTokensA = tokenize(reportA.item_name);
  const nameTokensB = tokenize(reportB.item_name);
  const nameJaccard = calculateJaccard(nameTokensA, nameTokensB);

  // Exact substring check
  const cleanNameA = reportA.item_name.toLowerCase().trim();
  const cleanNameB = reportB.item_name.toLowerCase().trim();

  if (cleanNameA === cleanNameB) {
    totalScore += 30;
    reasons.push(`Exact item name match ("${reportA.item_name}")`);
  } else if (cleanNameA.includes(cleanNameB) || cleanNameB.includes(cleanNameA)) {
    totalScore += 26;
    reasons.push(`Item name phrases overlap directly`);
  } else if (nameJaccard > 0.4) {
    const points = Math.min(30, Math.round(nameJaccard * 35));
    totalScore += points;
    reasons.push(`High name similarity (${Math.round(nameJaccard * 100)}% keyword overlap)`);
  } else if (nameJaccard > 0) {
    const points = Math.min(18, Math.round(nameJaccard * 25));
    totalScore += points;
    reasons.push(`Shared keywords in item name`);
  }

  // 3. Description Similarity (Max 25 pts)
  const descTokensA = tokenize(reportA.description);
  const descTokensB = tokenize(reportB.description);
  const sharedDescTokens = descTokensA.filter(token => descTokensB.includes(token));
  const uniqueSharedTokens = Array.from(new Set(sharedDescTokens));

  if (uniqueSharedTokens.length >= 4) {
    totalScore += 25;
    reasons.push(`Strong description match (${uniqueSharedTokens.slice(0, 3).join(', ')}...)`);
  } else if (uniqueSharedTokens.length >= 2) {
    totalScore += 16;
    reasons.push(`Matching descriptive keywords: ${uniqueSharedTokens.join(', ')}`);
  } else if (uniqueSharedTokens.length === 1) {
    totalScore += 8;
    reasons.push(`Shared descriptor: "${uniqueSharedTokens[0]}"`);
  }

  // 4. Location Proximity (Max 12 pts)
  const locTokensA = tokenize(reportA.location);
  const locTokensB = tokenize(reportB.location);
  const locJaccard = calculateJaccard(locTokensA, locTokensB);
  const cleanLocA = reportA.location.toLowerCase().trim();
  const cleanLocB = reportB.location.toLowerCase().trim();

  if (cleanLocA === cleanLocB) {
    totalScore += 12;
    reasons.push(`Identical location: "${reportA.location}"`);
  } else if (cleanLocA.includes(cleanLocB) || cleanLocB.includes(cleanLocA) || locJaccard > 0.3) {
    totalScore += 10;
    reasons.push(`Nearby or matching vicinity (${reportA.location} / ${reportB.location})`);
  } else if (locJaccard > 0) {
    totalScore += 5;
    reasons.push(`Similar area keywords in location`);
  }

  // 5. Date Proximity (Max 8 pts)
  try {
    const dateA = new Date(reportA.date_occurred).getTime();
    const dateB = new Date(reportB.date_occurred).getTime();
    if (!isNaN(dateA) && !isNaN(dateB)) {
      const diffDays = Math.abs(dateA - dateB) / (1000 * 60 * 60 * 24);
      if (diffDays <= 1) {
        totalScore += 8;
        reasons.push(`Dates occurred within 24 hours of each other`);
      } else if (diffDays <= 4) {
        totalScore += 6;
        reasons.push(`Occurred within ${Math.round(diffDays)} days`);
      } else if (diffDays <= 14) {
        totalScore += 3;
        reasons.push(`Occurred within ~2 weeks`);
      }
    }
  } catch {
    // Ignore date parse errors
  }

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, totalScore));

  let confidence: MatchScoreResult['confidence'] = 'Low Match';
  if (finalScore >= 90) {
    confidence = 'Excellent Match';
  } else if (finalScore >= 75) {
    confidence = 'Strong Match';
  } else if (finalScore >= 60) {
    confidence = 'Possible Match';
  }

  return {
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ['General item similarity'],
    confidence
  };
}
