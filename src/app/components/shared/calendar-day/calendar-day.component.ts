import {Component, Input, OnInit} from '@angular/core';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit {
  @Input() day: number;
  @Input() size: number;
  faCalendar = faCalendar;

  constructor() { }

  ngOnInit(): void {
  }

}
