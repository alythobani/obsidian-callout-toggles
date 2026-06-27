/**
 * Returns the first capturing group match (trimmed of surrounding whitespace) of the regex executed
 * on the text, if found. If the match is not found, returns undefined.
 * @param regex The regex to use, with at least one capturing group
 * @param text The text to search
 * @returns The first capturing group match (trimmed) if it exists, otherwise undefined
 */
export function getTrimmedFirstCapturingGroupIfExists(
  regex: RegExp,
  text: string,
): string | undefined {
  const maybeRawMatch = getFirstCapturingGroupIfExists(regex, text);
  return maybeRawMatch?.trim();
}

/**
 * Returns the first capturing group match of the regex if it exists, otherwise returns undefined.
 * @param regex The regex to use, with at least one capturing group
 * @param text The text to search
 * @returns The first capturing group match if it exists, otherwise undefined
 */
export function getFirstCapturingGroupIfExists(regex: RegExp, text: string): string | undefined {
  const match = regex.exec(text);
  return match?.[1];
}
