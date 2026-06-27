import type { NonEmptyStringArray } from "./arrayUtils";
import type { Editor, EditorPosition, EditorRange } from "obsidian";

import { getLastElement } from "./arrayUtils";
import { throwNever } from "./errorUtils";
import { clamp } from "./numberUtils";

export type SelectedLinesDiff = {
  oldLines: NonEmptyStringArray;
  newLines: NonEmptyStringArray;
};

export type LineDiff = {
  oldLine: string;
  newLine: string;
};

export type CursorOrSelectionAction =
  | SetCursorAction
  | SetSelectionAction
  | SetSelectionInCorrectDirectionAction
  | ClearSelectionAction;

export type SetCursorAction = {
  type: "setCursor";
  newPosition: EditorPosition;
};

export type SetSelectionAction = {
  type: "setSelection";
  newRange: EditorRange;
};

export type SetSelectionInCorrectDirectionAction = {
  type: "setSelectionInCorrectDirection";
  newRange: EditorRange;
  originalCursorPositions: CursorPositions;
};

export type CursorPositions = {
  anchor: EditorPosition;
  head: EditorPosition;
  from: EditorPosition;
  to: EditorPosition;
};

export type ClearSelectionAction = {
  type: "clearSelection";
  newCursor: EditorPosition;
};

/**
 * Replaces the selected lines with the new lines, and adjusts the editor selection to maintain its
 * position relative to the original text.
 */
export function replaceLinesAndAdjustSelection({
  editor,
  selectedLinesDiff,
  originalCursorPositions,
  selectedLinesRange,
}: {
  editor: Editor;
  selectedLinesDiff: SelectedLinesDiff;
  originalCursorPositions: CursorPositions;
  selectedLinesRange: EditorRange;
}): void {
  const newSelectionRange = getNewSelectionRangeAfterReplacingLines({
    originalCursorPositions,
    selectedLinesDiff,
  });
  const newText = selectedLinesDiff.newLines.join("\n");
  editor.replaceRange(newText, selectedLinesRange.from, selectedLinesRange.to);
  setSelectionInCorrectDirection({ editor, originalCursorPositions, newRange: newSelectionRange });
}

function getNewSelectionRangeAfterReplacingLines({
  originalCursorPositions,
  selectedLinesDiff,
}: {
  originalCursorPositions: CursorPositions;
  selectedLinesDiff: SelectedLinesDiff;
}): EditorRange {
  const { from: oldFrom, to: oldTo } = originalCursorPositions;
  const newFrom = getNewFromPosition({ oldFrom, selectedLinesDiff });
  const newTo = getNewToPosition({ oldTo, selectedLinesDiff });
  return { from: newFrom, to: newTo };
}

/**
 * Gets the new cursor `from` position after the selected lines have been altered, while keeping the
 * relative `from` position within the text the same.
 */
export function getNewFromPosition({
  oldFrom,
  selectedLinesDiff,
}: {
  oldFrom: EditorPosition;
  selectedLinesDiff: SelectedLinesDiff;
}): EditorPosition {
  const { oldLines, newLines } = selectedLinesDiff;
  const didAddOrRemoveHeaderLine = oldLines.length !== newLines.length;
  if (didAddOrRemoveHeaderLine) {
    // Select from the start of the header line if we added a new header line. If we removed a
    // header line, we should still select from the start of the first line.
    return { line: oldFrom.line, ch: 0 };
  }
  const lineDiff = { oldLine: oldLines[0], newLine: newLines[0] };
  const newFromCh = getNewPositionWithinLine({ oldCh: oldFrom.ch, lineDiff });
  return { line: oldFrom.line, ch: newFromCh };
}

/**
 * Gets the new cursor `to` position after the selected lines have been altered, while keeping the
 * relative `to` position within the text the same.
 */
export function getNewToPosition({
  oldTo,
  selectedLinesDiff,
}: {
  oldTo: EditorPosition;
  selectedLinesDiff: SelectedLinesDiff;
}): EditorPosition {
  const { oldLines, newLines } = selectedLinesDiff;
  const numLinesDiff = newLines.length - oldLines.length; // we may have added or removed a header line
  const newToLine = oldTo.line + numLinesDiff;
  const lastLineDiff = getLastLineDiff(selectedLinesDiff);
  const newToCh = getNewPositionWithinLine({ oldCh: oldTo.ch, lineDiff: lastLineDiff });
  return { line: newToLine, ch: newToCh };
}

/**
 * Gets the line diff for the last line of the selected lines.
 */
export function getLastLineDiff({ oldLines, newLines }: SelectedLinesDiff): LineDiff {
  return { oldLine: getLastElement(oldLines), newLine: getLastElement(newLines) };
}

/**
 * Gets the new cursor `ch` position within a given line after it's been altered, while keeping the
 * cursor's relative position in the line the same.
 */
export function getNewPositionWithinLine({
  oldCh,
  lineDiff,
}: {
  oldCh: number;
  lineDiff: LineDiff;
}): number {
  const { oldLine, newLine } = lineDiff;
  const lineLengthDiff = oldLine.length - newLine.length;
  const newCh = clamp({ value: oldCh - lineLengthDiff, min: 0, max: newLine.length });
  return newCh;
}

/**
 * Returns the range and text of the selected lines, from the start of the first
 * selected line to the end of the last selected line (regardless of where in
 * the line each selection boundary is).
 */
export function getSelectedLinesRangeAndText(editor: Editor): {
  selectedLinesRange: EditorRange;
  selectedLinesText: string;
} {
  const { from, to } = getSelectedLinesRange(editor);
  const text = editor.getRange(from, to);
  return { selectedLinesRange: { from, to }, selectedLinesText: text };
}

function getSelectedLinesRange(editor: Editor): EditorRange {
  const { from, to } = getSelectionRange(editor);
  const startOfFirstSelectedLine = { line: from.line, ch: 0 };
  const endOfLastSelectedLine = { line: to.line, ch: editor.getLine(to.line).length };
  return { from: startOfFirstSelectedLine, to: endOfLastSelectedLine };
}

export function getCursorPositions(editor: Editor): CursorPositions {
  const { anchor, head } = getAnchorAndHead(editor);
  const { from, to } = getSelectionRange(editor);
  return { anchor, head, from, to };
}

function getAnchorAndHead(editor: Editor): { anchor: EditorPosition; head: EditorPosition } {
  const anchor = editor.getCursor("anchor");
  const head = editor.getCursor("head");
  return { anchor, head };
}

function getSelectionRange(editor: Editor): EditorRange {
  const from = editor.getCursor("from");
  const to = editor.getCursor("to");
  return { from, to };
}

export function runCursorOrSelectionAction({
  editor,
  action,
}: {
  editor: Editor;
  action: CursorOrSelectionAction;
}): void {
  switch (action.type) {
    case "setCursor": {
      editor.setCursor(action.newPosition);
      return;
    }
    case "setSelection": {
      editor.setSelection(action.newRange.from, action.newRange.to);
      return;
    }
    case "setSelectionInCorrectDirection": {
      const { newRange, originalCursorPositions } = action;
      setSelectionInCorrectDirection({ editor, originalCursorPositions, newRange });
      return;
    }
    case "clearSelection": {
      clearSelectionAndSetCursor({ editor, newCursor: action.newCursor });
      return;
    }
    default:
      throwNever(action);
  }
}

export function setSelectionInCorrectDirection({
  editor,
  originalCursorPositions,
  newRange,
}: {
  editor: Editor;
  originalCursorPositions: CursorPositions;
  newRange: EditorRange;
}): void {
  const { newAnchor, newHead } = getNewAnchorAndHead(originalCursorPositions, newRange);
  editor.setSelection(newAnchor, newHead);
}

function getNewAnchorAndHead(
  originalCursorPositions: CursorPositions,
  newRange: EditorRange,
): { newAnchor: EditorPosition; newHead: EditorPosition } {
  const { from: newFrom, to: newTo } = newRange;
  return isHeadBeforeAnchor(originalCursorPositions)
    ? { newAnchor: newTo, newHead: newFrom }
    : { newAnchor: newFrom, newHead: newTo };
}

function isHeadBeforeAnchor({ anchor, head }: Pick<CursorPositions, "anchor" | "head">): boolean {
  return head.line < anchor.line || (head.line === anchor.line && head.ch < anchor.ch);
}

/**
 * Clears the selection and sets the cursor to the given position.
 */
export function clearSelectionAndSetCursor({
  editor,
  newCursor,
}: {
  editor: Editor;
  newCursor: EditorPosition;
}): void {
  editor.setSelection(newCursor, newCursor);
}

export function getCalloutStartPos({
  originalCursorPositions,
}: {
  originalCursorPositions: CursorPositions;
}): EditorPosition {
  const { from: oldFrom } = originalCursorPositions;
  return { line: oldFrom.line, ch: 0 };
}

export function getClearSelectionCursorStartAction({
  originalCursorPositions,
}: {
  originalCursorPositions: CursorPositions;
}): ClearSelectionAction {
  const startPos = { line: originalCursorPositions.from.line, ch: 0 };
  return { type: "clearSelection", newCursor: startPos };
}
