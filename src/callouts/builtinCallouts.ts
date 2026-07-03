/**
 * This file contains the built-in callouts that are available to be used in Obsidian.
 *
 * See Obsidian docs:
 * https://help.obsidian.md/Editing+and+formatting/Callouts#Supported%20types
 */

import type { CalloutID } from "obsidian-callout-manager";

type BuiltinCallout = {
  id: CalloutID;
  aliases: readonly CalloutID[];
};

/**
 * Updated as of 2026-06-27 based on https://obsidian.md/help/callouts#Supported+types
 */
const builtinCallouts: readonly BuiltinCallout[] = [
  { id: "note", aliases: [] },
  { id: "abstract", aliases: ["summary", "tldr"] },
  { id: "info", aliases: [] },
  { id: "todo", aliases: [] },
  { id: "tip", aliases: ["hint", "important"] },
  { id: "success", aliases: ["check", "done"] },
  { id: "question", aliases: ["help", "faq"] },
  { id: "warning", aliases: ["caution", "attention"] },
  { id: "failure", aliases: ["fail", "missing"] },
  { id: "danger", aliases: ["error"] },
  { id: "bug", aliases: [] },
  { id: "example", aliases: [] },
  { id: "quote", aliases: ["cite"] },
];

export const BUILTIN_CALLOUT_IDS: CalloutID[] = builtinCallouts.flatMap((builtinCallout) => [
  builtinCallout.id,
  ...builtinCallout.aliases,
]);
