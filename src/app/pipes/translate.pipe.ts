import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription | null = null;
  private lastKey: string = '';
  private lastParams: { [key: string]: string } | undefined;
  private lastValue: string = '';

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  transform(key: string, params?: { [key: string]: string }): string {
    // Return cached value if key and params haven't changed
    if (key === this.lastKey && JSON.stringify(params) === JSON.stringify(this.lastParams)) {
      return this.lastValue;
    }

    this.lastKey = key;
    this.lastParams = params;

    // Unsubscribe from previous subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Get translation and subscribe to language changes
    this.subscription = this.translateService.get(key, params).subscribe(value => {
      this.lastValue = value;
      this.cdr.markForCheck();
    });

    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
