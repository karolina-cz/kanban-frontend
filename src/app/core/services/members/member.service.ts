import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {MemberDto} from '../../models/memberDto';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Member} from '../../models/member.model';
import {map} from 'rxjs/operators';
import {RoomService} from '../room/room.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // TODO sortowanie members
  public dataObservable: BehaviorSubject<Member[]> = new BehaviorSubject<Member[]>([]);
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService, private httpClient: HttpClient, private roomService: RoomService) { }

  connect(roomId: string): void {
    this.topicSubscription = this.rxStompService.watch('/topic/room/' + roomId + '/members').subscribe((message: Message) => {
      const membersDto: MemberDto[] = JSON.parse(message.body) as MemberDto[];
      let members: Member[] = [];
      for (const member of membersDto) {
        members.push(new Member(member.roomMemberId, member.name, member.active, member.type, member.color, member.dailyProductivity));
      }
      members = this.sortMembersByName(members);
      this.dataObservable.next(members);
    });
  }

  disconnect(): void {
    this.topicSubscription.unsubscribe();
  }

  getAllMembers(roomId: string): Observable<Member[]> {
    return this.httpClient.get<MemberDto[]>(environment.apiUrl + '/roomMember/room/' + roomId).pipe(
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
    return this.httpClient.post<MemberDto>(environment.apiUrl + '/roomMember', member);
  }

  patchRoomMember(member: { roomMemberId: string, isActive: boolean }): Observable<MemberDto>{
    return this.httpClient.patch<MemberDto>(environment.apiUrl + '/roomMember/' + member.roomMemberId, member);
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
      member.dailyProductivity[this.roomService.daySubject.getValue() - 1] = Math.floor(Math.random() * 5 + 1);
      body.push({
        roomMemberId: member.roomMemberId,
        dailyProductivity: member.dailyProductivity
      });
    }
    return this.httpClient.patch(environment.apiUrl + '/roomMember', body);
  }

  sortMembersByName(members: Member[]): Member[] {
    return members.sort((a, b) => a.name > b.name ? 1 : -1);
  }

}
