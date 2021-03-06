import {Component, OnDestroy, OnInit} from '@angular/core';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {faExclamationCircle, faQuestionCircle, faTimes, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {Member} from '../../core/models/member/member.model';
import {MemberService} from '../../core/services/members/member.service';
import {Subscription} from 'rxjs';
import {RoomService} from '../../core/services/room/room.service';
import {MemberType} from '../../core/enums/member/member-type';
import {CheatSheetDialogComponent} from '../cheat-sheet-dialog/cheat-sheet-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DayService} from '../../core/services/day/day.service';
import {RoomType} from '../../core/enums/room/room-type';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-members-productivity',
  templateUrl: './members-productivity.component.html',
  styleUrls: ['./members-productivity.component.css']
})
export class MembersProductivityComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  members: Member[];
  membersSub: Subscription;
  faUserCircle = faUserCircle;
  faQuestionCircle = faQuestionCircle;
  faExclamationCircle = faExclamationCircle;

  constructor(public toggleService: SidebarToggleService, private memberService: MemberService, public roomService: RoomService,
              private dialog: MatDialog, public dayService: DayService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.membersSub = this.memberService.dataObservable.subscribe(members =>
      this.members = members.filter(member => member.type !== MemberType.VIEWER));
  }

  ngOnDestroy(): void {
    this.membersSub.unsubscribe();
  }

  onDrawProductivity(): void{
    this.memberService.drawProductivity().subscribe();
  }

  onShowHelpClicked(): void {
    this.dialog.open(CheatSheetDialogComponent, { maxWidth: '600px', maxHeight: '90%', data:
        {roomType:  this.route.snapshot.url[0].path === 'kanban-system' ? RoomType.KANBAN_SYSTEM : RoomType.KANBAN_BOARD}});
  }

}
