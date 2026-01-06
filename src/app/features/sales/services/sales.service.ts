import { Injectable, inject, signal } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { Sale, SaleItem, Recipe, InventoryItem } from '../../../core/models/core.models';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private firestore = inject(FirestoreService);

    // Cache recipes for speed (optional, could be a signal)
    recipes = signal<Recipe[]>([]);

    constructor() {
        this.loadCommonRecipes();
    }

    private loadCommonRecipes() {
        // In a real app, subscribe to this.firestore.getCollection<Recipe>('recipes')
        // For now, we simulate or assume they are loaded elsewhere
    }

    /**
     * Process a Sale Transaction
     * - Records the sale
     * - Deducts inventory based on Recipes (Escandallos)
     * - Cloud Function preferred, but Client-side Batch used here for prototype.
     */
    async processSale(saleItems: SaleItem[], totalAmount: number): Promise<void> {
        const batch = this.firestore.getBatch();

        // 1. Create Sale Entry
        const saleRef = this.firestore.getNewDocRef('sales');
        const saleData: Sale = {
            id: saleRef.id,
            amount: totalAmount,
            date: new Date(), // Firestore uses Timestamp but JS Date works with Converter usually
            items: saleItems
        };
        batch.set(saleRef, saleData);

        // 2. Process Escandallos (Inventory Deduction)
        // We need to fetch current inventory states to decrement correctly if we want to check negative stock here,
        // but Firestore 'increment(-val)' is atomic and safer for concurrency.

        // TODO: Optimize by fetching only relevant recipes
        const allRecipes = (await firstValueFrom(this.firestore.getCollection<Recipe>('recipes'))) as Recipe[];

        for (const item of saleItems) {
            const recipe = allRecipes.find(r => r.id === item.productId);

            if (recipe) {
                // Product has a recipe, deduct ingredients
                for (const ingredient of recipe.ingredients) {
                    const deductionAmount = ingredient.quantityRequired * item.quantity;
                    const invRef = this.firestore.getDocRef('inventory', ingredient.inventoryItemId);

                    // Use Firestore atomic increment (negative for deduction)
                    // Note: In a raw JS SDK we need 'increment' from firestore/lite or main
                    // Assuming FirestoreService can expose a helper or we import it here.
                    // For this snippet, I will implement a raw update via the service wrapper if possible,
                    // or just use standard update with current value (less safe but OK for single user prototype).

                    // BETTER: Use Firestore Atomic Increment
                    const { increment } = await import('firebase/firestore');
                    batch.update(invRef, {
                        quantity: increment(-deductionAmount)
                    });
                }
            } else {
                // Fallback: If item IS an inventory item directly (e.g. selling a Can of Soda)
                // Check if item.productId matches an inventory ID
                // This logic depends on business rules. For now, we assume sales are Recipes.
                console.warn(`No recipe found for product ${item.productId} (${item.name})`);
            }
        }

        // Uber Direct placeholder
        // this.uberDirectService.dispatchOrder(saleData);

        await batch.commit();
    }
}
