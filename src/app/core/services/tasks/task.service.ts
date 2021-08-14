import { Injectable } from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TaskResponse} from '../../dtos/task/TaskResponse';
import {KanbanBoardTask} from '../../models/task/kanban-board-task.model';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Task} from '../../dtos/task/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public static blockerProb = 0.25;
  public boardTaskObservable: BehaviorSubject<KanbanBoardTask[]> = new BehaviorSubject<KanbanBoardTask[]>([]);
  boardTasks: KanbanBoardTask[];
  boardData = this.boardTaskObservable.asObservable();
  public canEmmit = true;

  constructor(private rxStompService: RxStompService, private httpClient: HttpClient) {
    this.boardTaskObservable.subscribe(value => this.boardTasks = value);
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
      if (this.canEmmit) {
        const jsonBody = JSON.parse(message.body);
        const tasks: TaskResponse[] = jsonBody as TaskResponse[];
        if (roomType === 'KANBAN_BOARD') {
          const allTasks = this.mapTaskResponse<KanbanBoardTask>(tasks, KanbanBoardTask);
          // allTasks = allTasks.filter(task => {
          //   return !(task.visibleFromDay !== null && task.visibleFromDay > this.roomService.day);
          // });
          this.boardTaskObservable.next(allTasks);
        }
      }
    });
  }

  refreshTasks(roomId: string): void {
    this.getAllKanbanBoardTasks(roomId).subscribe(value => {
      // value = value.filter(task => {
      //   return !(task.visibleFromDay !== null && task.visibleFromDay > this.roomService.day);
      // });
      this.boardTaskObservable.next(value);
    });
  }

  getAllKanbanBoardTasks(roomId: string): Observable<KanbanBoardTask[]> {
    return this.httpClient.get<TaskResponse[]>(environment.apiUrl + '/task/room/' + roomId).pipe(
      map(tasksDto => {
        console.log(tasksDto);
        const tasks = this.mapTaskResponse(tasksDto, KanbanBoardTask);
        this.boardTasks = tasks;
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
