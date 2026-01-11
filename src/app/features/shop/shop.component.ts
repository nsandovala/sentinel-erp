import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen text-white font-sans selection:bg-[#22c55e] selection:text-black">
      <!-- Header -->
      <header class="fixed top-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-white/5 rounded-full transition-colors">
              <span>Menu</span>
            </button>
            <div class="flex flex-col cursor-pointer">
              <h1 class="text-xl font-bold tracking-tight text-[#22c55e] font-display">THE BEST BURGER</h1>
              <span class="text-[10px] text-gray-400 tracking-wider uppercase">Dark Kitchen Premium</span>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <button class="p-2 hover:bg-white/5 rounded-full transition-colors relative">
              <span>Cart</span>
              <span class="absolute top-0 right-0 w-4 h-4 bg-[#22c55e] text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                0
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
              <button class="px-8 py-3 bg-[#22c55e] text-black font-bold rounded-full hover:bg-[#1ea850] transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20">
                Ver Menú
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Grid -->
      <section class="px-4 pb-24">
        <div class="container mx-auto">
          <h2 class="text-2xl font-bold mb-6">Nuestros Productos</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
              <h3 class="text-lg font-bold text-white">Producto de Ejemplo</h3>
              <p class="text-gray-400 text-sm">Descripción del producto.</p>
              <p class="text-[#22c55e] font-bold">$5.990</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export default class ShopComponent implements OnInit {
  ngOnInit() { 
    console.log('ShopComponent ngOnInit');
  }
}
