export default class TaskUtils {

  static getNumberFromTaskName(taskName: string): number {
    return +taskName.split('.', 2)[1];
  }

  static getPrefixFromTaskName(taskName: string): string {
    return taskName.split('.', 2)[0];
  }

  static sortTasksByNames<T extends { name: string }>(taskList: T[]): T[] {
    return taskList.sort((a, b) => {
      if (TaskUtils.getPrefixFromTaskName(a.name) > TaskUtils.getPrefixFromTaskName(b.name)) {
        return 1;
      } else if (TaskUtils.getPrefixFromTaskName(a.name) < TaskUtils.getPrefixFromTaskName(b.name)) {
        return -1;
      } else {
        if (TaskUtils.getNumberFromTaskName(a.name) > TaskUtils.getNumberFromTaskName(b.name)) {
          return 1;
        } else if (TaskUtils.getNumberFromTaskName(a.name) < TaskUtils.getNumberFromTaskName(b.name)){
          return -1;
        }
      }
  });
}
}
