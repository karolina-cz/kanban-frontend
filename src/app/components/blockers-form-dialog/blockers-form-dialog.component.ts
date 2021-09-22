import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-blockers-form-dialog',
  templateUrl: './blockers-form-dialog.component.html',
  styleUrls: ['./blockers-form-dialog.component.css']
})
export class BlockersFormDialogComponent implements OnInit {
  blockersForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {probability: number},
              private dialogRef: MatDialogRef<BlockersFormDialogComponent>) {}

  ngOnInit(): void {
    this.blockersForm = new FormGroup({
      probability: new FormControl(this.data.probability, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]*$')])
    });
  }

  onSaveClicked(): void {
    this.blockersForm.markAllAsTouched();
    if (this.blockersForm.valid) {
      this.dialogRef.close({blockersProbability: this.blockersForm.get('probability').value});
    }
  }

}
