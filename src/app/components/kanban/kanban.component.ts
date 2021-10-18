import {Component, OnInit} from '@angular/core';
import {MemberService} from '../../core/services/members/member.service';
import {ActivatedRoute} from '@angular/router';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RoomType} from '../../core/enums/room/room-type';

@Component({
  selector: 'app-kanban-system',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  isMemberRegistered: boolean;
  roomId: string;
  currentRoomMember;
  roomType: RoomType;
  roomTypeEnum = RoomType;

  constructor(private memberService: MemberService, private route: ActivatedRoute, public toggleService: SidebarToggleService,
              public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.roomType = this.route.snapshot.url[0].path === 'kanban-system' ? RoomType.KANBAN_SYSTEM : RoomType.KANBAN_BOARD;
    this.currentRoomMember = this.memberService.getCurrentRoomMember(this.roomId);
    this.isMemberRegistered = !!this.currentRoomMember;
  }

  conditionallyShowInfo(canShow: boolean): void {
    if (canShow) {
      this.snackBar.open('Przepraszamy, liczba członków zespołu jest zbyt duża, zostałeś/aś dodany jako Zwykły uczestnik.', 'Ok', {
        panelClass: ['snackbar-white']
      });
    }
  }

}
