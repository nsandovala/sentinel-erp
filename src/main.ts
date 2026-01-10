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
import { AdminLayoutComponent } from './app/layouts/admin-layout.component';
import { PublicLayoutComponent } from './app/layouts/public-layout.component';

// Guards
import { AuthGuard } from './app/core/guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'shop', pathMatch: 'full' },
    { path: 'login', redirectTo: 'admin/login', pathMatch: 'full' },
    { path: 'auth', redirectTo: 'admin/login', pathMatch: 'full' },

    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: 'shop', loadChildren: () => import('./app/features/shop/shop.module').then(m => m.ShopModule) }
        ]
    },
    {
        path: 'admin',
        children: [
            { path: 'login', loadChildren: () => import('./app/features/auth/auth.module').then(m => m.AuthModule) },
            {
                path: '',
                component: AdminLayoutComponent,
                canActivate: [AuthGuard],
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'sales', component: SalesComponent },
                    { path: 'inventory', component: InventoryComponent },
                    { path: 'recipes', component: RecipesComponent }
                ]
            }
        ]
    },

    { path: 'dashboard', redirectTo: 'admin/dashboard', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'admin/sales', pathMatch: 'full' },
    { path: 'inventory', redirectTo: 'admin/inventory', pathMatch: 'full' },
    { path: 'recipes', redirectTo: 'admin/recipes', pathMatch: 'full' }
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
