import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';
import { ShopService, CartItem } from '../../services/shop.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <div class="min-h-screen bg-[#121212] pt-24 px-4 pb-12 font-sans text-white">
      <div class="container mx-auto max-w-2xl">
        <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
          <lucide-icon name="shopping-cart" class="text-[#22c55e]"></lucide-icon>
          Finalizar Pedido
        </h2>

        <div class="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5 space-y-8">
          
          <!-- Step 1: Items -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-[#22c55e]">1. Tu Pedido</h3>
            <div class="space-y-3 mb-4">
              <div *ngFor="let item of cart$ | async" class="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                <div class="flex items-center gap-3">
                    <span class="font-bold text-[#22c55e]">{{ item.quantity }}x</span>
                    <span>{{ item.name }}</span>
                </div>
                <span>{{ item.price * item.quantity | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
              </div>
            </div>
            <div class="flex justify-between text-xl font-bold border-t border-white/10 pt-4">
              <span>Total</span>
              <span class="text-[#22c55e]">{{ getTotal() | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
            </div>
          </div>

          <!-- Step 2: Delivery Method -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-[#22c55e]">2. Entrega</h3>
            <div class="flex gap-4">
              <button (click)="deliveryMethod = 'pickup'" 
                      [ngClass]="{'bg-[#22c55e] text-black': deliveryMethod === 'pickup', 'bg-white/5': deliveryMethod !== 'pickup'}"
                      class="flex-1 py-3 rounded-xl border border-white/10 font-bold transition-all text-center">
                Retiro en Local
              </button>
              <button (click)="deliveryMethod = 'delivery'" 
                      [ngClass]="{'bg-[#22c55e] text-black': deliveryMethod === 'delivery', 'bg-white/5': deliveryMethod !== 'delivery'}"
                      class="flex-1 py-3 rounded-xl border border-white/10 font-bold transition-all text-center">
                Delivery
              </button>
            </div>
            
            <div *ngIf="deliveryMethod === 'delivery'" class="mt-4 animate-fade-in">
              <label class="block text-sm text-gray-400 mb-2">Dirección de entrega</label>
              <textarea [(ngModel)]="address" placeholder="Ej: Av. Siempre Viva 742, Dept 101" 
                        class="w-full bg-[#121212] rounded-xl border border-white/10 p-3 text-white focus:border-[#22c55e] outline-none h-24"></textarea>
            </div>
          </div>

          <!-- Step 3: Contact -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-[#22c55e]">3. Datos de Contacto</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Nombre</label>
                <input type="text" [(ngModel)]="customerName" class="w-full bg-[#121212] rounded-xl border border-white/10 p-3 text-white focus:border-[#22c55e] outline-none">
              </div>
               <div>
                <label class="block text-sm text-gray-400 mb-2">WhatsApp</label>
                <input type="tel" [(ngModel)]="customerPhone" placeholder="+569..." class="w-full bg-[#121212] rounded-xl border border-white/10 p-3 text-white focus:border-[#22c55e] outline-none">
              </div>
            </div>
          </div>

           <!-- Step 4: Payment -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-[#22c55e]">4. Pago</h3>
            <div class="space-y-3">
              <button (click)="paymentMethod = 'transfer'" 
                      class="w-full p-4 rounded-xl border border-white/10 flex items-center justify-between hover:border-[#22c55e] transition-all group">
                <div class="flex items-center gap-3">
                  <div [ngClass]="{'bg-[#22c55e]': paymentMethod === 'transfer'}" class="w-4 h-4 rounded-full border border-gray-500 group-hover:border-[#22c55e]"></div>
                  <span>Transferencia Bancaria</span>
                </div>
                <lucide-icon name="credit-card" class="text-gray-500"></lucide-icon>
              </button>
               <button (click)="paymentMethod = 'cash'" 
                      class="w-full p-4 rounded-xl border border-white/10 flex items-center justify-between hover:border-[#22c55e] transition-all group">
                <div class="flex items-center gap-3">
                  <div [ngClass]="{'bg-[#22c55e]': paymentMethod === 'cash'}" class="w-4 h-4 rounded-full border border-gray-500 group-hover:border-[#22c55e]"></div>
                  <span>Pago al recibir (Efectivo/Tarjeta)</span>
                </div>
                 <lucide-icon name="wallet" class="text-gray-500"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Action -->
          <button (click)="confirmOrder()" [disabled]="!isValid()" 
                  class="w-full py-4 bg-[#22c55e] text-black font-bold text-lg rounded-xl hover:bg-[#1ea850] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8">
            Confirmar Pedido
          </button>
           <p class="text-center text-xs text-gray-500 mt-4">
             HEO 🤖 revisará tu pedido y te enviará la confirmación por WhatsApp.
           </p>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CheckoutComponent {
  cart$: Observable<CartItem[]>;

  deliveryMethod: 'pickup' | 'delivery' = 'pickup';
  paymentMethod: 'transfer' | 'cash' = 'transfer';

  customerName = '';
  customerPhone = '';
  address = '';

  constructor(private shopService: ShopService, private router: Router) {
    this.cart$ = this.shopService.getCart();
  }

  getTotal(): number {
    let total = 0;
    this.cart$.subscribe(items => {
      total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }).unsubscribe();
    return total;
  }

  isValid(): boolean {
    if (!this.customerName || !this.customerPhone) return false;
    if (this.deliveryMethod === 'delivery' && !this.address) return false;
    return true;
  }

  confirmOrder() {
    // In real app, call service to create order
    // Simulate ID creation
    const orderId = 'ORD-' + Math.floor(Math.random() * 10000);
    this.router.navigate(['/shop/status', orderId]);
  }
}
