import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <div class="min-h-screen bg-[#121212] pt-24 px-4 pb-12 font-sans text-white flex flex-col items-center">
      <div class="max-w-md w-full bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 text-center relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent animate-moving-bar"></div>

        <div class="w-20 h-20 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
           <lucide-icon name="check-circle" class="w-10 h-10 text-[#22c55e]"></lucide-icon>
        </div>

        <h2 class="text-2xl font-bold text-white mb-2">¡Pedido Confirmado!</h2>
        <p class="text-gray-400 mb-8">Orden <span class="text-[#22c55e] font-mono font-bold">{{ orderId }}</span></p>

        <!-- Timeline -->
        <div class="space-y-6 text-left relative pl-4 border-l-2 border-white/10 ml-4 mb-8">
           <div class="relative">
             <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             <h4 class="font-bold text-[#22c55e]">Recibido</h4>
             <p class="text-xs text-gray-500">HEO procesó tu orden</p>
           </div>
           
           <div class="relative opacity-50">
             <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-700"></div>
             <h4 class="font-bold text-white">En Preparación</h4>
             <p class="text-xs text-gray-500">La cocina oscura se enciende</p>
           </div>

           <div class="relative opacity-50">
             <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-700"></div>
             <h4 class="font-bold text-white">Listo / En camino</h4>
             <p class="text-xs text-gray-500">Prepárate para el sabor</p>
           </div>
        </div>

        <div class="bg-white/5 p-4 rounded-xl mb-6">
          <p class="text-sm text-gray-300 mb-2">Te enviamos los detalles a tu WhatsApp.</p>
          <button class="w-full py-2 bg-[#25D366] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors">
            <lucide-icon name="message-circle" class="w-4 h-4"></lucide-icon>
            Hablar con Soporte
          </button>
        </div>

        <a routerLink="/shop" class="text-[#22c55e] hover:underline text-sm block">Volver a la tienda</a>

      </div>
    </div>
  `,
  styles: [`
    @keyframes moving-bar {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-moving-bar {
      animation: moving-bar 2s linear infinite;
    }
  `]
})
export class OrderStatusComponent implements OnInit {
  orderId: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}
