import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { SalesService } from './services/sales.service';
import { SaleItem } from '../../core/models/core.models';

@Component({
    selector: 'app-sales',
    standalone: true,
    imports: [CommonModule, LucideIconComponent, ClpPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="h-full flex flex-col md:flex-row gap-6">
      <!-- POS Area -->
      <div class="flex-grow bg-gray-900/40 border border-gray-800 rounded-2xl p-6 flex flex-col">
        <h2 class="text-xl font-bold text-gray-200 mb-4 flex items-center">
            <lucide-icon name="wallet" class="mr-2 text-green-500"></lucide-icon> Punto de Venta
        </h2>

        <!-- Product Grid (Mock) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 overflow-y-auto max-h-[400px]">
             @for (prod of mockProducts; track prod.id) {
                 <button (click)="addToCart(prod)" class="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all border border-gray-700 hover:border-green-500/50 flex flex-col text-left group">
                    <span class="text-gray-300 font-medium group-hover:text-white">{{ prod.name }}</span>
                    <span class="text-green-400 font-bold mt-2">{{ prod.price | clp }}</span>
                 </button>
             }
        </div>
      </div>

      <!-- Cart / Ticket -->
      <div class="w-full md:w-96 bg-black/60 border border-gray-800 rounded-2xl p-6 flex flex-col">
        <h3 class="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">Ticket Actual</h3>
        
        <div class="flex-grow space-y-3 overflow-y-auto mb-4">
            @for (item of cart(); track item.productId) {
                <div class="flex justify-between items-center text-sm p-2 rounded hover:bg-gray-800/50">
                    <div class="flex flex-col">
                        <span class="text-gray-200">{{ item.name }}</span>
                        <span class="text-xs text-gray-500">x{{ item.quantity }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-gray-300 font-mono">{{ item.unitPrice * item.quantity | clp }}</span>
                        <button (click)="removeFromCart(item.productId)" class="text-red-500/50 hover:text-red-400">
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
                <span class="text-2xl font-black text-green-400">{{ total() | clp }}</span>
            </div>
            
            <button (click)="finalizeSale()" [disabled]="cart().length === 0 || processing()" 
                class="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
                @if(processing()) {
                    <span class="animate-pulse">Procesando...</span>
                } @else {
                    COBRAR
                }
            </button>
        </div>
      </div>
    </div>
  `
})
export class SalesComponent {
    private salesService = inject(SalesService);

    cart = signal<SaleItem[]>([]);
    processing = signal(false);


    // Mock Products (In real app, fetch from Firestore 'products')
    // We explicitly type this to ensure it works with the template
    mockProducts: any[] = [
        // BURGERS
        { id: 'vader-burger', name: 'Vader Burger', price: 5990 },
        { id: 'burger-cheddar', name: 'Burger Cheddar', price: 5900 },
        { id: 'burger-imperial', name: 'Burger Imperial', price: 6990 },
        { id: 'burger-italianni', name: 'Burger Italianni', price: 6190 },
        { id: 'shenlong-burger', name: 'Shenlong Burger', price: 6750 },
        // MECHADAS
        { id: 'black-mechada', name: 'Black Mechada', price: 6250 },
        { id: 'super-mechada-z', name: 'Super Mechada Z', price: 4600 },
        { id: 'mechada-cheddaron', name: 'Mechada Cheddaron', price: 4750 },
        { id: 'chacarero-prime', name: 'Chacarero Prime', price: 5650 },
        { id: 'mechada-italiana-3000', name: 'Mechada Italiana 3000', price: 5500 },
        { id: 'mechada-pobre-poderosa', name: 'Mechada Pobre', price: 5950 },
        // SIDES & DRINKS
        { id: 'papas-kaioken', name: 'Papas Kaioken', price: 2000 },
        { id: 'coca-cola-lata', name: 'Coca-Cola 350ml', price: 1500 },
    ];

    constructor() {
        console.log("Sales Component Initialized v1.1 - Products Loaded:", this.mockProducts.length);
    }


    addToCart(prod: any) {
        this.cart.update(curr => {
            const existing = curr.find(x => x.productId === prod.id);
            if (existing) {
                return curr.map(x => x.productId === prod.id ? { ...x, quantity: x.quantity + 1 } : x);
            }
            return [...curr, { productId: prod.id, name: prod.name, unitPrice: prod.price, quantity: 1 }];
        });
    }

    removeFromCart(id: string) {
        this.cart.update(curr => curr.filter(x => x.productId !== id));
    }

    total = computed(() => this.cart().reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));

    async finalizeSale() {
        if (this.processing()) return;
        this.processing.set(true);
        try {
            await this.salesService.processSale(this.cart(), this.total());
            this.cart.set([]); // Clear cart
            // Show Success Notification (Toast)
        } catch (e) {
            console.error("Sale Failed", e);
            alert("Error procesando venta");
        } finally {
            this.processing.set(false);
        }
    }
}
