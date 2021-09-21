import {ColumnLimitInterface} from '../interfaces/column-limit-interface';
import {columnsKanbanSystem} from '../models/column-name';
import {ColumnLimitType} from '../models/column-limit-type.enum';

export function getSingleColumnLimitsOrdered(columnLimits: ColumnLimitInterface[]): ColumnLimitInterface[] {
  const singleColumnLimits: ColumnLimitInterface[] = [];
  columnsKanbanSystem.forEach(columnName => {
    const columnLimit: ColumnLimitInterface = columnLimits.find(el =>
      el.limitType === ColumnLimitType.SINGLE && el.columns[0].toLowerCase() === columnName);
    if (columnLimit) {
      singleColumnLimits.push(columnLimit);
    }
  });
  return singleColumnLimits;
}
