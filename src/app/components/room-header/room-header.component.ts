import {Component, OnDestroy, OnInit} from '@angular/core';
import {faBars, faChevronLeft, faChevronRight, faEye, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {MemberType} from '../../core/models/memberType';
import {MemberService} from '../../core/services/members/member.service';
import {MemberDto} from '../../core/models/memberDto';
import {ActivatedRoute} from '@angular/router';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {Subscription} from 'rxjs';
import {TaskService} from '../../core/services/tasks/task.service';
import {RoomService} from '../../core/services/room/room.service';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {DayService} from '../../core/services/day/day.service';
import {MatDialog} from '@angular/material/dialog';
import {LimitsDialogComponent} from '../limits-dialog/limits-dialog.component';
import {ColumnLimitService} from '../../core/services/column-limit/column-limit.service';
import {getSingleColumnLimitsOrdered} from '../../core/utils/column-utils';

@Component({
  selector: 'app-room-header',
  templateUrl: './room-header.component.html',
  styleUrls: ['./room-header.component.css']
})
export class RoomHeaderComponent implements OnInit, OnDestroy {
  isSidebarOpen ;
  faUserCircle = faUserCircle;
  color = 'red';
  members: MemberDto[] = [];
  dropdownOpen = false;
  faEye = faEye;
  roomId: string;
  roomType: string;
  faBars = faBars;
  toggleSub: Subscription;
  faCalendar = faCalendar;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  daySub: Subscription;
  constructor(private memberService: MemberService, private route: ActivatedRoute,
              public toggleService: SidebarToggleService, private taskService: TaskService,
              public roomService: RoomService, public dayService: DayService,
              private dialog: MatDialog, private columnLimitService: ColumnLimitService) {
  }

  toggleDropdownStatus(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.roomType = this.route.snapshot.url[0].path;
    this.memberService.getAllMembers(this.roomId).subscribe(data => {
      this.members = data.filter(member => member.active);
    });
    this.memberService.connect(this.roomId);
    this.memberService.data.subscribe(data => {
      this.members = data.filter(member => member.active);
    });
    this.toggleSub = this.toggleService.isOpenSubject.subscribe(value => this.isSidebarOpen = value);
  }

  ngOnDestroy(): void {
    this.toggleSub.unsubscribe();
  }

  onSetLimitsClicked(): void {
    this.dialog.open(LimitsDialogComponent, {
      width: '500px', maxHeight: '90%',
      data: {
        singleColumnLimits: getSingleColumnLimitsOrdered(this.columnLimitService.columnLimitSubject.getValue()),
        multipleColumnLimits: this.columnLimitService.columnLimitSubject.getValue().filter(el => el.limitType.toLowerCase() === 'multiple'),
        roomId: this.roomId
      }
    });
  }

  isViewer(type: string): string {
    return type === MemberType.VIEWER ? '(Przeglądający)' : '';
  }

  onGenerateTask(): void {
    this.taskService.generateTask(this.roomId).subscribe();
  }

  onDrawBlockers(): void{
    // todo zmienic tez na system tasks
    this.taskService.drawBlockers(this.taskService.boardTasks).subscribe();
  }

  nextDayClicked(): void {

  }

}
