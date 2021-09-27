import {Component, OnDestroy, OnInit} from '@angular/core';
import { columnsKanbanSystem} from '../../core/models/column-name';
import {forkJoin, Subscription} from 'rxjs';
import {TaskService} from '../../core/services/tasks/task.service';
import {ActivatedRoute} from '@angular/router';
import {MemberService} from '../../core/services/members/member.service';
import {RoomService} from '../../core/services/room/room.service';
import {KanbanSystemTask} from '../../core/models/task/kanban-system-task.model';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {Task} from '../../core/interfaces/task/Task';
import TaskUtils from '../../core/utils/taskUtils';
import { SimulationDayInterface} from '../../core/interfaces/day-interface';
import {InfoDialogComponent} from '../shared/info-dialog/info-dialog.component';
import {DayService} from '../../core/services/day/day.service';
import {MatDialog} from '@angular/material/dialog';
import {skip} from 'rxjs/operators';
import {ColumnLimitService} from '../../core/services/column-limit/column-limit.service';
import {ColumnLimitInterface} from '../../core/interfaces/column-limit-interface';
import {ColumnLimitType} from '../../core/models/column-limit-type.enum';
import {SimulationDayService} from '../../core/services/simulation-day/simulation-day.service';
import {RoomType} from '../../core/models/room/room-type';

@Component({
  selector: 'app-kanban-system-columns',
  templateUrl: './kanban-system-columns.component.html',
  styleUrls: ['./kanban-system-columns.component.css']
})
export class KanbanSystemColumnsComponent implements OnInit, OnDestroy {
  roomId: string;
  members = [];
  tasks: KanbanSystemTask[];
  columns: {name: string, tasks: any[]}[];
  days: SimulationDayInterface[];
  singleColumnLimits: {columnName: string, limit: ColumnLimitInterface}[]; // todo merge singleColumnLimits ans columns
  multipleColumnLimits: ColumnLimitInterface[];
  subscriptions: Subscription[] = [];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private memberService: MemberService,
              private roomService: RoomService, private dayService: DayService, private dialog: MatDialog,
              private columnLimitService: ColumnLimitService, private simulationDayService: SimulationDayService) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.singleColumnLimits = columnsKanbanSystem.map(column => ({columnName: column, limit: null}));
    this.columns = columnsKanbanSystem.map(column => ({name: column, tasks: []}));
    this.simulationDayService.getDays().subscribe(res => {
        this.days = res;
        this.displayNewDayDialog(1);
      }
    );
    this.subscriptions.push(this.roomService.daySubject.pipe(skip(1)).subscribe(dayNumber => {
      this.taskService.refreshTasks(this.roomId, RoomType.KANBAN_SYSTEM);
      this.displayNewDayDialog(dayNumber);
    }));
    this.subscriptions.push(this.dayService.dayClickedSubject.pipe(skip(1)).subscribe(day => {
      this.openDialog({day, narrative: this.days[day - 1]?.narrative});
    }));
    this.subscriptions.push(this.columnLimitService.columnLimitSubject.pipe(skip(1)).subscribe(limits => {
      this.handleNewColumnLimits(limits);
    }));
    this.initializeData();
    this.observeTasks();
    this.observeMembers();
    this.columnLimitService.connect(this.roomId);
  }
// todo wyswietlanie info o danym dniu zrobic bardziej generycznie - zeby nie bylo powtorzen w board i system
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

  initializeData(): void {
    forkJoin([
      this.memberService.getAllMembers(this.roomId),
      this.taskService.getAllKanbanSystemTasks(this.roomId),
      this.columnLimitService.getAllColumnLimits(this.roomId)]
    ).subscribe(([members, tasks, columnLimits]) => {
      this.members = members;
      this.handleNewTasks(tasks);
      this.handleNewColumnLimits(columnLimits);
    });
  }

  handleNewColumnLimits(columnLimits: ColumnLimitInterface[]): void {
    columnLimits.filter(el => el.limitType === ColumnLimitType.SINGLE).forEach(limit => {
      const columnLimit: any = this.singleColumnLimits.find(el => el.columnName.toUpperCase() === limit.columns[0]);
      if (columnLimit) {
        columnLimit.limit = limit;
      }
    });
    this.multipleColumnLimits = columnLimits.filter(el => el.limitType === ColumnLimitType.MULTIPLE);
  }

  handleNewTasks(tasks: KanbanSystemTask[]): void {
    tasks = tasks.filter(task => task.visibleFromDay === null || task.visibleFromDay <= this.roomService.day);
    this.columns.forEach(element => element.tasks = []);
    this.tasks = TaskUtils.sortTasksByNames(tasks);
    tasks.forEach(task => {
      this.columns.find(element => element.name === task.kanbanColumn).tasks.push(task);
    });
  }

  observeTasks(): void {
    this.taskService.connect(this.roomId, 'KANBAN_SYSTEM');
    this.subscriptions.push(this.taskService.kanbanSystemData.subscribe((tasks) => {
      let previousTasks: KanbanSystemTask[] = [];
      this.columns.forEach(column => previousTasks = previousTasks.concat(column.tasks));
      const openMenuTask = previousTasks.find(task => task.isMenuOpen === true);
      if (openMenuTask) {
        const newTaskWithMenuOpen = tasks.find(task => task.taskId === openMenuTask.taskId);
        if (newTaskWithMenuOpen) {
          newTaskWithMenuOpen.isMenuOpen = true;
        }
      }
      tasks.forEach(task => {
        const previousTask = previousTasks.find(el => el.taskId === task.taskId);
        if (previousTask) {
          task.selectedColor = previousTask.selectedColor;
        }
      });
      this.handleNewTasks(tasks);
    }));
  }

  observeMembers(): void {
    this.subscriptions.push(
      this.memberService.dataObservable.subscribe(members => {
        this.members = members;
      })
    );
  }

  drop(event: CdkDragDrop<KanbanSystemTask[]>): void {
    if (event.previousContainer !== event.container) {
      this.updateTaskColumn(event);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  updateTaskColumn(event: CdkDragDrop<KanbanSystemTask[]>): void{
    const task = event.previousContainer.data[event.previousIndex];
    const kanbanColumn = event.container.id;
    task.kanbanColumn = kanbanColumn;
    const taskDto: Task = {
      kanbanColumn: kanbanColumn.toUpperCase()
    };
    this.taskService.patchTask(taskDto, task.taskId).subscribe();
  }

  getMultipleColumnLimit(columns: string[]): number {
    return columns.map(column => this.columns.find(el => el.name === column.toLowerCase()).tasks.length).reduce((a, b) => a + b, 0);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }

}
