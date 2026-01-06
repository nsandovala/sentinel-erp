import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, docData, addDoc, setDoc, updateDoc, deleteDoc, writeBatch, query, where, Timestamp } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MOCK_INVENTORY, MOCK_RECIPES, MOCK_SALES, MOCK_EXPENSES } from '../models/mock-data';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore = inject(Firestore, { optional: true }); // Make Optional to prevent crash on invalid config
    private appId = 'dark-kitchen-erp-clp';

    private getPath(col: string): string {
        return `artifacts/${this.appId}/public/data/${col}`;
    }

    // Generic Collection Stream
    getCollection<T>(path: string): Observable<T[]> {
        if (!this.firestore) {
            console.warn(`Firestore not available (Mock Mode): Serving ${path}`);
            return of(this.getMockData(path) as T[]);
        }

        try {
            const colRef = collection(this.firestore, this.getPath(path));
            return (collectionData(colRef, { idField: 'id' }) as Observable<T[]>).pipe(
                catchError(err => {
                    console.error(`Firestore Error [${path}]:`, err);
                    return of(this.getMockData(path) as T[]);
                })
            );
        } catch (e) {
            console.error(`Firestore Init Failed [${path}]:`, e);
            return of(this.getMockData(path) as T[]);
        }
    }

    // Generic Doc Stream
    getDoc<T>(path: string, id: string): Observable<T | undefined> {
        if (!this.firestore) return of(undefined);
        const docRef = doc(this.firestore, this.getPath(path), id);
        return docData(docRef, { idField: 'id' }) as Observable<T>;
    }

    // Add Item
    async add(path: string, data: any): Promise<string> {
        if (!this.firestore) {
            console.log(`[MOCK] Added to ${path}:`, data);
            return 'mock_id_' + Date.now();
        }
        const colRef = collection(this.firestore, this.getPath(path));
        const res = await addDoc(colRef, { ...data, createdAt: Timestamp.now() });
        return res.id;
    }

    // Update Item
    async update(path: string, id: string, data: any): Promise<void> {
        if (!this.firestore) {
            console.log(`[MOCK] Updated ${path}/${id}:`, data);
            return;
        }
        const docRef = doc(this.firestore, this.getPath(path), id);
        await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
    }

    // Delete Item
    async delete(path: string, id: string): Promise<void> {
        if (!this.firestore) {
            console.log(`[MOCK] Deleted ${path}/${id}`);
            return;
        }
        const docRef = doc(this.firestore, this.getPath(path), id);
        await deleteDoc(docRef);
    }

    // Get Batch Instance
    getBatch() {
        if (!this.firestore) {
            // Return a Mock Batch object
            return {
                set: (ref: any, data: any) => console.log('[MOCK BATCH] Set', data),
                update: (ref: any, data: any) => console.log('[MOCK BATCH] Update', data),
                delete: (ref: any) => console.log('[MOCK BATCH] Delete'),
                commit: async () => console.log('[MOCK BATCH] Committed')
            } as any;
        }
        return writeBatch(this.firestore);
    }

    // Helper to get Doc Ref
    getDocRef(path: string, id: string) {
        if (!this.firestore) return { id } as any; // Mock Ref
        return doc(this.firestore, this.getPath(path), id);
    }

    // Helper to get New Doc Ref
    getNewDocRef(path: string) {
        if (!this.firestore) return { id: 'mock_auto_id_' + Date.now() } as any;
        return doc(collection(this.firestore, this.getPath(path)));
    }

    private getMockData(path: string): any[] {
        switch (path) {
            case 'inventory': return MOCK_INVENTORY;
            case 'recipes': return MOCK_RECIPES;
            case 'sales': return MOCK_SALES;
            case 'expenses': return MOCK_EXPENSES;
            default: return [];
        }
    }
}
