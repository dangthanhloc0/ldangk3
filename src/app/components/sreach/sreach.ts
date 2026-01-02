import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'sreach-document',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './sreach.html',
  styleUrl: './sreach.css',
})
export class Sreach {
 keyword = '';

  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.keyword.trim());
  }
}
