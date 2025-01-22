import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ThemeService } from '../../../../data/services/shared/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isLoggedIn: boolean = false;
  selectedTheme = false;
  constructor(private route: ActivatedRoute, private router: Router, private themeService: ThemeService) {

    this.route.url.subscribe((url) => {
      if (url[0]?.path === 'login') {
        this.isLoggedIn = false;
      }
      else {
        this.isLoggedIn = true
      }
    })

  }
  ngOnInit(): void {
    const currentTheme = this.themeService.getTheme();
    this.selectedTheme = currentTheme === 'dark-theme' ? true : false;      
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  onThemeChange(event: any): void {
    const theme = event.target.checked ? 'dark-theme' : 'light-theme';
    this.themeService.setTheme(theme);
  }
}
