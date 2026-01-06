import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService, CartItem } from '../../services/shop.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-widget',
  template: `
    <div class="fixed inset-0 z-50 flex justify-end">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="close.emit()"></div>
      
      <!-- Panel -->
      <div class="relative w-full max-w-md bg-[#1a1a1a] h-full shadow-2xl flex flex-col animate-slide-in">
        <div class="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <lucide-icon name="shopping-cart" class="text-[#22c55e]"></lucide-icon>
            Tu Pedido
          </h2>
          <button (click)="close.emit()" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div *ngIf="(cart$ | async)?.length === 0" class="h-full flex flex-col items-center justify-center text-gray-500">
            <lucide-icon name="shopping-cart" class="w-12 h-12 mb-4 opacity-50"></lucide-icon>
            <p>Tu carrito está vacío</p>
          </div>

          <div class="space-y-4">
            <div *ngFor="let item of cart$ | async" class="flex gap-4 p-4 bg-white/5 rounded-xl">
              <img [src]="item.image" class="w-20 h-20 rounded-lg object-cover">
              <div class="flex-1">
                <h4 class="font-bold text-white">{{ item.name }}</h4>
                <p class="text-[#22c55e] text-sm">{{ item.price | currency:'CLP':'symbol-narrow':'1.0-0' }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <button class="w-6 h-6 rounded-full bg-white/10 hover:bg-[#22c55e] hover:text-black flex items-center justify-center text-xs ml-auto">
                    <lucide-icon name="minus" class="w-3 h-3"></lucide-icon>
                  </button>
                  <span class="text-sm font-medium">{{ item.quantity }}</span>
                  <button (click)="shopService.addToCart(item)" class="w-6 h-6 rounded-full bg-white/10 hover:bg-[#22c55e] hover:text-black flex items-center justify-center text-xs">
                    <lucide-icon name="plus" class="w-3 h-3"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-white/5 bg-[#121212]">
          <div class="flex justify-between mb-4 text-gray-400">
            <span>Subtotal</span>
            <span class="text-white font-bold">{{ getTotal() | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
          </div>
          <button (click)="close.emit(); router.navigate(['/shop/checkout'])" class="w-full py-3 bg-[#22c55e] text-black font-bold rounded-xl hover:bg-[#1ea850] transition-colors">
            Ir a Pagar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class CartWidgetComponent {
  @Output() close = new EventEmitter<void>();
  cart$: Observable<CartItem[]>;

  constructor(public shopService: ShopService, public router: Router) {
    this.cart$ = this.shopService.getCart();
  }

  getTotal(): number {
    let total = 0;
    // This is a bit hacky for a template method, but acceptable for MVP
    let currentCart: CartItem[] = [];
    this.cart$.subscribe(c => currentCart = c).unsubscribe();
    return currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}
