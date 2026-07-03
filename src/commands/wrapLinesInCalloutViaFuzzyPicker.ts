import type { PluginSettingsManager } from "../pluginSettingsManager";
import type { App, Command, Editor } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { wrapLinesInCallout } from "../lib/wrapLinesInCallout/wrapLinesInCallout";
import { WrapLinesInCalloutFuzzyPicker } from "../lib/wrapLinesInCalloutFuzzyPicker/wrapLinesInCalloutFuzzyPicker";

/**
 * Makes a `Wrap lines in callout...` command that opens a fuzzy picker to select the callout type
 * (ID) to wrap the current line or selected lines in.
 */
export function makeWrapLinesInCalloutViaFuzzyPickerCommand(
  app: App,
  getAllCalloutIDs: () => readonly CalloutID[],
  pluginSettingsManager: PluginSettingsManager,
): Command {
  return {
    id: "wrap-lines-in-callout-via-fuzzy-picker",
    name: `Wrap lines in callout...`,
    editorCallback: (editor) =>
      openWrapLinesInCalloutFuzzyPicker({ app, editor, getAllCalloutIDs, pluginSettingsManager }),
  };
}

function openWrapLinesInCalloutFuzzyPicker({
  app,
  editor,
  getAllCalloutIDs,
  pluginSettingsManager,
}: {
  app: App;
  editor: Editor;
  getAllCalloutIDs: () => readonly CalloutID[];
  pluginSettingsManager: PluginSettingsManager;
}): void {
  const fuzzyPicker = new WrapLinesInCalloutFuzzyPicker({
    app,
    calloutIDs: getAllCalloutIDs(),
    onChooseCalloutID: (calloutID): void =>
      wrapLinesInCallout(editor, calloutID, pluginSettingsManager),
  });
  fuzzyPicker.open();
}
