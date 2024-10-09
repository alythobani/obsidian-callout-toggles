import { Plugin, PluginSettingTab, Setting, ToggleComponent } from "obsidian";
import { REMOVE_CALLOUT_FROM_SELECTED_LINES_COMMAND } from "./commands/removeCallout";

export interface PluginSettings {
  shouldSetSelectionAfterCurrentLineWrap: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  shouldSetSelectionAfterCurrentLineWrap: false,
};

export class PluginSettingsManager extends PluginSettingTab {
  private settings: PluginSettings;

  constructor(private plugin: Plugin) {
    super(plugin.app, plugin);
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
  }

  public async setupSettingsTab(): Promise<void> {
    this.settings = await this.loadSettings();
    this.addSettingTab();
  }

  private async loadSettings(): Promise<PluginSettings> {
    const loadedSettings = (await this.plugin.loadData()) as PluginSettings;
    return Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
  }

  private addSettingTab(): void {
    this.plugin.addSettingTab(this);
  }

  public getSetting(settingKey: keyof PluginSettings): PluginSettings[keyof PluginSettings] {
    return this.settings[settingKey];
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Select text after inserting callout")
      .setDesc(
        "Whether to select a callout's text after insertion, even if no text was selected before." +
          " This can be useful if you want to be able to run" +
          ` '${REMOVE_CALLOUT_FROM_SELECTED_LINES_COMMAND.name}' immediately afterwards.`
      )
      .addToggle(this.setupSetSelectionToggle.bind(this));
  }

  private setupSetSelectionToggle(toggle: ToggleComponent): ToggleComponent {
    toggle = toggle.setValue(this.settings.shouldSetSelectionAfterCurrentLineWrap);
    toggle = toggle.onChange(async (value) => {
      this.settings.shouldSetSelectionAfterCurrentLineWrap = value;
      await this.saveSettings();
    });
    return toggle;
  }

  private async saveSettings(): Promise<void> {
    await this.plugin.saveData(this.settings);
  }
}
