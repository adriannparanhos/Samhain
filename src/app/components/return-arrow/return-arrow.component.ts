import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-return-arrow',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      name="arrow-left"
      class="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
    ></lucide-icon>`,
  styleUrl: './return-arrow.component.css'
})
export class ReturnArrowComponent {

}
