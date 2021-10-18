import {Component, OnDestroy, OnInit} from '@angular/core';
import {faBars, faChevronLeft, faChevronRight, faEye, faInfoCircle, faShareSquare, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {MemberType} from '../../core/enums/member/member-type';
import {MemberService} from '../../core/services/members/member.service';
import {MemberDto} from '../../core/interfaces/member/member-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {TaskService} from '../../core/services/tasks/task.service';
import {RoomService} from '../../core/services/room/room.service';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {DayService} from '../../core/services/day/day.service';
import {MatDialog} from '@angular/material/dialog';
import {LimitsDialogComponent} from '../limits-dialog/limits-dialog.component';
import {ColumnLimitService} from '../../core/services/column-limit/column-limit.service';
import {getSingleColumnLimitsOrdered} from '../../core/utils/column-utils';
import {BlockersFormDialogComponent} from '../blockers-form-dialog/blockers-form-dialog.component';
import {Room} from '../../core/interfaces/room/room';
import {RoomType} from '../../core/enums/room/room-type';
import {skip} from 'rxjs/operators';
import {ColumnLimitType} from '../../core/enums/column-limit/column-limit-type.enum';
import {Member} from '../../core/models/member/member.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-header',
  templateUrl: './room-header.component.html',
  styleUrls: ['./room-header.component.css']
})
export class RoomHeaderComponent implements OnInit, OnDestroy {
  faUserCircle = faUserCircle;
  members: MemberDto[] = [];
  dropdownOpen = false;
  faEye = faEye;
  faInfo = faInfoCircle;
  room: Room = {roomId: null, roomType: null, blockersProbability: null};
  faBars = faBars;
  faCalendar = faCalendar;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  RoomTypeEnum = RoomType;
  MemberTypeEnum = MemberType;
  subscriptions: Subscription[] = [];
  faShareSquare = faShareSquare;

  constructor(private memberService: MemberService, private route: ActivatedRoute,
              public toggleService: SidebarToggleService, private taskService: TaskService,
              public roomService: RoomService, public dayService: DayService,
              private dialog: MatDialog, private columnLimitService: ColumnLimitService, private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.room.roomId = this.route.snapshot.params.id;
    this.room.roomType = this.route.snapshot.url[0].path === 'kanban-system' ? RoomType.KANBAN_SYSTEM : RoomType.KANBAN_BOARD;
    this.roomService.getRoom(this.room.roomId).subscribe(room => {
      if (room.type !== this.room.roomType) {
        this.router.navigate(['/']);
      }
      this.room.blockersProbability = room.blockersProbability;
    });
    this.roomService.connect(this.room.roomId);
    this.subscriptions.push(this.roomService.roomSubject.pipe(skip(1)).subscribe(room => {
      this.room.blockersProbability = room.blockersProbability;
    }));
    this.memberService.getAllMembers(this.room.roomId).subscribe(data => {
      this.members = data;
    });
    this.memberService.connect(this.room.roomId);
    this.subscriptions.push(this.memberService.dataObservable.subscribe(data => {
      this.members = data;
    }));
    // todo implement loader / disable buttons until data loaded
  }

  openSnackBar(): void {
    this.snackBar.open('Pomyślnie skopiowano link', 'Ok', {
      duration: 2000,
      panelClass: ['snackbar-white']
    });
  }

  onSetLimitsClicked(): void {
    this.dialog.open(LimitsDialogComponent, {
      width: '500px', maxHeight: '90%',
      data: {
        singleColumnLimits: getSingleColumnLimitsOrdered(this.columnLimitService.columnLimitSubject.getValue()),
        multipleColumnLimits: this.columnLimitService.columnLimitSubject.getValue().filter(el => el.limitType === ColumnLimitType.MULTIPLE),
        roomId: this.room.roomId
      }
    });
  }

  onSetProbabilityClicked(): void {
    const blockersEditDialog = this.dialog.open(BlockersFormDialogComponent, {
      maxHeight: '80%', data: {probability: this.room.blockersProbability}
    });
    blockersEditDialog.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.patchRoom(this.room.roomId, result).subscribe();
      }
    });
  }

  onGenerateTask(): void {
    this.taskService.generateTask(this.room.roomId).subscribe();
  }

  onDrawBlockers(): void {
    this.taskService.drawBlockers(this.room.roomType === RoomType.KANBAN_BOARD ? this.taskService.boardTasks : this.taskService.systemTasks,
      this.room.blockersProbability).subscribe();
  }
  get link(): string {
    return window.location.href;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.roomService.disconnect();
    this.dayService.daySubject = new BehaviorSubject<number>(1);
    this.roomService.roomSubject = new BehaviorSubject<Room>(null);
    this.memberService.disconnect();
    this.memberService.dataObservable = new BehaviorSubject<Member[]>([]);
  }

}
