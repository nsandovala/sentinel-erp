import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { SalesService } from './services/sales.service';
import { ShopService, CartItem } from '../shop/services/shop.service';
import { Product } from '../../data/catalog.tbb';

@Component({
    selector: 'app-sales',
    standalone: true,
    imports: [CommonModule, LucideIconComponent, ClpPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="h-full flex flex-col md:flex-row gap-6">
      <!-- POS Area -->
      <div class="flex-grow bg-gray-900/40 border border-gray-800 rounded-2xl p-6 flex flex-col">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-200 flex items-center">
                <lucide-icon name="wallet" class="mr-2 text-green-500"></lucide-icon> Punto de Venta
            </h2>
            
            <!-- Category Tabs -->
            <div class="flex gap-2">
                @for(cat of categories; track cat) {
                    <button (click)="selectedCategory.set(cat)" 
                        [class.bg-green-600]="selectedCategory() === cat"
                        [class.text-black]="selectedCategory() === cat"
                        [class.bg-gray-800]="selectedCategory() !== cat"
                        class="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:bg-green-500/50">
                        {{ cat }}
                    </button>
                }
            </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 overflow-y-auto custom-scrollbar flex-grow content-start">
             @for (prod of filteredProducts(); track prod.id) {
                 <button (click)="addToCart(prod)" class="group relative aspect-square bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 hover:border-[#22c55e] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] flex flex-col">
                    <!-- Background Image -->
                    <div class="absolute inset-0">
                        <img [src]="prod.image || 'assets/placeholder_food.jpg'" class="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                    
                    <!-- Content -->
                    <div class="relative z-10 mt-auto p-4 text-left w-full">
                        <h3 class="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">{{ prod.name }}</h3>
                        <span class="text-[#22c55e] font-black text-xl drop-shadow-md">{{ prod.price | clp }}</span>
                    </div>

                    <!-- Scanline/Holo Effect -->
                    <div class="absolute inset-0 bg-gradient-to-tr from-[#22c55e]/0 via-white/5 to-[#22c55e]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                 </button>
             }
        </div>
      </div>

      <!-- Cart / Ticket -->
      <div class="w-full md:w-96 bg-black/60 border border-gray-800 rounded-2xl p-6 flex flex-col">
        <h3 class="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">Ticket Actual</h3>
        
        <div class="flex-grow space-y-3 overflow-y-auto mb-4 custom-scrollbar">
            @for (item of cart$ | async; track item.id) {
                <div class="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-800/50 group">
                    <div class="flex flex-col">
                        <span class="text-gray-200 font-medium">{{ item.name }}</span>
                        <div class="flex items-center gap-2 mt-1">
                             <button (click)="updateQty(item.id, item.quantity - 1)" class="p-1 hover:text-red-400 text-gray-500"><lucide-icon name="minus" class="w-3 h-3"></lucide-icon></button>
                             <span class="text-xs text-green-400 font-mono w-4 text-center">{{ item.quantity }}</span>
                             <button (click)="updateQty(item.id, item.quantity + 1)" class="p-1 hover:text-green-400 text-gray-500"><lucide-icon name="plus" class="w-3 h-3"></lucide-icon></button>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-gray-300 font-mono">{{ item.price * item.quantity | clp }}</span>
                        <button (click)="removeFromCart(item.id)" class="text-red-500/0 group-hover:text-red-500/50 hover:!text-red-400 transition-all">
                           <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>
            } @empty {
                <div class="text-center text-gray-600 italic py-10">Ticket vacío</div>
            }
        </div>

        <div class="border-t border-gray-800 pt-4 mt-auto">
            <div class="flex justify-between items-center mb-6">
                <span class="text-gray-400">Total</span>
                <span class="text-2xl font-black text-green-400">{{ total$ | async | clp }}</span>
            </div>
            
            <button (click)="finalizeSale()" [disabled]="(cartCount$ | async) === 0 || processing()" 
                class="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-green-900/20">
                @if(processing()) {
                    <span class="animate-pulse">Procesando...</span>
                } @else {
                    COBRAR TICKET
                }
            </button>
        </div>
      </div>
    </div>
  `
})
export class SalesComponent {
    private salesService = inject(SalesService);
    private shopService = inject(ShopService);

    processing = signal(false);
    selectedCategory = signal<string>('BURGERS');
    categories = ['BURGERS', 'MECHADAS', 'PAPAS', 'BEBIDAS', 'COMBOS'];

    // Data from ShopService
    products$ = this.shopService.getProducts();
    cart$ = this.shopService.items$;
    total$ = this.shopService.total$;
    cartCount$ = this.shopService.getCartCount();

    // Local computed for filtering
    // In a real app with RxJS, we'd combineLatest, but here we can use a simpler approach since products are static-ish
    // We'll use a signal for products to make filtering easier
    allProducts = signal<Product[]>([]);

    filteredProducts = computed(() => {
        const cat = this.selectedCategory();
        return this.allProducts().filter(p => {
            if (cat === 'COMBOS') return false; // No combos yet
            return p.category === cat;
        });
    });

    constructor() {
        // Load products into signal
        this.shopService.getProducts().subscribe(p => this.allProducts.set(p));
    }

    addToCart(prod: Product) {
        this.shopService.addItem(prod);
    }

    removeFromCart(id: string) {
        this.shopService.removeItem(id);
    }

    updateQty(id: string, qty: number) {
        this.shopService.updateQty(id, qty);
    }

    async finalizeSale() {
        if (this.processing()) return;
        this.processing.set(true);

        // Emulate processing
        setTimeout(() => {
            this.shopService.clear();
            alert("Venta registrada con éxito");
            this.processing.set(false);
        }, 1000);
    }
}
