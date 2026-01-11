import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-public-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="min-h-screen bg-white text-black">Layout loaded <router-outlet></router-outlet></div>
  `
})
export class PublicLayoutComponent { 
  constructor() {
    console.log('PublicLayoutComponent loaded');
  }
}
