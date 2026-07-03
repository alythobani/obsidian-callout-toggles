import type { PluginSettingsManager } from "../pluginSettingsManager";
import type { Command, Editor } from "obsidian";

import { CALLOUT_HEADER_WITH_ID_CAPTURE_REGEX } from "./calloutTitleUtils";
import { getSelectedLinesRangeAndText } from "./selectionUtils";

/**
 * See Obsidian docs for `editorCheckCallback` for more information:
 * https://docs.obsidian.md/Reference/TypeScript+API/Command/editorCheckCallback
 */
type EditorCheckCallback = Required<Command>["editorCheckCallback"];

type EditorAction = ({ editor, pluginSettingsManager }: EditorActionParams) => void;

type EditorActionParams = { editor: Editor; pluginSettingsManager: PluginSettingsManager };

/**
 * Creates an editor check callback for a command that should only be available when the currently
 * selected lines begin with a callout.
 */
export function makeCalloutSelectionCheckCallback({
  editorAction,
  pluginSettingsManager,
}: {
  editorAction: EditorAction;
  pluginSettingsManager: PluginSettingsManager;
}): EditorCheckCallback {
  return (checking, editor, _ctx) => {
    if (!editor.somethingSelected()) return false; // Only show the command if text is selected
    if (!isFirstSelectedLineCalloutHeader(editor)) return false; // Only show the command if the selected lines begin with a callout
    return showOrRunCommand({ checking, editorAction, editor, pluginSettingsManager });
  };
}

function isFirstSelectedLineCalloutHeader(editor: Editor): boolean {
  const { selectedLinesText } = getSelectedLinesRangeAndText(editor);
  return CALLOUT_HEADER_WITH_ID_CAPTURE_REGEX.test(selectedLinesText);
}

/**
 * Shows or runs the given editor action depending on whether `checking` is true. Helper function
 * for creating editor check callbacks.
 */
function showOrRunCommand({
  checking,
  editorAction,
  editor,
  pluginSettingsManager,
}: {
  checking: boolean;
  editorAction: ({
    editor,
    pluginSettingsManager,
  }: {
    editor: Editor;
    pluginSettingsManager: PluginSettingsManager;
  }) => void;
  editor: Editor;
  pluginSettingsManager: PluginSettingsManager;
}): boolean {
  if (checking) return true;
  editorAction({ editor, pluginSettingsManager });
  return true;
}
