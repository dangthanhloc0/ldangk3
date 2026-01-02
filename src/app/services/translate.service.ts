import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLanguage = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguage.asObservable();
  
  private translations: { [key: string]: TranslationDictionary } = {};
  private loadedLanguages: Set<string> = new Set();
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  /**
   * Initialize language and load translations synchronously
   */
  private initializeLanguage(): void {
    // Always load English first as fallback
    this.loadTranslationsSync('en');
    
    // Then load saved language if different from English
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.currentLanguage.next(savedLanguage);
    
    // Load saved language if it's not English
    if (savedLanguage !== 'en') {
      this.loadTranslationsSync(savedLanguage);
    }
  }

  /**
   * Get translated text for a key
   */
  instant(key: string, params?: { [key: string]: string }): string {
    const language = this.currentLanguage.value;
    
    // Try current language first
    if (this.translations[language]) {
      let translation = this.getNestedTranslation(key, language);
      if (translation) {
        // Replace parameters if provided
        if (params && typeof translation === 'string') {
          let result = translation;
          Object.keys(params).forEach(param => {
            result = result.replace(`{{${param}}}`, params[param]);
          });
          return result;
        }
        return translation;
      }
    }
    
    // Fallback to English if current language doesn't have the key
    if (language !== 'en' && this.translations['en']) {
      let translation = this.getNestedTranslation(key, 'en');
      if (translation) {
        // Replace parameters if provided
        if (params && typeof translation === 'string') {
          let result = translation;
          Object.keys(params).forEach(param => {
            result = result.replace(`{{${param}}}`, params[param]);
          });
          return result;
        }
        return translation;
      }
    }
    
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  /**
   * Get translation as observable
   */
  get(key: string, params?: { [key: string]: string }): Observable<string> {
    return new Observable(observer => {
      observer.next(this.instant(key, params));
      const subscription = this.currentLanguage$.subscribe(() => {
        observer.next(this.instant(key, params));
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Set the current language
   */
  setLanguage(language: string): void {
    // Load translations synchronously if not already loaded
    if (!this.loadedLanguages.has(language)) {
      this.loadTranslationsSyncForSwitch(language);
    }
    
    this.currentLanguage.next(language);
    localStorage.setItem('language', language);
    console.log(`Language switched to: ${language}`);
  }

  /**
   * Load translations from i18n JSON file (synchronous for initial load)
   */
  private loadTranslationsSync(language: string): void {
    const filePath = `assets/i18n/${language}.json`;
    
    // Use XMLHttpRequest for synchronous loading
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, false); // false = synchronous
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        this.translations[language] = data;
        this.loadedLanguages.add(language);
        this.isInitialized = true;
        console.log(`Translations loaded for language: ${language}`);
      }
    };
    xhr.onerror = () => {
      console.error(`Failed to load translations for language ${language}`);
      this.isInitialized = true;
    };
    xhr.send();
  }

  /**
   * Load translations synchronously when switching languages
   */
  private loadTranslationsSyncForSwitch(language: string): void {
    const filePath = `assets/i18n/${language}.json`;
    
    // Use XMLHttpRequest for synchronous loading
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filePath, false); // false = synchronous
    
    try {
      xhr.send();
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        this.translations[language] = data;
        this.loadedLanguages.add(language);
        console.log(`Translations loaded for language: ${language}`);
      } else {
        console.error(`Failed to load translations: status ${xhr.status}`);
      }
    } catch (error) {
      console.error(`Failed to load translations for language ${language}:`, error);
    }
  }

  /**
   * Load translations from i18n JSON file (async for language switching)
   */
  private loadTranslations(language: string): void {
    const filePath = `assets/i18n/${language}.json`;
    
    this.http.get<TranslationDictionary>(filePath).subscribe({
      next: (data) => {
        this.translations[language] = data;
        this.loadedLanguages.add(language);
        console.log(`Translations loaded for language: ${language}`);
      },
      error: (error) => {
        console.error(`Failed to load translations for language ${language}:`, error);
      }
    });
  }

  /**
   * Get current language
   */
  getLanguage(): string {
    return this.currentLanguage.value;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): string[] {
    // Return the languages from i18n folder
    return ['en', 'vn'];
  }

  /**
   * Add translations for a language
   */
  addTranslations(language: string, translations: TranslationDictionary): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    this.translations[language] = { ...this.translations[language], ...translations };
  }

  /**
   * Helper method to get nested translations
   */
  private getNestedTranslation(key: string, language: string): string | null {
    const keys = key.split('.');
    let value: any = this.translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return typeof value === 'string' ? value : null;
  }
}
