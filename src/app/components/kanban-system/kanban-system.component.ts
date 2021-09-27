import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MemberService} from '../../core/services/members/member.service';
import {ActivatedRoute} from '@angular/router';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-kanban-system',
  templateUrl: './kanban-system.component.html',
  styleUrls: ['./kanban-system.component.css']
})
export class KanbanSystemComponent implements OnInit, OnDestroy {
  isSidebarOpen;
  isMemberRegistered: boolean;
  roomId: string;
  faTimes = faTimes;
  toggleSub: Subscription;
  currentRoomMember;

  constructor(private memberService: MemberService, private route: ActivatedRoute, public toggleService: SidebarToggleService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.currentRoomMember = this.memberService.getCurrentRoomMember(this.roomId);
    this.isMemberRegistered = !!this.currentRoomMember;
    if (this.isMemberRegistered === true){
      // this.memberService.patchRoomMember({roomMemberId: this.currentRoomMember.roomMemberId, isActive: true}).subscribe();
    }
    this.toggleSub = this.toggleService.isOpenSubject.subscribe(value => this.isSidebarOpen = value);
  }

  ngOnDestroy(): void {
    this.toggleSub.unsubscribe();
    if (this.isMemberRegistered) {
      // this.memberService.patchRoomMember({roomMemberId: this.currentRoomMember.roomMemberId, isActive: false}).subscribe();
    }
  }

}
