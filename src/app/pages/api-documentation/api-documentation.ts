import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiFunctionService, ApiFunction } from '../../services/api-function.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-api-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './api-documentation.html',
  styleUrl: './api-documentation.css',
})
export class ApiDocumentation implements OnInit {
  categories: any[] = [];
  allFunctions: ApiFunction[] = [];
  selectedCategory: string = 'authentication';
  selectedFunction: ApiFunction | null = null;
  filteredFunctions: ApiFunction[] = [];
  searchQuery: string = '';

  constructor(
    private apiFunctionService: ApiFunctionService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.categories = this.apiFunctionService.getCategories();
    this.allFunctions = this.apiFunctionService.getFunctions();
    this.selectCategory('authentication');
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.filteredFunctions = this.apiFunctionService.getFunctionsByCategory(categoryId);
    this.selectedFunction = null;
  }

  selectFunction(func: ApiFunction) {
    this.selectedFunction = func;
  }

  search() {
    if (!this.searchQuery.trim()) {
      this.selectCategory(this.selectedCategory);
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredFunctions = this.allFunctions.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.longDescription.toLowerCase().includes(query)
    );
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    });
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  }

  getCategoryIcon(categoryId: string): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.icon : '📚';
  }

  getErrorMeaning(code: string): string {
    const key = code;
    return this.translateService.instant(key);
  }

  getErrorSolution(code: string): string {
    const solutionKey = 'SOLUTION_' + code;
    return this.translateService.instant(solutionKey);
  }

  getWhenToUseText(functionId: string, index: number): string {
    const key = 'FUNCTION_DETAILS.' + functionId.toUpperCase() + '_WHEN_' + (index + 1);
    return this.translateService.instant(key);
  }

  getBestPracticeText(functionId: string, index: number): string {
    const key = 'FUNCTION_DETAILS.' + functionId.toUpperCase() + '_BEST_' + (index + 1);
    return this.translateService.instant(key);
  }

  getDescription(functionId: string): string {
    const key = 'FUNCTIONS.' + functionId.toUpperCase() + '_DESC';
    return this.translateService.instant(key);
  }

  getLongDescription(functionId: string): string {
    const key = 'FUNCTION_DETAILS.' + functionId.toUpperCase() + '_LONG_DESC';
    return this.translateService.instant(key);
  }

  getParameterDescription(functionId: string, paramName: string): string {
    const key = 'FUNCTION_DETAILS.' + functionId.toUpperCase() + '_PARAM_' + paramName.toUpperCase();
    return this.translateService.instant(key);
  }
}
