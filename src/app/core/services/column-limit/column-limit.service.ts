import { Injectable } from '@angular/core';
import {Message} from '@stomp/stompjs';
import {TaskResponse} from '../../dtos/task/TaskResponse';
import {KanbanBoardTask} from '../../models/task/kanban-board-task.model';
import {KanbanSystemTask} from '../../models/task/kanban-system-task.model';
import {RxStompService} from '@stomp/ng2-stompjs';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColumnLimitService {
  public columnLimitSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // todo dodac interfejs column limit

  constructor(private rxStompService: RxStompService) { }

  connect(roomId: string): void {
    this.rxStompService.watch('/topic/room/' + roomId + '/columnLimits').subscribe((message: Message) => {
      const jsonBody = JSON.parse(message.body);
      console.log('nowe limity ', jsonBody);
      this.columnLimitSubject.next(jsonBody);
    });
  }
}
