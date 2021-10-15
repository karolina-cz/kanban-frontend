export interface Room {
  roomId?: string;
  roomType?: string;
  type?: string;
  stageOneLimit?: number;
  stageOneInProgressLimit?: number;
  stageOneCommittedLimit?: number;
  stageOneDoneLimit?: number;
  stageTwoLimit?: number;
  doneLimit?: number;
  blockersProbability?: number;
}
