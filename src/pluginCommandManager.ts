import type { CalloutManagerOwnedHandle } from "./callouts/calloutManager";
import type { PluginSettingsManager } from "./pluginSettingsManager";
import type { Command, Plugin } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { BUILTIN_CALLOUT_IDS } from "./callouts/builtinCallouts";
import {
  getCalloutIDsFromCalloutManager,
  getCalloutManagerAPIHandleIfInstalled,
} from "./callouts/calloutManager";
import { makeRemoveCalloutFromSelectedLinesCommand } from "./commands/removeCallout";
import {
  getFullWrapLinesInXCalloutCommandID,
  makeWrapLinesInXCalloutCommand,
} from "./commands/wrapLinesInXCallout";
import { filterOutElements } from "./utils/arrayUtils";

export class PluginCommandManager {
  calloutManager?: CalloutManagerOwnedHandle;
  addedCommandCalloutIDsSet = new Set<CalloutID>();
  onCalloutManagerChange = this.resyncCalloutCommands.bind(this);

  constructor(
    private plugin: Plugin,
    private pluginSettingsManager: PluginSettingsManager,
  ) {}

  public onPluginUnload(): void {
    if (this.calloutManager === undefined) {
      return;
    }
    this.calloutManager.off("change", this.onCalloutManagerChange);
  }

  public async setupCommands(): Promise<void> {
    await this.setupCalloutManagerIfInstalled();
    this.addAllCommands();
  }

  private async setupCalloutManagerIfInstalled(): Promise<void> {
    const maybeAPIHandle = await getCalloutManagerAPIHandleIfInstalled(this.plugin);
    if (maybeAPIHandle === undefined) {
      return;
    }
    this.calloutManager = maybeAPIHandle;
    this.calloutManager.on("change", this.onCalloutManagerChange);
  }

  private resyncCalloutCommands(): void {
    const allCalloutIDs = this.getAllCalloutIDs();
    this.removeOutdatedWrapLinesInXCalloutCommands(allCalloutIDs);
    this.addMissingCalloutCommands(allCalloutIDs);
  }

  /**
   * Returns all available Obsidian callout IDs. Uses the Callout Manager plugin API if available;
   * otherwise uses a hard-coded list of built-in callout IDs.
   */
  private getAllCalloutIDs(): readonly CalloutID[] {
    if (this.calloutManager === undefined) {
      return BUILTIN_CALLOUT_IDS;
    }
    return getCalloutIDsFromCalloutManager(this.calloutManager);
  }

  private removeOutdatedWrapLinesInXCalloutCommands(newCalloutIDs: readonly CalloutID[]): void {
    const existingCommandCalloutIDs = Array.from(this.addedCommandCalloutIDsSet);
    const newCalloutIDsSet = new Set(newCalloutIDs);
    const outdatedCalloutIDs = filterOutElements(existingCommandCalloutIDs, newCalloutIDsSet);
    outdatedCalloutIDs.forEach((calloutID) => this.removeWrapLinesInXCalloutCommand(calloutID));
  }

  private removeWrapLinesInXCalloutCommand(calloutID: CalloutID): void {
    const pluginID = this.plugin.manifest.id;
    const fullCommandID = getFullWrapLinesInXCalloutCommandID({ pluginID, calloutID });
    this.removeCommand({ fullCommandID });
    this.addedCommandCalloutIDsSet.delete(calloutID);
  }

  private addMissingCalloutCommands(newCalloutIDs: readonly CalloutID[]): void {
    const missingCalloutIDs = filterOutElements(newCalloutIDs, this.addedCommandCalloutIDsSet);
    missingCalloutIDs.forEach((calloutID) => this.addWrapLinesInXCalloutCommand(calloutID));
  }

  private addAllCommands(): void {
    this.addAllWrapLinesInXCalloutCommands();
    this.addRemoveCalloutFromSelectedLinesCommand();
  }

  private addAllWrapLinesInXCalloutCommands(): void {
    const allCalloutIDs = this.getAllCalloutIDs();
    allCalloutIDs.forEach((calloutID) => this.addWrapLinesInXCalloutCommand(calloutID));
  }

  private addWrapLinesInXCalloutCommand(calloutID: CalloutID): void {
    const wrapLinesInXCalloutCommand = makeWrapLinesInXCalloutCommand(
      calloutID,
      this.pluginSettingsManager,
    );
    this.addCommand(wrapLinesInXCalloutCommand);
    this.addedCommandCalloutIDsSet.add(calloutID);
  }

  private addCommand(command: Command): void {
    this.plugin.addCommand(command);
  }

  private addRemoveCalloutFromSelectedLinesCommand(): void {
    const removeCalloutFromSelectedLinesCommand = makeRemoveCalloutFromSelectedLinesCommand(
      this.pluginSettingsManager,
    );
    this.addCommand(removeCalloutFromSelectedLinesCommand);
  }

  private removeCommand({ fullCommandID }: { fullCommandID: string }): void {
    this.plugin.app.commands.removeCommand(fullCommandID);
  }
}
