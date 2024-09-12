export default class RectangleTextUtil {
  static countLettersAndNumbers(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "").length;
  }
}
