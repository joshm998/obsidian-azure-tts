import { AzureTTSSettings } from "main";
import * as fs from "fs"
import { App, FileSystemAdapter } from "obsidian";

export function generateTTS(app: App, settings: AzureTTSSettings, text: string) {
    const adapter = app.vault.adapter as FileSystemAdapter;

    fetch("https://australiaeast.api.cognitive.microsoft.com/sts/v1.0/issueToken", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Ocp-Apim-Subscription-Key": settings.api_key
        },
        method: "POST"
    })
        .then(res => res.text())
        .then((token) => {
            if (token) {
                console.log(token);
                fetch("https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1", {
                    headers: {
                        "Content-Type": "application/ssml+xml",
                        "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
                        "Authorization": `Bearer ${token}`
                    },
                    body: generateSSML(text),
                    method: "POST"
                })
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        adapter.mkdir("tts");
                        adapter.writeBinary("tts/test.mp3", buffer);
                    });
            }
        });
}

function generateSSML(text: string): string {
    return `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Male'
    name='en-US-ChristopherNeural'>
        ${text}
    </voice></speak>`;

}
