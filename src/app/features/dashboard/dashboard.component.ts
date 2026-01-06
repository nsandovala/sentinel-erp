import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { ClpPipe } from '../../shared/pipes/clp.pipe';
import { GeminiService } from '../../core/services/gemini.service';
import { InventoryService } from '../inventory/services/inventory.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Sale, Expense, AppMetrics } from '../../core/models/core.models';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LucideIconComponent, ClpPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="h-full overflow-y-auto custom-scrollbar p-1">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <!-- KPIs -->
            <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Net Profit -->
                <div class="p-6 rounded-2xl border border-green-500/20 bg-gray-900/40 backdrop-blur-xl hover:border-green-500/40 transition-all group">
                    <h4 class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Utilidad Operativa</h4>
                    <p class="text-3xl font-black tracking-tight" [class.text-green-400]="metrics().netProfit >= 0" [class.text-red-400]="metrics().netProfit < 0">
                        {{ metrics().netProfit | clp }}
                    </p>
                    <div class="mt-2 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500 animate-pulse" [style.width.%]="75"></div>
                    </div>
                </div>
                
                <!-- Revenue -->
                <div class="p-6 rounded-2xl border border-blue-500/20 bg-gray-900/40 backdrop-blur-xl">
                    <h4 class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Ventas Brutas</h4>
                    <p class="text-2xl font-bold text-blue-400">{{ metrics().totalRevenue | clp }}</p>
                </div>

                <!-- Expenses -->
                <div class="p-6 rounded-2xl border border-red-500/20 bg-gray-900/40 backdrop-blur-xl">
                    <h4 class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Gastos Totales</h4>
                    <p class="text-2xl font-bold text-red-400">{{ metrics().totalExpenses | clp }}</p>
                </div>

                <!-- Low Stock Alert -->
                <div class="md:col-span-3 p-8 rounded-2xl border border-yellow-500/20 bg-gray-900/40 min-h-[150px]">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="text-xl font-black text-yellow-400 flex items-center tracking-tighter uppercase italic">
                            <lucide-icon name="alert-triangle" class="w-6 h-6 mr-2"></lucide-icon> Quiebre de Stock
                        </h4>
                    </div>
                    
                    @if (metrics().lowStockItems.length > 0) {
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            @for (item of metrics().lowStockItems; track item.id) {
                                <div class="flex flex-col p-4 bg-yellow-950/20 border border-yellow-500/10 rounded-xl hover:bg-yellow-950/30 transition-colors cursor-pointer">
                                    <span class="text-yellow-100 font-bold text-sm mb-1 uppercase">{{ item.name }}</span>
                                    <div class="flex justify-between items-baseline">
                                        <span class="text-xs text-yellow-500/70">Quedan:</span>
                                        <span class="text-lg font-mono text-yellow-500">{{ item.quantity }}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    } @else {
                        <div class="w-full text-center py-10 text-gray-600 border border-dashed border-gray-800 rounded-2xl font-mono text-xs flex flex-col items-center justify-center">
                            <lucide-icon name="package" class="w-8 h-8 mb-2 opacity-50"></lucide-icon>
                            <span>ESCANEO DE INVENTARIO COMPLETO: SIN ALERTAS CRÍTICAS.</span>
                        </div>
                    }
                </div>
            </div>

            <!-- AI Column -->
            <div class="lg:col-span-4">
                 <div class="p-6 rounded-xl border border-green-500/20 bg-gray-900/60 flex flex-col h-full min-h-[460px] shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    <!-- Scanline effect -->
                    <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent bg-[length:100%_4px] animate-scan"></div>
                    
                    <h4 class="text-lg font-bold text-green-400 mb-4 flex items-center justify-between border-b border-gray-800 pb-3 z-10">
                        <span class="flex items-center">
                            <lucide-icon name="cpu" class="w-5 h-5 mr-2 animate-pulse"></lucide-icon> Sentinel Core IA
                        </span>
                        <span class="text-[10px] bg-green-950/50 px-2 py-1 rounded text-green-300 font-mono">v2.5_ACTIVE</span>
                    </h4>
                    
                    <div class="flex-grow p-4 bg-black/40 rounded-lg overflow-y-auto mb-4 border border-gray-800/50 text-sm z-10 custom-scrollbar">
                        @if (gemini.isLoading()) {
                             <div class="flex flex-col items-center justify-center h-full space-y-4">
                                <div class="w-8 h-8 relative">
                                    <div class="absolute inset-0 border-2 border-green-500/10 rounded-full"></div>
                                    <div class="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin"></div>
                                </div>
                                <p class="text-green-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Procesando...</p>
                            </div>
                        } @else {
                            <div class="text-gray-300 whitespace-pre-wrap leading-relaxed font-light">{{ aiResponse() }}</div>
                        }
                    </div>

                    <div class="z-10 mt-auto">
                        <div class="flex space-x-2">
                             <input #prompt type="text" class="flex-grow bg-black/50 border border-gray-700 rounded p-2 text-white text-xs" placeholder="Consultar a Sentinel..." (keyup.enter)="askAi(prompt.value); prompt.value=''">
                             <button (click)="askAi(prompt.value); prompt.value=''" class="p-2 bg-green-700 text-white rounded hover:bg-green-600"><lucide-icon name="send" class="w-4 h-4"></lucide-icon></button>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  `
})
export class DashboardComponent {
    firestore = inject(FirestoreService);
    gemini = inject(GeminiService);

    // Convert observables to signals
    sales = toSignal(this.firestore.getCollection<Sale>('sales'), { initialValue: [] });
    expenses = toSignal(this.firestore.getCollection<Expense>('expenses'), { initialValue: [] });
    stock = toSignal(this.firestore.getCollection<any>('inventory'), { initialValue: [] }); // 'any' for quick fix on lowStockItems type match

    metrics = computed<AppMetrics>(() => {
        const totalRevenue = this.sales().reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const totalExpenses = this.expenses().reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const lowStockItems = this.stock().filter(item => (Number(item.quantity) || 0) < (Number(item.minStock) || 10));

        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses,
            lowStockItems
        };
    });

    aiResponse = signal("SISTEMA ONLINE. A la espera de comandos.");

    async askAi(query: string) {
        if (!query.trim()) return;
        const m = this.metrics();
        const context = `Contexto ERP: Ventas=${m.totalRevenue}, Gastos=${m.totalExpenses}, Utilidad=${m.netProfit}. Alertas Stock=${m.lowStockItems.length}.`;
        const res = await this.gemini.generateContent(
            `Contexto: ${context}\nUsuario: ${query}`,
            "Eres el Cerebro de Sentinel ERP. Responde corto, técnico y estratégico."
        );
        this.aiResponse.set(res);
    }
}
