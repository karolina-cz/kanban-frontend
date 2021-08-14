import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../core/services/room/room.service';
import {RoomType} from '../../core/models/room/room-type';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private roomService: RoomService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreateKanbanBoard(): void {
    this.roomService.createRoom(RoomType.KANBAN_BOARD).subscribe((uuid) => {
      this.router.navigate(['/kanban-board/' + uuid]);
    });
  }

  onCreateKanbanSystem(): void {
    this.roomService.createRoom(RoomType.KANBAN_SYSTEM).subscribe((uuid) => {
      this.router.navigate(['/kanban-system/' + uuid]);
    });
  }

}
