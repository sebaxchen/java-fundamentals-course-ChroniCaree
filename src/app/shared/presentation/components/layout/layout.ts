import { Component, signal, computed, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [
    MatButton,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcher,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit, OnDestroy {
  private document: Document;
  
  isDarkMode = signal<boolean>(false);
  protected readonly sidebarTitle = signal<string>('ACME Learning Center');
  protected readonly unlockedCount = signal<number>(1);
  protected readonly timeLeftSeconds = signal<number>(0);
  protected readonly newlyUnlockedIndex = signal<number | null>(null);
  protected readonly formattedTimeLeft = computed(() => this.formatTime(this.timeLeftSeconds()));
  protected readonly allResourcesUnlocked = computed(() => this.unlockedCount() >= this.options.length);
  private storageListener?: (event: StorageEvent) => void;
  private timerIntervalId?: number;
  private langChangeSubscription?: Subscription;
  private readonly unlockIntervalMs = 10 * 60 * 1000;
  private readonly nextUnlockAt = signal<number | null>(null);
  private readonly enableProgressTimer = false;

  options = [
    {link: '/resource-1', label: 'option.home'},
    {link: '/resource-2', label: 'option.about'},
    {link: '/resource-3', label: 'option.courses'},
    {link: '/resource-4', label: 'option.categories'},
    {link: '/resource-5', label: 'option.resource5'},
    {link: '/course-complete', label: 'option.complete'}
  ];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private renderer: Renderer2,
    private router: Router,
    private translate: TranslateService
  ) {
    this.document = doc;
    // Cargar el tema guardado o usar el predeterminado
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.isDarkMode.set(true);
    }

    this.updateSidebarTitle();
    
    // Suscribirse a cambios de idioma para actualizar el título
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateSidebarTitle();
    });

    if (typeof window !== 'undefined') {
      this.storageListener = (event: StorageEvent) => {
        if (event.key === 'userName') {
          this.updateSidebarTitle();
        }
      };

      window.addEventListener('storage', this.storageListener);
    }
  }

  ngOnInit() {
    // Aplicar el tema inicial
    this.applyTheme();
    this.initializeProgress();
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (typeof window !== 'undefined' && this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  private applyTheme() {
    if (this.isDarkMode()) {
      this.renderer.addClass(this.document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }

  private updateSidebarTitle() {
    const name = localStorage.getItem('userName');

    if (name && name.trim().length > 0) {
      const hello = this.translate.instant('sidebar.hello');
      this.sidebarTitle.set(`${hello} ${name.trim()}`);
    } else {
      const title = this.translate.instant('sidebar.appTitle');
      this.sidebarTitle.set(title);
    }
  }

  toggleDarkMode() {
    this.isDarkMode.update(value => !value);
    // Aplicar inmediatamente para asegurar que funcione
    this.applyTheme();
  }

  protected isResourceLocked(index: number): boolean {
    if (!this.enableProgressTimer) {
      return false;
    }

    return index >= this.unlockedCount();
  }

  protected shouldShowContinueButton(): boolean {
    if (!this.enableProgressTimer) {
      return false;
    }

    return this.newlyUnlockedIndex() !== null;
  }

  protected onContinueToNextResource() {
    const index = this.newlyUnlockedIndex();
    if (index === null) {
      return;
    }

    const target = this.options[index];
    if (target) {
      this.router.navigate([target.link]);
    }

    this.newlyUnlockedIndex.set(null);
    this.saveProgress();
  }

  private initializeProgress() {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.enableProgressTimer) {
      this.unlockedCount.set(this.options.length);
      this.newlyUnlockedIndex.set(null);
      this.timeLeftSeconds.set(0);
      this.nextUnlockAt.set(null);
      this.stopTimer();
      localStorage.removeItem('resourceProgress');
      return;
    }

    const stored = localStorage.getItem('resourceProgress');
    let unlocked = 1;
    let nextUnlock: number | null = null;
    let pendingIndex: number | null = null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed.unlockedCount === 'number' && parsed.unlockedCount > 0) {
          unlocked = Math.min(parsed.unlockedCount, this.options.length);
        }
        if (typeof parsed.nextUnlockAt === 'number') {
          nextUnlock = parsed.nextUnlockAt;
        }
        if (typeof parsed.newlyUnlockedIndex === 'number') {
          pendingIndex = parsed.newlyUnlockedIndex;
        }
      } catch (error) {
        // Ignorar errores de parseo y continuar con valores predeterminados
      }
    }

    const now = Date.now();

    if (unlocked < this.options.length) {
      if (!nextUnlock || Number.isNaN(nextUnlock)) {
        nextUnlock = now + this.unlockIntervalMs;
      }

      while (unlocked < this.options.length && nextUnlock !== null && now >= nextUnlock) {
        unlocked += 1;
        pendingIndex = unlocked - 1;
        nextUnlock = unlocked < this.options.length ? nextUnlock + this.unlockIntervalMs : null;
      }
    } else {
      nextUnlock = null;
    }

    this.unlockedCount.set(unlocked);
    this.newlyUnlockedIndex.set(pendingIndex !== null && pendingIndex < unlocked ? pendingIndex : null);
    this.nextUnlockAt.set(nextUnlock);

    if (nextUnlock) {
      const secondsLeft = Math.max(0, Math.ceil((nextUnlock - now) / 1000));
      this.timeLeftSeconds.set(secondsLeft);
      this.startTimer();
    } else {
      this.timeLeftSeconds.set(0);
      this.stopTimer();
    }

    this.saveProgress();
  }

  private startTimer() {
    if (typeof window === 'undefined' || this.allResourcesUnlocked()) {
      return;
    }

    if (!this.enableProgressTimer) {
      return;
    }

    this.stopTimer();
    this.timerIntervalId = window.setInterval(() => this.handleTick(), 1000);
    this.handleTick();
  }

  private stopTimer() {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.enableProgressTimer) {
      return;
    }

    if (this.timerIntervalId !== undefined) {
      window.clearInterval(this.timerIntervalId);
      this.timerIntervalId = undefined;
    }
  }

  private handleTick() {
    if (!this.enableProgressTimer) {
      return;
    }

    if (this.allResourcesUnlocked()) {
      this.timeLeftSeconds.set(0);
      this.stopTimer();
      this.nextUnlockAt.set(null);
      this.saveProgress();
      return;
    }

    const nextUnlock = this.nextUnlockAt();
    const now = Date.now();

    if (!nextUnlock) {
      this.nextUnlockAt.set(now + this.unlockIntervalMs);
      this.timeLeftSeconds.set(Math.ceil(this.unlockIntervalMs / 1000));
      this.saveProgress();
      return;
    }

    const diffSeconds = Math.max(0, Math.ceil((nextUnlock - now) / 1000));
    this.timeLeftSeconds.set(diffSeconds);

    if (diffSeconds <= 0) {
      this.unlockNextResource();
    }
  }

  private unlockNextResource() {
    if (!this.enableProgressTimer) {
      return;
    }

    const currentUnlocked = this.unlockedCount();
    if (currentUnlocked >= this.options.length) {
      this.timeLeftSeconds.set(0);
      this.nextUnlockAt.set(null);
      this.stopTimer();
      this.saveProgress();
      return;
    }

    const newUnlocked = currentUnlocked + 1;
    this.unlockedCount.set(newUnlocked);
    this.newlyUnlockedIndex.set(newUnlocked - 1);

    if (newUnlocked >= this.options.length) {
      this.timeLeftSeconds.set(0);
      this.nextUnlockAt.set(null);
      this.stopTimer();
    } else {
      const nextUnlock = Date.now() + this.unlockIntervalMs;
      this.nextUnlockAt.set(nextUnlock);
      this.timeLeftSeconds.set(Math.ceil(this.unlockIntervalMs / 1000));
    }

    this.saveProgress();
  }

  private formatTime(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  private saveProgress() {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.enableProgressTimer) {
      return;
    }

    const progress = {
      unlockedCount: this.unlockedCount(),
      nextUnlockAt: this.nextUnlockAt(),
      newlyUnlockedIndex: this.newlyUnlockedIndex()
    };

    localStorage.setItem('resourceProgress', JSON.stringify(progress));
  }
}
