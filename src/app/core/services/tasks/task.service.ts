import { Injectable } from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TaskResponse} from '../../interfaces/task/TaskResponse';
import {KanbanBoardTask} from '../../models/task/kanban-board-task.model';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Task} from '../../interfaces/task/Task';
import {KanbanSystemTask} from '../../models/task/kanban-system-task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public static blockerProb = 0.25;
  public boardTaskObservable: BehaviorSubject<KanbanBoardTask[]> = new BehaviorSubject<KanbanBoardTask[]>([]);
  public systemTaskObservable: BehaviorSubject<KanbanSystemTask[]> = new BehaviorSubject<KanbanSystemTask[]>([]);
  boardTasks: KanbanBoardTask[];
  systemTasks: KanbanSystemTask[];
  boardData = this.boardTaskObservable.asObservable();
  kanbanSystemData = this.systemTaskObservable.asObservable();

  constructor(private rxStompService: RxStompService, private httpClient: HttpClient) {
    this.boardTaskObservable.subscribe(value => this.boardTasks = value);
    this.systemTaskObservable.subscribe(value => this.systemTasks = value);
  }

  private mapTaskResponse<T>(tasksRes: TaskResponse[], type: new(task: TaskResponse) => T): T[] {
    const tasks: T[] = [];
    for (const task of tasksRes) {
      tasks.push(new type(task));
    }
    return tasks;
  }

  connect(roomId: string, roomType: string): void {
    this.rxStompService.watch('/topic/room/' + roomId + '/tasks').subscribe((message: Message) => {
        const jsonBody = JSON.parse(message.body);
        const tasks: TaskResponse[] = jsonBody as TaskResponse[];
        if (roomType === 'KANBAN_BOARD') {
          this.boardTaskObservable.next(this.mapTaskResponse<KanbanBoardTask>(tasks, KanbanBoardTask));
        } else {
          this.systemTaskObservable.next(this.mapTaskResponse<KanbanSystemTask>(tasks, KanbanSystemTask));
        }
    });
  }

  refreshTasks(roomId: string): void {
    // todo refresh both
    this.getAllKanbanBoardTasks(roomId).subscribe(value => {
      this.boardTaskObservable.next(value);
    });
  }

  getAllKanbanBoardTasks(roomId: string): Observable<KanbanBoardTask[]> {
    return this.httpClient.get<TaskResponse[]>(environment.apiUrl + '/task/room/' + roomId).pipe(
      map(tasksDto => {
        const tasks: KanbanBoardTask[] = this.mapTaskResponse(tasksDto, KanbanBoardTask);
        this.boardTasks = tasks;
        return tasks;
      })
    );
  }

  getAllKanbanSystemTasks(roomId: string): Observable<KanbanSystemTask[]> {
    return this.httpClient.get<TaskResponse[]>(environment.apiUrl + '/task/room/' + roomId).pipe(
      map(tasksDto => {
        const tasks: KanbanSystemTask[] = this.mapTaskResponse(tasksDto, KanbanSystemTask);
        this.systemTasks = tasks;
        return tasks;
      })
    );
  }


  patchTask(task: Task, taskId: string): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + '/task/' + taskId, task);
  }

  addAssignee(taskId: string, memberId: string): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/task/' + taskId + '/roomMember/' + memberId, null);
  }

  deleteAssignee(taskId: string, memberId: string): Observable<any> {
    return this.httpClient.delete(environment.apiUrl + '/task/' + taskId + '/roomMember/' + memberId);
  }

  patchAssignee(taskId: string, memberId: string): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + '/task/' + taskId + '/roomMember/' + memberId, null);
  }

  generateTask(roomId: string): Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/task/room/' + roomId, null);
  }

  drawBlockers(tasks: Task[]): Observable<any> {
    console.log('tasks', tasks);
    const body: Task[] = [];
    for (const task of tasks){
        body.push({
          taskId: task.taskId,
          isBlocked: Math.random() < TaskService.blockerProb
        });
    }
    return this.httpClient.patch(environment.apiUrl + '/task', body);
  }

}
