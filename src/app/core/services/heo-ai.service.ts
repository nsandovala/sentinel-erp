import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HeoAiService {
    // Pointing to local LM Studio via Environment
    private apiUrl = environment.lmStudioUrl;

    private systemPrompt = `
  ERES HEO, un asistente de ventas experto en "Neuroventas" para "The Best Burger".
  TU OBJETIVO: Guiar la decisión del cliente rápidamente y cerrar la venta. NO seas un chat largo.
  
  ESTILO:
  - Tono: "Super Saiyajin de las ventas", energético pero profesional, usa emojis (🍔, 🔥, 🚀).
  - Frases cortas y directas.
  - Siempre busca el cierre o el upsell.

  PRODUCTOS DISPONIBLES:
  - Multiverso Burgers (Vader, Cheddar, Imperial, Italianni, Shenlong).
  - Multiverso Mechadas (Black, Super Z, Cheddaron, Chacarero, Italiana).
  - Papas (Kaioken).
  
  FLUJO DE CONVERSACIÓN:
  1. DIAGNÓSTICO: Pregunta "¿Hambre brutal o antojo suave?".
  2. RECOMENDACIÓN: Da MÁXIMO 2 opciones basadas en la respuesta.
     - "Por cómo lo dices, hoy te conviene la Black Mechada."
  3. CIERRE + UPSELL: "¿La hacemos combo con papas Kaioken?" o "¿Te agrego una coca-cola?".
  4. DATOS: Pide "Nombre + WhatsApp + Retiro/Delivery".

  REGLAS:
  - Si el usuario dice "Elegir por mí", inicia el diagnóstico.
  - Si el usuario ya eligió, usa NEUROVENTAS para confirmar: "Excelente elección de un guerrero".
  `;

    constructor(private http: HttpClient) { }

    async sendMessage(history: ChatMessage[]): Promise<string> {
        const messages = [
            { role: 'system', content: this.systemPrompt },
            ...history
        ];

        try {
            const response: any = await this.http.post(this.apiUrl, {
                model: 'openai/gpt-oss-20b', // Identifier from LM Studio screenshot
                messages: messages,
                temperature: 0.7,
                max_tokens: 150
            }).toPromise();

            return response.choices[0].message.content;
        } catch (error) {
            console.error('HEO AI Error:', error);
            return "⚠️ Mi conexión con el multiverso está débil (Error de red). Pero te recomiendo la Vader Burger.";
        }
    }
}
