export enum ColumnName {
  BACKLOG = 'backlog',
  STAGE_ONE_IN_PROGRESS = 'stage_one_in_progress',
  STAGE_ONE_COMMITTED = 'stage_one_committed',
  STAGE_ONE_DONE = 'stage_one_done',
  STAGE_TWO = 'stage_two',
  DONE = 'done'
}

export const columnNameToDisplay = {
  backlog: 'Zadania',
  stage_one_in_progress: 'Etap 1 - Podjęte',
  stage_one_committed: 'Etap 1 - W trakcie',
  stage_one_done: 'Etap 1 - Wykonane',
  stage_two: 'Etap 2',
  done: 'Wykonane'
};

export const columnsKanbanSystem = [ColumnName.BACKLOG, ColumnName.STAGE_ONE_IN_PROGRESS, ColumnName.STAGE_ONE_COMMITTED,
  ColumnName.STAGE_ONE_DONE, ColumnName.STAGE_TWO, ColumnName.DONE];
