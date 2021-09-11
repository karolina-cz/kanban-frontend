import { Component, OnInit } from '@angular/core';
import {ColumnName} from '../../core/models/column-name';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {forkJoin, Subscription} from 'rxjs';
import {TaskService} from '../../core/services/tasks/task.service';
import {ActivatedRoute} from '@angular/router';
import {MemberService} from '../../core/services/members/member.service';
import {RoomService} from '../../core/services/room/room.service';
import {KanbanSystemTask} from '../../core/models/task/kanban-system-task.model';
import {CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {Task} from '../../core/dtos/task/Task';
import TaskUtils from '../../core/utils/taskUtils';

@Component({
  selector: 'app-kanban-system-columns',
  templateUrl: './kanban-system-columns.component.html',
  styleUrls: ['./kanban-system-columns.component.css']
})
export class KanbanSystemColumnsComponent implements OnInit {
  roomId: string;
  members = [];
  tasks: KanbanSystemTask[];
  taskSubscription: Subscription;
  columns: {displayName: string, name: string, tasks: any[]}[] = [{displayName: 'Zadania', name: ColumnName.BACKLOG, tasks: []},
    {displayName: 'Etap 1 - Podjęte', name: ColumnName.STAGE_ONE_COMMITTED, tasks: []},
    {displayName: 'Etap 1 - W trakcie', name: ColumnName.STAGE_ONE_IN_PROGRESS, tasks: []},
    {displayName: 'Etap 1 - Wykonane', name: ColumnName.STAGE_ONE_DONE, tasks: []},
    {displayName: 'Etap 2', name: ColumnName.STAGE_TWO, tasks: []},
    {displayName: 'Wykonane', name: ColumnName.DONE, tasks: []}];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private memberService: MemberService,
              private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.initializeData();
    this.observeTasks();
  }

  initializeData(): void {
    forkJoin([
      this.memberService.getAllMembers(this.roomId),
      this.taskService.getAllKanbanSystemTasks(this.roomId)]
    ).subscribe(([members, tasks]) => {
      this.members = members;
      this.handleNewTasks(tasks);
    });
  }

  handleNewTasks(tasks: KanbanSystemTask[]): void {
    console.log('handle new tasks');
    tasks = tasks.filter(task => task.visibleFromDay === null || task.visibleFromDay <= this.roomService.day);
    // todo jezeli bedzie suuwanie taskow to tutaj trzeba to dodac
    // todo update zamiast nowej tablicy : task jest dodany, task jest usuniety, task jest update'owany
    // dla kazdego taska nowego wyszukujemy najpierw wszytskie taski z jego kolumny i wsrod tych takow szukamy naszego nowego taska na podstawie id
    // jezeli id zostalo znalezione to wtedy robimy update
    // jezeli task nie zostal znaleziony to musi byc dodany do odpowiedniej tablicy
    // potem sortujemy taski kazdej kolumny wedlug nazwy
    this.columns.forEach(element => element.tasks = []);
    this.tasks = TaskUtils.sortTasksByNames(tasks);
    tasks.forEach(task => {
      const columnTasks: KanbanSystemTask[] = this.columns.find(element => element.name === task.kanbanColumn).tasks;
      columnTasks.push(task);
    });
  }

  observeTasks(): void {
    this.taskService.connect(this.roomId, 'KANBAN_SYSTEM');
    this.taskSubscription = this.taskService.kanbanSystemData.subscribe((tasks) => {
      let previousTasks: KanbanSystemTask[] = [];
      this.columns.forEach(column => previousTasks = previousTasks.concat(column.tasks));
      console.log('prev tasks', previousTasks);
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
    });
  }

  drop(event: CdkDragDrop<KanbanSystemTask[]>): void {
    console.log('drop', event.previousContainer, event.container);
    if (event.previousContainer !== event.container) {
      console.log('diff');
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

}
