// Removed import to avoid circular dependency
// import { InventoryItem, Recipe, Sale, Expense } from './core.models';


export const MOCK_INVENTORY: any[] = [
    { id: 'inv_1', name: 'Pan Burger Brioche', quantity: 120, unitCost: 350, unit: 'unid', minStock: 20 },
    { id: 'inv_2', name: 'Carne Molida Premium', quantity: 15, unitCost: 4500, unit: 'kg', minStock: 10 },
    { id: 'inv_3', name: 'Queso Cheddar', quantity: 5, unitCost: 6000, unit: 'kg', minStock: 8 },
    { id: 'inv_4', name: 'Papas Prefritas', quantity: 50, unitCost: 1800, unit: 'kg', minStock: 25 },
    { id: 'inv_5', name: 'Salsa Especial', quantity: 2, unitCost: 2500, unit: 'lt', minStock: 5 },
];

export const MOCK_RECIPES: any[] = [
    {
        id: 'burger_classic',
        productName: 'Burger Clásica',
        sellingPrice: 8500,
        ingredients: [
            { inventoryItemId: 'inv_1', name: 'Pan Burger', quantityRequired: 1 },
            { inventoryItemId: 'inv_2', name: 'Carne Molida', quantityRequired: 0.150 }, // 150g
            { inventoryItemId: 'inv_3', name: 'Queso Cheddar', quantityRequired: 0.040 } // 40g
        ]
    },
    {
        id: 'fries_medium',
        productName: 'Papas Medianas',
        sellingPrice: 2500,
        ingredients: [
            { inventoryItemId: 'inv_4', name: 'Papas', quantityRequired: 0.250 }
        ]
    }
];

export const MOCK_SALES: any[] = [
    { id: 's1', amount: 8500, date: new Date(), description: 'Venta #1234' },
    { id: 's2', amount: 15500, date: new Date(), description: 'Venta #1235' },
    { id: 's3', amount: 2500, date: new Date(), description: 'Venta #1236' },
];

export const MOCK_EXPENSES: any[] = [
    { id: 'e1', amount: 50000, date: new Date(), category: 'Insumos', description: 'Compra Pan' },
    { id: 'e2', amount: 12000, date: new Date(), category: 'Servicios', description: 'Gas' },
];
