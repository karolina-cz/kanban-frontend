import {Component, OnDestroy, OnInit} from '@angular/core';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {ColumnName} from '../../core/models/column-name';
import {BoardMemberTasks} from '../../core/models/board-member-tasks.model';
import {Member} from '../../core/models/member.model';
import {MemberType} from '../../core/models/memberType';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {TaskService} from '../../core/services/tasks/task.service';
import {ActivatedRoute} from '@angular/router';
import {MemberService} from '../../core/services/members/member.service';
import TaskUtils from '../../core/utils/taskUtils';
import {forkJoin, Subscription} from 'rxjs';
import {Task} from '../../core/interfaces/task/Task';
import {RoomService} from '../../core/services/room/room.service';
import {SimulationDayInterface} from '../../core/interfaces/day-interface';
import {skip} from 'rxjs/operators';
import {DayService} from '../../core/services/day/day.service';
import {InfoDialogComponent} from '../shared/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SimulationDayService} from '../../core/services/simulation-day/simulation-day.service';
import {RoomType} from '../../core/models/room/room-type';

@Component({
  selector: 'app-kanban-board-columns',
  templateUrl: './kanban-board-columns.component.html',
  styleUrls: ['./kanban-board-columns.component.css']
})
export class KanbanBoardColumnsComponent implements OnInit, OnDestroy {
  roomId: string;
  members = [];
  tasks: KanbanBoardTask[];
  backlog: KanbanBoardTask[] = [];
  memberTasks: BoardMemberTasks[] = [];
  done = [];
  taskSubscription: Subscription;

  memberColumns = [ColumnName.STAGE_ONE_IN_PROGRESS, ColumnName.STAGE_ONE_DONE,
    ColumnName.STAGE_TWO];
  columns = [ColumnName.BACKLOG, ColumnName.STAGE_ONE_IN_PROGRESS, ColumnName.STAGE_ONE_DONE,
    ColumnName.STAGE_TWO, ColumnName.DONE];
  middleColumnIds = [];
  faUserCircle = faUserCircle;
  days: SimulationDayInterface[];
  daySubscription: Subscription;
  dayInfoSubscription: Subscription;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private memberService: MemberService,
              private roomService: RoomService, private dayService: DayService, private dialog: MatDialog,
              private simulationDayService: SimulationDayService) {
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.simulationDayService.getDays().subscribe(res => {
        this.days = res;
        this.displayNewDayDialog(1);
      }
    );
    this.daySubscription = this.roomService.daySubject.pipe(skip(1)).subscribe(dayNumber => {
      this.displayNewDayDialog(dayNumber);
      console.log('new day konaban-column', dayNumber);
    });
    this.dayInfoSubscription = this.dayService.dayInfoSubject.pipe(skip(1)).subscribe(day => {
      this.openDialog({day, narrative: this.days[day - 1]?.narrative});
    });
    this.initializeData();
    this.observeTasks();
    this.roomService.daySubject.subscribe(() => {
        this.taskService.refreshTasks(this.roomId, RoomType.KANBAN_BOARD);
    });
  }

  // wyswietlanie info o danym dniu zrobic bardziej generycznie - zeby nie bylo powtorzen w board i system
  displayNewDayDialog(day: number): void {
    if (!this.dayService.dayViewed(day - 1, this.roomId)) {
      this.dayService.setDayAsViewed(day - 1, this.roomId);
      this.openDialog({day, narrative: this.days[day - 1]?.narrative});
    }
  }

  openDialog(data: any): void {
    this.dialog.open(InfoDialogComponent, {
      width: '500px', maxHeight: '80%',
      data
    });
  }

  ngOnDestroy(): void {
    this.taskSubscription.unsubscribe();
  }

  initializeData(): void {
    forkJoin([
      this.memberService.getAllMembers(this.roomId),
      this.taskService.getAllKanbanBoardTasks(this.roomId)]
    ).subscribe(([members, tasks]) => {
      this.handleNewMembers(members);
      this.handleNewTasks(tasks);
    });
  }

  observeTasks(): void {
    this.taskService.connect(this.roomId, 'KANBAN_BOARD');
    this.taskSubscription = this.taskService.boardData.subscribe((tasks) => {
      this.handleNewTasks(tasks);
    });
  }

  handleNewMembers(members: Member[]): void {
    this.members = members;
    this.initAssigneesColumns(members);
  }

  handleNewTasks(tasks: KanbanBoardTask[]): void {
    tasks = tasks.filter(task => task.visibleFromDay == null || task.visibleFromDay <= this.roomService.day);
    this.clearAllColumns();
    this.tasks = TaskUtils.sortTasksByNames(tasks);
    for (const task of tasks) {
      this.assignTaskToColumn(task);
    }
  }


  clearAllColumns(): void {
    this.backlog = [];
    this.done = [];
    for (const item of this.memberTasks) {
      item.columnTasks.set(ColumnName.STAGE_ONE_DONE, []);
      item.columnTasks.set(ColumnName.STAGE_ONE_IN_PROGRESS, []);
      item.columnTasks.set(ColumnName.STAGE_TWO, []);
    }
  }

  drop(event: CdkDragDrop<KanbanBoardTask[]>): void {
    if (event.previousContainer !== event.container) {
      this.updateTaskColumn(event);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  updateTaskColumn(event: CdkDragDrop<KanbanBoardTask[]>): void{
    const task = event.previousContainer.data[event.previousIndex];
    const kanbanColumn = event.container.id.split('-', 1)[0];
    task.kanbanColumn = kanbanColumn;
    const taskDto: Task = {
      kanbanColumn: kanbanColumn.toUpperCase()
    };
    if (task.assignee === null && this.isKanbanColumnAssigneeColumn(kanbanColumn)){
      const assigneeId: number = +event.container.id.split('-', 2)[1];
      taskDto.assignees = [this.memberTasks[assigneeId].member.roomMemberId];
    }
    this.taskService.patchTask(taskDto, task.taskId).subscribe();
  }

  assignTaskToColumn(task: KanbanBoardTask): void {
    switch (task.kanbanColumn) {
      case ColumnName.BACKLOG: {
        this.backlog.push(task);
        break;
      }
      case ColumnName.DONE : {
        this.done.push(task);
        break;
      }
      default: {
        if (task.assignee !== null) {
          const memberTask = this.memberTasks.filter(x => x.member.roomMemberId === task.assignee.roomMemberId)[0];
          memberTask.columnTasks.get(task.kanbanColumn as ColumnName).push(task);
        }
        break;
      }
    }
  }

  initAssigneesColumns(members: Member[]): void {
    this.memberTasks = [];
    for (const member of members) {
      if (member.type === MemberType.PARTICIPANT) {
        const columnToTask = new Map();
        columnToTask.set(ColumnName.STAGE_ONE_IN_PROGRESS, []);
        columnToTask.set(ColumnName.STAGE_ONE_DONE, []);
        columnToTask.set(ColumnName.STAGE_TWO, []);
        this.memberTasks.push(new BoardMemberTasks(member, columnToTask));
      }
    }
    this.getContainersIds();
  }

  getContainersIds(): string[] {
    const ids = [];
    for (const col of this.columns.slice(1, this.columns.length - 1)) {
      for (let i = 0; i < this.memberTasks.length; i++) {
        ids.push(col + '-' + i);
      }
    }
    this.middleColumnIds = ids;
    return ids;
  }

  getConnectedLists(columnName: ColumnName, memberIdx?: number): string[] {
    switch (columnName) {
      case ColumnName.BACKLOG:
        return this.middleColumnIds.concat([ColumnName.DONE]);
      case ColumnName.STAGE_ONE_IN_PROGRESS:
        return [ColumnName.STAGE_ONE_DONE + '-' + memberIdx, ColumnName.STAGE_TWO + '-' + memberIdx,
          ColumnName.BACKLOG, ColumnName.DONE];
      case ColumnName.STAGE_ONE_DONE:
        return [ColumnName.STAGE_ONE_IN_PROGRESS + '-' + memberIdx, ColumnName.STAGE_TWO + '-' + memberIdx,
          ColumnName.BACKLOG, ColumnName.DONE];
      case ColumnName.STAGE_TWO:
        return [ColumnName.STAGE_ONE_IN_PROGRESS + '-' + memberIdx, ColumnName.STAGE_ONE_DONE + '-' + memberIdx,
          ColumnName.BACKLOG, ColumnName.DONE];
      case ColumnName.DONE:
        return this.middleColumnIds.concat([ColumnName.BACKLOG]);
    }
  }

  isKanbanColumnAssigneeColumn(column: string): boolean {
    return this.memberColumns.includes(column as ColumnName);
  }


}
