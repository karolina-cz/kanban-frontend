import { Injectable } from '@angular/core';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ColumnLimitInterface, CreateColumnLimitInterface} from '../../interfaces/column-limit-interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColumnLimitService {
  public columnLimitSubject: BehaviorSubject<ColumnLimitInterface[]> = new BehaviorSubject<ColumnLimitInterface[]>(null);
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService, private httpClient: HttpClient) { }

  connect(roomId: string): void {
    this.topicSubscription = this.rxStompService.watch('/topic/room/' + roomId + '/columnLimits').subscribe((message: Message) => {
      const jsonBody = JSON.parse(message.body);
      this.columnLimitSubject.next(jsonBody);
    });
  }

  disconnect(): void {
    this.topicSubscription.unsubscribe();
  }

  getAllColumnLimits(roomId: string): Observable<ColumnLimitInterface[]> {
    return this.httpClient.get<ColumnLimitInterface[]>(environment.apiUrl + '/columnLimit/room/' + roomId).pipe(
      tap( res => this.columnLimitSubject.next(res))
      );
  }

  createColumnLimits(columnLimits: CreateColumnLimitInterface[]): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/columnLimit', columnLimits);
  }

  patchColumnLimits(columnLimits: ColumnLimitInterface[]): Observable<any> {
    return this.httpClient.patch(environment.apiUrl + '/columnLimit', columnLimits);
  }

  deleteColumnLimits(columnLimitIds: {columnLimitId: string}[]): Observable<any> {
    return this.httpClient.request('delete', environment.apiUrl + '/columnLimit', {body: columnLimitIds});
  }
}
