import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiFunctionService, ApiFunction } from '../../services/api-function.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../services/translate.service';
import { FormsModule } from '@angular/forms';

interface FunctionCategory {
  name: string;
  icon: string;
  functions: ApiFunction[];
  color: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  categories: FunctionCategory[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';
  filteredFunctions: ApiFunction[] = [];
  descriptionKeyMap: { [key: string]: string } = {};

  constructor(
    private apiFunctionService: ApiFunctionService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    const allFunctions = this.apiFunctionService.getFunctions();

    const categoryMap: { [key: string]: FunctionCategory } = {
      authentication: {
        name: this.translateService.instant('ADMIN.AUTHENTICATION'),
        icon: '🔐',
        functions: [],
        color: '#e74c3c'
      },
      'user-management': {
        name: this.translateService.instant('ADMIN.USER_MANAGEMENT'),
        icon: '👥',
        functions: [],
        color: '#3498db'
      },
      'role-management': {
        name: this.translateService.instant('ADMIN.ROLE_MANAGEMENT'),
        icon: '🛡️',
        functions: [],
        color: '#f39c12'
      },
      token: {
        name: this.translateService.instant('ADMIN.TOKEN_MANAGEMENT'),
        icon: '🔑',
        functions: [],
        color: '#9b59b6'
      }
    };

    allFunctions.forEach(func => {
      if (categoryMap[func.category]) {
        categoryMap[func.category].functions.push(func);
      }
    });

    this.categories = Object.values(categoryMap).filter(cat => cat.functions.length > 0);
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = this.selectedCategory === categoryName ? '' : categoryName;
    this.filterFunctions();
  }

  search(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filterFunctions();
  }

  private filterFunctions(): void {
    if (!this.searchQuery && !this.selectedCategory) {
      this.filteredFunctions = [];
      return;
    }

    const allFunctions = this.apiFunctionService.getFunctions();
    this.filteredFunctions = allFunctions.filter(func => {
      const matchCategory = !this.selectedCategory || func.category === this.selectedCategory;
      const matchSearch = !this.searchQuery || 
        func.name.toLowerCase().includes(this.searchQuery) ||
        func.description.toLowerCase().includes(this.searchQuery);
      return matchCategory && matchSearch;
    });
  }

  getCategoryForFunction(categoryKey: string): FunctionCategory | undefined {
    return this.categories.find(cat => cat.name.toLowerCase() === categoryKey.replace('-', ' ').toLowerCase());
  }

  getTotalFunctions(): number {
    return this.categories.reduce((sum, cat) => sum + cat.functions.length, 0);
  }

  getDescriptionKey(functionId: string): string {
    // Convert camelCase to UPPERCASE without underscores
    // Example: refreshToken -> REFRESHTOKEN
    const upperCaseId = functionId.replace(/([A-Z])/g, '$1').toUpperCase();
    return 'FUNCTIONS.' + upperCaseId + '_DESC';
  }
}
