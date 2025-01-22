import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
 currentTheme: string = 'light-theme';

  setTheme(theme: string): void {
    this.currentTheme = theme;
    const body = document.body;
    body.className = theme;
    localStorage.setItem('theme', theme);
  }

  getTheme(): string {
    return localStorage.getItem('theme') || 'light-theme';
  }
}
