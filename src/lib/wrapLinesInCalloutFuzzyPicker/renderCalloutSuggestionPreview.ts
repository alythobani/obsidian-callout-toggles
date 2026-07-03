import type { CalloutID } from "obsidian-callout-manager";

import { setIcon } from "obsidian";

import { toTitleCase } from "../../utils/stringUtils";

export function renderCalloutSuggestionPreview({
  calloutID,
  suggestionElement,
}: {
  calloutID: CalloutID;
  suggestionElement: HTMLElement;
}): void {
  suggestionElement.addClass("callout-toggles-fuzzy-picker-suggestion");
  const calloutDiv = suggestionElement.createDiv({ cls: "callout" });
  calloutDiv.setAttribute("data-callout", calloutID);
  addTitleDivToCalloutDiv({ calloutDiv, calloutID });
}

function addTitleDivToCalloutDiv({
  calloutDiv,
  calloutID,
}: {
  calloutDiv: HTMLDivElement;
  calloutID: CalloutID;
}): void {
  const calloutTitleEl = calloutDiv.createDiv({ cls: "callout-title" });
  addIconDivToTitleDiv({ calloutTitleEl, calloutDiv });
  calloutTitleEl.createDiv({ cls: "callout-title-inner", text: toTitleCase(calloutID) });
}

function addIconDivToTitleDiv({
  calloutTitleEl,
  calloutDiv,
}: {
  calloutTitleEl: HTMLDivElement;
  calloutDiv: HTMLDivElement;
}): void {
  const iconEl = calloutTitleEl.createDiv({ cls: "callout-icon" });
  const iconId = getComputedStyle(calloutDiv).getPropertyValue("--callout-icon").trim();
  if (iconId === "") {
    return;
  }
  setIcon(iconEl, iconId);
}
