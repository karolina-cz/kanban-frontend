import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {DayInterface} from '../../interfaces/day-interface';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  static readonly DAYS_NUMBER = 10;
  dayInfoSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor(private httpClient: HttpClient) { }

  getDays(roomId: string): Observable<DayInterface[]> {
    return this.httpClient.get<DayInterface[]>(environment.apiUrl + '/day/room/' + roomId);
  }

  setDayAsViewed(day: number, roomId: string): void {
    const roomData = JSON.parse(localStorage.getItem(roomId));
    const daysViewed = roomData.daysViewed ? roomData.daysViewed : new Array(DayService.DAYS_NUMBER).fill(false);
    daysViewed[day] = true;
    Object.assign(roomData, {daysViewed});
    localStorage.setItem(roomId, JSON.stringify(roomData));
  }

  dayViewed(day: number, roomId: string): boolean {
    const roomData = JSON.parse(localStorage.getItem(roomId));
    return roomData?.daysViewed?.length ? roomData.daysViewed[day] : false;
  }
}
