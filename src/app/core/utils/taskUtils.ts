export default class TaskUtils {

  static getNumberFromTaskName(taskName: string): number {
    return +taskName.split('.', 2)[1];
  }

  static getPrefixFromTaskName(taskName: string): string {
    return taskName.split('.', 2)[0];
  }

  static sortTasksByNames<T extends { name: string }>(taskList: T[]): T[] {
    return taskList.sort((a, b) => {
      if (TaskUtils.getPrefixFromTaskName(a.name) === TaskUtils.getPrefixFromTaskName(b.name)) {
        return TaskUtils.getNumberFromTaskName(a.name) > TaskUtils.getNumberFromTaskName(b.name) ? 1 : -1;
      } else if (TaskUtils.getPrefixFromTaskName(a.name) === 'P') {
        return -1;
      } else if (TaskUtils.getPrefixFromTaskName(a.name) === 'S') {
        return 1;
      } else {
        return TaskUtils.getPrefixFromTaskName(b.name) === 'P' ? 1 : -1;
      }
    });
  }
}
