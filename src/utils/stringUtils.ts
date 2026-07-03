import type { NonEmptyStringArray } from "./arrayUtils";

/**
 * Better-typed version of `text.split("\n")` where we know the result will always have at least one
 * element, since `String.prototype.split` only returns an empty array when the input string and
 * separator are both empty strings, and in this case the separator is "\n" which is not empty.
 */
export function getTextLines(text: string): NonEmptyStringArray {
  return text.split("\n") as NonEmptyStringArray;
}

export function toTitleCase(text: string): string {
  const words = text.split(/\s|-/);
  const capitalizedWords = words.map((word) => toSentenceCase(word));
  return capitalizedWords.join(" ");
}

export function toSentenceCase(text: string): string {
  const firstLetter = text.charAt(0).toUpperCase();
  const rest = text.slice(1).toLowerCase();
  return `${firstLetter}${rest}`;
}
