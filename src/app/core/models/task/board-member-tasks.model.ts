import {Member} from '../member/member.model';
import {KanbanBoardTask} from './kanban-board-task.model';
import {ColumnName} from '../../enums/room/column-name';

export class BoardMemberTasks {
  member: Member;
  columnTasks: Map<ColumnName, KanbanBoardTask[]>;

  constructor(member: Member, columnTasks: Map<ColumnName, KanbanBoardTask[]>) {
    this.member = member;
    this.columnTasks = columnTasks;
  }
}
