export interface ColumnLimitInterface {
  columnLimitId?: string;
  limitType?: string;
  columns?: string[];
  limitValue: number;
  isActive?: boolean;
}

export interface CreateColumnLimitInterface {
  roomId: string;
  limitType: string;
  columns: string[];
  limitValue: number;
}

export interface ColumnLimitDialogDataInterface {
  singleColumnLimits: ColumnLimitInterface[];
  multipleColumnLimits: ColumnLimitInterface[];
  roomId: string;
}
