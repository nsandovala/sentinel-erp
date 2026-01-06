import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'clp',
    standalone: true
})
export class ClpPipe implements PipeTransform {
    transform(value: number | undefined | null): string {
        const num = Math.round(parseFloat(String(value) || '0') || 0);
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(num);
    }
}
