import type { PluginSettingsManager } from "../../pluginSettingsManager";
import type { Command, Editor } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { getPartialWrapLinesInCalloutCommandID } from "../commandIDs";
import { wrapCurrentLineInCallout } from "./wrapCurrentLineInCallout";
import { wrapSelectedLinesInCallout } from "./wrapSelectedLinesInCallout";

/**
 * Makes a command that wraps the current line, or selected lines if there are any, in the given
 * callout.
 */
export function makeWrapLinesInCalloutCommand(
  calloutID: CalloutID,
  pluginSettingsManager: PluginSettingsManager,
): Command {
  return {
    id: getPartialWrapLinesInCalloutCommandID(calloutID),
    name: `Wrap lines in ${calloutID} callout`,
    editorCallback: (editor) => wrapLinesInCallout(editor, calloutID, pluginSettingsManager),
  };
}

function wrapLinesInCallout(
  editor: Editor,
  calloutID: CalloutID,
  pluginSettingsManager: PluginSettingsManager,
): void {
  if (editor.somethingSelected()) {
    wrapSelectedLinesInCallout(editor, calloutID, pluginSettingsManager);
    return;
  }
  wrapCurrentLineInCallout({
    editor,
    calloutID,
    pluginSettingsManager,
  });
}
