export interface Sale {
    id: string;
    amount: number;
    description?: string;
    date: any; // Firestore Timestamp
    items?: SaleItem[]; // Details for Escandallos
}

export interface SaleItem {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface Expense {
    id: string;
    amount: number;
    description?: string;
    category?: string;
    date: any;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unitCost: number;
    unit: string; // e.g., 'kg', 'units', 'liters'
    minStock: number;
}

export interface Recipe {
    id: string; // Should match the Product ID sold
    productName: string;
    sellingPrice: number;
    ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
    inventoryItemId: string;
    name: string; // Denormalized for easier display
    quantityRequired: number; // Qty per 1 unit of product
}

export interface AppMetrics {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    lowStockItems: InventoryItem[];
}
