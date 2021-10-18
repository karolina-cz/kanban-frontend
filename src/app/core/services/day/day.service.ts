import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RoomService} from '../room/room.service';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  static readonly DAYS_NUMBER = 10;
  daySubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  dayClickedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  constructor() { }

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

  nextDay(): void {
    if (this.daySubject.getValue() < RoomService.dayCount) {
      this.daySubject.next(this.daySubject.getValue() + 1);
    }
  }

  previousDay(): void {
    if (this.daySubject.getValue() > 1) {
      this.daySubject.next(this.daySubject.getValue() - 1);
    }
  }
}
