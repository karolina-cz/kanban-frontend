import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {faBars, faChevronLeft, faChevronRight, faEye, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {MemberType} from '../../core/models/memberType';
import {MemberService} from '../../core/services/members/member.service';
import {MemberDto} from '../../core/models/memberDto';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Member} from '../../core/models/member.model';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {Subscription} from 'rxjs';
import {TaskService} from '../../core/services/tasks/task.service';
import {RoomService} from '../../core/services/room/room.service';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';

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
  faBars = faBars;
  toggleSub: Subscription;
  faCalendar = faCalendar;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  daySub: Subscription;
  constructor(private memberService: MemberService, private route: ActivatedRoute,
              public toggleService: SidebarToggleService, private taskService: TaskService,
              public roomService: RoomService) {
  }

  toggleDropdownStatus(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
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

}
