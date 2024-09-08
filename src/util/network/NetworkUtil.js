export default class NetworkUtil {
  static async fetchPublicIP(timeoutMilliseconds = 500) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMilliseconds);

    try {
      const response = await fetch("https://api.ipify.org?format=json", {
        signal: controller.signal,
      });
      const data = await response.json();
      return data.ip;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch request timed out");
      } else {
        console.error("Error fetching public IP:", error);
      }
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
