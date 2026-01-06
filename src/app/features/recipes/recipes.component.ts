import { Component, inject, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { InventoryService } from '../inventory/services/inventory.service';
import { FormsModule } from '@angular/forms';
import { Recipe, RecipeIngredient, InventoryItem } from '../../core/models/core.models';

@Component({
    selector: 'app-recipes',
    standalone: true,
    imports: [CommonModule, LucideIconComponent, AsyncPipe, FormsModule],
    template: `
    <div class="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- List of Recipes -->
        <div class="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 overflow-hidden flex flex-col">
            <h2 class="text-xl font-bold text-gray-200 mb-4 flex items-center">
                <lucide-icon name="chef-hat" class="mr-2 text-purple-500"></lucide-icon> Escandallos (Recetas)
            </h2>
            <div class="flex-grow overflow-y-auto space-y-3">
                 @for (recipe of (inventoryService.recipes$ | async); track recipe.id) {
                     <div class="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer">
                        <div class="flex justify-between mb-2">
                             <span class="font-bold text-white">{{ recipe.productName }}</span>
                             <span class="text-xs font-mono text-purple-400">ID: {{ recipe.id }}</span>
                        </div>
                        <div class="space-y-1">
                            @for (ing of recipe.ingredients; track ing.inventoryItemId) {
                                <div class="flex justify-between text-xs text-gray-400">
                                    <span>• {{ ing.name }}</span>
                                    <span>{{ ing.quantityRequired }} u</span>
                                </div>
                            }
                        </div>
                     </div>
                 }
            </div>
        </div>

        <!-- Recipe Editor (Simple Version) -->
        <div class="bg-black/60 border border-gray-800 rounded-2xl p-6">
             <h3 class="text-gray-400 text-xs font-mono uppercase tracking-widest mb-4">Nueva Receta</h3>
             
             <div class="space-y-4">
                <div>
                    <label class="block text-xs text-gray-500 mb-1">ID Producto (Venta)</label>
                    <input [(ngModel)]="newRecipe.id" type="text" class="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" placeholder="ej: burger_classic">
                </div>
                <div>
                    <label class="block text-xs text-gray-500 mb-1">Nombre Producto</label>
                    <input [(ngModel)]="newRecipe.productName" type="text" class="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" placeholder="ej: Burger Clásica">
                </div>

                <div class="border-t border-gray-800 pt-4">
                    <label class="block text-xs text-purple-400 mb-2">Ingredientes</label>
                    <!-- Ingredient Adder Mock -->
                    <div class="flex gap-2 mb-4">
                         <select #ingSelect class="bg-gray-900 border border-gray-700 rounded p-2 text-white text-xs flex-grow">
                            <option value="">Seleccionar Insumo...</option>
                            @for (item of (inventoryService.inventory$ | async); track item.id) {
                                <option [value]="item.id" [attr.data-name]="item.name">{{ item.name }} ({{item.unit}})</option>
                            }
                         </select>
                         <input #qtyInput type="number" class="w-20 bg-gray-900 border border-gray-700 rounded p-2 text-white text-xs" placeholder="Cant.">
                         <button (click)="addIngredient(ingSelect.value, ingSelect.options[ingSelect.selectedIndex].text, qtyInput.value)" class="p-2 bg-purple-600 rounded text-white hover:bg-purple-500">
                            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                         </button>
                    </div>

                    <div class="space-y-2 mb-4">
                        @for (ing of newRecipe.ingredients; track ing.inventoryItemId) {
                             <div class="flex justify-between text-sm bg-gray-800 p-2 rounded border border-gray-700">
                                <span class="text-gray-300">{{ ing.name }}</span>
                                <span class="font-mono text-purple-300">{{ ing.quantityRequired }}</span>
                            </div>
                        }
                    </div>
                </div>

                <button (click)="saveRecipe()" class="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all">
                    GUARDAR ESCANDALLO
                </button>
             </div>
        </div>
    </div>
  `
})
export class RecipesComponent {
    inventoryService = inject(InventoryService);

    newRecipe: Recipe = {
        id: '',
        productName: '',
        sellingPrice: 0,
        ingredients: []
    };

    addIngredient(id: string, name: string, qty: string) {
        if (!id || !qty) return;
        // Clean name (remove unit part from option text logic if needed)
        this.newRecipe.ingredients.push({
            inventoryItemId: id,
            name: name,
            quantityRequired: Number(qty)
        });
    }

    async saveRecipe() {
        if (!this.newRecipe.id) return;
        try {
            // Using ID as doc ID implies we use setDoc, generic addData implies auto-ID.
            // Let's assume we use addData but ideally should be setDoc(recipe.id)
            // For now, prototype flexibility:
            await this.inventoryService.addData('recipes', this.newRecipe);
            this.newRecipe = { id: '', productName: '', sellingPrice: 0, ingredients: [] };
            alert("Receta Guardada");
        } catch (e) {
            console.error(e);
        }
    }
}
