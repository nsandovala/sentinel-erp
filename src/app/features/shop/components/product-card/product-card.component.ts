import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product, ShopService } from '../../services/shop.service';

@Component({
    selector: 'app-product-card',
    template: `
    <div class="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#22c55e]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <!-- Image -->
      <div class="relative h-48 overflow-hidden">
        <img [src]="product.image" [alt]="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-60"></div>
        <span *ngIf="product.isNew" class="absolute top-3 left-3 px-2 py-1 bg-[#22c55e] text-black text-[10px] font-bold rounded-full">NEW</span>
      </div>

      <!-- Content -->
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-white group-hover:text-[#22c55e] transition-colors">{{ product.name }}</h3>
          <span class="text-[#22c55e] font-bold">{{ product.price | currency:'CLP':'symbol-narrow':'1.0-0' }}</span>
        </div>
        <p class="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{{ product.description }}</p>
        
        <button (click)="addToCart()" 
                class="w-full py-2 bg-white/5 hover:bg-[#22c55e] hover:text-black text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          <span>Agregar</span>
          <lucide-icon name="plus" class="w-4 h-4 transition-transform group-hover/btn:rotate-90"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
    @Input() product!: Product;

    constructor(private shopService: ShopService) { }

    addToCart() {
        this.shopService.addToCart(this.product);
    }
}
