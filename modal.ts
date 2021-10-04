import { App, Modal, Setting } from "obsidian";

export class GenerateTTSModal extends Modal {
    inputText: string;

    onSubmit: (mediaURL: string) => void;

    constructor(
        app: App,
        inputText: string,
        onSubmit: (mediaURL: string) => void
    ) {
        super(app);
        this.inputText = inputText;
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