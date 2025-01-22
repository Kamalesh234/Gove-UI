import { Component } from '@angular/core';
import { ThemeService } from '../data/services/shared/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GOVE';
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    const theme = this.themeService.getTheme();
    this.themeService.setTheme(theme);
  }
}
