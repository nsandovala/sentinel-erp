import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { InventoryService } from './services/inventory.service';

import { ShopService } from '../shop/services/shop.service';
import { Product } from '../../data/catalog.tbb';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent, ClpPipe, AsyncPipe],
  template: `
    <div class="p-6 bg-gray-900/40 border border-gray-800 rounded-2xl h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-200 flex items-center gap-3">
          <lucide-icon *ngIf="activeTab === 'ingredients'" name="package" class="text-yellow-500"></lucide-icon>
          <lucide-icon *ngIf="activeTab === 'products'" name="shopping-bag" class="text-[#22c55e]"></lucide-icon>
          {{ activeTab === 'ingredients' ? 'Inventario de Insumos' : 'Catálogo de Productos' }}
        </h2>
        
        <div class="flex items-center gap-4">
          <div class="flex bg-black/40 rounded-lg p-1 border border-white/10">
            <button type="button" (click)="activeTab = 'ingredients'" 
                    [class.bg-yellow-600_20]="activeTab === 'ingredients'"
                    [class.text-yellow-500]="activeTab === 'ingredients'"
                    class="px-4 py-1.5 rounded-md text-xs font-bold transition-all text-gray-400 hover:text-white">
              Insumos
            </button>
            <button type="button" (click)="activeTab = 'products'" 
                    [class.bg-green-600_20]="activeTab === 'products'"
                    [class.text-green-500]="activeTab === 'products'"
                    class="px-4 py-1.5 rounded-md text-xs font-bold transition-all text-gray-400 hover:text-white">
              Productos
            </button>
          </div>

          <button type="button" (click)="openAddModal()" 
                  class="px-4 py-2 border rounded-lg text-sm transition-colors flex items-center font-bold text-gray-200 border-gray-700 hover:bg-gray-800">
            <lucide-icon name="plus" class="w-4 h-4 mr-1"></lucide-icon> Nuevo {{ activeTab === 'ingredients' ? 'Insumo' : 'Producto' }}
          </button>
        </div>
      </div>

      <div class="flex-grow overflow-auto custom-scrollbar">
        
        <!-- INGREDIENTS TABLE -->
        <table *ngIf="activeTab === 'ingredients'" class="w-full text-left text-sm text-gray-400 animate-fade-in">
          <thead class="bg-black/40 text-xs uppercase font-mono tracking-wider sticky top-0 backdrop-blur-md">
            <tr>
              <th class="p-3 rounded-tl-lg">Item</th>
              <th class="p-3">Unidad</th>
              <th class="p-3 text-right">Costo Unit.</th>
              <th class="p-3 text-right">Stock</th>
              <th class="p-3 text-center rounded-tr-lg">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            @for (item of (inventoryService.inventory$ | async); track item.id) {
              <tr class="hover:bg-gray-800/30 transition-colors group">
                <td class="p-3 font-medium text-gray-200">{{ item.name }}</td>
                <td class="p-3 text-xs">{{ item.unit }}</td>
                <td class="p-3 text-right font-mono">{{ item.unitCost | clp }}</td>
                <td class="p-3 text-right font-bold" [class.text-red-500]="item.quantity <= item.minStock" [class.text-green-500]="item.quantity > item.minStock">
                  {{ item.quantity }}
                </td>
                <td class="p-3 text-center">
                  <span *ngIf="item.quantity <= item.minStock" class="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-red-900/30 text-red-500 border border-red-500/20">BAJO STOCK</span>
                  <span *ngIf="item.quantity > item.minStock" class="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-green-900/30 text-green-500 border border-green-500/20">OPTIMO</span>
                </td>
              </tr>
            }
          </tbody>
        </table>

         <!-- PRODUCTS TABLE -->
        <table *ngIf="activeTab === 'products'" class="w-full text-left text-sm text-gray-400 animate-fade-in">
          <thead class="bg-black/40 text-xs uppercase font-mono tracking-wider sticky top-0 backdrop-blur-md">
            <tr>
              <th class="p-3 rounded-tl-lg">Imagen</th>
              <th class="p-3">Nombre</th>
              <th class="p-3">Categoría</th>
              <th class="p-3 text-right">Precio</th>
              <th class="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            @for (product of (products$ | async); track product.id) {
              <tr class="hover:bg-gray-800/30 transition-colors group">
                <td class="p-3">
                    <img [src]="product.image" class="w-10 h-10 rounded object-cover border border-white/10">
                </td>
                <td class="p-3 font-medium text-gray-200">
                    <input [(ngModel)]="product.name" class="bg-transparent border-none focus:ring-0 w-full hover:bg-white/5 p-1 rounded">
                </td>
                <td class="p-3 text-xs">
                    <span class="px-2 py-1 rounded bg-white/5 text-gray-300">{{ product.category }}</span>
                </td>
                <td class="p-3 text-right font-mono font-bold text-[#22c55e]">
                    <div class="flex items-center justify-end gap-1">
                        $ <input type="number" [(ngModel)]="product.price" class="bg-transparent border-b border-white/10 w-20 text-right focus:border-[#22c55e] outline-none">
                    </div>
                </td>
                <td class="p-3 text-right">
                    <button class="text-xs text-red-500 hover:text-red-400">Eliminar</button>
                    <!-- In real app, Save button logic -->
                </td>
              </tr>
            }
          </tbody>
        </table>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class InventoryComponent {
  inventoryService = inject(InventoryService);
  shopService = inject(ShopService);

  activeTab: 'ingredients' | 'products' = 'ingredients';
  products$: Observable<Product[]>;

  constructor() {
    this.products$ = this.shopService.getProducts();
  }

  openAddModal() {
    alert('Esta funcionalidad abriría el modal de "Agregar ' + (this.activeTab === 'ingredients' ? 'Insumo' : 'Producto') + '"');
  }
}
