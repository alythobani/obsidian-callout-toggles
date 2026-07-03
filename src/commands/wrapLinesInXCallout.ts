import type { PluginSettingsManager } from "../pluginSettingsManager";
import type { Command } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { getFullPluginCommandID } from "../lib/getFullPluginCommandID";
import { wrapLinesInCallout } from "../lib/wrapLinesInCallout/wrapLinesInCallout";

/**
 * Makes a `Wrap lines in X callout` command that wraps the current line, or selected lines if there
 * are any, in a callout of the given type (ID).
 */
export function makeWrapLinesInXCalloutCommand(
  calloutID: CalloutID,
  pluginSettingsManager: PluginSettingsManager,
): Command {
  return {
    id: getPartialWrapLinesInXCalloutCommandID(calloutID),
    name: `Wrap lines in ${calloutID} callout`,
    editorCallback: (editor) => wrapLinesInCallout(editor, calloutID, pluginSettingsManager),
  };
}

/**
 * Returns the full command ID for wrapping the current line or selected lines in the given callout.
 */
export function getFullWrapLinesInXCalloutCommandID({
  pluginID,
  calloutID,
}: {
  pluginID: string;
  calloutID: CalloutID;
}): string {
  const partialCommandID = getPartialWrapLinesInXCalloutCommandID(calloutID);
  return getFullPluginCommandID(pluginID, partialCommandID);
}

/**
 * Returns the command ID for wrapping the current line or selected lines in a callout.
 *
 * This is a partial command ID, so it should be combined with the plugin ID to form the full
 * command ID, e.g. when removing the command from the app.
 */
export function getPartialWrapLinesInXCalloutCommandID(calloutID: CalloutID): string {
  return `wrap-lines-in-${calloutID}-callout`;
}
