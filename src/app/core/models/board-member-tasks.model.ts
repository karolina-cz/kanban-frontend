import {Member} from './member.model';
import {KanbanBoardTask} from './task/kanban-board-task.model';
import {ColumnName} from './column-name';

export class BoardMemberTasks {
  member: Member;
  columnTasks: Map<ColumnName, KanbanBoardTask[]>;

  constructor(member: Member, columnTasks: Map<ColumnName, KanbanBoardTask[]>) {
    this.member = member;
    this.columnTasks = columnTasks;
  }
}
