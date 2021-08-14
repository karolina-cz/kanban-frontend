import { Pipe, PipeTransform } from '@angular/core';
import {TaskType} from '../models/taskType';

@Pipe({
  name: 'taskType'
})
export class TaskTypePipe implements PipeTransform {

  transform(value: TaskType): string {
    switch (value){
      case TaskType.FIXED_DATE:
        return 'ustalona data';
      case TaskType.STANDARD:
        return 'standard';
      case TaskType.URGENT:
        return 'pilne';
    }
  }

}
