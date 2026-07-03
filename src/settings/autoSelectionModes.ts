import type { TypedDropdownOption } from "./typedSettingsHelpers";

export const whenNothingSelectedAutoSelectionOptions: readonly TypedDropdownOption<AutoSelectionWhenNothingSelectedMode>[] =
  [
    { value: "selectHeaderToCursor", displayText: "Select up to header" },
    { value: "selectFull", displayText: "Select full callout" },
    { value: "selectTitle", displayText: "Select callout title" },
    { value: "originalCursor", displayText: "Keep relative cursor position" },
    { value: "cursorEnd", displayText: "Cursor at end" },
  ];

export const whenTextSelectedAutoSelectionOptions: readonly TypedDropdownOption<AutoSelectionWhenTextSelectedMode>[] =
  [
    { value: "selectHeaderToCursor", displayText: "Select up to header" },
    { value: "selectFull", displayText: "Select full callout" },
    { value: "selectTitle", displayText: "Select callout title" },
    { value: "originalSelection", displayText: "Keep relative selection" },
    { value: "clearSelectionCursorTo", displayText: "Clear selection" },
    { value: "clearSelectionCursorStart", displayText: "Clear selection, cursor at start" },
    { value: "clearSelectionCursorEnd", displayText: "Clear selection, cursor at end" },
  ];

export const afterRemovingCalloutAutoSelectionOptions: readonly TypedDropdownOption<AutoSelectionAfterRemovingCalloutMode>[] =
  [
    { value: "originalSelection", displayText: "Keep relative selection" },
    { value: "selectFull", displayText: "Select full remaining lines" },
    { value: "clearSelectionCursorTo", displayText: "Clear selection" },
    { value: "clearSelectionCursorStart", displayText: "Clear selection, cursor at start" },
    { value: "clearSelectionCursorEnd", displayText: "Clear selection, cursor at end" },
  ];

export type AutoSelectionModes = {
  /** Cursor/selection behavior after wrapping with no text selected. */
  whenNothingSelected: AutoSelectionWhenNothingSelectedMode;
  /** Cursor/selection behavior after wrapping a selection. */
  whenTextSelected: AutoSelectionWhenTextSelectedMode;
  /** Cursor/selection behavior after removing a callout. */
  afterRemovingCallout: AutoSelectionAfterRemovingCalloutMode;
};

export type AutoSelectionWhenNothingSelectedMode =
  "selectHeaderToCursor" | "selectFull" | "selectTitle" | "originalCursor" | "cursorEnd";

export type AutoSelectionWhenTextSelectedMode =
  | "selectHeaderToCursor"
  | "selectFull"
  | "selectTitle"
  | "originalSelection"
  | "clearSelectionCursorTo"
  | "clearSelectionCursorStart"
  | "clearSelectionCursorEnd";

export type AutoSelectionAfterRemovingCalloutMode =
  | "originalSelection"
  | "selectFull"
  | "clearSelectionCursorTo"
  | "clearSelectionCursorStart"
  | "clearSelectionCursorEnd";

export const DEFAULT_AUTO_SELECTION_MODES: AutoSelectionModes = {
  whenNothingSelected: "selectHeaderToCursor",
  whenTextSelected: "selectHeaderToCursor",
  afterRemovingCallout: "originalSelection",
};

export function migrateV1SettingToV2AutoSelectionModes({
  shouldSetSelectionAfterCurrentLineWrap,
}: {
  shouldSetSelectionAfterCurrentLineWrap: boolean;
}): AutoSelectionModes {
  const whenNothingSelected = shouldSetSelectionAfterCurrentLineWrap
    ? "selectHeaderToCursor"
    : "originalCursor";
  const { whenTextSelected, afterRemovingCallout } = DEFAULT_AUTO_SELECTION_MODES;
  return { whenNothingSelected, whenTextSelected, afterRemovingCallout };
}
