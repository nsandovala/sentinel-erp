import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Launcher -->
    <button
      class="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20
             flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
      (click)="toggle()"
      aria-label="Abrir chat"
      title="HEO Mini"
    >
      <span class="text-xl font-black">H</span>
      <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-black border-2 border-[#22c55e] animate-pulse"></span>
    </button>

    <!-- Panel -->
    <div
      *ngIf="open"
      class="fixed bottom-24 right-6 z-[9999] w-[340px] max-w-[92vw] rounded-2xl overflow-hidden
             border border-white/10 bg-[#121212]/95 backdrop-blur-xl shadow-2xl shadow-black/40
             animate-pop"
      role="dialog"
      aria-label="Chat HEO"
    >
      <!-- Header -->
      <div class="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center">
            <span class="text-[#22c55e] font-black">HEO</span>
          </div>
          <div>
            <div class="text-sm font-bold text-white">HEO Mini</div>
            <div class="text-[11px] text-gray-400">Asistente rápido</div>
          </div>
        </div>
        <button
          class="w-9 h-9 rounded-xl hover:bg-white/5 text-gray-300"
          (click)="toggle()"
          aria-label="Cerrar chat"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-4 space-y-3 max-h-[360px] overflow-auto">
        <div class="text-xs text-gray-400">
          Dime qué necesitas: menú, promo, stock, dudas… yo respondo.
        </div>

        <div class="rounded-2xl bg-white/5 border border-white/10 p-3">
          <div class="text-[12px] text-gray-300">Ejemplo:</div>
          <div class="text-sm text-white mt-1">
            "¿Qué burgers recomiendas hoy?"
          </div>
        </div>

        <div *ngIf="lastUserMsg" class="rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20 p-3">
          <div class="text-[11px] text-gray-400 mb-1">Tú</div>
          <div class="text-sm text-white">{{ lastUserMsg }}</div>
        </div>

        <div *ngIf="lastBotMsg" class="rounded-2xl bg-white/5 border border-white/10 p-3">
          <div class="text-[11px] text-gray-400 mb-1">HEO</div>
          <div class="text-sm text-white whitespace-pre-line">{{ lastBotMsg }}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-white/10 flex gap-2">
        <input
          [(ngModel)]="message"
          (keydown.enter)="send()"
          placeholder="Escribe aquí…"
          class="flex-1 h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none
                 focus:border-[#22c55e]/50"
        />
        <button
          class="h-11 px-4 rounded-xl bg-[#22c55e] text-black font-bold hover:bg-[#1ea850] active:scale-95 transition"
          (click)="send()"
        >
          Enviar
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pop {
      from { transform: translateY(8px) scale(.98); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    .animate-pop { animation: pop .18s ease-out; }

    /* Si no tienes Tailwind utilities para scrollbar, esto ayuda */
    :host ::-webkit-scrollbar { width: 8px; }
    :host ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 999px; }
  `]
})
export class ChatbotWidgetComponent {
  open = false;
  message = '';

  lastUserMsg = '';
  lastBotMsg = '';

  toggle() {
    this.open = !this.open;
  }

  send() {
    const text = (this.message || '').trim();
    if (!text) return;

    this.lastUserMsg = text;

    // Respuesta dummy (simple). Luego lo conectamos a LM Studio/HEO service.
    this.lastBotMsg = this.simpleReply(text);

    this.message = '';
  }

  simpleReply(text: string) {
    const t = text.toLowerCase();

    if (t.includes('promo') || t.includes('oferta')) {
      return 'Promo sugerida: 2x mechadas + papas. Si quieres, te armo el copy para WhatsApp en 15 segundos.';
    }
    if (t.includes('burger') || t.includes('hamburg')) {
      return 'Hoy te diría: Vader Burger si quieres épica, Cheddar si quieres clásico letal.';
    }
    if (t.includes('stock')) {
      return 'Puedo revisar alertas si conectamos Inventario → por ahora dime qué insumo te preocupa y lo priorizamos.';
    }
    return 'Entendido. Dame un segundo: ¿quieres respuesta corta o modo detallado?';
  }

  // Cierra el panel con Escape (nice-to-have)
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.open) this.open = false;
  }
}
