import {Component, inject, signal, computed} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {Layout} from './shared/presentation/components/layout/layout';
import {TranslateService} from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [Layout, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('java-fundamentals-course-ChroniCaree');
  private translate: TranslateService;
  private router = inject(Router);
  protected readonly currentRoute = signal<string>('');
  protected readonly showLayout = computed(() => this.currentRoute() !== '/register');

  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
    
    // Track current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.url);
    });
    
    // Set initial route
    this.currentRoute.set(this.router.url);
  }
}
