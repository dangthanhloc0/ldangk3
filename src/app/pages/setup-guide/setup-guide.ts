import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../services/translate.service';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  details?: string[];
  codeBlocks?: { lang: string; code: string }[];
}

@Component({
  selector: 'app-setup-guide',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './setup-guide.html',
  styleUrl: './setup-guide.css',
})
export class SetupGuide implements OnInit {
  steps: SetupStep[] = [];
  currentStep: number = 0;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.initializeSteps();
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
          this.translateService.instant('SETUP.STEP_1_DETAILS_5'),
          this.translateService.instant('SETUP.STEP_1_DETAILS_6')
        ]
      },
      {
        id: 2,
        title: this.translateService.instant('SETUP.STEP_2_TITLE'),
        description: this.translateService.instant('SETUP.STEP_2_DESC'),
        icon: '📦',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_2_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_2_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_2_DETAILS_3')
        ],
        codeBlocks: [
          {
            lang: 'xml',
            code: `<dependency>
    <groupId>com.example</groupId>
    <artifactId>keycloak-library</artifactId>
    <version>1.0.0</version>
</dependency>`
          }
        ]
      },
      {
        id: 3,
        title: this.translateService.instant('SETUP.STEP_3_TITLE'),
        description: this.translateService.instant('SETUP.STEP_3_DESC'),
        icon: '🐳',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_3_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_3_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_3_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_3_DETAILS_4')
        ]
      },
      {
        id: 4,
        title: this.translateService.instant('SETUP.STEP_4_TITLE'),
        description: this.translateService.instant('SETUP.STEP_4_DESC'),
        icon: '👑',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_4_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_4_DETAILS_3')
        ]
      },
      {
        id: 5,
        title: this.translateService.instant('SETUP.STEP_5_TITLE'),
        description: this.translateService.instant('SETUP.STEP_5_DESC'),
        icon: '🔑',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_5_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_4'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_5'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_6'),
          this.translateService.instant('SETUP.STEP_5_DETAILS_7')
        ]
      },
      {
        id: 6,
        title: this.translateService.instant('SETUP.STEP_6_TITLE'),
        description: this.translateService.instant('SETUP.STEP_6_DESC'),
        icon: '🍃',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_6_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_6_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_6_DETAILS_3')
        ],
        codeBlocks: [
          {
            lang: 'yaml',
            code: `keycloak:
  server-url: http://localhost:8080
  realm: demo-realm
  client-id: my-app
  client-secret: <CLIENT_SECRET_FROM_KEYCLOAK>
  
spring:
  application:
    name: keycloak-demo-backend`
          }
        ]
      },
      {
        id: 7,
        title: this.translateService.instant('SETUP.STEP_7_TITLE'),
        description: this.translateService.instant('SETUP.STEP_7_DESC'),
        icon: '⚛️',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_7_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_4')
        ],
        codeBlocks: [
          {
            lang: 'bash',
            code: `npm install keycloak-js`
          }
        ]
      },
      {
        id: 8,
        title: this.translateService.instant('SETUP.STEP_8_TITLE'),
        description: this.translateService.instant('SETUP.STEP_8_DESC'),
        icon: '✅',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_8_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_8_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_8_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_8_DETAILS_4'),
          this.translateService.instant('SETUP.STEP_8_DETAILS_5')
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
}
