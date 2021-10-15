import {Component, OnDestroy, OnInit} from '@angular/core';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {ColumnName} from '../../core/enums/room/column-name';
import {BoardMemberTasks} from '../../core/models/task/board-member-tasks.model';
import {Member} from '../../core/models/member/member.model';
import {MemberType} from '../../core/enums/member/member-type';
import {faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {TaskService} from '../../core/services/tasks/task.service';
import {ActivatedRoute} from '@angular/router';
import {MemberService} from '../../core/services/members/member.service';
import TaskUtils from '../../core/utils/task-utils';
import {BehaviorSubject, forkJoin, Subscription} from 'rxjs';
import {Task} from '../../core/interfaces/task/task';
import {RoomService} from '../../core/services/room/room.service';
import {SimulationDayInterface} from '../../core/interfaces/simulation-day/simulation-day-interface';
import {skip} from 'rxjs/operators';
import {DayService} from '../../core/services/day/day.service';
import {InfoDialogComponent} from '../shared/info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SimulationDayService} from '../../core/services/simulation-day/simulation-day.service';

@Component({
  selector: 'app-kanban-board-columns',
  templateUrl: './kanban-board-columns.component.html',
  styleUrls: ['./kanban-board-columns.component.css']
})
export class KanbanBoardColumnsComponent implements OnInit, OnDestroy {
  roomId: string;
  members = [];
  allDaysTasks: KanbanBoardTask[] = [];
  tasks: KanbanBoardTask[];
  backlog: KanbanBoardTask[] = [];
  memberTasks: BoardMemberTasks[] = [];
  done = [];
  memberColumns = [ColumnName.STAGE_ONE_IN_PROGRESS, ColumnName.STAGE_ONE_DONE,
    ColumnName.STAGE_TWO];
  columns = [ColumnName.BACKLOG, ColumnName.STAGE_ONE_IN_PROGRESS, ColumnName.STAGE_ONE_DONE,
    ColumnName.STAGE_TWO, ColumnName.DONE];
  middleColumnIds = [];
  faUserCircle = faUserCircle;
  days: SimulationDayInterface[];
  subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private memberService: MemberService,
              private roomService: RoomService, private dayService: DayService, private dialog: MatDialog,
              private simulationDayService: SimulationDayService) {
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.simulationDayService.getDays('kanban-board').subscribe(res => {
        this.days = res;
        this.displayNewDayDialog(1);
      }
    );
    this.subscriptions.push(this.roomService.daySubject.pipe(skip(1)).subscribe(dayNumber => {
      this.displayNewDayDialog(dayNumber);
      this.handleNewTasks(this.allDaysTasks);
    }));
    this.subscriptions.push(this.dayService.dayClickedSubject.pipe(skip(1)).subscribe(day => {
      this.openDialog({day, narrative: this.days[day - 1]?.narrative});
    }));
    this.initializeData();
    this.observeTasks();
    this.observeMembers();
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
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.taskService.boardTasks = [];
    this.taskService.disconnect();
    this.taskService.boardTaskObservable = new BehaviorSubject<KanbanBoardTask[]>([]);
    this.dayService.dayClickedSubject = new BehaviorSubject<number>(1);
  }

  initializeData(): void {
    forkJoin([
      this.memberService.getAllMembers(this.roomId),
      this.taskService.getAllKanbanBoardTasks(this.roomId)]
    ).subscribe(([members, tasks]) => {
      this.allDaysTasks = JSON.parse(JSON.stringify(tasks));
      this.handleNewMembers(members);
      this.handleNewTasks(tasks);
    });
  }

  observeTasks(): void {
    this.taskService.connect(this.roomId, 'KANBAN_BOARD');
    this.subscriptions.push(this.taskService.boardTaskObservable.subscribe((tasks) => {
      this.allDaysTasks = JSON.parse(JSON.stringify(tasks));
      const openMenuTask = this.tasks?.find(task => task.isMenuOpen === true);
      if (openMenuTask) {
        const newTaskWithMenuOpen = tasks.find(task => task.taskId === openMenuTask.taskId);
        if (newTaskWithMenuOpen) {
          newTaskWithMenuOpen.isMenuOpen = true;
        }
      }
      this.handleNewTasks(tasks);
    }));
  }

  observeMembers(): void {
    this.subscriptions.push(
      this.memberService.dataObservable.subscribe(members => {
        this.handleNewMembers(members);
        this.handleNewTasks(this.tasks);
      })
    );
  }

  handleNewMembers(members: Member[]): void {
    this.members = members;
    this.initAssigneesColumns(members);
  }

  handleNewTasks(tasks: KanbanBoardTask[]): void {
    tasks = tasks.filter(task => task.visibleFromDay == null || task.visibleFromDay <= this.roomService.daySubject.getValue());
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
      taskDto.roomMembers = [this.memberTasks[assigneeId].member.roomMemberId];
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
