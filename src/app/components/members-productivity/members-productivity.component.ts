import {Component, OnDestroy, OnInit} from '@angular/core';
import {SidebarToggleService} from '../../core/services/toggle/sidebar-toggle.service';
import {faTimes, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {Member} from '../../core/models/member.model';
import {MemberService} from '../../core/services/members/member.service';
import {Subscription} from 'rxjs';
import {RoomService} from '../../core/services/room/room.service';
import {MemberType} from '../../core/models/memberType';

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

  constructor(public toggleService: SidebarToggleService, private memberService: MemberService, public roomService: RoomService) { }

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

}
