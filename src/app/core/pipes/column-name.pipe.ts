import { Pipe, PipeTransform } from '@angular/core';
import { columnNameToDisplay } from '../models/column-name';

@Pipe({
  name: 'columnName'
})
export class ColumnNamePipe implements PipeTransform {

  transform(value: string[] | string, separator?: string): string {
    if (Array.isArray(value) && value.length) {
      return value.map(el => columnNameToDisplay[el.toLowerCase()]).join(separator ? separator : ', ');
    } else if (value && typeof value === 'string') {
      return columnNameToDisplay[value.toLowerCase()];
    } else {
      return '';
    }
  }
}
