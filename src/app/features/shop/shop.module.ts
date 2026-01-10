import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from './services/shop.service';
import { LucideAngularModule, ShoppingCart, MessageCircle, X, Plus, Minus, Search, Menu, CheckCircle, Truck, CreditCard, Wallet, ChevronRight } from 'lucide-angular';

const routes: Routes = [
    { path: '', loadComponent: () => import('./shop.component').then(m => m.default) },
    { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
    { path: 'status/:id', loadComponent: () => import('./components/order-status/order-status.component').then(m => m.OrderStatusComponent) }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        LucideAngularModule.pick({ ShoppingCart, MessageCircle, X, Plus, Minus, Search, Menu, CheckCircle, Truck, CreditCard, Wallet, ChevronRight })
    ],
    providers: [ShopService]
})
export class ShopModule { }
