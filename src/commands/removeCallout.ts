import type { PluginSettingsManager } from "../pluginSettingsManager";
import type { AutoSelectionAfterRemovingCalloutMode } from "../settings/autoSelectionModes";
import type { NonEmptyStringArray } from "../utils/arrayUtils";
import type {
  ClearSelectionAction,
  CursorOrSelectionAction,
  CursorPositions,
  SelectedLinesDiff,
  SetSelectionInCorrectDirectionAction,
} from "../utils/selectionUtils";
import type { Command, Editor } from "obsidian";

import { getLastElement, isNonEmptyArray } from "../utils/arrayUtils";
import {
  getCalloutIDAndExplicitTitle,
  isCustomTitle,
  makeH6Line,
} from "../utils/calloutTitleUtils";
import { makeCalloutSelectionCheckCallback } from "../utils/editorCheckCallbackUtils";
import {
  getCalloutStartPos,
  getClearSelectionCursorStartAction,
  getCursorPositions,
  getNewPositionWithinLine,
  getNewToPosition,
  getSelectedLinesRangeAndText,
  runCursorOrSelectionAction,
} from "../utils/selectionUtils";
import { getTextLines } from "../utils/stringUtils";

export function makeRemoveCalloutFromSelectedLinesCommand(
  pluginSettingsManager: PluginSettingsManager,
): Command {
  return {
    id: "remove-callout-from-selected-lines",
    name: "Remove callout from selected lines",
    editorCheckCallback: makeCalloutSelectionCheckCallback({
      editorAction: removeCalloutFromSelectedLines,
      pluginSettingsManager,
    }),
  };
}

/**
 * Removes the callout from the selected lines. Retains the title if it's not the default header for
 * the given callout, else removes the entire header line.
 */
function removeCalloutFromSelectedLines({
  editor,
  pluginSettingsManager,
}: {
  editor: Editor;
  pluginSettingsManager: PluginSettingsManager;
}): void {
  const originalCursorPositions = getCursorPositions(editor);
  const { selectedLinesRange, selectedLinesText } = getSelectedLinesRangeAndText(editor); // Full selected lines range and text
  const selectedLines = getTextLines(selectedLinesText);
  const { calloutID, maybeExplicitTitle } = getCalloutIDAndExplicitTitle(selectedLinesText);
  const newLines = getNewLinesAfterRemovingCallout({
    calloutID,
    maybeExplicitTitle,
    selectedLines,
  });
  const selectedLinesDiff = { oldLines: selectedLines, newLines };
  const newText = newLines.join("\n");
  editor.replaceRange(newText, selectedLinesRange.from, selectedLinesRange.to);
  setSelectionAfterRemovingCallout({
    editor,
    selectedLinesDiff,
    originalCursorPositions,
    pluginSettingsManager,
  });
}

/**
 * Gets the new lines after removing the callout from the selected lines.
 */
function getNewLinesAfterRemovingCallout({
  calloutID,
  maybeExplicitTitle,
  selectedLines,
}: {
  calloutID: string;
  maybeExplicitTitle: string | undefined;
  selectedLines: NonEmptyStringArray;
}): NonEmptyStringArray {
  if (maybeExplicitTitle !== undefined && isCustomTitle({ calloutID, title: maybeExplicitTitle })) {
    return getNewLinesAfterRemovingCalloutWithCustomTitle(maybeExplicitTitle, selectedLines);
  }
  return getNewLinesAfterRemovingCalloutWithDefaultTitle(selectedLines);
}

function getNewLinesAfterRemovingCalloutWithCustomTitle(
  customTitle: string,
  selectedLines: NonEmptyStringArray,
): NonEmptyStringArray {
  const customTitleHeadingLine = makeH6Line(customTitle);
  const unquotedLines = selectedLines.slice(1).map((line) => line.replace(/^> /, ""));
  return [customTitleHeadingLine, ...unquotedLines];
}

function getNewLinesAfterRemovingCalloutWithDefaultTitle(
  selectedLines: NonEmptyStringArray,
): NonEmptyStringArray {
  const linesWithoutHeader = selectedLines.slice(1);
  const unquotedLinesWithoutHeader = linesWithoutHeader.map((line) => line.replace(/^> /, ""));
  if (!isNonEmptyArray(unquotedLinesWithoutHeader)) {
    return [""];
  }
  return unquotedLinesWithoutHeader;
}

function setSelectionAfterRemovingCallout({
  editor,
  selectedLinesDiff,
  originalCursorPositions,
  pluginSettingsManager,
}: {
  editor: Editor;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  pluginSettingsManager: PluginSettingsManager;
}): void {
  const { afterRemovingCallout } = pluginSettingsManager.getSetting("autoSelectionModes");
  const cursorOrSelectionAction = getCursorOrSelectionActionAfterRemovingCallout({
    selectedLinesDiff,
    originalCursorPositions,
    afterRemovingCallout,
  });
  runCursorOrSelectionAction({ editor, action: cursorOrSelectionAction });
}

/**
 * Sets the selection or cursor (depending on user setting) after removing the callout from the
 * selected lines.
 */
export function getCursorOrSelectionActionAfterRemovingCallout({
  afterRemovingCallout,
  selectedLinesDiff,
  originalCursorPositions,
}: {
  afterRemovingCallout: AutoSelectionAfterRemovingCalloutMode;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
}): CursorOrSelectionAction {
  const { oldLines, newLines } = selectedLinesDiff;
  const didRemoveHeaderLine = oldLines.length !== newLines.length;
  switch (afterRemovingCallout) {
    case "originalSelection": {
      return getOriginalSelectionAction({
        selectedLinesDiff,
        originalCursorPositions,
        didRemoveHeaderLine,
      });
    }
    case "selectFull": {
      return getFullTextSelectionAction({ selectedLinesDiff, originalCursorPositions });
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
        didRemoveHeaderLine,
      });
    }
  }
}

function getOriginalSelectionAction({
  selectedLinesDiff,
  originalCursorPositions,
  didRemoveHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didRemoveHeaderLine: boolean;
}): SetSelectionInCorrectDirectionAction {
  const { oldLines, newLines } = selectedLinesDiff;
  const { from: oldFrom, to: oldTo } = originalCursorPositions;
  const newFromCh = didRemoveHeaderLine
    ? 0
    : getNewPositionWithinLine({
        oldCh: oldFrom.ch,
        lineDiff: { oldLine: oldLines[0], newLine: newLines[0] },
      });
  const newFrom = { line: oldFrom.line, ch: newFromCh };

  const newTo = getNewToPosition({ oldTo, selectedLinesDiff });

  const newRange = { from: newFrom, to: newTo };
  return { type: "setSelectionInCorrectDirection", newRange, originalCursorPositions };
}

function getFullTextSelectionAction({
  selectedLinesDiff,
  originalCursorPositions,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
}): SetSelectionInCorrectDirectionAction {
  const newFrom = getCalloutStartPos({ originalCursorPositions });

  const { oldLines, newLines } = selectedLinesDiff;
  const didRemoveHeaderLine = oldLines.length !== newLines.length;
  const { to: oldTo } = originalCursorPositions;
  const newToLine = didRemoveHeaderLine ? oldTo.line - 1 : oldTo.line;
  const newLastLine = getLastElement(newLines);
  const newTo = { line: newToLine, ch: newLastLine.length };

  const newRange = { from: newFrom, to: newTo };
  return { type: "setSelectionInCorrectDirection", newRange, originalCursorPositions };
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
  didRemoveHeaderLine,
}: {
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  didRemoveHeaderLine: boolean;
}): ClearSelectionAction {
  const { to: oldTo } = originalCursorPositions;
  const endLine = didRemoveHeaderLine ? oldTo.line - 1 : oldTo.line;
  const endCh = getLastElement(selectedLinesDiff.newLines).length;
  const endPos = { line: endLine, ch: endCh };
  return { type: "clearSelection", newCursor: endPos };
}
