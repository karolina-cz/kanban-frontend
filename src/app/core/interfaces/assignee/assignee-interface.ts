import {AssigneeTypeEnum} from '../../enums/assignee/assignee-type.enum';

export interface CreateAssigneeInterface{
  roomMemberId: string;
  taskId: string;
  assigneeType: AssigneeTypeEnum;
}
