import { Component, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent {
  @ViewChild('inputElement') inputElement!: ElementRef;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() class: string = '';
  @Input() formControlName: string = '';

  value: any = '';
  disabled: boolean = false;
  onChange: any = () => { };
  onTouched: any = () => { };


  writeValue(value: any): void {
    this.value = value;
    if (this.inputElement?.nativeElement) {
      this.inputElement.nativeElement.value = value || '';
    }
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
