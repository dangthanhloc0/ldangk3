import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      title: 'Single Sign-On',
      description: 'Centralized authentication with OAuth2 and OpenID Connect',
      icon: '🔐'
    },
    {
      title: 'User Management',
      description: 'Easy user provisioning and credential management',
      icon: '👥'
    },
    {
      title: 'Role-Based Access Control',
      description: 'Fine-grained authorization and policy management',
      icon: '📋'
    },
    {
      title: 'Social Login',
      description: 'Integrate with Google, Facebook, and other providers',
      icon: '🌐'
    },
    {
      title: 'Multi-Tenancy',
      description: 'Support for multiple realms and isolated environments',
      icon: '🏢'
    },
    {
      title: 'Token Management',
      description: 'JWT tokens with customizable claims and expiration',
      icon: '🎫'
    }
  ];
}
