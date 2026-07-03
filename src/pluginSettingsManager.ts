import type { AutoSelectionModes } from "./settings/autoSelectionModes";
import type { Plugin } from "obsidian";

import { PluginSettingTab, Setting } from "obsidian";

import {
  DEFAULT_AUTO_SELECTION_MODES,
  afterRemovingCalloutAutoSelectionOptions,
  migrateV1SettingToV2AutoSelectionModes,
  whenNothingSelectedAutoSelectionOptions,
  whenTextSelectedAutoSelectionOptions,
} from "./settings/autoSelectionModes";
import { createTypedDropdownSetting } from "./settings/typedSettingsHelpers";

type PluginSettingsV1 = {
  pluginVersion: undefined; // 1.1.0, but not set
  shouldUseExplicitTitle: boolean;
  calloutIDCapitalization: CalloutIDCapitalization;
  defaultFoldableState: DefaultFoldableState;
  shouldSetSelectionAfterCurrentLineWrap: boolean;
};

type SettingKey = keyof PluginSettingsV2;

type PluginSettingsV2 = {
  pluginVersion: "1.2.0";
  shouldUseExplicitTitle: boolean;
  calloutIDCapitalization: CalloutIDCapitalization;
  defaultFoldableState: DefaultFoldableState;
  autoSelectionModes: Readonly<AutoSelectionModes>;
};

type CalloutIDCapitalization = "lower" | "upper" | "sentence" | "title";

type DefaultFoldableState = "unfoldable" | "foldable-expanded" | "foldable-collapsed";

export const DEFAULT_SETTINGS: PluginSettingsV2 = {
  pluginVersion: "1.2.0",
  shouldUseExplicitTitle: true,
  calloutIDCapitalization: "lower",
  defaultFoldableState: "unfoldable",
  autoSelectionModes: DEFAULT_AUTO_SELECTION_MODES,
};

export class PluginSettingsManager extends PluginSettingTab {
  private settings: PluginSettingsV2 = deepCloneSettings(DEFAULT_SETTINGS);

  constructor(private plugin: Plugin) {
    super(plugin.app, plugin);
  }

  public async setupSettingsTab(): Promise<void> {
    this.settings = await this.loadSettings();
    this.addSettingTab();
  }

  private async loadSettings(): Promise<PluginSettingsV2> {
    const loadedSettings = ((await this.plugin.loadData()) ?? {}) as
      | Partial<PluginSettingsV1> // `Partial` since we didn't used to save full settings
      | PluginSettingsV2;
    if (loadedSettings.pluginVersion !== "1.2.0") {
      // Either empty or old settings (v1.1.0)
      const migratedSettings = migrateSettingsToV2(loadedSettings);
      await this.plugin.saveData(migratedSettings);
      return migratedSettings;
    }
    return loadedSettings;
  }

  private addSettingTab(): void {
    this.plugin.addSettingTab(this);
  }

  public getSetting<K extends SettingKey>(settingKey: K): PluginSettingsV2[K] {
    return this.settings[settingKey];
  }

  private async setSetting<K extends SettingKey>(
    settingKey: K,
    value: PluginSettingsV2[K],
  ): Promise<void> {
    this.settings[settingKey] = value;
    await this.saveSettings();
  }

  private async setAutoSelectionMode<K extends keyof AutoSelectionModes>(
    modeKey: K,
    value: AutoSelectionModes[K],
  ): Promise<void> {
    const newAutoSelectionModes = { ...this.settings.autoSelectionModes, [modeKey]: value };
    await this.setSetting("autoSelectionModes", newAutoSelectionModes);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl).setName("Callout headers").setHeading();
    this.displayExplicitCalloutTitlesSetting();
    this.displayCalloutIDCapitalizationSetting();
    this.displayDefaultFoldableStateSetting();

    this.displayAutoSelectionModeSettings();
  }

  private displayExplicitCalloutTitlesSetting(): void {
    new Setting(this.containerEl)
      .setName("Explicit callout titles")
      .setDesc(
        "Whether inserted callouts should have an explicit or implicit title by default. E.g. `> [!quote] Quote` vs `> [!quote]`.",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings.shouldUseExplicitTitle)
          .onChange((value) => this.setSetting("shouldUseExplicitTitle", value)),
      );
  }

  private displayCalloutIDCapitalizationSetting(): void {
    createTypedDropdownSetting({
      containerEl: this.containerEl,
      settingName: "Callout ID capitalization",
      settingDescription:
        "The default capitalization for inserted callout IDs. E.g. `> [!quote]` vs `> [!QUOTE]`.",
      dropdownOptions: [
        { value: "lower", displayText: "lower-case" },
        { value: "upper", displayText: "UPPER-CASE" },
        { value: "sentence", displayText: "Sentence-case" },
        { value: "title", displayText: "Title-Case" },
      ],
      currentValue: this.settings.calloutIDCapitalization,
      onChange: (newValue) => this.setSetting("calloutIDCapitalization", newValue),
    });
  }

  private displayDefaultFoldableStateSetting(): void {
    createTypedDropdownSetting({
      containerEl: this.containerEl,
      settingName: "Foldable callouts",
      settingDescription:
        "The default folded state for inserted callouts: unfoldable, expanded, or collapsed. E.g. `> [!quote]` vs `> [!quote]+` vs `> [!quote]-`.",
      dropdownOptions: [
        { value: "unfoldable", displayText: "Unfoldable" },
        { value: "foldable-expanded", displayText: "Foldable, expanded" },
        { value: "foldable-collapsed", displayText: "Foldable, collapsed" },
      ],
      currentValue: this.settings.defaultFoldableState,
      onChange: (newValue) => this.setSetting("defaultFoldableState", newValue),
    });
  }

  private displayAutoSelectionModeSettings(): void {
    new Setting(this.containerEl)
      .setName("Auto-selection / auto-cursor")
      .setHeading()
      .setDesc(
        "What to select, or where to place the cursor, after running a command. Selecting up to the header (or full text) can help with switching callout types quickly (by running remove/wrap back to back). But the other modes have their own merits as well. Experiment around to see what you prefer!",
      );
    createTypedDropdownSetting({
      containerEl: this.containerEl,
      settingName: "After inserting/wrapping with nothing selected",
      settingDescription:
        "What to select, or where to move the cursor, after inserting a fresh callout or wrapping the current line without any text selected.",
      dropdownOptions: whenNothingSelectedAutoSelectionOptions,
      currentValue: this.settings.autoSelectionModes.whenNothingSelected,
      onChange: (newValue) => this.setAutoSelectionMode("whenNothingSelected", newValue),
    });
    createTypedDropdownSetting({
      containerEl: this.containerEl,
      settingName: "After wrapping a text selection",
      settingDescription:
        "What to select, or where to move the cursor, after wrapping selected text in a callout.",
      dropdownOptions: whenTextSelectedAutoSelectionOptions,
      currentValue: this.settings.autoSelectionModes.whenTextSelected,
      onChange: (newValue) => this.setAutoSelectionMode("whenTextSelected", newValue),
    });
    createTypedDropdownSetting({
      containerEl: this.containerEl,
      settingName: "After removing a callout",
      settingDescription: "What to select, or where to move the cursor, after removing a callout.",
      dropdownOptions: afterRemovingCalloutAutoSelectionOptions,
      currentValue: this.settings.autoSelectionModes.afterRemovingCallout,
      onChange: (newValue) => this.setAutoSelectionMode("afterRemovingCallout", newValue),
    });
  }

  private async saveSettings(): Promise<void> {
    await this.plugin.saveData(this.settings);
  }
}

/**
 * Migrates empty or old settings to the current version (1.2.0), with default values as well as V1
 * settings migrated to V2 equivalents.
 */
function migrateSettingsToV2(oldSettings: Partial<PluginSettingsV1>): PluginSettingsV2 {
  const { shouldSetSelectionAfterCurrentLineWrap, pluginVersion: _, ...rest } = oldSettings;
  if (shouldSetSelectionAfterCurrentLineWrap === undefined) {
    return { ...deepCloneSettings(DEFAULT_SETTINGS), ...rest };
  }
  const autoSelectionModes = migrateV1SettingToV2AutoSelectionModes({
    shouldSetSelectionAfterCurrentLineWrap,
  });
  return { ...DEFAULT_SETTINGS, ...rest, autoSelectionModes };
}

/**
 * Deep-clones the given settings. There's currently only one nested object: `autoSelectionModes`.
 */
function deepCloneSettings(settings: PluginSettingsV2): PluginSettingsV2 {
  const clone: PluginSettingsV2 = { ...settings };
  clone.autoSelectionModes = { ...settings.autoSelectionModes };
  return clone;
}
