import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed bottom-6 right-6 z-40 bg-red-500 text-white p-4 rounded">
      Chatbot Widget Test
    </div>
  `,
  styles: []
})
export class ChatbotWidgetComponent {
  constructor() { 
    console.log('ChatbotWidgetComponent loaded');
  }
}
