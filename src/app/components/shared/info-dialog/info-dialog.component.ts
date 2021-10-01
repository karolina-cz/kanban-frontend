import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CheatSheetDialogComponent} from '../../cheat-sheet-dialog/cheat-sheet-dialog.component';
import * as confetti from 'canvas-confetti';


@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { day: number, narrative: string },
              private dialog: MatDialog, private renderer2: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    if (this.data.day === 10) {
      const canvas = this.renderer2.createElement('canvas');

      this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

      const myConfetti = confetti.create(canvas, {
        resize: true, // will fit all screen sizes,
      });

      myConfetti({
        shapes: ['square'],
        particleCount: 100,
        spread: 90,
        gravity: 1,
        origin: {
          y: (1),
          x: (0.5)
        }
      });
      setTimeout(() => {this.renderer2.removeChild(this.elementRef.nativeElement, canvas); }, 2000);
    }
  }

  onShowHelpClicked(): void {
    this.dialog.open(CheatSheetDialogComponent);
  }

}
