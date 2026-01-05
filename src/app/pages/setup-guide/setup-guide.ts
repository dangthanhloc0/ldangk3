import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { TranslateService } from '../../services/translate.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  details?: string[];
  codeBlocks?: { lang: string; code: string }[];
  images?: { alt: string; url: string; caption?: string }[];
}

@Component({
  selector: 'app-setup-guide',
  standalone: true,
  imports: [CommonModule, TranslatePipe, SafeHtmlPipe],
  templateUrl: './setup-guide.html',
  styleUrl: './setup-guide.css',
})
export class SetupGuide implements OnInit, OnDestroy {
  steps: SetupStep[] = [];
  currentStep: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.initializeSteps();
    // Subscribe to language changes
    this.translateService.currentLanguage$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.initializeSteps();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAssetUrl(path: string): string {
    const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
    return baseHref + path;
  }

  initializeSteps() {
    this.steps = [
      {
        id: 1,
        title: this.translateService.instant('SETUP.STEP_1_TITLE'),
        description: this.translateService.instant('SETUP.STEP_1_DESC'),
        icon: '⚙️',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_1_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_1_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_1_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_1_DETAILS_4'),
        ]
      },
      {
        id: 2,
        title: this.translateService.instant('SETUP.STEP_2_TITLE'),
        description: this.translateService.instant('SETUP.STEP_2_DESC'),
        icon: '📥',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_2_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_2_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_2_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_2_DETAILS_4'),
        ]
      },
      {
        id: 3,
        title: this.translateService.instant('SETUP.STEP_3_TITLE'),
        description: this.translateService.instant('SETUP.STEP_3_DESC'),
        icon: '📦',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_3_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_3_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_3_DETAILS_3')
        ],
        codeBlocks: [
          {
            lang: 'xml',
            code: `<dependency>
  <groupId>org.ldang.keycloack</groupId>
  <artifactId>authz-core</artifactId>
  <version>1.0-SNAPSHOT</version>
  <scope>compile</scope>
</dependency>`
          }
        ]
      },
      {
        id: 4,
        title: this.translateService.instant('SETUP.STEP_4_TITLE'),
        description: this.translateService.instant('SETUP.STEP_4_DESC'),
        icon: '🐳',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_4_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_4'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_5'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_6'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_7'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_8'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_9'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_10')
        ],
        images: [
          { alt: 'Manage Realms - Click Create Realm', url: this.getAssetUrl('assets/images/img_2.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_1') },
          { alt: 'Create Realm Dialog - Enter Name', url: this.getAssetUrl('assets/images/img_3.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_2') },
          { alt: 'Realm Created Successfully', url: this.getAssetUrl('assets/images/img_5.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_3') },
          { alt: 'Navigate to Clients Section', url: this.getAssetUrl('assets/images/img_6.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_4') },
          { alt: 'Create Client Form', url: this.getAssetUrl('assets/images/img_7.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_5') },
          // { alt: 'Client General Settings', url: this.getAssetUrl('assets/images/img_8.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_6') },
          { alt: 'Capability Config - Enable Capabilities', url: this.getAssetUrl('assets/images/img_8.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_7') },
          { alt: 'Login Settings - Configure URLs', url: this.getAssetUrl('assets/images/img_9.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_8') },
          { alt: 'Credentials Tab - Copy Client Secret', url: this.getAssetUrl('assets/images/img_10.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_9') }
        ]
      },
      {
        id: 5,
        title: this.translateService.instant('SETUP.STEP_5_TITLE'),
        description: this.translateService.instant('SETUP.STEP_5_DESC'),
        icon: '🍃',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_5_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_3')
        ],
        codeBlocks: [
          {
            lang: 'yaml',
            code: `# Keycloak Server Configuration
keycloak.domainUrl=http://localhost:8080
keycloak.realmName={your-realm}
keycloak.clientSecret={your-client-secret}
keycloak.clientId={your-client-ID}
# Admin Credentials for API Operations
keycloak.adminUsername=admin
keycloak.adminPassword=admin`
          }
        ]
      }
    ];
  }

  selectStep(index: number) {
    this.currentStep = index;
  }

  markStepComplete(index: number) {
    this.steps[index].completed = !this.steps[index].completed;
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied!');
    });
  }

  getCompletedCount(): number {
    return this.steps.filter(s => s.completed).length;
  }

  getProgressPercentage(): number {
    return Math.round((this.getCompletedCount() / this.steps.length) * 100);
  }

  openImageFullscreen(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }
}
