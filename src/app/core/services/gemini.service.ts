import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

@Injectable({
    providedIn: 'root'
})
export class GeminiService {
    // Point to local LM Studio (simulating Gemini/Sentinel Core)
    private apiUrl = environment.lmStudioUrl;

    isLoading = signal(false);

    async generateContent(prompt: string, systemInstruction: string = ""): Promise<string> {
        // LM Studio doesn't strictly need a key for local, but we pass dummy if needed
        const apiKey = "lm-studio";

        this.isLoading.set(true);
        try {
            // Using OpenAI format for LM Studio
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b', // Ensure this matches .env or just use a default
                    messages: [
                        { role: 'system', content: systemInstruction || "You are Sentinel Core." },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`Sentinel AI Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "Sin respuesta del modelo.";
        } catch (e) {
            console.error("Sentinel Core Call Failed", e);
            return "Error de conexión con LM Studio (Local). Asegúrate de que esté corriendo.";
        } finally {
            this.isLoading.set(false);
        }
    }
}
