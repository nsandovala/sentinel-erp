import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isNew?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

@Injectable()
export class ShopService {
    private products: Product[] = [
        // MULTIVERSO BURGERS
        {
            id: 'vader-burger',
            name: 'Vader Burger',
            description: 'Burger con salteado de verduras legendario, carne con receta exclusiva de la abuela, salsa verde y condimentos oscuros. La fuerza está con ella.',
            price: 5990,
            image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1742&auto=format&fit=crop',
            category: 'burgers',
            isNew: true
        },
        {
            id: 'burger-cheddar',
            name: 'Burger Cheddar',
            description: 'Burger con queso cheddar artesanal, lechuga y salsa verde. El equilibrio perfecto entre intensidad y frescura.',
            price: 5900,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop',
            category: 'burgers'
        },
        {
            id: 'burger-imperial',
            name: 'Burger Imperial',
            description: 'Triple burger con queso cheddar artesanal, tomate limachino, lechuga litoral y salsa verde. Tan poderosa que no cabe en la caja. Solo para titanes del hambre.',
            price: 6990,
            image: 'https://images.unsplash.com/photo-1615255476020-0382029731a5?q=80&w=1711&auto=format&fit=crop',
            category: 'burgers'
        },
        {
            id: 'burger-italianni',
            name: 'Burger Italianni',
            description: 'Burger con mayonesa casera, tomate limachino y palta Hass. Clásica, pero con carácter.',
            price: 6190,
            image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=1587&auto=format&fit=crop',
            category: 'burgers'
        },
        {
            id: 'shenlong-burger',
            name: 'Shenlong Burger',
            description: 'Doble burger con doble queso cheddar artesanal, cebolla morada con toque de pimienta, salsa verde y lechuga. Invoca tu deseo al primer mordisco.',
            price: 6750,
            image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1668&auto=format&fit=crop',
            category: 'burgers',
            isNew: true
        },

        // MULTIVERSO MECHADAS
        {
            id: 'black-mechada',
            name: 'Black Mechada',
            description: 'La mechada con el sabor de la resistencia. Mechada con cebolla morada frita, pimienta negra, palta, queso cheddar artesanal y salsa verde.',
            price: 6250,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1760&auto=format&fit=crop',
            category: 'mechadas'
        },
        {
            id: 'super-mechada-z',
            name: 'Super Mechada Z',
            description: 'La mechada que inició la leyenda. Posta paleta cocinada a fuego lento. Coronada con la salsa verde legendaria de la abuela. Validada desde Playa Ancha al sur.',
            price: 4600,
            image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1586&auto=format&fit=crop',
            category: 'mechadas'
        },
        {
            id: 'mechada-cheddaron',
            name: 'Mechada Cheddaron',
            description: 'El guerrero dorado del multiverso lácteo. Mechada con queso cheddar artesanal, lechuga y salsa verde. Sabor tan armónico que calma conflictos entre dimensiones.',
            price: 4750,
            image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?q=80&w=1586&auto=format&fit=crop',
            category: 'mechadas'
        },
        {
            id: 'chacarero-prime',
            name: 'Chacarero Prime',
            description: 'Sabores del campo con poder de otro planeta. Mechada con mayo casera con ajo, porotos verdes del Maipo, tomate limachino, ajo verde con aceite de oliva y pimienta negra.',
            price: 5650,
            image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?q=80&w=1740&auto=format&fit=crop',
            category: 'mechadas'
        },
        {
            id: 'mechada-italiana-3000',
            name: 'Mechada Italiana 3000',
            description: 'La mechada del futuro donde la palta es verde como un lingote. Mechada con palta Hass, mayonesa casera, tomate limachino.',
            price: 5500,
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1740&auto=format&fit=crop',
            category: 'mechadas'
        },
        {
            id: 'mechada-pobre-poderosa',
            name: 'Mechada Pobre Pero Poderosa',
            description: 'Simple pero contundente. Para los que saben lo que quieren.',
            price: 5950,
            image: 'https://images.unsplash.com/photo-1544025162-d7669d265634?q=80&w=1669&auto=format&fit=crop',
            category: 'mechadas'
        },

        // PAPAS LEGEND
        {
            id: 'papas-kaioken',
            name: 'Papas Kaioken',
            description: 'Crujientes, sabrosas y potenciadas con la receta de la abuela. Sal calibrada y fritura precisa. El acompañamiento que eleva tu ki.',
            price: 2000,
            image: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?q=80&w=1586&auto=format&fit=crop',
            category: 'sides'
        },

        // BEBIDAS
        {
            id: 'coca-cola-lata',
            name: 'Coca-Cola Lata 350ml',
            description: 'Refrescante y clásica.',
            price: 1500,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1740&auto=format&fit=crop',
            category: 'drinks'
        }
    ];
    private cart = new BehaviorSubject<CartItem[]>([]);

    constructor() { }

    getProducts(): Observable<Product[]> {
        return of(this.products);
    }

    getCart(): Observable<CartItem[]> {
        return this.cart.asObservable();
    }

    getCartCount(): Observable<number> {
        const rawCart = this.cart.value;
        const count = rawCart.reduce((acc, item) => acc + item.quantity, 0);
        return of(count); // In real app, map from subject
    }

    addToCart(product: Product) {
        const currentCart = this.cart.value;
        const existingItem = currentCart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
            this.cart.next([...currentCart]);
        } else {
            this.cart.next([...currentCart, { ...product, quantity: 1 }]);
        }
    }

    removeFromCart(productId: string) {
        const currentCart = this.cart.value;
        const updatedCart = currentCart.filter(item => item.id !== productId);
        this.cart.next(updatedCart);
    }
}
