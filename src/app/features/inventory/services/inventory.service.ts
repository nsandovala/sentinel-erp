import { Injectable, inject, signal } from '@angular/core';
import { FirestoreService } from '../../../core/services/firestore.service';
import { InventoryItem, Recipe } from '../../../core/models/core.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private firestore = inject(FirestoreService);

    // Expose streams
    inventory$: Observable<InventoryItem[]> = this.firestore.getCollection<InventoryItem>('inventory');
    recipes$: Observable<Recipe[]> = this.firestore.getCollection<Recipe>('recipes');

    // Actions
    async addData<T>(col: 'inventory' | 'recipes', data: any) {
        return this.firestore.add(col, data);
    }

    async updateData<T>(col: 'inventory' | 'recipes', id: string, data: any) {
        return this.firestore.update(col, id, data);
    }

    async deleteData(col: 'inventory' | 'recipes', id: string) {
        return this.firestore.delete(col, id);
    }
}
