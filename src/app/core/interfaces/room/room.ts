export interface Room {
  roomId?: string;
  roomType?: string; // todo merge roomType and type, requires backend changes
  type?: string;
  currentDay?: number;
  blockersProbability?: number;
}
