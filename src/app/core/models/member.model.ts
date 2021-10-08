import {MemberType} from './memberType';
import {MemberDto} from './memberDto';

export class Member implements MemberDto{
  roomMemberId: string;
  name: string;
  active: boolean;
  type: MemberType;
  color: string;
  dailyProductivity: number[];
  isAssignee?: boolean;
  assigneeType?: string;
  assigneeId?: string;

  constructor(roomMemberId: string, name: string, active: boolean, type: MemberType, color: string, dailyProductivity: number[]) {
    this.roomMemberId = roomMemberId;
    this.name = name;
    this.active = active;
    this.type = type;
    this.color = color;
    this.dailyProductivity = dailyProductivity;
  }
}
