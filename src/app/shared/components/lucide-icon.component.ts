import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'lucide-icon',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<svg [innerHTML]="IconSvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class]="class()"></svg>`
})
export class LucideIconComponent {
    name = input.required<string>();
    class = input<string>('w-5 h-5');

    // Condensed Map for critical icons
    private iconSvgMap: { [key: string]: string } = {
        'home': `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
        'trending-up': `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,
        'wallet': `<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h14a1 1 0 0 1 1 1v3h-2a2 2 0 0 0 0 4h2v3a1 1 0 0 0 1 1h2v-4h-2a1 1 0 0 1-1-1V8a1 1 0 0 0-1-1z"/>`,
        'package': `<path d="M12.89 2.16L21 6.34V17.66L12.89 21.84L4 17.66V6.34L12.89 2.16Z"/><path d="M12 22V12"/><path d="M21 6.34L12 12L3 6.34"/><path d="M17 9.5L12 12.5L7 9.5"/>`,
        'alert-triangle': `<path d="M10.29 3.86L1.82 18.99A2 2 0 0 0 3.6 22h16.8a2 2 0 0 0 1.77-3.01L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
        'send': `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
        'cpu': `<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>`,
        'trash': `<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`,
        'plus': `<path d="M12 5v14M5 12h14"/>`,
        'chef-hat': `<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 9.08 0A5.11 5.11 0 0 1 18.59 6 4 4 0 0 1 20 13.87V21H6Z"/><line x1="6" y1="17" x2="20" y2="17"/>`
    };
    get IconSvg(): string { return this.iconSvgMap[this.name()] || ''; }
}
