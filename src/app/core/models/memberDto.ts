import {MemberType} from './memberType';

export interface MemberDto {
  roomMemberId?: string;
  roomId?: string;
  name?: string;
  color?: string;
  type?: MemberType;
  active?: boolean;
  dailyProductivity?: number[];
  usedProductivity?: number[];
}
