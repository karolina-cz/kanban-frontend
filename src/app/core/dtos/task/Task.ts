import {TaskType} from '../../models/taskType';

export interface Task {
  taskId?: string;
  workPoints1?: string[];
  workPoints2?: string[];
  isBlocked?: boolean;
  type?: TaskType;
  kanbanColumn?: string;
  startDay?: number;
  endDay?: number;
  visibleFromDay?: number;
  effort?: number;
  name?: string;
  dueDay?: number;
  assignees?: string[];
}
