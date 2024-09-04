export default class EventAttacher {
  constructor() {
    // Initialize with any shared state or configuration if needed
  }

  attachEventListeners(selection, node) {
    if (!selection) {
      //   console.error("Selection is undefined or null");
      return;
    }

    selection
      .on("click", (event) => this.handleNodeClick(event, node))
      .on("mouseover", (event) => this.handleNodeMouseOver(event, node))
      .on("mouseout", (event) => this.handleNodeMouseOut(event, node));
  }

  handleNodeClick(event, node) {
    console.log("Node clicked:", node);
    // Implement your click logic here
  }

  handleNodeMouseOver(event, node) {
    console.log("Mouse over node:", node);
    // Implement your mouse over logic here
  }

  handleNodeMouseOut(event, node) {
    console.log("Mouse out of node:", node);
    // Implement your mouse out logic here
  }
}
