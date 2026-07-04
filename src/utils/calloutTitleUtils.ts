import type { PluginSettingsManager } from "../pluginSettingsManager";
import type { EditorRange } from "obsidian";

import { getTrimmedFirstCapturingGroupIfExists } from "./regexUtils";
import { toSentenceCase } from "./stringUtils";

export const CALLOUT_HEADER_WITH_ID_CAPTURE_REGEX = /^> \[!(.+)\]/;
const CALLOUT_TITLE_REGEX = /^> \[!.+\][+-]? (.+)/;
const HEADING_TITLE_REGEX = /^#+ (.+)/;

export type CalloutHeaderParts = {
  /** The base part of the header, e.g. `> [!quote]` */
  baseCalloutHeader: string;
  /** The foldable suffix: `+`, `-`, or "" */
  foldableSuffix: string;
  /** The title part of the header, e.g. `Quote` */
  maybeTitle: string | undefined;
};

export function makeCalloutHeader({
  calloutID,
  maybeTitleFromHeading,
  pluginSettingsManager,
}: {
  calloutID: string;
  /** The title parsed from the first selected line if it was a heading, else undefined */
  maybeTitleFromHeading: string | undefined;
  pluginSettingsManager: PluginSettingsManager;
}): string {
  const calloutHeaderParts = getNewCalloutHeaderParts({
    calloutID,
    maybeTitleFromHeading,
    pluginSettingsManager,
  });
  return constructCalloutHeaderFromParts(calloutHeaderParts);
}

/**
 * Returns the parts of the header of a new callout, including the base callout header, foldable
 * suffix, and title, based on the user's settings. Uses the given title parsed from the first
 * selected line if that line was a non-empty heading; otherwise, if the user's settings call for an
 * explicit title, uses the default title for the callout.
 */
export function getNewCalloutHeaderParts({
  calloutID,
  maybeTitleFromHeading,
  pluginSettingsManager,
}: {
  calloutID: string;
  /** The title parsed from the first selected line if it was a heading, else undefined */
  maybeTitleFromHeading: string | undefined;
  pluginSettingsManager: PluginSettingsManager;
}): CalloutHeaderParts {
  const baseCalloutHeader = makeBaseCalloutHeader(calloutID, pluginSettingsManager);
  const foldableSuffix = makeFoldableSuffix(pluginSettingsManager);
  const maybeTitle =
    maybeTitleFromHeading ?? maybeMakeExplicitTitle(calloutID, pluginSettingsManager);
  return { baseCalloutHeader, foldableSuffix, maybeTitle };
}

function makeBaseCalloutHeader(
  calloutID: string,
  pluginSettingsManager: PluginSettingsManager,
): string {
  const capitalizedCalloutID = makeCapitalizedCalloutID(calloutID, pluginSettingsManager);
  return `> [!${capitalizedCalloutID}]`;
}

function makeCapitalizedCalloutID(
  calloutID: string,
  pluginSettingsManager: PluginSettingsManager,
): string {
  const calloutIDCapitalization = pluginSettingsManager.getSetting("calloutIDCapitalization");
  switch (calloutIDCapitalization) {
    case "lower":
      return calloutID.toLowerCase();
    case "upper":
      return calloutID.toUpperCase();
    case "sentence":
      return toSentenceCase(calloutID);
    case "title":
      return calloutID
        .split("-")
        .map((word) => toSentenceCase(word))
        .join("-");
  }
}

function makeFoldableSuffix(pluginSettingsManager: PluginSettingsManager): string {
  const defaultFoldableState = pluginSettingsManager.getSetting("defaultFoldableState");
  switch (defaultFoldableState) {
    case "unfoldable":
      return "";
    case "foldable-expanded":
      return "+";
    case "foldable-collapsed":
      return "-";
  }
}

/**
 * Returns an explicit default title for the callout, if one should be used (depending on the user's
 * settings), else undefined.
 */
export function maybeMakeExplicitTitle(
  calloutID: string,
  pluginSettingsManager: PluginSettingsManager,
): string | undefined {
  const shouldUseExplicitTitle = pluginSettingsManager.getSetting("shouldUseExplicitTitle");
  if (!shouldUseExplicitTitle) {
    return undefined;
  }
  return getDefaultCalloutTitle(calloutID);
}

export function constructCalloutHeaderFromParts({
  baseCalloutHeader,
  foldableSuffix,
  maybeTitle,
}: CalloutHeaderParts): string {
  const titleText = maybeTitle !== undefined ? ` ${maybeTitle}` : "";
  return `${baseCalloutHeader}${foldableSuffix}${titleText}`;
}

export function makeH6Line(title: string): string {
  return `###### ${title}`;
}

/**
 * Parses the callout ID and explicit title (if present) from the full text of a callout.
 *
 * @param fullCalloutText The full text of the callout (both the header and the body).
 */
export function getCalloutIDAndExplicitTitle(fullCalloutText: string): {
  calloutID: string;
  maybeExplicitTitle: string | undefined;
} {
  const calloutID = getCalloutID(fullCalloutText);
  const maybeExplicitTitle = getTrimmedExplicitTitleIfExists(fullCalloutText);
  return { calloutID, maybeExplicitTitle };
}

function getCalloutID(fullCalloutText: string): string {
  const maybeCalloutID = getTrimmedCalloutIDIfExists(fullCalloutText);
  if (maybeCalloutID === undefined) {
    throw new Error("Callout ID not found in callout text.");
  }
  return maybeCalloutID;
}

function getTrimmedCalloutIDIfExists(fullCalloutText: string): string | undefined {
  return getTrimmedFirstCapturingGroupIfExists(
    CALLOUT_HEADER_WITH_ID_CAPTURE_REGEX,
    fullCalloutText,
  );
}

/**
 * Gets the explicit title (trimmed of surrounding whitespace) of a callout, if one is present.
 *
 * @param fullCalloutText The full text of the callout (both the header and the body).
 */
function getTrimmedExplicitTitleIfExists(fullCalloutText: string): string | undefined {
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
  const maybeTitleFromHeading = getTrimmedHeadingTitleIfExists(firstSelectedLine);
  if (maybeTitleFromHeading === "" || maybeTitleFromHeading === undefined) {
    return undefined;
  }
  return maybeTitleFromHeading;
}

function getTrimmedHeadingTitleIfExists(firstSelectedLine: string): string | undefined {
  return getTrimmedFirstCapturingGroupIfExists(HEADING_TITLE_REGEX, firstSelectedLine);
}

/**
 * Determines whether the given explicit title, if it even exists, is a custom title or the same as
 * the default title for the given callout.
 */
export function isCustomTitle({ calloutID, title }: { calloutID: string; title: string }): boolean {
  return title !== "" && title !== getDefaultCalloutTitle(calloutID);
}

function getDefaultCalloutTitle(calloutID: string): string {
  return toSentenceCase(calloutID).replace(/-/g, " ");
}

/**
 * Gets the title's editor range, given the parts of the callout header and the title's line number.
 */
export function getTitleRange({
  calloutHeaderParts,
  line,
}: {
  calloutHeaderParts: CalloutHeaderParts;
  line: number;
}): EditorRange {
  const { baseCalloutHeader, foldableSuffix, maybeTitle } = calloutHeaderParts;
  if (maybeTitle === undefined) {
    const ch = baseCalloutHeader.length + foldableSuffix.length;
    return { from: { line, ch }, to: { line, ch } };
  }
  const titleLength = maybeTitle.length;
  const titleStart = baseCalloutHeader.length + foldableSuffix.length + 1;
  const titleEnd = titleStart + titleLength;
  return { from: { line, ch: titleStart }, to: { line, ch: titleEnd } };
}
