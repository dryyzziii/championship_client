import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test_api';
}
