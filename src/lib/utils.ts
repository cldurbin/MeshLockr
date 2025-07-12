// src/lib/utils.ts

/**
 * Normalize a string for simple, forgiving search comparisons.
 * - Lowercases the string
 * - Removes spaces
 */
export function normalize(str: string) {
  return str.toLowerCase().replace(/\s+/g, '')
}
/**
 * Checks if a string contains another string, ignoring case and spaces.
 * Uses the normalize function to compare both strings.
 */