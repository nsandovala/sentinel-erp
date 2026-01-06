import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopComponent } from './shop.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ChatbotWidgetComponent } from './components/chatbot-widget/chatbot-widget.component';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { ShopService } from './services/shop.service';
import { LucideAngularModule, ShoppingCart, MessageCircle, X, Plus, Minus, Search, Menu, CheckCircle, Truck, CreditCard, Wallet, ChevronRight } from 'lucide-angular';

const routes: Routes = [
    { path: '', component: ShopComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'status/:id', component: OrderStatusComponent }
];

@NgModule({
    declarations: [
        ShopComponent,
        ProductCardComponent,
        CartWidgetComponent,
        CheckoutComponent,
        OrderStatusComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ChatbotWidgetComponent, // Chatbot is standalone
        RouterModule.forChild(routes),
        LucideAngularModule.pick({ ShoppingCart, MessageCircle, X, Plus, Minus, Search, Menu, CheckCircle, Truck, CreditCard, Wallet, ChevronRight })
    ],
    providers: [ShopService]
})
export class ShopModule { }
