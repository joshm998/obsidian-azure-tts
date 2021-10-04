import { AzureTTSSettings } from "main";
import { App, Modal, Setting } from "obsidian";
import { generateTTS } from "services/azurespeech";

export class GenerateTTSModal extends Modal {
    inputText: string;
    settings: AzureTTSSettings;
    app: App;

    onSubmit: (mediaURL: string) => void;

    constructor(
        app: App,
        settings: AzureTTSSettings,
        inputText: string,
        onSubmit: (mediaURL: string) => void
    ) {
        super(app);
        this.app = app;
        this.inputText = inputText;
        this.settings = settings;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;

        if (!this.inputText) {
            contentEl.createEl("h1", { text: "Generate TTS" });

            new Setting(contentEl).setName("Text to Convert").addText((text) =>
                text.setValue(this.inputText).onChange((value) => {
                    this.inputText = value;
                })
            );

            new Setting(contentEl).addButton((btn) =>
                btn
                    .setButtonText("Insert")
                    .setCta()
                    .onClick(() => {
                        this.close();
                        generateTTS(this.app, this.settings, this.inputText);
                        this.onSubmit(this.inputText);
                    })
            );
        }
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}