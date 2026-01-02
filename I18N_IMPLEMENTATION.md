# i18n Translation Implementation Guide

## Overview
This project now has complete i18n (internationalization) support for English (en) and Vietnamese (vn) languages.

## Translation Structure

### Translation Keys Organization

```
HOME:
  - TITLE: "Home" / "Trang Chủ"
  - WELCOME: "Welcome to my Keycloak Library" / "Chào mừng đến Keycloak Library"
  - SUBTITLE: Full subtitle with description
  - GET_STARTED: "Get Started" / "Bắt Đầu"
  - LEARN_MORE: "Learn More" / "Tìm Hiểu Thêm"
  - DESCRIPTION: "Home page" / "Trang chủ"

ADMIN:
  - TITLE: "Admin" / "Quản Trị"
  - DASHBOARD: "Admin Dashboard" / "Bảng Điều Khiển Quản Trị"
  - SEARCH_PLACEHOLDER: Search placeholder with emoji
  - DESCRIPTION: "Admin panel" / "Bảng điều khiển quản trị"

API_DOC:
  - TITLE: "API Documentation" / "Tài Liệu API"
  - SUBTITLE: "Detailed guide on all Keycloak Library Functions"
  - SEARCH_PLACEHOLDER: Keycloak specific search placeholder
  - DESCRIPTION: "API Documentation" / "Tài Liệu API"

SEARCH:
  - PLACEHOLDER: "Search..." / "Tìm kiếm..."
  - BUTTON: "Search" / "Tìm kiếm"
  - DESCRIPTION: Search instruction

SETUP:
  - TITLE: "Setup Guide" / "Hướng Dẫn Cài Đặt"
  - DESCRIPTION: "Setup Guide" / "Hướng Dẫn Cài Đặt"

COMMON:
  - LOGIN: "Login" / "Đăng Nhập"
  - LOGOUT: "Logout" / "Đăng Xuất"
  - LANGUAGE: "Language" / "Ngôn Ngữ"
```

## Files Updated

### 1. Services
- **translate.service.ts** - Updated with en/vn translations

### 2. Pipes
- **translate.pipe.ts** - Allows use of `{{ 'KEY' | translate }}` in templates

### 3. Components Updated with i18n
- **HomeComponent** - Uses HOME.* keys
- **AdminComponent** - Uses ADMIN.* keys
- **ApiDocumentation** - Uses API_DOC.* keys
- **SetupGuide** - Ready for i18n
- **SreachComponent** - Uses SEARCH.* keys

### 4. Translation Files
- `src/assets/i18n/en.json` - English translations
- `src/assets/i18n/vn.json` - Vietnamese translations

## Usage Examples

### In Templates
```html
<!-- Simple translation -->
<h1>{{ 'HOME.WELCOME' | translate }}</h1>

<!-- With description -->
<p>{{ 'HOME.SUBTITLE' | translate }}</p>

<!-- Button labels -->
<button>{{ 'HOME.GET_STARTED' | translate }}</button>

<!-- Search placeholders -->
<input [placeholder]="'SEARCH.PLACEHOLDER' | translate">
```

### In Components (TypeScript)
```typescript
constructor(private translateService: TranslateService) {}

// Get translated text instantly
const title = this.translateService.instant('HOME.TITLE');

// Get as observable
this.translateService.get('HOME.WELCOME').subscribe(text => {
  console.log(text);
});

// Change language
this.translateService.setLanguage('vn'); // Switch to Vietnamese
this.translateService.setLanguage('en'); // Switch to English

// Get available languages
const languages = this.translateService.getAvailableLanguages(); // ['en', 'vn']

// Get current language
const current = this.translateService.getLanguage();
```

## Language Switcher Example

```typescript
// In a header/navbar component
import { TranslateService } from './services/translate.service';

@Component({
  selector: 'app-header',
  template: `
    <div class="language-switcher">
      <button (click)="setLanguage('en')">English</button>
      <button (click)="setLanguage('vn')">Tiếng Việt</button>
    </div>
  `
})
export class HeaderComponent {
  constructor(private translateService: TranslateService) {}

  setLanguage(lang: string) {
    this.translateService.setLanguage(lang);
  }

  getCurrentLanguage() {
    return this.translateService.getLanguage();
  }
}
```

## Adding New Translations

### Step 1: Update translate.service.ts
```typescript
private translations = {
  en: {
    'NEW_PAGE': {
      'TITLE': 'New Page',
      'DESCRIPTION': 'A new page description'
    }
  },
  vn: {
    'NEW_PAGE': {
      'TITLE': 'Trang Mới',
      'DESCRIPTION': 'Mô tả trang mới'
    }
  }
}
```

### Step 2: Update JSON files
Update `en.json` and `vn.json` with the same structure.

### Step 3: Use in template
```html
<h1>{{ 'NEW_PAGE.TITLE' | translate }}</h1>
<p>{{ 'NEW_PAGE.DESCRIPTION' | translate }}</p>
```

## Current Implementation Status

✅ Translate Service implemented
✅ Translate Pipe implemented
✅ All pages using i18n labels
✅ English (en) translations
✅ Vietnamese (vn) translations
✅ Language persistence (localStorage)
✅ Automatic UI updates on language change

## Key Features

1. **Nested Translation Keys** - Support for dot-notation (e.g., 'HOME.TITLE')
2. **Parameter Substitution** - Support for dynamic values in translations
3. **Language Persistence** - Selected language is saved to localStorage
4. **Reactive Updates** - All pipes update when language changes
5. **Standalone Pipe** - Works with Angular standalone components
6. **Type Safety** - Proper TypeScript interfaces for translations

## Notes

- Default language is English ('en')
- Languages are stored with locale codes: 'en' and 'vn'
- All translations include both label names and descriptions
- The pipe uses `pure: false` to detect language changes automatically
