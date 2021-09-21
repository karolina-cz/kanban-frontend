import {TaskType} from '../taskType';
import {Member} from '../member.model';
import {TaskResponse} from '../../interfaces/task/TaskResponse';

export class KanbanSystemTask {
  taskId: string;
  workPoints1: string[];
  workPoints2: string[];
  isBlocked: boolean;
  type: TaskType;
  kanbanColumn: string;
  visibleFromDay: number;
  startDay: number;
  endDay: number;
  dueDay: number;
  name: string;
  assignees: Member[];
  isMenuOpen?: boolean;
  selectedColor?: string;

  constructor(taskRes: TaskResponse) {
    if (taskRes.roomMembers.length > 0) {
      this.assignees = taskRes.roomMembers;
    } else {
      this.assignees = [];
    }
    this.taskId = taskRes.taskId;
    this.workPoints1 = taskRes.workPoints1;
    this.workPoints2 = taskRes.workPoints2;
    this.isBlocked = taskRes.isBlocked;
    this.kanbanColumn = taskRes.kanbanColumn.toLowerCase();
    this.visibleFromDay = taskRes.visibleFromDay;
    this.name = taskRes.name;
    this.startDay = taskRes.startDay;
    this.endDay = taskRes.endDay;
    this.dueDay = taskRes.dueDay;
    this.type = taskRes.type;
    this.isMenuOpen = false;
  }
}
