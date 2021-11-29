import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {
  faCircle, faInfoCircle,
  faLock,
  faLockOpen,
  faPencilAlt, faTimes,
  faUserCircle,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {Member} from '../../core/models/member/member.model';
import {MemberType} from '../../core/enums/member/member-type';
import {TaskType} from '../../core/enums/task/task-type';
import {TaskService} from '../../core/services/tasks/task.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ColumnName} from '../../core/enums/room/column-name';
import {AssigneeService} from '../../core/services/assignee/assignee.service';
import {WorkPoint} from '../../core/interfaces/work-point/work-point';
import {RoomService} from '../../core/services/room/room.service';
import {WorkPointService} from '../../core/services/work-point/work-point.service';
import {DayService} from '../../core/services/day/day.service';
import {MemberService} from '../../core/services/members/member.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() task: KanbanBoardTask;
  @Input() allMembers: Member[];
  @ViewChild('clickMenuTrigger') clickMenuTrigger: MatMenuTrigger;

  faUserCircle = faUserCircle;
  color = 'red';
  faCircle = faCircle;
  faLock = faLock;
  isBlocked = true;
  faLockOpen = faLockOpen;
  faCalendar = faCalendar;
  faPencilAlt = faPencilAlt;
  faUserPlus = faUserPlus;
  faTimes = faTimes;
  filteredMembers;
  effortValid = true;
  effortForm: FormGroup;
  faInfoCircle = faInfoCircle;
  ColumnNameEnum = ColumnName;

  constructor(private taskService: TaskService, private renderer: Renderer2, private detectorRef: ChangeDetectorRef,
              private overlayContainer: OverlayContainer, private assigneeService: AssigneeService, private roomService: RoomService,
              private workPointService: WorkPointService, private dayService: DayService, private memberService: MemberService,
              private route: ActivatedRoute, private snackbar: MatSnackBar) {
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
          Validators.max(30),
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

  unblockTask(): void {
    if (this.task.isBlocked) {
      this.taskService.patchTask(
        {isBlocked: false,
          dayModified: this.dayService.daySubject.getValue(),
          editorId: this.memberService.getCurrentRoomMember(this.route.snapshot.params.id).roomMemberId},
        this.task.taskId)
        .subscribe({
          error: (err) => {
            if (err.status === 405) {
              this.snackbar.open('Nie masz wystarczająco produktywności, aby odblokowac to zadanie!', 'Ok',
                {duration: 3000, panelClass: ['snackbar-white']});
            }
          }
        });
    }
  }

  isFixedDate(): boolean {
    return this.task.type === TaskType.FIXED_DATE;
  }

  onAssigneeAdded(assignee: Member): void{
    this.taskService.patchTask({roomMembers: [assignee.roomMemberId]}, this.task.taskId).subscribe();
    this.task.assignee = assignee;
    this.updateFilteredMembers();
  }

  onAssigneeRemoved(assignee: Member): void{
    this.task.assignee = null;
    this.assigneeService.deleteAssignee(assignee.assigneeId).subscribe();
    this.updateFilteredMembers();
  }

  onWorkPointClicked(workPoint: WorkPoint): void {
    const assigneeId: string = workPoint.color === null ? this.task.assignee?.assigneeId : null;
    workPoint.color = assigneeId == null ? null : this.task.assignee.color;
    this.workPointService.patchWorkPoint(workPoint.workPointId, {assigneeId, dayModified: this.dayService.daySubject.getValue() - 1})
      .subscribe();
  }

}
