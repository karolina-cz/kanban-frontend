import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Room} from '../../interfaces/room/room';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {TaskService} from '../tasks/task.service';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  public static dayCount = 10;
  roomSubject: BehaviorSubject<Room> = new BehaviorSubject<Room>(null);
  private topicSubscription: Subscription;


  constructor(private httpClient: HttpClient, private taskService: TaskService, private rxStompService: RxStompService) {
  }

  connect(roomId: string): void {
    this.topicSubscription = this.rxStompService.watch('/topic/room/' + roomId + '/info').subscribe((message: Message) => {
      this.roomSubject.next(JSON.parse(message.body) as Room);
    });
  }

  disconnect(): void {
    this.topicSubscription.unsubscribe();
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
}
