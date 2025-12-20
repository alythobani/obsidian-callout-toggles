# Callout Toggles

[![Obsidian logo badge](https://img.shields.io/badge/Obsidian-%23483699.svg?&logo=obsidian&logoColor=white)](https://obsidian.md/plugins?id=callout-toggles) [![Number of downloads badge](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json&query=$["callout-toggles"].downloads&label=downloads)](https://obsidian.md/plugins?id=callout-toggles)

An [Obsidian plugin](https://obsidian.md/plugins?id=callout-toggles) to quickly add, switch, or remove callout blocks in your notes with convenient commands. Provides a separate command for every callout type, so you can easily assign hotkeys for your favorite callouts.

![Switching between callout types demonstration](./readme_gifs/main-demo-switching.gif)

## Features

- Without leaving your keyboard:
  - Insert a fresh (blank) callout, or turn existing text into a callout
  - Remove a callout, turning it back into regular text
  - Switch the type of an existing callout
- [Retain custom titles](#retaining-custom-titles) when wrapping or removing callouts
- Works with your [custom callout types](#custom-callouts-callout-manager) (automatically syncs with [Callout Manager] if installed)
- Settings for formatting, auto-selection, foldable callouts, and more

## Table of contents

1. [Features](#features)
2. [Table of contents](#table-of-contents)
3. [Commands provided](#commands-provided)
   1. [Wrap lines in ... callout](#wrap-lines-in--callout)
   2. [Remove callout from selected lines](#remove-callout-from-selected-lines)
4. [Usage examples](#usage-examples)
   1. [Inserting a fresh callout](#inserting-a-fresh-callout)
   2. [Wrapping the current line](#wrapping-the-current-line)
   3. [Wrapping multiple lines](#wrapping-multiple-lines)
   4. [Removing a callout](#removing-a-callout)
   5. [Retaining custom titles](#retaining-custom-titles)
5. [Custom callouts (Callout Manager)](#custom-callouts-callout-manager)
6. [Feedback](#feedback)
7. [Appreciation](#appreciation)

## Commands provided

Two types of commands are provided: `Wrap lines in ... callout` (where `...` is a callout type) and `Remove callout from selected lines`. Using them together, you can easily switch the type of an existing callout.

> [!TIP]
> Both commands work on full lines of text, so your cursor position within a given line doesn't matter. As long as part of a line is selected, the entire line will be included.

### Wrap lines in ... callout

One `Wrap lines in ... callout` command is provided for every possible callout type (❞ Quote, ⚠ Warning, 🔥 Tip, 🐞 Bug, 📝 Note, etc.), so that you can assign separate hotkeys for each of your favorite callouts. This can be used both for inserting fresh callouts, and for turning existing text into callouts.

### Remove callout from selected lines

> [!IMPORTANT]
> Note that a callout must begin on the first selected line of text for this command to be available.

This will remove the callout syntax from the selected lines, turning the callout back into regular text. If a custom title is present, it will be retained as a Markdown heading (see [Retaining custom titles](#retaining-custom-titles)).

## Usage examples

### Inserting a fresh callout

To insert a fresh callout of your choice, simply run `Wrap lines in ... callout` on a blank line:

![Inserting a fresh callout](./readme_gifs/usage_examples/0-insert-fresh.gif)

### Wrapping the current line

If the current line is not blank and nothing is selected, the current line will be turned into a callout:

![Wrapping the current line in a callout](./readme_gifs/usage_examples/1-current-line.gif)

### Wrapping multiple lines

To turn multiple lines of text into a callout, first select the lines, and then  run `Wrap lines in ... callout`:

![Wrapping multiple lines in a callout](./readme_gifs/usage_examples/2-multi-line.gif)

### Removing a callout

To turn a callout back into regular text, run `Remove callout from selected lines` with the given lines selected (make sure the callout header is on the first selected line):

![Unwrapping a callout block](./readme_gifs/usage_examples/3-remove-callout.gif)

### Retaining custom titles

If a callout has a default title (e.g. `> [!quote] Quote`), the entire header line will be removed when calling `Remove callout from selected lines`. But if a custom title is present (e.g. `> [!quote] Aristotle`), it will be retained as a Markdown heading, so that you don't lose your hard work in choosing that title.

Likewise, if you call `Wrap lines in ... callout` on a selection whose first line is a Markdown heading, the heading will be used as the custom title for the new callout block. This makes it easy to switch between callout types while retaining your custom titles, by calling `Remove` and then `Wrap`:

![Retaining custom titles while switching between callout types](./readme_gifs/usage_examples/4b-custom-title-fast.gif)

## Custom callouts (Callout Manager)

This plugin automatically integrates with the [Callout Manager] plugin, if you have it installed. This means that even your custom callout types get their own `Wrap` commands.

If you don't have Callout Manager installed, [no worries](https://www.youtube.com/watch?v=4P-YBqVzJg0), this plugin will still work as expected. A default set of callout types will be available for you to use.

## Feedback

If you have any feedback or suggestions, feel free to [open an issue](https://github.com/alythobani/obsidian-callout-toggles/issues) and I'd be happy to take a look when I can; although my availability may be limited.

## Appreciation

Thanks to the creators of Obsidian, seriously an awesome note-taking app! And big thanks to [eth-p] for providing a [Callout Manager API](https://github.com/eth-p/obsidian-callout-manager/tree/master/api)—super cool and very useful here.

[Callout Manager]: https://github.com/eth-p/obsidian-callout-manager/
[eth-p]: https://github.com/eth-p/
