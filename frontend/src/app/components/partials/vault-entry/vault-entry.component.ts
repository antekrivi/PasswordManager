import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VaultEntry } from '../../../models/VaultEntry';

@Component({
  selector: 'app-vault-entry',
  standalone: false,
  templateUrl: './vault-entry.component.html',
  styleUrl: './vault-entry.component.css'
})
export class VaultEntryComponent {
  @Input() entry!: VaultEntry;
  @Input() index!: number;
  @Output() save = new EventEmitter<VaultEntry>();
  @Output() cancel = new EventEmitter<void>();

  submitEdit() {
    this.save.emit(this.entry);
  }

  onCancel() {
    this.cancel.emit();
  }
}
