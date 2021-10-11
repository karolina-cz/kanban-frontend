import {TaskType} from '../taskType';
import {Member} from '../member.model';
import {TaskResponse} from '../../interfaces/task/TaskResponse';
import {WorkPoint} from '../../interfaces/work-point/work-point';

export class KanbanSystemTask {
  taskId: string;
  workPoints1: WorkPoint[];
  workPoints2: WorkPoint[];
  isBlocked: boolean;
  type: TaskType;
  kanbanColumn: string;
  visibleFromDay: number;
  startDay: number;
  endDay: number;
  dueDay: number;
  name: string;
  assignees: Member[];
  isHelperMenuOpen?: boolean;
  selectedColor?: string;

  constructor(taskRes: TaskResponse) {
    if (taskRes.assignees.length > 0) {
      this.assignees = taskRes.assignees;
    } else {
      this.assignees = [];
    }
    this.taskId = taskRes.taskId;
    this.workPoints1 = taskRes.workPoints.filter(el => el.stage === 0).sort((a, b) => a.pointIndex - b.pointIndex);
    this.workPoints2 = taskRes.workPoints.filter(el => el.stage === 1).sort((a, b) => a.pointIndex - b.pointIndex);
    this.isBlocked = taskRes.isBlocked;
    this.kanbanColumn = taskRes.kanbanColumn.toLowerCase();
    this.visibleFromDay = taskRes.visibleFromDay;
    this.name = taskRes.name;
    this.startDay = taskRes.startDay;
    this.endDay = taskRes.endDay;
    this.dueDay = taskRes.dueDay;
    this.type = taskRes.type;
    this.isHelperMenuOpen = false;
  }
}
