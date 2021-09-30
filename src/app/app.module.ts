import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import { RoomHeaderComponent } from './components/room-header/room-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TaskTypePipe } from './core/pipes/task-type.pipe';
import { KanbanBoardColumnsComponent } from './components/kanban-board-columns/kanban-board-columns.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import {MatSelectModule} from '@angular/material/select';
import { MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { NewMemberComponent } from './components/new-member/new-member.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MembersProductivityComponent } from './components/members-productivity/members-productivity.component';
import { CalendarDayComponent } from './components/shared/calendar-day/calendar-day.component';
import { KanbanSystemComponent } from './components/kanban-system/kanban-system.component';
import { KanbanSystemColumnsComponent } from './components/kanban-system-columns/kanban-system-columns.component';
import { TaskSystemComponent } from './components/task-system/task-system.component';
import { InfoDialogComponent } from './components/shared/info-dialog/info-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { LimitsDialogComponent } from './components/limits-dialog/limits-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {A11yModule} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { ColumnNamePipe } from './core/pipes/column-name.pipe';
import {MatChipsModule} from '@angular/material/chips';
import { BlockersFormDialogComponent } from './components/blockers-form-dialog/blockers-form-dialog.component';
import { CheatSheetDialogComponent } from './components/cheat-sheet-dialog/cheat-sheet-dialog.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    RoomHeaderComponent,
    TaskBoardComponent,
    TaskTypePipe,
    KanbanBoardColumnsComponent,
    KanbanBoardComponent,
    HomeComponent,
    HeaderComponent,
    NewMemberComponent,
    MembersProductivityComponent,
    CalendarDayComponent,
    KanbanSystemComponent,
    KanbanSystemColumnsComponent,
    TaskSystemComponent,
    InfoDialogComponent,
    LimitsDialogComponent,
    ColumnNamePipe,
    BlockersFormDialogComponent,
    CheatSheetDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    FontAwesomeModule,
    NgbTooltipModule,
    NgbDropdownModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DragDropModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatDialogModule,
    MatTableModule,
    A11yModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  entryComponents: [InfoDialogComponent],
  providers: [{
    provide: InjectableRxStompConfig,
    useValue: myRxStompConfig,
  },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
