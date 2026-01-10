import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>Shop loaded</div>
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
