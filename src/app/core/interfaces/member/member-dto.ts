import {MemberType} from '../../enums/member/member-type';

export interface MemberDto {
  roomMemberId?: string;
  roomId?: string;
  name?: string;
  color?: string;
  type?: MemberType;
  dailyProductivity?: number[];
  usedProductivity?: number[];
}
