import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, type: string): SafeHtml | any {
    if (!value) return value;

    switch (type) {
      case 'html':
        // Convert newlines to <br> tags
        const htmlContent = value.replace(/\n/g, '<br>');
        return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
}
