import type { PluginSettingsManager } from "../../pluginSettingsManager";
import type { Editor } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { wrapCurrentLineInCallout } from "./wrapCurrentLineInCallout";
import { wrapSelectedLinesInCallout } from "./wrapSelectedLinesInCallout";

/**
 * Wraps the current line, or selected lines if there are any, in a callout of the given type (ID).
 */
export function wrapLinesInCallout(
  editor: Editor,
  calloutID: CalloutID,
  pluginSettingsManager: PluginSettingsManager,
): void {
  if (editor.somethingSelected()) {
    wrapSelectedLinesInCallout(editor, calloutID, pluginSettingsManager);
    return;
  }
  wrapCurrentLineInCallout({ editor, calloutID, pluginSettingsManager });
}
