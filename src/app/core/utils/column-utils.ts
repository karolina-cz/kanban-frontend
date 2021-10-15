import {ColumnLimitInterface} from '../interfaces/column-limit/column-limit-interface';
import {columnsKanbanSystem} from '../enums/room/column-name';
import {ColumnLimitType} from '../enums/column-limit/column-limit-type.enum';

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
