import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  isOpen;
  isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.isOpenSubject.subscribe(value => this.isOpen = value);
  }
}
