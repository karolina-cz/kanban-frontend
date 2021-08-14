import {Component, OnInit} from '@angular/core';
import {KanbanSystemTask} from '../../core/models/task/kanban-system-task.model';
import {TaskResponse} from '../../core/dtos/task/TaskResponse';
import {TaskType} from '../../core/models/taskType';
import {Member} from '../../core/models/member.model';
import {MemberType} from '../../core/models/memberType';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {TaskService} from '../../core/services/tasks/task.service';
import {faCheck, faCircle, faInfoCircle, faLock, faLockOpen, faPencilAlt, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-system',
  templateUrl: './task-system.component.html',
  styleUrls: ['./task-system.component.css']
})
export class TaskSystemComponent implements OnInit {
  task: KanbanSystemTask;
  taskType = TaskType;
  faCalendar = faCalendar;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faUserCircle = faUserCircle;
  faPencilAlt = faPencilAlt;
  faUserPlus = faUserPlus;
  faCircle = faCircle;
  faInfoCircle = faInfoCircle;
  faCheck = faCheck;
  selectedColor: string = null;


  constructor(private taskService: TaskService) {
    const taskRes: TaskResponse = {
      taskId: '123',
      workPoints1: [null, null, null, null, null],
      workPoints2: [null, null, null, null, null],
      isBlocked: false,
      type: TaskType.STANDARD,
      kanbanColumn: 'backlog',
      startDay: 1,
      endDay: 4,
      visibleFromDay: 1,
      name: 'S.1',
      roomMembers: [new Member('11', 'Jan Nowak', true, MemberType.PARTICIPANT, 'red', [1, 1, 1, 1, 1, 1, 1, 1, 1]),
        new Member('11', 'Jan Nowak', true, MemberType.PARTICIPANT, 'red', [1, 1, 1, 1, 1, 1, 1, 1, 1])],
    };
    this.task = new KanbanSystemTask(taskRes);
  }

  blockedToggled(): void {
    this.task.isBlocked = !this.task.isBlocked;
    this.taskService.patchTask({isBlocked: this.task.isBlocked}, this.task.taskId).subscribe();
  }

  ngOnInit(): void {
  }

  onWorkPointClicked(stage: number, i: number): void {
    console.log('work point clicked');
  }

}
