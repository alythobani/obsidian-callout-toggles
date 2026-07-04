import type { PluginSettingsManager } from "../../pluginSettingsManager";
import type { AutoSelectionWhenTextSelectedMode } from "../../settings/autoSelectionModes";
import type { NonEmptyStringArray } from "../../utils/arrayUtils";
import type { CalloutHeaderParts } from "../../utils/calloutTitleUtils";
import type {
  ClearSelectionAction,
  CursorOrSelectionAction,
  CursorPositions,
  LineDiff,
  SelectedLinesDiff,
  SetSelectionAction,
  SetSelectionInCorrectDirectionAction,
} from "../../utils/selectionUtils";
import type { Editor, EditorPosition } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { getLastElement } from "../../utils/arrayUtils";
import {
  constructCalloutHeaderFromParts,
  getCustomHeadingTitleIfExists,
  getNewCalloutHeaderParts,
  getTitleRange,
} from "../../utils/calloutTitleUtils";
import {
  getCalloutStartPos,
  getClearSelectionCursorStartAction,
  getCursorPositions,
  getLastLineDiff,
  getNewFromPosition,
  getNewPositionWithinLine,
  getNewToPosition,
  getSelectedLinesRangeAndText,
  runCursorOrSelectionAction,
} from "../../utils/selectionUtils";
import { getTextLines } from "../../utils/stringUtils";

/**
 * Wraps the selected lines in a callout.
 */
export function wrapSelectedLinesInCallout(
  editor: Editor,
  calloutID: CalloutID,
  pluginSettingsManager: PluginSettingsManager,
): void {
  const originalCursorPositions = getCursorPositions(editor); // Save cursor positions before editing
  const { selectedLinesRange, selectedLinesText } = getSelectedLinesRangeAndText(editor);
  const selectedLines = getTextLines(selectedLinesText);
  const { maybeTitleFromHeading, rawBodyLines } =
    getCalloutTitleAndBodyFromSelectedLines(selectedLines);
  const calloutHeaderParts = getNewCalloutHeaderParts({
    calloutID,
    maybeTitleFromHeading,
    pluginSettingsManager,
  });
  const newLines = getNewCalloutLines({ calloutHeaderParts, rawBodyLines });
  const selectedLinesDiff = { oldLines: selectedLines, newLines };
  const newText = newLines.join("\n");
  editor.replaceRange(newText, selectedLinesRange.from, selectedLinesRange.to);
  setSelectionOrCursorAfterWrappingSelectedLines({
    editor,
    selectedLinesDiff,
    originalCursorPositions,
    pluginSettingsManager,
    calloutHeaderParts,
  });
}

/**
 * Gets the callout title (if provided via first selected line as a heading) and raw (i.e. not yet
 * prepended) body lines from the selected text lines.  Whether the first selected line is a heading
 * determines whether it is included in the raw body lines.
 */
function getCalloutTitleAndBodyFromSelectedLines(selectedLines: NonEmptyStringArray): {
  maybeTitleFromHeading: string | undefined;
  rawBodyLines: string[];
} {
  const [firstSelectedLine, ...restSelectedLines] = selectedLines;
  const maybeTitleFromHeading = getCustomHeadingTitleIfExists({ firstSelectedLine });
  const rawBodyLines = maybeTitleFromHeading === undefined ? selectedLines : restSelectedLines;
  return { maybeTitleFromHeading, rawBodyLines };
}

/**
 * Gets the new callout lines to replace the selected lines with.
 */
function getNewCalloutLines({
  calloutHeaderParts,
  rawBodyLines,
}: {
  calloutHeaderParts: CalloutHeaderParts;
  rawBodyLines: string[];
}): NonEmptyStringArray {
  const calloutHeader = constructCalloutHeaderFromParts(calloutHeaderParts);
  const calloutBodyLines = rawBodyLines.map((line) => `> ${line}`);
  return [calloutHeader, ...calloutBodyLines];
}

/**
 * Sets the selection or cursor (depending on user setting) after wrapping the selected lines in a
 * callout.
 */
function setSelectionOrCursorAfterWrappingSelectedLines({
  editor,
  selectedLinesDiff,
  originalCursorPositions,
  pluginSettingsManager,
  calloutHeaderParts,
}: {
  editor: Editor;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  pluginSettingsManager: PluginSettingsManager;
  calloutHeaderParts: CalloutHeaderParts;
}): void {
  const { whenTextSelected } = pluginSettingsManager.getSetting("autoSelectionModes");
  const cursorOrSelectionAction = getCursorOrSelectionActionAfterWrappingSelectedLines({
    whenTextSelected,
    selectedLinesDiff,
    originalCursorPositions,
    calloutHeaderParts,
  });
  runCursorOrSelectionAction({ editor, action: cursorOrSelectionAction });
}

export function getCursorOrSelectionActionAfterWrappingSelectedLines({
  whenTextSelected,
  selectedLinesDiff,
  originalCursorPositions,
  calloutHeaderParts,
}: {
  whenTextSelected: AutoSelectionWhenTextSelectedMode;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  calloutHeaderParts: CalloutHeaderParts;
}): CursorOrSelectionAction {
  const { oldLines, newLines } = selectedLinesDiff;
  const didAddHeaderLine = oldLines.length !== newLines.length;
  switch (whenTextSelected) {
    case "selectHeaderToCursor": {
      return getSelectHeaderToCursorAction({
        selectedLinesDiff,
        originalCursorPositions,
        didAddHeaderLine,
      });
    }
    case "selectFull": {
      return getSelectFullAction({ selectedLinesDiff, originalCursorPositions, didAddHeaderLine });
    }
    case "selectTitle": {
      return getSelectTitleAction({ originalCursorPositions, calloutHeaderParts });
    }
    case "originalSelection": {
      return getOriginalSelectionAction({
        selectedLinesDiff,
        originalCursorPositions,
        didAddHeaderLine,
      });
    }
    case "clearSelectionCursorTo": {
      return getClearSelectionCursorToAction({ selectedLinesDiff, originalCursorPositions });
    }
    case "clearSelectionCursorStart": {
      return getClearSelectionCursorStartAction({ originalCursorPositions });
    }
    case "clearSelectionCursorEnd": {
      return getClearSelectionCursorEndAction({
        selectedLinesDiff,
        originalCursorPositions,
        didAddHeaderLine,
      });
    }
  }
}

/**
 * Selects the callout header to the cursor position.
 */
function getSelectHeaderToCursorAction({
  selectedLinesDiff,
  originalCursorPositions,
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didAddHeaderLine: boolean;
}): SetSelectionInCorrectDirectionAction {
  const { from: oldFrom, to: oldTo } = originalCursorPositions;
  const newFrom = getNewFromPosition({ oldFrom, selectedLinesDiff });

  const newToLine = didAddHeaderLine ? oldTo.line + 1 : oldTo.line;
  const lastLineDiff = getLastLineDiff(selectedLinesDiff);
  const newToCh = getNewPositionWithinLine({ oldCh: oldTo.ch, lineDiff: lastLineDiff });
  const newTo = { line: newToLine, ch: newToCh };

  const newRange = { from: newFrom, to: newTo };
  return { type: "setSelectionInCorrectDirection", newRange, originalCursorPositions };
}

/**
 * Selects the full callout after wrapping the selected lines in a callout.
 */
function getSelectFullAction({
  selectedLinesDiff,
  originalCursorPositions,
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didAddHeaderLine: boolean;
}): SetSelectionInCorrectDirectionAction {
  const startPos = getCalloutStartPos({ originalCursorPositions });
  const endPos = getCalloutEndPos({ selectedLinesDiff, originalCursorPositions, didAddHeaderLine });
  const newRange = { from: startPos, to: endPos };
  return { type: "setSelectionInCorrectDirection", newRange, originalCursorPositions };
}

/**
 * Selects the callout title after wrapping the selected lines in a callout.
 */
function getSelectTitleAction({
  originalCursorPositions,
  calloutHeaderParts,
}: {
  originalCursorPositions: CursorPositions;
  calloutHeaderParts: CalloutHeaderParts;
}): SetSelectionAction {
  const titleRange = getTitleRange({ calloutHeaderParts, line: originalCursorPositions.from.line });
  return { type: "setSelection", newRange: titleRange };
}

/**
 * Selects the original selection after wrapping the selected lines in a callout.
 */
function getOriginalSelectionAction({
  selectedLinesDiff,
  originalCursorPositions,
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didAddHeaderLine: boolean;
}): SetSelectionInCorrectDirectionAction {
  const { from: oldFrom, to: oldTo } = originalCursorPositions;
  const newFromLine = didAddHeaderLine ? oldFrom.line + 1 : oldFrom.line;
  const firstLineDiff = getFirstLineDiff({ selectedLinesDiff, didAddHeaderLine });
  const newFromCh = getNewPositionWithinLine({ oldCh: oldFrom.ch, lineDiff: firstLineDiff });
  const newFrom = { line: newFromLine, ch: newFromCh };

  const newTo = getNewToPosition({ oldTo, selectedLinesDiff });

  const newRange = { from: newFrom, to: newTo };
  return { type: "setSelectionInCorrectDirection", newRange, originalCursorPositions };
}

/**
 * Gets the line diff for the first selected line. Matches that line with the second new line if a
 * header line was added. Otherwise, the first selected line was a heading line that we can match
 * with the first new line (which is the header line).
 */
function getFirstLineDiff({
  selectedLinesDiff: { oldLines, newLines },
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  didAddHeaderLine: boolean;
}): LineDiff {
  const oldLine = oldLines[0];
  if (!didAddHeaderLine) {
    // `oldLine` is a heading line that we can match with the callout header
    return { oldLine, newLine: newLines[0] };
  }
  // Match `oldLine` with the second new line (first new body line)
  const secondNewLine = newLines[1];
  if (secondNewLine === undefined) {
    throw new Error("Expected first non-header line to be defined");
  }
  return { oldLine, newLine: secondNewLine };
}

function getClearSelectionCursorToAction({
  selectedLinesDiff,
  originalCursorPositions,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
}): ClearSelectionAction {
  const { to: oldTo } = originalCursorPositions;
  const newTo = getNewToPosition({ oldTo, selectedLinesDiff });
  // TODO: If user is in insert mode (with selection) or non-vim mode, we shouldn't subtract one
  const newCursor = { line: newTo.line, ch: newTo.ch - 1 };
  return { type: "clearSelection", newCursor };
}

/**
 * Clears the selection and moves the cursor to the end of the callout after wrapping the selected
 * lines in a callout.
 */
function getClearSelectionCursorEndAction({
  selectedLinesDiff,
  originalCursorPositions,
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didAddHeaderLine: boolean;
}): ClearSelectionAction {
  const endPos = getCalloutEndPos({ selectedLinesDiff, originalCursorPositions, didAddHeaderLine });
  return { type: "clearSelection", newCursor: endPos };
}

function getCalloutEndPos({
  selectedLinesDiff,
  originalCursorPositions,
  didAddHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didAddHeaderLine: boolean;
}): EditorPosition {
  const { to: oldTo } = originalCursorPositions;
  const endLine = didAddHeaderLine ? oldTo.line + 1 : oldTo.line;
  const endCh = getLastElement(selectedLinesDiff.newLines).length;
  return { line: endLine, ch: endCh };
}
