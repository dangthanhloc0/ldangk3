import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService } from '../../app/services/translate.service';
import { TranslatePipe } from '../../app/pipes/translate.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userName: string | null = null;
  currentLanguage = 'en';
  availableLanguages: string[] = [];
  private destroy$ = new Subject<void>();

  @ViewChild('languageDropdown') languageDropdown!: ElementRef;

  constructor(private translateService: TranslateService) {
    this.currentLanguage = this.translateService.getLanguage();
    this.availableLanguages = this.translateService.getAvailableLanguages();
    console.log('Available languages:', this.availableLanguages);
  }

  ngOnInit() {
    this.currentLanguage = this.translateService.getLanguage();
    this.availableLanguages = this.translateService.getAvailableLanguages();
    
    // Subscribe to language changes
    this.translateService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.currentLanguage = language;
        console.log('Header updated language to:', language);
      });
    
    console.log('Header initialized - Languages:', this.availableLanguages);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login() {
    // This will be connected to Keycloak later
    this.isAuthenticated = true;
    this.userName = 'Demo User';
  }

  logout() {
    // This will be connected to Keycloak later
    this.isAuthenticated = false;
    this.userName = null;
  }

  setLanguage(language: string) {
    console.log('Setting language to:', language);
    this.translateService.setLanguage(language);
    this.currentLanguage = language;
  }

  trackByLang(index: number, lang: string): string {
    return lang;
  }

  getLanguageDisplay(lang: string): string {
    const languageMap: { [key: string]: string } = {
      'en': 'English',
      'vn': 'Tiếng Việt'
    };
    return languageMap[lang] || lang;
  }
}
