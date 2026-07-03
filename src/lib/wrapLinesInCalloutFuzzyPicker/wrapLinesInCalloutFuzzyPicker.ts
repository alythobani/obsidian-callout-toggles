import type { App, FuzzyMatch } from "obsidian";
import type { CalloutID } from "obsidian-callout-manager";

import { FuzzySuggestModal } from "obsidian";

import { renderCalloutSuggestionPreview } from "./renderCalloutSuggestionPreview";

const FUZZY_PICKER_PLACEHOLDER = "Choose a callout type";

export class WrapLinesInCalloutFuzzyPicker extends FuzzySuggestModal<CalloutID> {
  constructor({
    app,
    calloutIDs,
    onChooseCalloutID,
  }: {
    app: App;
    calloutIDs: readonly CalloutID[];
    onChooseCalloutID: (calloutID: CalloutID) => void;
  }) {
    super(app);
    this.calloutIDs = calloutIDs;
    this.onChooseCalloutID = onChooseCalloutID;
    this.setPlaceholder(FUZZY_PICKER_PLACEHOLDER);
  }

  private calloutIDs: readonly CalloutID[];
  private onChooseCalloutID: (calloutID: CalloutID) => void;

  getItems(): CalloutID[] {
    return [...this.calloutIDs];
  }

  getItemText(calloutID: CalloutID): string {
    return calloutID;
  }

  onChooseItem(calloutID: CalloutID): void {
    this.onChooseCalloutID(calloutID);
  }

  renderSuggestion({ item: calloutID }: FuzzyMatch<CalloutID>, el: HTMLElement): void {
    renderCalloutSuggestionPreview({ calloutID, suggestionElement: el });
  }
}
