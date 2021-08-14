import {Member} from '../member.model';
import {TaskType} from '../taskType';
import {TaskResponse} from '../../dtos/task/TaskResponse';

export class KanbanBoardTask{
  taskId: string;
  workPoints1: string[];
  workPoints2: string[];
  isBlocked: boolean;
  type: TaskType;
  kanbanColumn: string;
  visibleFromDay: number;
  dueDay: number;
  effort: number;
  name: string;
  assignee: Member;

  constructor(taskRes: TaskResponse) {
    if (taskRes.roomMembers.length > 0) {
      this.assignee = taskRes.roomMembers[0];
    } else {
      this.assignee = null;
    }
    this.taskId = taskRes.taskId;
    this.workPoints1 = taskRes.workPoints1;
    this.workPoints2 = taskRes.workPoints2;
    this.isBlocked = taskRes.isBlocked;
    this.kanbanColumn = taskRes.kanbanColumn.toLowerCase();
    this.visibleFromDay = taskRes.visibleFromDay;
    this.effort = taskRes.effort;
    this.name = taskRes.name;
    this.dueDay = taskRes.dueDay;
    this.type = taskRes.type;
  }
}
