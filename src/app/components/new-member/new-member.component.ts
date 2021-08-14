import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {MemberService} from '../../core/services/members/member.service';
import {MemberDto} from '../../core/models/memberDto';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css']
})
export class NewMemberComponent implements OnInit {
  @Output() memberCreated = new EventEmitter<any>();
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
        member.roomMemberId = memberDto.roomMemberId;
        member.color = memberDto.color;
        member.type = memberDto.type;
        // TODO jezeli jest inny type to wyswietlic wiadomosc
        this.memberService.saveCurrentRoomMember(member);
        this.memberCreated.emit();
      }, error => {
        //TODO display error message
        console.log('error');
      });
    }
  }

}
