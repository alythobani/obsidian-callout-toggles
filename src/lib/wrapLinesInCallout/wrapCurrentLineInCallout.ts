import type { PluginSettingsManager } from "../../pluginSettingsManager";
import type { AutoSelectionWhenNothingSelectedMode } from "../../settings/autoSelectionModes";
import type { CalloutHeaderParts } from "../../utils/calloutTitleUtils";
import type {
  CursorOrSelectionAction,
  SetCursorAction,
  SetSelectionAction,
} from "../../utils/selectionUtils";
import type { Editor, EditorPosition } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import {
  constructCalloutHeaderFromParts,
  getNewCalloutHeaderParts,
  getTitleRange,
} from "../../utils/calloutTitleUtils";
import { runCursorOrSelectionAction } from "../../utils/selectionUtils";

/**
 * Wraps the cursor's current line in a callout.
 */
export function wrapCurrentLineInCallout({
  editor,
  calloutID,
  pluginSettingsManager,
}: {
  editor: Editor;
  calloutID: CalloutID;
  pluginSettingsManager: PluginSettingsManager;
}): void {
  const oldCursor = editor.getCursor();
  const { line } = oldCursor;
  const oldLineText = editor.getLine(line);
  const calloutHeaderParts = getNewCalloutHeaderParts({
    calloutID,
    maybeTitleFromHeading: undefined,
    pluginSettingsManager,
  });
  const calloutHeader = constructCalloutHeaderFromParts(calloutHeaderParts);
  const newCalloutText = getNewCalloutText({ calloutHeader, oldLineText });
  editor.replaceRange(newCalloutText, { line, ch: 0 }, { line, ch: oldLineText.length });
  setSelectionOrCursorAfterWrappingCurrentLine({
    editor,
    oldCursor,
    oldLineText,
    pluginSettingsManager,
    calloutHeaderParts,
  });
}

function getNewCalloutText({
  calloutHeader,
  oldLineText,
}: {
  calloutHeader: string;
  oldLineText: string;
}): string {
  const prependedLine = `> ${oldLineText}`;
  const newCalloutText = `${calloutHeader}\n${prependedLine}`;
  return newCalloutText;
}

/**
 * Sets the selection or cursor (depending on user setting) after wrapping the current line in a
 * callout.
 */
function setSelectionOrCursorAfterWrappingCurrentLine({
  editor,
  oldCursor,
  oldLineText,
  pluginSettingsManager,
  calloutHeaderParts,
}: {
  editor: Editor;
  oldCursor: EditorPosition;
  oldLineText: string;
  pluginSettingsManager: PluginSettingsManager;
  calloutHeaderParts: CalloutHeaderParts;
}): void {
  const { whenNothingSelected } = pluginSettingsManager.getSetting("autoSelectionModes");
  const cursorOrSelectionAction = getCursorOrSelectionActionAfterWrappingCurrentLine({
    oldCursor,
    oldLineText,
    whenNothingSelected,
    calloutHeaderParts,
  });
  runCursorOrSelectionAction({ editor, action: cursorOrSelectionAction });
}

export function getCursorOrSelectionActionAfterWrappingCurrentLine({
  oldCursor,
  oldLineText,
  whenNothingSelected,
  calloutHeaderParts,
}: {
  oldCursor: EditorPosition;
  oldLineText: string;
  whenNothingSelected: AutoSelectionWhenNothingSelectedMode;
  calloutHeaderParts: CalloutHeaderParts;
}): CursorOrSelectionAction {
  switch (whenNothingSelected) {
    case "selectHeaderToCursor": {
      return getSelectHeaderToCursorAction({ oldCursor, oldLineText });
    }
    case "selectFull": {
      return getSelectFullCalloutAction({ oldCursor, oldLineText });
    }
    case "selectTitle": {
      return getSelectTitleAction({ oldCursor, calloutHeaderParts });
    }
    case "originalCursor": {
      return getCursorToOriginalRelativePositionAction({ oldCursor });
    }
    case "cursorEnd": {
      return getCursorToEndOfLineAction({ oldCursor, oldLineText });
    }
  }
}

/**
 * Selects from the start of the callout header to the cursor's original relative position within
 * the text.
 */
function getSelectHeaderToCursorAction({
  oldCursor,
  oldLineText,
}: {
  oldCursor: EditorPosition;
  oldLineText: string;
}): SetSelectionAction {
  const newFrom = { line: oldCursor.line, ch: 0 };
  // TODO: If the user is in insert mode or non-vim mode, we should only add 2 to the cursor's ch
  const newToCh = Math.min(oldCursor.ch + 3, oldLineText.length + 2);
  const newTo = { line: oldCursor.line + 1, ch: newToCh };
  return { type: "setSelection", newRange: { from: newFrom, to: newTo } };
}

/**
 * Selects the full callout after wrapping the current line in a callout.
 */
function getSelectFullCalloutAction({
  oldCursor,
  oldLineText,
}: {
  oldCursor: EditorPosition;
  oldLineText: string;
}): SetSelectionAction {
  const newFrom = { line: oldCursor.line, ch: 0 };
  const newTo = { line: oldCursor.line + 1, ch: oldLineText.length + 2 };
  return { type: "setSelection", newRange: { from: newFrom, to: newTo } };
}

function getSelectTitleAction({
  oldCursor,
  calloutHeaderParts,
}: {
  oldCursor: EditorPosition;
  calloutHeaderParts: CalloutHeaderParts;
}): SetSelectionAction {
  const titleRange = getTitleRange({ calloutHeaderParts, line: oldCursor.line });
  return { type: "setSelection", newRange: titleRange };
}

function getCursorToOriginalRelativePositionAction({
  oldCursor,
}: {
  oldCursor: EditorPosition;
}): SetCursorAction {
  const { line, ch } = oldCursor;
  return { type: "setCursor", newPosition: { line: line + 1, ch: ch + 2 } };
}

function getCursorToEndOfLineAction({
  oldCursor,
  oldLineText,
}: {
  oldCursor: EditorPosition;
  oldLineText: string;
}): SetCursorAction {
  return {
    type: "setCursor",
    newPosition: { line: oldCursor.line + 1, ch: oldLineText.length + 2 },
  };
}
