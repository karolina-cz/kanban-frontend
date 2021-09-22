import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Room} from '../../interfaces/room/Room';
import {BehaviorSubject, Observable} from 'rxjs';
import {TaskService} from '../tasks/task.service';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public static dayCount = 10;
  day: number;
  daySubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  roomSubject: BehaviorSubject<Room> = new BehaviorSubject<Room>(null);
  roomId: string = null;
  constructor(private httpClient: HttpClient, private taskService: TaskService, private rxStompService: RxStompService) {
    this.daySubject.subscribe(value => {
      this.day = value;
      if (this.roomId !== null) {
        this.taskService.refreshTasks(this.roomId);
      }
    });
  }

  connect(roomId: string): void {
    this.rxStompService.watch('/topic/room/' + roomId + '/info').subscribe((message: Message) => {
      this.roomSubject.next(JSON.parse(message.body) as Room);
    });
  }

  createRoom(roomType: string): Observable<any> {
    const body: Room = {
      roomType
    };
    return this.httpClient.post(environment.apiUrl + '/room', body);
  }

  getRoom(roomId: string): Observable<Room> {
    return this.httpClient.get(environment.apiUrl + '/room/' + roomId);
  }

  patchRoom(roomId: string, room: Room): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + '/room/' + roomId, room);
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.httpClient.delete(environment.apiUrl + '/room/' + roomId);
  }

  // todo przeniesc to do dayService
  nextDay(): void {
    if (this.day < RoomService.dayCount) {
      this.daySubject.next(this.day + 1);
    }
  }

  previousDay(): void {
    if (this.day > 1) {
      this.daySubject.next(this.day - 1);
    }
  }
}
