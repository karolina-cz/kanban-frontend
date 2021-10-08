import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {KanbanSystemTask} from '../../core/models/task/kanban-system-task.model';
import {TaskType} from '../../core/models/taskType';
import {Member} from '../../core/models/member.model';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {TaskService} from '../../core/services/tasks/task.service';
import {
  faCheck,
  faCircle,
  faFillDrip,
  faLock,
  faLockOpen,
  faPencilAlt,
  faPlus,
  faTimes,
  faUser,
  faUserCheck,
  faUserCircle,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MemberType} from '../../core/models/memberType';
import {AssigneeService} from '../../core/services/assignee/assignee.service';
import {AssigneeTypeEnum} from '../../core/models/assignee/assignee-type.enum';

@Component({
  selector: 'app-task-system',
  templateUrl: './task-system.component.html',
  styleUrls: ['./task-system.component.css']
})
export class TaskSystemComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() task: KanbanSystemTask;
  @Input() allMembers: Member[];
  @ViewChild('clickMenuTrigger') clickMenuTrigger: MatMenuTrigger;
  @ViewChild('clickHelperMenuTrigger') clickHelperMenuTrigger: MatMenuTrigger;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  taskType = TaskType;
  faCalendar = faCalendar;
  faLock = faLock;
  faLockOpen = faLockOpen;
  faUserCircle = faUserCircle;
  faPencilAlt = faPencilAlt;
  faUserPlus = faUserPlus;
  faCircle = faCircle;
  faUser = faUser;
  faUserCheck = faUserCheck;
  faFillDrip = faFillDrip;
  faPlus = faPlus;
  faTimes = faTimes;
  faTick = faCheck;
  workPointColor: string = null;
  taskForm: FormGroup = this.fb.group({
    assignees: this.fb.array([])
  });
  assigneesList: Member[];
  mainAssignee: Member;
  timelineForm: FormGroup;



  constructor(private taskService: TaskService, private fb: FormBuilder, private overlayContainer: OverlayContainer,
              private renderer: Renderer2, private detectorRef: ChangeDetectorRef, private assigneeService: AssigneeService) {
    const disableAnimations = true;

    // get overlay container to set property that disables animations
    const overlayContainerElement: HTMLElement = this.overlayContainer.getContainerElement();

    // angular animations renderer hooks up the logic to disable animations into setProperty
    this.renderer.setProperty( overlayContainerElement, '@.disabled', disableAnimations );
  }

  blockedToggled(): void {
    this.task.isBlocked = !this.task.isBlocked;
    this.taskService.patchTask({isBlocked: this.task.isBlocked}, this.task.taskId).subscribe();
  }

  ngOnInit(): void {
    this.timelineForm = new FormGroup({
        startDay: new FormControl(this.task.startDay === 0 ? null : this.task.startDay, [
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('^[0-9]*$')]),
      endDay: new FormControl(this.task.endDay === 0 ? null : this.task.endDay, [
        Validators.min(1),
        Validators.max(10),
        Validators.pattern('^[0-9]*$')])
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.task.isHelperMenuOpen) {
      this.clickHelperMenuTrigger.openMenu();
      this.detectorRef.detectChanges();
    }
  }

  onStartDaySubmitted(): void {
    if (this.startDay.valid){
      this.task.startDay = this.startDay.value == null ? 0 : this.startDay.value;
      this.taskService.patchTask({startDay: this.task.startDay}, this.task.taskId).subscribe();
    } else {
      this.timelineForm.patchValue({
        startDay: this.task.startDay
      });
    }
  }

  onEndDaySubmitted(): void {
    if (this.endDay.valid){
      this.task.endDay = this.endDay.value == null ? 0 : this.endDay.value;
      this.taskService.patchTask({endDay: this.task.endDay}, this.task.taskId).subscribe();
    } else {
      this.timelineForm.patchValue({
        endDay: this.task.endDay
      });
    }
  }
  get startDay(): AbstractControl {
    return this.timelineForm.get('startDay');
  }

  get endDay(): AbstractControl {
    return this.timelineForm.get('endDay');
  }

  get assignees(): FormArray {
    return this.taskForm.get('assignees') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.task.assignees?.length && this.task.selectedColor !== null &&
      !this.task.assignees.some(el => el.color === this.task.selectedColor)) {
        this.task.selectedColor = this.task.assignees[0].color;
    }
    const mainAssignee: Member = this.task.assignees.find(el => el.assigneeType === AssigneeTypeEnum.MAIN);
    if (mainAssignee) {
      this.mainAssignee = JSON.parse(JSON.stringify(mainAssignee));
    }
    this.assigneesList = this.getMembersList();
  }


  getMembersList(): Member[] {
    const members: Member[] = JSON.parse(JSON.stringify(this.allMembers));
    members.forEach(member => {
      const assignee = this.task.assignees.find(el => el.roomMemberId === member.roomMemberId);
      if (assignee){
        member.assigneeId = assignee.assigneeId;
        member.assigneeType = assignee.assigneeType;
        member.isAssignee = true;
      }
    });
    return members.filter(el => el.type !== MemberType.VIEWER);
  }

  get helpersList(): Member[] {
    if (this.mainAssignee != null) {
      return this.assigneesList.filter(el => el.assigneeType !== AssigneeTypeEnum.MAIN
        && el.roomMemberId !== this.mainAssignee.roomMemberId);
    } else {
      return this.assigneesList.filter(el => el.assigneeType !== AssigneeTypeEnum.MAIN);
    }
  }

  get mainAssigneeList(): Member[] {
    if (this.mainAssignee != null) {
      return this.assigneesList.filter(el => el.roomMemberId !== this.mainAssignee.roomMemberId);
    } else {
      return this.assigneesList;
    }
  }

  get helpers(): Member[] {
    return this.task.assignees?.filter(el => el.assigneeType === AssigneeTypeEnum.HELPER);
  }

  assigneeChanged(selected: boolean, roomMember: Member): void {
    const isAssignee: boolean = !!roomMember.isAssignee;
    if (isAssignee === false && selected === true) {
      roomMember.isAssignee = true;
      this.assigneeService.createAssignee({taskId: this.task.taskId, roomMemberId: roomMember.roomMemberId,
        assigneeType: AssigneeTypeEnum.HELPER}).subscribe();
    } else if (isAssignee === true && selected === false) {
      roomMember.isAssignee = false;
      const assigneeId: string = this.task.assignees.find(el => el.roomMemberId === roomMember.roomMemberId)?.assigneeId;
      if (assigneeId) {
        this.assigneeService.deleteAssignee(assigneeId).subscribe();
      }
    }
  }

  onMainAssigneeRemoved(): void {
    this.assigneeService.deleteAssignee(this.mainAssignee.assigneeId).subscribe();
  }

  onMainAssigneeAdded(member: Member): void {
    this.assigneeService.createAssignee({taskId: this.task.taskId, roomMemberId: member.roomMemberId,
      assigneeType: AssigneeTypeEnum.MAIN}).subscribe();
  }

  onWorkPointClicked(stage: number, i: number): void {
    let workPoints = this.task.workPoints1;
    if (stage !== 1){
      workPoints = this.task.workPoints2;
    }

    if ((workPoints[i] === null || workPoints[i] !== this.task.selectedColor) && this.task.selectedColor) {
      workPoints[i] = this.task.assignees === [] ? null : this.task.selectedColor;
    } else {
      workPoints[i] = null;
    }

    if (stage === 1) {
      this.taskService.patchTask({workPoints1: workPoints}, this.task.taskId).subscribe();
    } else {
      this.taskService.patchTask({workPoints2: workPoints}, this.task.taskId).subscribe();
    }
  }

}
