import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideIconComponent } from '../shared/components/lucide-icon.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideIconComponent],
    template: `
    <div class="min-h-screen bg-[#050505] text-gray-100 font-sans flex flex-col md:flex-row">
        <!-- Sidebar Navigation -->
        <nav class="w-full md:w-24 bg-black border-r border-gray-900 p-4 flex md:flex-col items-center justify-between md:justify-start gap-6 sticky top-0 z-50 h-auto md:h-screen">
            <!-- Brand -->
            <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(22,163,74,0.4)] mb-4 hidden md:flex">
                 <lucide-icon name="cpu" class="text-white w-6 h-6"></lucide-icon>
            </div>

            <div class="flex md:flex-col gap-6 w-full justify-around md:justify-start px-2">
               <a routerLink="/admin/dashboard" routerLinkActive="text-green-400 bg-green-900/10 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" class="p-3 rounded-xl text-gray-400 border border-gray-800 hover:text-green-300 hover:border-green-500/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.1)] transition-all duration-300 flex flex-col items-center group">
                    <lucide-icon name="home" class="group-hover:scale-110 transition-transform"></lucide-icon>
                    <span class="text-[9px] mt-1 font-mono uppercase tracking-widest">Dash</span>
               </a>
               <a routerLink="/admin/sales" routerLinkActive="text-blue-400 bg-blue-900/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" class="p-3 rounded-xl text-gray-400 border border-gray-800 hover:text-blue-300 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.1)] transition-all duration-300 flex flex-col items-center group">
                    <lucide-icon name="wallet" class="group-hover:scale-110 transition-transform"></lucide-icon>
                    <span class="text-[9px] mt-1 font-mono uppercase tracking-widest">Venta</span>
               </a>
               <a routerLink="/admin/inventory" routerLinkActive="text-yellow-400 bg-yellow-900/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" class="p-3 rounded-xl text-gray-400 border border-gray-800 hover:text-yellow-300 hover:border-yellow-500/50 hover:shadow-[0_0_10px_rgba(234,179,8,0.1)] transition-all duration-300 flex flex-col items-center group">
                    <lucide-icon name="package" class="group-hover:scale-110 transition-transform"></lucide-icon>
                    <span class="text-[9px] mt-1 font-mono uppercase tracking-widest">Stock</span>
               </a>
               <a routerLink="/admin/recipes" routerLinkActive="text-purple-400 bg-purple-900/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]" class="p-3 rounded-xl text-gray-400 border border-gray-800 hover:text-purple-300 hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.1)] transition-all duration-300 flex flex-col items-center group">
                    <lucide-icon name="chef-hat" class="group-hover:scale-110 transition-transform"></lucide-icon>
                    <span class="text-[9px] mt-1 font-mono uppercase tracking-widest">Receta</span>
               </a>
            </div>

            <div class="mt-auto hidden md:block">
                 <div class="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                    S
                 </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-grow h-screen overflow-hidden flex flex-col">
            <!-- Header (Mobile/Desktop) -->
            <header class="h-16 border-b border-gray-900/50 bg-black/20 backdrop-blur flex items-center px-8 justify-between shrink-0">
                <h1 class="text-xl font-black tracking-tighter uppercase">Sentinel <span class="text-green-500">ERP</span> <span class="text-[9px] font-mono text-gray-500 ml-2 tracking-widest hidden sm:inline-block">DARK KITCHEN INTELLIGENCE</span></h1>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="text-[10px] font-mono text-green-500/80">SYSTEM ONLINE</span>
                    </div>
                    <button (click)="logout()" class="text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white border border-gray-800 px-3 py-2 rounded-lg transition-colors">
                        Salir
                    </button>
                </div>
            </header>

            <div class="flex-grow overflow-hidden p-4 md:p-8 relative">
                <router-outlet></router-outlet>
            </div>
        </main>
    </div>
  `
})
export class AdminLayoutComponent {
    constructor(private router: Router) { }

    logout() {
        localStorage.removeItem('admin_token');
        this.router.navigate(['/admin/login']);
    }
}
