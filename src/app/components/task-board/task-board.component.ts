import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {
  faCheck,
  faCircle, faInfoCircle,
  faLock,
  faLockOpen,
  faMinusCircle,
  faPencilAlt, faPlusCircle, faTimes,
  faUserCircle,
  faUserEdit,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {Member} from '../../core/models/member.model';
import {MemberType} from '../../core/models/memberType';
import {TaskType} from '../../core/models/taskType';
import {TaskService} from '../../core/services/tasks/task.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ColumnName} from '../../core/models/column-name';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() task: KanbanBoardTask;
  @Input() allMembers: Member[];
  @ViewChild('clickMenuTrigger') clickMenuTrigger: MatMenuTrigger;

  panelOpenState = false;
  faUserCircle = faUserCircle;
  color = 'red';
  faCircle = faCircle;
  faLock = faLock;
  isBlocked = true;
  faLockOpen = faLockOpen;
  faCalendar = faCalendar;
  fixedDayNum = 10;
  faPencilAlt = faPencilAlt;
  faUserEdit = faUserEdit;
  faUserPlus = faUserPlus;
  faMinusCircle = faMinusCircle;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  filteredMembers;
  workPointValid: number[] = new Array(11);
  effortValid = true;
  faCheck = faCheck;
  effortForm: FormGroup;
  faInfoCircle = faInfoCircle;
  ColumnNameEnum = ColumnName;

  constructor(private taskService: TaskService, private renderer: Renderer2, private detectorRef: ChangeDetectorRef,
              private overlayContainer: OverlayContainer) {
    const disableAnimations = true;

    // get overlay container to set property that disables animations
    const overlayContainerElement: HTMLElement = this.overlayContainer.getContainerElement();

    // angular animations renderer hooks up the logic to disable animations into setProperty
    this.renderer.setProperty( overlayContainerElement, '@.disabled', disableAnimations );
  }

  updateFilteredMembers(): void {
    this.filteredMembers = this.allMembers.filter(el => el?.roomMemberId !== this.task.assignee?.roomMemberId
      && el.type !== MemberType.VIEWER );
  }

  ngOnInit(): void {
    this.effortForm = new FormGroup({
        effort: new FormControl(this.task.effort === -1 ? null : this.task.effort, [
          Validators.min(0),
          Validators.max(5),
          this.validateEffortField.bind(this)])
      }
    );
  }

  get effort(): AbstractControl {
    return this.effortForm.get('effort');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateFilteredMembers();
  }

  ngAfterViewInit(): void {
    if (this.task.isMenuOpen) {
      this.clickMenuTrigger.openMenu();
      this.detectorRef.detectChanges();
    }
  }

  onEffortSubmitted(): void{
    if (this.effort.valid){
      this.task.effort = this.effort.value == null ? -1 : this.effort.value;
      this.taskService.patchTask({effort: this.task.effort}, this.task.taskId).subscribe();
    }
  }

  validateEffortField(control: AbstractControl): { [key: string]: any } {
    const rem = control.value && Number.parseFloat(control.value) % 0.5;
    return rem ? { error: 'Not a valid step' } : null;
  }

  blockedToggled(): void {
    this.task.isBlocked = !this.task.isBlocked;
    this.taskService.patchTask({isBlocked: this.task.isBlocked}, this.task.taskId).subscribe();
  }

  isFixedDate(): boolean {
    return this.task.type === TaskType.FIXED_DATE;
  }

  onAssigneeAdded(assignee: Member): void{
    this.taskService.patchTask({assignees: [assignee.roomMemberId]}, this.task.taskId).subscribe();
    this.task.assignee = assignee;
    this.updateFilteredMembers();
  }

  onAssigneeRemoved(assignee: Member): void{
    this.task.assignee = null;
    this.taskService.deleteAssignee(this.task.taskId, assignee.roomMemberId).subscribe();
    this.updateFilteredMembers();
  }

  onWorkPointClicked(stage: number, i: number): void {
    let workPoints = this.task.workPoints1;
    if (stage !== 1){
      workPoints = this.task.workPoints2;
    }

    if (workPoints[i] === null) {
      workPoints[i] = this.task.assignee === null ? null : this.task.assignee.color;
    } else {
      workPoints[i] = null;
    }

    if (stage === 1) {
      this.taskService.patchTask({workPoints1: workPoints}, this.task.taskId).subscribe();
    } else {
      this.taskService.patchTask({workPoints2: workPoints}, this.task.taskId).subscribe();
    }
  }
  onEffortChanged(effort: number): void{
    effort = +effort;
    this.effortValid = this.workPointValid.includes(effort);
    if (this.effortValid) {
      this.task.effort = effort;
      this.taskService.patchTask({effort}, this.task.taskId).subscribe();
    }
  }

}
