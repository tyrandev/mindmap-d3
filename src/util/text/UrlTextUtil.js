export default class UrlTextUtil {
  static isValidUrl(url) {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" + // protocol (http or https) - now required
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*\\.)+[a-zA-Z]{2,})|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
      "i"
    );
    return urlPattern.test(url);
  }

  static ensureHttps(url) {
    if (!/^https?:\/\//i.test(url)) {
      // If the URL doesn't start with http:// or https://, prepend https://
      return `https://${url}`;
    }
    return url;
  }
}
