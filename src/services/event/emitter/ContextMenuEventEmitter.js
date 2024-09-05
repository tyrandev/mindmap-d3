import EventEmitter from "./EventEmitter";

class ContextMenuEventEmitter extends EventEmitter {
  constructor() {
    if (!ContextMenuEventEmitter.instance) {
      super();
      ContextMenuEventEmitter.instance = this;
      Object.freeze(this);
    }
    return ContextMenuEventEmitter.instance;
  }
}

const instance = new ContextMenuEventEmitter();
export default instance;
