export function getFullPluginCommandID(pluginID: string, partialCommandID: string): string {
  return `${pluginID}:${partialCommandID}`;
}
