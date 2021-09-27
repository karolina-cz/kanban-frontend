import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
  }
}
