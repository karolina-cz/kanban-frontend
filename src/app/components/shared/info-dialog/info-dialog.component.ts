import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {CheatSheetDialogComponent} from '../../cheat-sheet-dialog/cheat-sheet-dialog.component';


@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  faQuestionCircle = faQuestionCircle;

  constructor(public dialogRef: MatDialogRef<InfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { day: number, narrative: string },
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onShowHelpClicked(): void {
    this.dialog.open(CheatSheetDialogComponent);
  }

}
