import {Component, OnDestroy, OnInit} from '@angular/core';
import {MemberService} from '../../core/services/members/member.service';
import {ActivatedRoute} from '@angular/router';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  isSidebarOpen;
  isMemberRegistered: boolean;
  roomId: string;
  faTimes = faTimes;
  toggleSub: Subscription;
  currentRoomMember;

  constructor(private memberService: MemberService, private route: ActivatedRoute, public toggleService: SidebarToggleService,
              private snackBar: MatSnackBar) { }

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

  conditionallyShowInfo(canShow: boolean): void {
    if (canShow) {
      this.snackBar.open('Przepraszamy, liczba członków zespołu jest zbyt duża, zostałeś dodany jako przeglądający.', 'Ok', {
        panelClass: ['snackbar-white']
      });
    }
  }

}

