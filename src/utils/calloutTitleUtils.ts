import { getTrimmedFirstCapturingGroupIfExists } from "./regexUtils";
import { toTitleCaseWord } from "./stringUtils";

const CALLOUT_ID_REGEX = /^> \[!(\w+)\]/;
const CALLOUT_TITLE_REGEX = /^> \[!\w+\] (.+)/;
const HEADING_TITLE_REGEX = /^#+ (.+)/;

export function makeCalloutHeader({
  calloutID,
  title,
}: {
  calloutID: string;
  title: string;
}): string {
  const baseCalloutHeader = makeBaseCalloutHeader(calloutID);
  return `${baseCalloutHeader} ${title}`;
}

function makeBaseCalloutHeader(calloutID: string): string {
  return `> [!${calloutID}]`;
}

export function getDefaultCalloutTitle(calloutID: string): string {
  return toTitleCaseWord(calloutID);
}

export function makeDefaultCalloutHeader(calloutID: string): string {
  const defaultTitle = getDefaultCalloutTitle(calloutID);
  return makeCalloutHeader({ calloutID, title: defaultTitle });
}

export function makeH6Line(title: string): string {
  return `###### ${title}`;
}

/**
 * Parses the callout ID and effective title from the full text of a callout.
 *
 * @param fullCalloutText The full text of the callout (both the header and the body).
 */
export function getCalloutIDAndEffectiveTitle(fullCalloutText: string): {
  calloutID: string;
  effectiveTitle: string;
} {
  const calloutID = getCalloutID(fullCalloutText);
  const effectiveTitle = getCalloutEffectiveTitle(calloutID, fullCalloutText);
  return { calloutID, effectiveTitle };
}

function getCalloutID(fullCalloutText: string): string {
  const maybeCalloutID = getTrimmedCalloutIDIfExists(fullCalloutText);
  if (maybeCalloutID === undefined) {
    throw new Error("Callout ID not found in callout text.");
  }
  return maybeCalloutID;
}

function getTrimmedCalloutIDIfExists(fullCalloutText: string): string | undefined {
  return getTrimmedFirstCapturingGroupIfExists(CALLOUT_ID_REGEX, fullCalloutText);
}

/**
 * Gets the effective title of a callout, which may either be an explicitly set non-empty (and not
 * only whitespace) title, or otherwise inferred as the default title.
 */
function getCalloutEffectiveTitle(calloutID: string, fullCalloutText: string): string {
  const maybeExplicitTitle = getTrimmedCalloutTitleIfExists(fullCalloutText);
  if (maybeExplicitTitle === "" || maybeExplicitTitle === undefined) {
    return getDefaultCalloutTitle(calloutID);
  }
  return maybeExplicitTitle;
}

/**
 * Gets the explicit title (trimmed of surrounding whitespace) of a callout, if one is present.
 *
 * @param fullCalloutText The full text of the callout (both the header and the body).
 */
function getTrimmedCalloutTitleIfExists(fullCalloutText: string): string | undefined {
  return getTrimmedFirstCapturingGroupIfExists(CALLOUT_TITLE_REGEX, fullCalloutText);
}

/**
 * Gets the heading title text (trimmed of surrounding whitespace) from the first line of selected
 * text to be wrapped in a callout, if such a heading text exists. If none is found or the trimmed
 * string is empty, returns undefined.
 *
 * @param firstSelectedLine The first line of the text to be wrapped in a callout.
 * @returns The trimmed heading text if it exists and is non-empty, otherwise undefined.
 */
export function getCustomHeadingTitleIfExists({
  firstSelectedLine,
}: {
  firstSelectedLine: string;
}): string | undefined {
  const maybeHeadingTitle = getTrimmedHeadingTitleIfExists(firstSelectedLine);
  if (maybeHeadingTitle === "" || maybeHeadingTitle === undefined) {
    return undefined;
  }
  return maybeHeadingTitle;
}

function getTrimmedHeadingTitleIfExists(firstSelectedLine: string): string | undefined {
  return getTrimmedFirstCapturingGroupIfExists(HEADING_TITLE_REGEX, firstSelectedLine);
}

/**
 * Determines whether the given title is a custom title or the default title for the given callout.
 */
export function isCustomTitle({ calloutID, title }: { calloutID: string; title: string }): boolean {
  const defaultTitle = getDefaultCalloutTitle(calloutID);
  return title !== defaultTitle;
}
