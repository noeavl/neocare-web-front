// select.component.ts
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() name: string = '';
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder: string = 'Select an option';
  @Output() selected = new EventEmitter<string>();

  value: string = '';
  disabled: boolean = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.selected.emit(value);
  }

  writeValue(value: string): void {
    // When the form is reset, the value will be null or empty
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}