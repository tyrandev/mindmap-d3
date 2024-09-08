import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import NetworkUtil from "../util/network/NetworkUtil.js";

class Session {
  constructor() {
    this.os = null;
    this.browser = null;
    this.publicIP = null;
  }

  async initialize() {
    this.os = OSUtil.getOS();
    this.browser = BrowserUtil.getBrowser();
    this.publicIP = await NetworkUtil.fetchPublicIP();
    console.log(
      "OS: ",
      this.os,
      "| Browser: ",
      this.browser,
      "| Public IP: ",
      this.publicIP
    );
  }

  getOS() {
    return this.os;
  }

  getBrowser() {
    return this.browser;
  }

  getPublicIP() {
    return this.publicIP;
  }

  static getInstance() {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    return Session.instance;
  }
}

const sessionInstance = Session.getInstance();
export default sessionInstance;
