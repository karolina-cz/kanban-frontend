import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MemberService} from '../../core/services/members/member.service';
import {MemberDto} from '../../core/interfaces/member/member-dto';
import {ActivatedRoute} from '@angular/router';
import {MemberType} from '../../core/enums/member/member-type';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css']
})
export class NewMemberComponent implements OnInit {
  @Output() memberCreated = new EventEmitter<boolean>();
  memberForm: FormGroup;
  roomId: string;
  constructor(private memberService: MemberService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.params.id;
    this.memberForm = new FormGroup({
      name: new FormControl(''),
      memberType: new FormControl('participant'),
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      const member: MemberDto = {
        type: this.memberForm.value.memberType.toUpperCase(),
        name: this.memberForm.value.name,
        roomId: this.roomId
      };
      this.memberService.createRoomMember(member).subscribe((memberDto) => {
        const selectedType = member.type;
        member.roomMemberId = memberDto.roomMemberId;
        member.color = memberDto.color;
        member.type = memberDto.type;
        this.memberService.saveCurrentRoomMember(member);
        if (selectedType === MemberType.PARTICIPANT && memberDto.type !== MemberType.PARTICIPANT) {
          this.memberCreated.emit(true);
        } else {
          this.memberCreated.emit(false);
        }
      });
    }
  }

}
