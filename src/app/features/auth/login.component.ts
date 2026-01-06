import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-login',
    template: `
    <div class="min-h-screen bg-black flex items-center justify-center font-sans">
      <div class="w-full max-w-md p-8 bg-[#121212] border border-gray-800 rounded-2xl relative overflow-hidden">
        
        <!-- Decorative Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent"></div>

        <div class="text-center mb-8">
           <div class="w-16 h-16 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#22c55e]/30">
             <lucide-icon name="lock" class="text-[#22c55e] w-8 h-8"></lucide-icon>
           </div>
           <h2 class="text-2xl font-bold text-white">Acceso Restringido</h2>
           <p class="text-gray-500 text-sm">Dark Kitchen Intelligence</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Usuario</label>
            <input type="text" [(ngModel)]="username" 
                   class="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[#22c55e] outline-none transition-colors">
          </div>
          <div>
            <label class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Contraseña</label>
            <input type="password" [(ngModel)]="password" (keyup.enter)="login()"
                   class="w-full bg-black border-gray-800 rounded-lg p-3 text-white focus:border-[#22c55e] outline-none transition-colors">
          </div>
          
          <button (click)="login()" 
                  class="w-full py-3 bg-[#22c55e] text-black font-bold rounded-lg hover:bg-[#1ea850] transition-all flex items-center justify-center gap-2 mt-4">
            Ingresar
            <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <p *ngIf="error" class="text-red-500 text-center text-sm mt-4 animate-shake">{{ error }}</p>

      </div>
    </div>
  `,
    styles: [`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
  `]
})
export class AdminLoginComponent {
    username = '';
    password = '';
    error = '';

    constructor(private router: Router) { }

    login() {
        // Hardcoded credentials as requested
        if (this.username === 'nandres.sandoval@gmail.com' && this.password === '1973') {
            localStorage.setItem('admin_token', 'valid');
            this.router.navigate(['/dashboard']);
        } else {
            this.error = 'Credenciales inválidas. Acceso denegado.';
        }
    }
}
