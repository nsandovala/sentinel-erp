import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product, TBB_CATALOG } from '../../../data/catalog.tbb';

export { Product, TBB_CATALOG }; // Re-export for consumers

export interface CartItem extends Product {
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private products: Product[] = TBB_CATALOG;

    // Cart State
    private cart = new BehaviorSubject<CartItem[]>([]);

    // Observables
    items$ = this.cart.asObservable();

    total$ = this.items$.pipe(
        map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );

    constructor() { }

    getProducts(): Observable<Product[]> {
        // Return as observable to mimic API
        return new BehaviorSubject(this.products).asObservable();
    }

    getCartCount(): Observable<number> {
        return this.items$.pipe(
            map(items => items.reduce((count, item) => count + item.quantity, 0))
        );
    }

    addItem(product: Product) {
        const currentCart = this.cart.getValue();
        const existingItem = currentCart.find(item => item.id === product.id);

        if (existingItem) {
            this.updateQty(product.id, existingItem.quantity + 1);
        } else {
            this.cart.next([...currentCart, { ...product, quantity: 1 }]);
        }
    }

    removeItem(productId: string) {
        const currentCart = this.cart.getValue();
        this.cart.next(currentCart.filter(item => item.id !== productId));
    }

    updateQty(productId: string, qty: number) {
        if (qty <= 0) {
            this.removeItem(productId);
            return;
        }

        const currentCart = this.cart.getValue();
        const updatedCart = currentCart.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: qty };
            }
            return item;
        });

        this.cart.next(updatedCart);
    }

    clear() {
        this.cart.next([]);
    }

    // Compatibility methods
    getCart(): Observable<CartItem[]> {
        return this.items$;
    }

    addToCart(product: Product) {
        this.addItem(product);
    }
}
