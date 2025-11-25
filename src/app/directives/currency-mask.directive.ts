import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[currencyMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true
    }
  ]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value;
    
    // Remove tudo exceto números
    value = value.replace(/\D/g, '');
    
    if (value === '') {
      this.el.nativeElement.value = '';
      this.onChange(0);
      return;
    }
    
    // Converte para número com 2 casas decimais
    const numericValue = parseFloat(value) / 100;
    
    // Formata como moeda brasileira
    const formattedValue = this.formatCurrency(numericValue);
    
    this.el.nativeElement.value = formattedValue;
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any): void {
    // Seleciona todo o texto ao focar
    setTimeout(() => {
      event.target.select();
    }, 0);
  }

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      this.el.nativeElement.value = this.formatCurrency(numericValue);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
