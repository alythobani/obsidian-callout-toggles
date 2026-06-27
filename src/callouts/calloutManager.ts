import type { Plugin } from "obsidian";
import type { CalloutID, CalloutManager } from "obsidian-callout-manager";

import { getApi, isInstalled as isCalloutManagerInstalled } from "obsidian-callout-manager";

export type CalloutManagerOwnedHandle = CalloutManager<true>;

export async function getCalloutManagerAPIHandleIfInstalled(
  plugin: Plugin,
): Promise<CalloutManagerOwnedHandle | undefined> {
  if (!isCalloutManagerInstalled(plugin.app)) {
    return undefined;
  }
  return getApi(plugin);
}

export function getCalloutIDsFromCalloutManager(
  calloutManager: CalloutManagerOwnedHandle,
): readonly CalloutID[] {
  return calloutManager.getCallouts().map((callout) => callout.id);
}
