import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {MemberDto} from '../../models/memberDto';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Member} from '../../models/member.model';
import {map} from 'rxjs/operators';
import {RoomService} from '../room/room.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // TODO sortowanie members
  public dataObservable: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
  data = this.dataObservable.asObservable();

  constructor(private rxStompService: RxStompService, private httpClient: HttpClient, private roomService: RoomService) { }

  connect(roomId: string): void {
    this.rxStompService.watch('/topic/room/' + roomId + '/members').subscribe((message: Message) => {
      const jsonBody = JSON.parse(message.body);
      const membersDto: MemberDto[] = jsonBody as MemberDto[];
      let members: Member[] = [];
      for (const member of membersDto) {
        members.push(new Member(member.roomMemberId, member.name, member.active, member.type, member.color, member.dailyProductivity));
      }
      members = this.sortMembersByName(members);
      this.dataObservable.next(members);
    });
  }

  getAllMembers(roomId: string): Observable<Member[]> {
    return this.httpClient.get<MemberDto[]>('http://localhost:8080/api/roomMember/room/' + roomId).pipe(
      map (data => {
        let members: Member[] = [];
        for (const member of data) {
          members.push(new Member(member.roomMemberId, member.name, member.active, member.type, member.color, member.dailyProductivity));
        }
        members = this.sortMembersByName(members);
        this.dataObservable.next(members);
        return members;
      })
    );

  }

  createRoomMember(member: MemberDto): Observable<MemberDto> {
    return this.httpClient.post<MemberDto>('http://localhost:8080/api/roomMember', member);
  }

  patchRoomMember(member: { roomMemberId: string, isActive: boolean }): Observable<MemberDto>{
    return this.httpClient.patch<MemberDto>('http://localhost:8080/api/roomMember/' + member.roomMemberId, member);
  }

  saveCurrentRoomMember(member: MemberDto): void {
    const dataToSave: any = JSON.parse(localStorage.getItem(member.roomId)) ?
      Object.assign(JSON.parse(localStorage.getItem(member.roomId)), {memberData: member}) : {memberData: member};
    localStorage.setItem(member.roomId, JSON.stringify(dataToSave));
  }

  getCurrentRoomMember(roomId: string): MemberDto {
    return JSON.parse(localStorage.getItem(roomId))?.memberData;
  }

  drawProductivity(): Observable<any> {
    const body: MemberDto[] = [];
    for (const member of this.dataObservable.value) {
      member.dailyProductivity[this.roomService.day - 1] = Math.floor(Math.random() * 5);
      body.push({
        roomMemberId: member.roomMemberId,
        dailyProductivity: member.dailyProductivity
      });
    }
    return this.httpClient.patch('http://localhost:8080/api/roomMember', body);
  }

  sortMembersByName(members: Member[]): Member[] {
    return members.sort((a, b) => a.name > b.name ? 1 : -1);
  }

}
