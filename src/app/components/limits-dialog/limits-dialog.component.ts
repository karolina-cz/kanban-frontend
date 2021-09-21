import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  ColumnLimitDialogDataInterface,
  ColumnLimitInterface, CreateColumnLimitInterface
} from '../../core/interfaces/column-limit-interface';
import {columnsKanbanSystem} from '../../core/models/column-name';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {ColumnLimitType} from '../../core/models/column-limit-type.enum';
import {ColumnLimitService} from '../../core/services/column-limit/column-limit.service';

@Component({
  selector: 'app-limits-dialog',
  templateUrl: './limits-dialog.component.html',
  styleUrls: ['./limits-dialog.component.css']
})
export class LimitsDialogComponent implements OnInit {
  limitsForm: FormGroup;
  columnsKanbanSystem1 = columnsKanbanSystem;
  faTrash = faTrashAlt;

  constructor(public dialogRef: MatDialogRef<LimitsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ColumnLimitDialogDataInterface, private formBuilder: FormBuilder,
              private columnLimitService: ColumnLimitService) {
  }

  ngOnInit(): void {
    this.limitsForm = this.formBuilder.group({
      singleColumnLimits: this.formBuilder.array(
        this.data.singleColumnLimits.map(elem => this.createColumnGroup(elem))
      ),
      multipleColumnLimits: this.formBuilder.array(
        this.data.multipleColumnLimits.map(elem => this.createColumnGroup(elem))
      )
    });
  }

  createColumnGroup(columnLimit: ColumnLimitInterface): FormGroup {
    if (columnLimit.limitType === ColumnLimitType.MULTIPLE) {
      return this.formBuilder.group({
        columnLimitId: columnLimit.columnLimitId,
        limitType: columnLimit.limitType,
        limitValue: [columnLimit.limitValue, [Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.required]],
        columns: [columnLimit.columns, [this.columnsLengthValidator]],
        isActive: columnLimit.isActive
      });
    } else {
      return this.formBuilder.group({
        columnLimitId: columnLimit.columnLimitId,
        limitType: columnLimit.limitType,
        limitValue: [{value: columnLimit.limitValue, disabled: !columnLimit.isActive},
          [Validators.pattern('^[0-9]*$'), Validators.min(1), this.limitValueConditionallyRequiredValidator]],
        columns: [columnLimit.columns],
        isActive: columnLimit.isActive
      });
    }
  }

  get singleColumnLimits(): FormArray {
    return this.limitsForm.get('singleColumnLimits') as FormArray;
  }

  get multipleColumnLimits(): FormArray {
    return this.limitsForm.get('multipleColumnLimits') as FormArray;
  }

  onSaveClicked(): void {
    this.limitsForm.markAllAsTouched();
    if (this.limitsForm.valid) {
      const deletedLimits: { columnLimitId: string }[] = this.data.multipleColumnLimits
        .filter(previousLimit =>
          !this.multipleColumnLimits.controls.some(currentLimit => currentLimit.value.columnLimitId === previousLimit.columnLimitId))
        .map(el => ({columnLimitId: el.columnLimitId}));
      const singleColumns: ColumnLimitInterface[] = this.singleColumnLimits.controls.map((el: FormGroup) => {
        return {columnLimitId: el.get('columnLimitId').value, limitValue: el.get('limitValue').value, isActive: el.get('isActive').value};
      });
      const multipleColumns: ColumnLimitInterface[] = this.multipleColumnLimits.controls
        .filter(el => el.get('columnLimitId').value)
        .map((el: FormGroup) => {
          return {columnLimitId: el.get('columnLimitId').value, columns: el.get('columns').value, limitValue: el.get('limitValue').value};
        });
      const newMultipleColumns: CreateColumnLimitInterface[] = this.multipleColumnLimits.controls
        .filter(el => !el.get('columnLimitId').value)
        .map((el: FormGroup) => {
          return {limitType: ColumnLimitType.MULTIPLE, columns: el.get('columns').value, limitValue: el.get('limitValue').value,
            roomId: this.data.roomId};
        });
      if (newMultipleColumns.length) {
        this.columnLimitService.createColumnLimits(newMultipleColumns).subscribe();
      }
      if (deletedLimits.length) {
        this.columnLimitService.deleteColumnLimits(deletedLimits).subscribe();
      }
      this.columnLimitService.patchColumnLimits(singleColumns.concat(multipleColumns)).subscribe();
      this.dialogRef.close();
    }
  }

  onRemoveLimitClicked(index: number): void {
    this.multipleColumnLimits.removeAt(index);
  }

  onAddLimitClicked(): void {
    this.multipleColumnLimits.push(this.createColumnGroup({
      columnLimitId: null, limitType: ColumnLimitType.MULTIPLE, columns: [],
      isActive: null, limitValue: null
    }));
  }

  onActiveChanged(formGroup: FormGroup): void {
    if (formGroup.get('isActive').value) {
      formGroup.get('limitValue').enable();
    } else {
      formGroup.get('limitValue').disable();
      if (!formGroup.get('limitValue').valid) {
        formGroup.get('limitValue').setValue(null);
      }
    }
  }

  limitValueConditionallyRequiredValidator(formControl: AbstractControl): ValidationErrors {
    if (!formControl.parent) {
      return null;
    }
    if (formControl.parent.get('isActive').value) {
      return Validators.required(formControl);
    }
    return null;
  }

  columnsLengthValidator(formControl: AbstractControl): ValidationErrors {
    if (!formControl.parent) {
      return null;
    }
    if (!formControl.value || formControl.value.length < 2) {
      return {columnsLengthValidator: true};
    }
    return null;
  }
}
