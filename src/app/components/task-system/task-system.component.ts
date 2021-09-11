import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {KanbanSystemTask} from '../../core/models/task/kanban-system-task.model';
import {TaskResponse} from '../../core/dtos/task/TaskResponse';
import {TaskType} from '../../core/models/taskType';
import {Member} from '../../core/models/member.model';
import {MemberType} from '../../core/models/memberType';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {TaskService} from '../../core/services/tasks/task.service';
import {faCheck, faCircle, faInfoCircle, faLock, faLockOpen, faPencilAlt, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {KanbanBoardTask} from '../../core/models/task/kanban-board-task.model';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatMenuTrigger} from '@angular/material/menu';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-task-system',
  templateUrl: './task-system.component.html',
  styleUrls: ['./task-system.component.css']
})
export class TaskSystemComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() task: KanbanSystemTask;
  @Input() allMembers: Member[];
  @ViewChild('clickMenuTrigger') clickMenuTrigger: MatMenuTrigger;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
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
  workPointColor: string = null;
  taskForm: FormGroup = this.fb.group({
    assignees: this.fb.array([])
  });
  assigneesList: Member[];
  timelineForm: FormGroup;



  constructor(private taskService: TaskService, private fb: FormBuilder, private overlayContainer: OverlayContainer, private renderer: Renderer2,
              private cdref: ChangeDetectorRef) {
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
        startDay: new FormControl(this.task.startDay, [
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('^[0-9]*$')]),
      endDay: new FormControl(this.task.endDay, [
        Validators.min(1),
        Validators.max(10),
        Validators.pattern('^[0-9]*$')])
      }
    );
  }

  ngAfterViewInit(): void {
    console.log('view init');
    if (this.task.isMenuOpen) {
      console.log('menu open');
      this.clickMenuTrigger.openMenu();
      this.cdref.detectChanges();
    }
  }

  onStartDaySubmitted(): void {
    if (this.startDay.valid){
      this.task.startDay = this.startDay.value;
      this.taskService.patchTask({startDay: this.startDay.value}, this.task.taskId).subscribe();
    } else {
      this.timelineForm.patchValue({
        startDay: this.task.startDay
      });
    }
  }

  onEndDaySubmitted(): void {
    if (this.endDay.valid){
      this.task.startDay = this.endDay.value;
      this.taskService.patchTask({endDay: this.endDay.value}, this.task.taskId).subscribe();
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
    if (this.task.assignees?.length && !this.task.assignees.some(el => el.color === this.task.selectedColor)) {
        this.task.selectedColor = this.task.assignees[0].color;
    }
    // todo w checkbox list wyswietlac tylko participant
    console.log('on changes'); // todo sprawdzic czy po dodaniu nowego czlonka zespolu wywola sie on changes
    this.assigneesList = this.getMembersList();
    // todo nie amykac mat menu po wybraniu osoby - teraz sie zamyka po otrzymaniu aktualizacji
    // todo zrobic dodawanie / usuwanie na cosob na change -
    // if (this.taskForm) {
    //   console.log('task form');
    //   this.taskForm.controls.assignees.patchValue(this.getMembersList());
    // } else {
    //   console.log('not exist');
    //   this.taskForm = this.fb.group({
    //     assignees: this.fb.array(this.getMembersList())
    //   });
    // }
  }


  getMembersList(): Member[] {
    // todo naprawic liste checkboxow
    const members: Member[] = JSON.parse(JSON.stringify(this.allMembers));
    members.forEach(member => {
      console.log('inside');
      if (this.task.assignees.some(el => el.roomMemberId === member.roomMemberId)){
        console.log('inside if');
        member.isAssignee = true;
      }
    });
    return members;
  }

  assigneeChanged(selected: boolean, roomMember: Member): void {
    const isAssignee: boolean = !!roomMember.isAssignee;
    if (isAssignee === false && selected === true) {
      roomMember.isAssignee = true; // mozan wykomentowac jak bedzie observe tasks
      this.taskService.addAssignee(this.task.taskId, roomMember.roomMemberId).subscribe();
    } else if (isAssignee === true && selected === false) {
      roomMember.isAssignee = false;
      this.taskService.deleteAssignee(this.task.taskId, roomMember.roomMemberId).subscribe();
      console.log('delete assignee');
    }
  }


  onAssigneeAdded(assignee: Member): void {
    // this.taskService.patchTask({assignees: [assignee.roomMemberId]}, this.task.taskId).subscribe();
    // this.task.assignee = assignee;
    // this.updateFilteredMembers();
  }

  test() {
    console.log('abc');
  }

  onWorkPointClicked(stage: number, i: number): void {
    console.log('work point clicked');
    let workPoints = this.task.workPoints1;
    if (stage !== 1){
      workPoints = this.task.workPoints2;
    }

    if (workPoints[i] === null || workPoints[i] !== this.task.selectedColor) {
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
