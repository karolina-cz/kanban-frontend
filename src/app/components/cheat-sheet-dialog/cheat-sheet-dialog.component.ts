import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RoomType} from '../../core/enums/room/room-type';

@Component({
  selector: 'app-cheat-sheet-dialog',
  templateUrl: './cheat-sheet-dialog.component.html',
  styleUrls: ['./cheat-sheet-dialog.component.css']
})
export class CheatSheetDialogComponent implements OnInit {
  RoomType = RoomType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {roomType: RoomType}) { }

  ngOnInit(): void {
  }

}
