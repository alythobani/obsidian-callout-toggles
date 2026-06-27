import type { CalloutID } from "obsidian-callout-manager";

/**
 * Returns the full command ID for wrapping the current line or selected lines in the given callout.
 */
export function getFullWrapLinesInCalloutCommandID({
  pluginID,
  calloutID,
}: {
  pluginID: string;
  calloutID: CalloutID;
}): string {
  const partialCommandID = getPartialWrapLinesInCalloutCommandID(calloutID);
  return getFullPluginCommandID(pluginID, partialCommandID);
}

/**
 * Returns the command ID for wrapping the current line or selected lines in a callout.
 *
 * This is a partial command ID, so it should be combined with the plugin ID to form the full
 * command ID, e.g. when removing the command from the app.
 */
export function getPartialWrapLinesInCalloutCommandID(calloutID: CalloutID): string {
  return `wrap-lines-in-${calloutID}-callout`;
}

function getFullPluginCommandID(pluginID: string, partialCommandID: string): string {
  return `${pluginID}:${partialCommandID}`;
}
