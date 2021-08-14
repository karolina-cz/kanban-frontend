export default class Utils {
  static stringArrayToLowercase(array: string[]): string[] {
    return array.map(x => {
      if (x !== null) {
        return x.toLowerCase();
      }
      return null;
    });
  }
}
