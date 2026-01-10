import { Component, OnInit } from '@angular/core';
import { ShopService } from './services/shop.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartWidgetComponent } from './components/cart-widget/cart-widget.component';
import { ChatbotWidgetComponent } from './components/chatbot-widget/chatbot-widget.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, ProductCardComponent, CartWidgetComponent, ChatbotWidgetComponent],
  template: `
    <div class="min-h-screen text-white font-sans selection:bg-[#22c55e] selection:text-black">
      <!-- Side Menu -->
      <div *ngIf="isMenuOpen" class="fixed inset-0 z-[60] flex">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="toggleMenu()"></div>
        <div class="relative w-64 bg-[#1a1a1a] h-full shadow-2xl p-6 flex flex-col animate-slide-in">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-[#22c55e]">MENÚ</h2>
            <button (click)="toggleMenu()"><lucide-icon name="x" class="text-gray-400"></lucide-icon></button>
          </div>
          <nav class="space-y-4">
             <a (click)="setCategory('all'); toggleMenu()" class="block text-lg font-medium hover:text-[#22c55e] cursor-pointer">Inicio</a>
             <a (click)="setCategory('BURGERS'); toggleMenu()" class="block text-lg font-medium hover:text-[#22c55e] cursor-pointer">Burgers</a>
             <a (click)="setCategory('MECHADAS'); toggleMenu()" class="block text-lg font-medium hover:text-[#22c55e] cursor-pointer">Mechadas</a>
             <a (click)="toggleMenu()" routerLink="/login" class="block text-lg font-medium text-gray-500 hover:text-white cursor-pointer mt-8 pt-8 border-t border-white/10">Admin Login</a>
          </nav>
        </div>
      </div>

      <!-- Header -->
      <header class="fixed top-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button (click)="toggleMenu()" class="p-2 hover:bg-white/5 rounded-full transition-colors">
              <lucide-icon name="menu" class="w-6 h-6"></lucide-icon>
            </button>
            <div class="flex flex-col cursor-pointer" (click)="setCategory('all')">
              <h1 class="text-xl font-bold tracking-tight text-[#22c55e] font-display">THE BEST BURGER</h1>
              <span class="text-[10px] text-gray-400 tracking-wider uppercase">Dark Kitchen Premium</span>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-white/5 rounded-full transition-colors relative" (click)="toggleCart()">
              <lucide-icon name="shopping-cart" class="w-6 h-6"></lucide-icon>
              <span *ngIf="(cartCount$ | async) as count" 
                    class="absolute top-0 right-0 w-4 h-4 bg-[#22c55e] text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                {{ count }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="pt-24 pb-12 px-4">
        <div class="container mx-auto">
          <div class="relative rounded-3xl overflow-hidden h-64 md:h-[400px] w-full group shadow-2xl shadow-[#22c55e]/10">
            <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1742&auto=format&fit=crop" 
                 class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hero Burger">
            <div class="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 md:p-10 max-w-xl">
              <span class="px-3 py-1 bg-[#22c55e] text-black text-xs font-bold rounded-full mb-4 inline-block tracking-wider">NUEVO LANZAMIENTO</span>
              <h2 class="text-4xl md:text-6xl font-black mb-4 leading-tight">Vader <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-emerald-600">Burger</span></h2>
              <p class="text-gray-300 text-sm md:text-lg mb-6 leading-relaxed">La fuerza está con ella. Carne con receta exclusiva de la abuela, salsa verde y condimentos oscuros.</p>
              <button (click)="setCategory('BURGERS')" class="px-8 py-3 bg-[#22c55e] text-black font-bold rounded-full hover:bg-[#1ea850] transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20">
                Ver Menú
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="px-4 mb-8 sticky top-16 z-40 bg-[#121212]/95 backdrop-blur-md py-4 border-b border-white/5">
        <div class="container mx-auto overflow-x-auto custom-scrollbar no-scrollbar">
          <div class="flex gap-3 min-w-max md:justify-center">
            <button *ngFor="let cat of categories" 
                    (click)="setCategory(cat.id)"
                    [ngClass]="selectedCategory === cat.id ? 'bg-[#22c55e] text-black scale-105' : 'bg-[#1a1a1a] text-white hover:bg-white/10'"
                    class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border border-white/5 shadow-sm">
              {{ cat.name }}
            </button>
          </div>
        </div>
      </section>

      <!-- Product Grid -->
      <section class="px-4 pb-24">
        <!-- Product Grid -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          @if ((filteredProducts$ | async)?.length === 0) {
              <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                  <lucide-icon name="package" class="w-16 h-16 mb-4 opacity-50"></lucide-icon>
                  <p class="text-xl">No hay productos</p>
              </div>
          }

          @for (product of filteredProducts$ | async; track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </section>

      <!-- Components -->
      <app-cart-widget *ngIf="isCartOpen" (close)="toggleCart()"></app-cart-widget>
      <app-chatbot-widget></app-chatbot-widget>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ShopComponent implements OnInit {
  categories = [
    { id: 'all', name: 'Todo' },
    { id: 'BURGERS', name: 'Burgers' },
    { id: 'MECHADAS', name: 'Mechadas' },
    { id: 'PAPAS', name: 'Papas Legend' },
    { id: 'BEBIDAS', name: 'Bebidas' }
  ];

  isMenuOpen = false;

  private category$ = new BehaviorSubject<string>('all');
  selectedCategory = 'all';

  isCartOpen = false;
  filteredProducts$: Observable<any[]>;
  cartCount$: Observable<number>;

  constructor(private shopService: ShopService) {
    console.log('ShopComponent Initialized - Loading Catalog...');
    this.cartCount$ = this.shopService.getCartCount();

    // Use ShopService to get products
    const products$ = this.shopService.getProducts();

    // Combine products with category filter
    this.filteredProducts$ = combineLatest([
      products$,
      this.category$
    ]).pipe(
      map(([products, category]) => {
        if (category === 'all') return products;
        return products.filter(p => p.category === category);
      })
    );
  }

  ngOnInit() { 
    console.log('ShopComponent ngOnInit - Products loaded:', this.filteredProducts$);
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isCartOpen = false;
  }

  setCategory(catId: string) {
    this.selectedCategory = catId;
    this.category$.next(catId);
  }
}
