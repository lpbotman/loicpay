import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'flexibleNumber' })
export class FlexibleNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '';

    // Détermine si le nombre est entier
    const isInteger = value % 1 === 0;

    // Utilise l'API Intl.NumberFormat avec le locale 'fr-FR'
    const formatter = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });

    return formatter.format(value);
  }
}
