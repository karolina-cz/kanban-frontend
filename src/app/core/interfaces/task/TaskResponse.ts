import {Member} from '../../models/member.model';
import {TaskType} from '../../models/taskType';

export interface TaskResponse {
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
  assignees?: Member[];
  dueDay?: number;
}
