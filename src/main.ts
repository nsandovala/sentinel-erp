import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { provideAuth } from '@angular/fire/auth';
import { getFirestore } from 'firebase/firestore';
import { provideFirestore } from '@angular/fire/firestore';

// Routes
import { DashboardComponent } from './app/features/dashboard/dashboard.component';
import { SalesComponent } from './app/features/sales/sales.component';
import { InventoryComponent } from './app/features/inventory/inventory.component';
import { RecipesComponent } from './app/features/recipes/recipes.component';

// Guards
import { AuthGuard } from './app/core/guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'shop', pathMatch: 'full' }, // Home is Shop
    { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.module').then(m => m.AuthModule) },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard] },
    { path: 'shop', loadChildren: () => import('./app/features/shop/shop.module').then(m => m.ShopModule) },
];

// Firebase Config Placeholder (Replace with process.env or actual config)
const firebaseConfig = {
    // User should reinject their config here
    authDomain: "dark-kitchen-erp.firebaseapp.com",
    projectId: "dark-kitchen-erp",
};

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        // Firebase Providers Temporarily Disabled for Offline Demo Mode
        // provideFirebaseApp(() => initializeApp(firebaseConfig)),
        // provideAuth(() => getAuth()),
        // provideFirestore(() => getFirestore())
    ]
}).catch(err => console.error(err));
