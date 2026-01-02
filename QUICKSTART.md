# Quick Start Guide - Keycloak Demo

## Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
ng serve
```

### Step 3: Open Browser
Navigate to: **http://localhost:4200/**

## What You'll See

- **Home Page**: Featured content with Keycloak feature showcase
- **About Page**: Information about Keycloak and integration steps
- **Responsive Navigation**: Header with Bootstrap-styled navbar
- **Professional Footer**: Complete with links and information

## Project Includes

✅ Modern Angular 21 setup  
✅ Bootstrap 5 styling  
✅ Pre-configured routing  
✅ Keycloak service template  
✅ Auth guards example  
✅ Responsive components  
✅ Production-ready structure  

## Next Steps: Enable Keycloak

Follow these steps to connect to a real Keycloak server:

### 1. Install Keycloak JavaScript Adapter
```bash
npm install keycloak-js
```

### 2. Set Up Keycloak Server
- Download Keycloak from https://www.keycloak.org/downloads
- Or use a managed Keycloak service

### 3. Configure Service
Edit `src/app/services/keycloak.service.ts` and update the `initKeycloak()` method with:
- Your Keycloak server URL
- Your realm name
- Your client ID

### 4. Initialize Keycloak
In `src/main.ts`, add:
```typescript
import { KeycloakService } from './app/services/keycloak.service';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    const keycloakService = appRef.injector.get(KeycloakService);
    return keycloakService.initKeycloak();
  });
```

### 5. Update Routes
Add authentication guards to protect routes:
```typescript
import { authGuard } from './guards/auth.guard';

{ path: 'protected', component: MyComponent, canActivate: [authGuard] }
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `ng serve` | Start dev server |
| `ng build` | Build for production |
| `ng test` | Run tests |
| `ng generate component name` | Create new component |
| `npm install` | Install dependencies |

## Project Structure

```
src/
├── app/
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # Business logic (Keycloak service)
│   ├── guards/            # Route guards (auth guard)
│   └── app.ts             # Root component
├── index.html             # HTML entry point
├── main.ts                # Application bootstrap
└── styles.css             # Global styles
```

## Troubleshooting

### Port 4200 Already In Use
```bash
ng serve --port 4300
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
ng serve
```

### Build Issues
```bash
ng build --configuration development --verbose
```

## Documentation

- [Angular Docs](https://angular.dev)
- [Bootstrap Docs](https://getbootstrap.com)
- [Keycloak Docs](https://www.keycloak.org/documentation)
- [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter)

## Support

- Angular Issues: https://github.com/angular/angular/issues
- Keycloak Issues: https://github.com/keycloak/keycloak/issues
- Bootstrap Issues: https://github.com/twbs/bootstrap/issues

---

Happy coding! 🚀
