import { GenerateTTSModal } from 'modal';
import { App, Editor, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export interface AzureTTSSettings {
	api_key: string;
}

const DEFAULT_SETTINGS: AzureTTSSettings = {
	api_key: ''
}

export default class AzureTTSPlugin extends Plugin {
	settings: AzureTTSSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addCommand({
			id: 'generate-tts',
			name: 'Generate TTS',
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				const sel = editor.getSelection()
				let leaf = this.app.workspace.activeLeaf;
				const onSubmit = (media: String) => {
					editor.replaceSelection(`${sel}\n![[${media}]]`);
				};

				if (leaf) {
					if (!checking) {
						new GenerateTTSModal(this.app, this.settings, sel, onSubmit).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new TTSSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TTSSettingTab extends PluginSettingTab {
	plugin: AzureTTSPlugin;

	constructor(app: App, plugin: AzureTTSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Obsidian Azure TTS Settings' });

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Key for the Azure Speech Service')
			.addText(text => text
				.setPlaceholder('Enter API Key...')
				.setValue('')
				.onChange(async (value) => {
					this.plugin.settings.api_key = value;
					await this.plugin.saveSettings();
				}));
	}
}
