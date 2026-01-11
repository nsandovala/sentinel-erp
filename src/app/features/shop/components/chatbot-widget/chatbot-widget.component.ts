import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true, // Making it standalone for easier imports if needed, or stick to module
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end font-sans">
      <!-- Chat Window -->
      <div *ngIf="isOpen" 
           class="mb-4 w-80 md:w-96 bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col animate-pop-up origin-bottom-right h-[550px] flex flex-col">
        
        <!-- Header: Super Saiyajin Logic -->
        <div class="p-4 bg-gradient-to-r from-emerald-900 to-[#121212] flex items-center gap-3 border-b border-white/5 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#22c55e] to-yellow-400 p-[2px] shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10">
            <div class="w-full h-full bg-[#121212] rounded-full flex items-center justify-center relative overflow-hidden">
               <span class="text-lg font-black text-[#22c55e]">HEO</span>
               <div class="absolute inset-0 bg-[#22c55e]/10 animate-pulse"></div>
            </div>
          </div>
          
          <div class="z-10">
            <h4 class="font-bold text-white text-lg tracking-tight">HEO <span class="text-[#22c55e]">VENTAS</span></h4>
            <span class="text-[10px] text-yellow-400 font-bold uppercase tracking-widest">Modo Neuroventas Activo</span>
          </div>
          
          <button (click)="toggleChat()" class="ml-auto text-white/50 hover:text-white z-10 transition-colors">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex border-b border-white/5 bg-[#121212]">
          <button (click)="setMode('ai')" 
                  [class.text-[#22c55e]]="mode === 'ai'"
                  [class.border-b-2]="mode === 'ai'"
                  [class.border-[#22c55e]]="mode === 'ai'"
                  class="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-white/5 transition-all">
            Elegir por mí
          </button>
          <button (click)="setMode('manual')" 
                  [class.text-[#22c55e]]="mode === 'manual'"
                  [class.border-b-2]="mode === 'manual'"
                  [class.border-[#22c55e]]="mode === 'manual'"
                  class="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-white/5 transition-all">
            Armar Pedido
          </button>
          <button (click)="setMode('tracking')" 
                  [class.text-[#22c55e]]="mode === 'tracking'"
                  [class.border-b-2]="mode === 'tracking'"
                  [class.border-[#22c55e]]="mode === 'tracking'"
                  class="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-white/5 transition-all">
            Seguimiento
          </button>
        </div>

        <!-- AI Chat Content -->
        <div *ngIf="mode === 'ai'" class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#1a1a1a]" #scrollContainer>
            <div *ngFor="let msg of messages" class="flex gap-3" [ngClass]="{'flex-row-reverse': msg.role === 'user'}">
              
              <!-- Avatar -->
              <div *ngIf="msg.role === 'assistant'" class="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <span class="text-[10px] text-[#22c55e] font-bold">AI</span>
              </div>
              
              <!-- Bubble -->
              <div [ngClass]="msg.role === 'user' ? 'bg-[#22c55e] text-black' : 'bg-[#121212] text-gray-200 border border-white/10'"
                   class="p-3 rounded-2xl max-w-[85%] text-sm shadow-sm relative">
                <p>{{ msg.content }}</p>
                <div [ngClass]="msg.role === 'user' ? 'text-black/50' : 'text-gray-500'" class="text-[10px] mt-1 text-right font-mono">
                  {{ msg.role === 'assistant' ? 'HEO' : 'TÚ' }}
                </div>
              </div>
            </div>
            
            <div *ngIf="isLoading" class="flex gap-3">
               <div class="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center shrink-0 border border-white/10">
                <span class="text-[10px] text-[#22c55e] animate-spin">⚡</span>
              </div>
              <div class="bg-[#121212] p-3 rounded-2xl border border-white/10">
                <div class="flex gap-1">
                  <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                  <span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Prompts -->
          <div *ngIf="messages.length <= 1" class="px-4 py-2 bg-[#1a1a1a] flex gap-2 overflow-x-auto custom-scrollbar">
            <button *ngFor="let prompt of quickPrompts" 
                    (click)="sendUserMessage(prompt)"
                    class="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#22c55e]/30 text-[#22c55e] text-xs hover:bg-[#22c55e] hover:text-black transition-colors">
              {{ prompt }}
            </button>
          </div>

          <!-- Input -->
          <div class="p-4 bg-[#121212] border-t border-white/5">
            <div class="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-xl border border-white/5 focus-within:border-[#22c55e] transition-colors shadow-inner">
              <input type="text" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" 
                     placeholder="Escribe aquí..." 
                     class="flex-1 bg-transparent text-white text-sm focus:outline-none px-2">
              <button (click)="sendMessage()" [disabled]="!userInput.trim() || isLoading"
                      class="p-2 bg-[#22c55e] rounded-lg text-black hover:bg-[#1ea850] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <lucide-icon name="message-circle" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Manual & Tracking Placeholders -->
        <div *ngIf="mode !== 'ai'" class="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
           <lucide-icon [name]="mode === 'manual' ? 'shopping-cart' : 'truck'" class="w-16 h-16 mb-4 opacity-20"></lucide-icon>
           <h5 class="text-white font-bold mb-2">{{ mode === 'manual' ? 'Armar Pedido' : 'Seguimiento' }}</h5>
           <p class="text-sm">Usa el menú principal para armar tu pedido o ingresa tu ID para tracking.</p>
           <button *ngIf="mode === 'manual'" (click)="toggleChat()" class="mt-4 text-[#22c55e] text-sm hover:underline">Ir a la Tienda</button>
        </div>

      </div>

      <!-- Toggle Button -->
      <button (click)="toggleChat()" 
              class="w-16 h-16 bg-[#22c55e] rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center justify-center text-black hover:scale-110 hover:rotate-3 transition-all duration-300 group z-50 relative overflow-hidden">
        <div class="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
        <lucide-icon *ngIf="!isOpen" name="message-circle" class="w-8 h-8"></lucide-icon>
        <lucide-icon *ngIf="isOpen" name="x" class="w-8 h-8"></lucide-icon>
        
        <!-- Label -->
        <span *ngIf="!isOpen" class="absolute -top-10 right-0 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap animate-bounce">
           HEO te ayuda a elegir 👇
        </span>
      </button>
    </div>
  `,
  styles: [`
    @keyframes pop-up {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-pop-up {
      animation: pop-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  mode: 'ai' | 'manual' | 'tracking' = 'ai';
  userInput = '';
  isLoading = false;

  messages: any[] = [
    { role: 'assistant', content: '¡Hola! Soy HEO 🤖. ¿Hambre brutal o antojo suave?' }
  ];

  quickPrompts = [
    'Hambre brutal',
    'Antojo suave',
    'Quiero algo picante',
    'Recomiéndame lo más vendido'
  ];

  constructor() { }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  setMode(m: 'ai' | 'manual' | 'tracking') {
    this.mode = m;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  sendUserMessage(text: string) {
    this.userInput = text;
    this.sendMessage();
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.userInput = '';

    // Add user message
    this.messages.push({ role: 'user', content: userMsg });
    this.isLoading = true;

    // Simulate delay and dummy response
    setTimeout(() => {
      const responses = [
        '¡Excelente elección! Te recomiendo la Vader Burger, es legendaria.',
        'Si buscas algo suave, prueba la Burger Italianni con palta Hass.',
        '¿Picante? La Mechada Diablo es perfecta para ti.',
        'Nuestro bestseller es la Burger Cheddar, ¡pruébala!'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.messages.push({ role: 'assistant', content: randomResponse });
      this.isLoading = false;
    }, 1000);
  }
}
