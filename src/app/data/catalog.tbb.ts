export type Category = 'BURGERS' | 'MECHADAS' | 'PAPAS' | 'BEBIDAS' | 'COMBOS';

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: Category;
    tags?: string[];
    image?: string;
    active?: boolean;
    isNew?: boolean;
}

export const TBB_CATALOG: Product[] = [
    // BURGERS
    {
        id: 'vader_burger',
        name: 'Vader Burger',
        price: 5990,
        description: 'Burger con salteado de verduras legendario, carne con receta exclusiva de la abuela, salsa verde y condimentos oscuros. La fuerza está con ella.',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1742&auto=format&fit=crop'
    },
    {
        id: 'burger_cheddar',
        name: 'Burger Cheddar',
        price: 5900,
        description: 'Burger con queso cheddar artesanal, lechuga y salsa verde. El equilibrio perfecto entre intensidad y frescura.',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop'
    },
    {
        id: 'burger_imperial',
        name: 'Burger Imperial',
        price: 6990,
        description: 'Triple burger con queso cheddar artesanal, tomate limachino, lechuga litoral y salsa verde. Tan poderosa que no cabe en la caja. Solo para titanes del hambre.',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1615255476020-0382029731a5?q=80&w=1711&auto=format&fit=crop'
    },
    {
        id: 'burger_italianni',
        name: 'Burger Italianni',
        price: 6190,
        description: 'Burger con mayonesa casera, tomate limachino y palta Hass. Clásica, pero con carácter.',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?q=80&w=1587&auto=format&fit=crop'
    },
    {
        id: 'shenlong_burger',
        name: 'Shenlong Burger',
        price: 6750,
        description: 'Doble burger con doble queso cheddar artesanal, cebolla morada con toque de pimienta, salsa verde y lechuga. Invoca tu deseo al primer mordisco.',
        category: 'BURGERS',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1668&auto=format&fit=crop'
    },

    // MECHADAS
    {
        id: 'black_mechada',
        name: 'Black Mechada',
        price: 6250,
        description: 'La mechada con el sabor de la resistencia. Mechada con cebolla morada frita, pimienta negra, palta, queso cheddar artesanal y salsa verde.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1760&auto=format&fit=crop'
    },
    {
        id: 'super_mechada_z',
        name: 'Super Mechada Z',
        price: 4600,
        description: 'La mechada que inició la leyenda. Posta paleta cocinada a fuego lento, coronada con salsa verde legendaria de la abuela (huevo, ajo, aceite maravilla, cilantro). Validada desde Playa Ancha hasta el sur de Chile.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1586&auto=format&fit=crop'
    },
    {
        id: 'mechada_cheddaron',
        name: 'Mechada Cheddaron',
        price: 4750,
        description: 'El guerrero dorado del multiverso lácteo. Mechada con queso cheddar artesanal, lechuga y salsa verde.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?q=80&w=1586&auto=format&fit=crop'
    },
    {
        id: 'chacarero_prime',
        name: 'Chacarero Prime',
        price: 5650,
        description: 'Sabores del campo con poder de otro planeta. Mechada con mayo casera con ajo, porotos verdes, tomate limachino, ajo verde con aceite de oliva y pimienta negra.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?q=80&w=1740&auto=format&fit=crop'
    },
    {
        id: 'mechada_italiana_3000',
        name: 'Mechada Italiana 3000',
        price: 5500,
        description: 'La mechada del futuro donde la palta es verde como un lingote. Mechada con palta Hass, mayonesa casera, tomate limachino.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1740&auto=format&fit=crop'
    },
    {
        id: 'mechada_pobre_poderosa',
        name: 'Mechada Pobre Pero Poderosa',
        price: 5950,
        description: 'Simple pero contundente. Para los que saben lo que quieren.',
        category: 'MECHADAS',
        image: 'https://images.unsplash.com/photo-1544025162-d7669d265634?q=80&w=1669&auto=format&fit=crop'
    },

    // PAPAS
    {
        id: 'papas_kaioken',
        name: 'Papas Kaioken',
        price: 2000,
        description: 'Crujientes, sabrosas y potenciadas con la receta de la abuela. El acompañamiento que eleva tu ki.',
        category: 'PAPAS',
        image: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?q=80&w=1586&auto=format&fit=crop'
    },

    // BEBIDAS
    {
        id: 'coca_cola_350',
        name: 'Coca-Cola Lata 350ml',
        price: 1500,
        description: 'Bebida oficial. Fría. Directa. Sin debate.',
        category: 'BEBIDAS',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1740&auto=format&fit=crop'
    }
];
