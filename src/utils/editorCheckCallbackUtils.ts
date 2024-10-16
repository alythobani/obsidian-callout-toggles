import { Command, Editor } from "obsidian";
import { getSelectedLinesRangeAndText } from "./selectionUtils";

const CALLOUT_HEADER_REGEX = /^> \[!\w+\]/;

/**
 * See Obsidian docs for `editorCheckCallback` for more information:
 * https://docs.obsidian.md/Reference/TypeScript+API/Command/editorCheckCallback
 */
type EditorCheckCallback = Command["editorCheckCallback"];

/**
 * Creates an editor check callback for a command that should only be available when text is
 * currently selected in the editor.
 */
export function makeSelectionCheckCallback(
  editorAction: (editor: Editor) => void
): EditorCheckCallback {
  return (checking, editor, _ctx) => {
    if (!editor.somethingSelected()) return false; // Only show the command if text is selected
    return showOrRunCommand(editorAction, editor, checking);
  };
}

/**
 * Creates an editor check callback for a command that should only be available when the currently
 * selected lines begin with a callout.
 */
export function makeCalloutSelectionCheckCallback(
  editorAction: (editor: Editor) => void
): EditorCheckCallback {
  return (checking, editor, _ctx) => {
    if (!editor.somethingSelected()) return false; // Only show the command if text is selected
    const { selectedLinesText } = getSelectedLinesRangeAndText(editor);
    if (!CALLOUT_HEADER_REGEX.test(selectedLinesText)) return false; // Only show the command if the selected text is a callout
    return showOrRunCommand(editorAction, editor, checking);
  };
}

/**
 * Creates an editor check callback for a command that that runs on the current line of the cursor.
 * There should be no text currently selected in the editor, to avoid ambiguity in what will happen.
 */
export function makeCurrentLineCheckCallback(
  editorAction: (editor: Editor) => void
): EditorCheckCallback {
  return (checking, editor, _ctx) => {
    if (editor.somethingSelected()) return false; // Don't show the command if text is selected
    return showOrRunCommand(editorAction, editor, checking);
  };
}

function showOrRunCommand(
  editorAction: (editor: Editor) => void,
  editor: Editor,
  checking: boolean
): boolean {
  if (checking) return true;
  editorAction(editor);
  return true;
}
