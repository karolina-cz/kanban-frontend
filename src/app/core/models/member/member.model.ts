import {MemberType} from '../../enums/member/member-type';
import {MemberDto} from '../../interfaces/member/member-dto';

export class Member implements MemberDto {
  roomMemberId: string;
  name: string;
  type: MemberType;
  color: string;
  dailyProductivity: number[];
  isAssignee?: boolean;
  assigneeType?: string;
  assigneeId?: string;
  usedProductivity?: number[];

  constructor(roomMemberId: string, name: string, type: MemberType, color: string, dailyProductivity: number[],
              usedProductivity: number[]) {
    this.roomMemberId = roomMemberId;
    this.name = name;
    this.type = type;
    this.color = color;
    this.dailyProductivity = dailyProductivity;
    this.usedProductivity = usedProductivity;
  }
}
