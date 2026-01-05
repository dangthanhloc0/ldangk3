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
  codeBlocks?: { lang: string; code: string; title?: string }[];
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
            title: 'pom.xml - Add these dependencies',
            code: `<!-- Custom Keycloak Library -->
<dependency>
  <groupId>org.ldang.keycloack</groupId>
  <artifactId>authz-core</artifactId>
  <version>1.0-SNAPSHOT</version>
  <scope>compile</scope>
</dependency>

<!-- Spring Boot OAuth2 Resource Server -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<!-- Spring Boot OAuth2 Client -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

<!-- Spring Boot Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Boot Web -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Lombok for code generation -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>

<!-- Validation -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- OAuth2 JOSE (JSON Object Signing and Encryption) -->
<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>

<!-- Jackson JSON Processing -->
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-core</artifactId>
  <version>2.15.2</version>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-json</artifactId>
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
      },
      {
        id: 6,
        title: this.translateService.instant('SETUP.STEP_6_TITLE'),
        description: this.translateService.instant('SETUP.STEP_6_DESC'),
        icon: '🔒',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_6_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_6_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_6_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_6_DETAILS_4')
        ],
        codeBlocks: [
          {
            lang: 'java',
            title: 'SecurityConfig.java - Spring Security Configuration',
            code: `import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.*;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                ).csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter defaultGrantedConverter = new JwtGrantedAuthoritiesConverter();
        defaultGrantedConverter.setAuthorityPrefix("SCOPE_");

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<String> roles = new ArrayList<>();

            Object realmAccess = jwt.getClaim("realm_access");
            if (realmAccess instanceof Map) {
                Object r = ((Map<?, ?>) realmAccess).get("roles");
                if (r instanceof Collection) {
                    ((Collection<?>) r).forEach(x -> roles.add(String.valueOf(x)));
                }
            }

            Object resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess instanceof Map) {
                ((Map<?, ?>) resourceAccess).forEach((client, value) -> {
                    if (value instanceof Map) {
                        Object rolesObj = ((Map<?, ?>) value).get("roles");
                        if (rolesObj instanceof Collection) {
                            ((Collection<?>) rolesObj).forEach(x -> roles.add(String.valueOf(x)));
                        }
                    }
                });
            }

            Object groups = jwt.getClaim("groups");
            if (groups instanceof Collection) {
                ((Collection<?>) groups).forEach(x -> roles.add(String.valueOf(x)));
            }

            List<org.springframework.security.core.GrantedAuthority> authorities =
                    roles.stream()
                            .filter(Objects::nonNull)
                            .map(String::valueOf)
                            .distinct()
                            .map(r -> "ROLE_" + r)
                            .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

            Collection<org.springframework.security.core.GrantedAuthority> scopeAuthorities =
                    defaultGrantedConverter.convert(jwt);

            List<org.springframework.security.core.GrantedAuthority> result = new ArrayList<>();
            if (scopeAuthorities != null) result.addAll(scopeAuthorities);
            result.addAll(authorities);

            return result;
        });

        return converter;
    }
}`
          }
        ]
      },
      {
        id: 7,
        title: this.translateService.instant('SETUP.STEP_7_TITLE'),
        description: this.translateService.instant('SETUP.STEP_7_DESC'),
        icon: '🔍',
        completed: false,
        details: [
          this.translateService.instant('SETUP.STEP_7_DETAILS_1'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_2'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_3'),
          this.translateService.instant('SETUP.STEP_7_DETAILS_4')
        ],
        codeBlocks: [
          {
            lang: 'java',
            title: 'Application.java - Add @ComponentScan',
            code: `
import org.springframework.context.annotation.ComponentScan;
@ComponentScan({"org.ldang.keycloack", "com.example.test"})
`
          }
        ],
        images: [
          { alt: 'Add ComponentScan to Application Class', url: this.getAssetUrl('assets/images/img_11.png'), caption: this.translateService.instant('SETUP.IMAGE_CAPTION_10') }
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
