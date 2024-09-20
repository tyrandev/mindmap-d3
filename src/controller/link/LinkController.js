import MindmapLink from "../../model/links/MindmapLink.js";
import UrlLink from "../../model/links/UrlLink.js";
import UrlTextUtil from "../../util/text/UrlTextUtil.js";

export default class LinkController {
  constructor(mindmapLocalStorage) {
    if (!mindmapLocalStorage) {
      throw new Error("MindmapLocalStorage instance is required");
    }
    this.mindmapLocalStorage = mindmapLocalStorage;
  }

  setMindmapLink(node, mindmapName) {
    if (!node) return;
    const savedMindmaps = this.mindmapLocalStorage.listSavedMindMaps();
    if (!savedMindmaps.includes(mindmapName)) {
      throw new Error(`Mindmap with the name "${mindmapName}" does not exist.`);
    }
    const mindmapLink = new MindmapLink(mindmapName);
    node.setLink(mindmapLink);
  }

  setUrlLink(node, url) {
    if (!node) return;
    if (!UrlTextUtil.isValidUrl(url)) {
      throw new Error(
        `Invalid URL: "${url}". Please provide a valid URL starting with http or https.`
      );
    }
    const urlLink = new UrlLink(url);
    node.setLink(urlLink);
  }

  removeLink(node) {
    node.setLink(null);
  }

  openMindmapLink(node) {
    if (!node) return;

    const link = node.getLink();
    if (!link || link.getType() !== "MindmapLink") {
      throw new Error("No MindmapLink set or invalid link type.");
    }

    const mindmapName = link.getMindmapName();
    try {
      console.log(`Opening mindmap: ${mindmapName}`);
      this.mindmapLocalStorage.loadFromLocalStorage(mindmapName);
    } catch (error) {
      throw new Error(`Failed to load mindmap: ${error.message}`);
    }
  }

  openUrlLink(node) {
    if (!node) return;

    const link = node.getLink();
    if (!link || link.getType() !== "UrlLink") {
      throw new Error("No UrlLink set or invalid link type.");
    }

    const url = link.getUrl();
    window.open(url, "_blank");
  }

  openLink(node) {
    if (!node) return;

    const link = node.getLink();
    if (!link) {
      throw new Error("No link is set for this node.");
    }

    const linkType = link.getType();
    if (linkType === "MindmapLink") {
      this.openMindmapLink(node);
    } else if (linkType === "UrlLink") {
      this.openUrlLink(node);
    } else {
      throw new Error("Unsupported link type.");
    }
  }

  async promptSetUrlLink(node) {
    const userInput = prompt("Enter the URL to link to this node:");
    if (!userInput) {
      alert("URL input canceled.");
      return;
    }

    try {
      this.setUrlLink(node, userInput);
      console.log(`URL link set to: ${userInput}`);
    } catch (error) {
      alert(`Error setting URL link: ${error.message}`);
    }
  }

  async promptSetMindmapLink(node) {
    const mindmaps = this.mindmapLocalStorage.listSavedMindMaps();
    if (mindmaps.length === 0) {
      alert("No mindmaps available to link.");
      return;
    }

    const userInput = prompt(
      `Select a mindmap to link to this node (Available mindmaps: ${mindmaps.join(
        ", "
      )}):`
    );

    if (!userInput) {
      alert("Mindmap selection canceled.");
      return;
    }

    const selectedMindmap = userInput.trim();
    const mindmapExists = mindmaps.some(
      (map) => map.toLowerCase() === selectedMindmap.toLowerCase()
    );

    if (mindmapExists) {
      try {
        this.setMindmapLink(node, selectedMindmap);
        console.log(`Mindmap link set to: ${selectedMindmap}`);
      } catch (error) {
        alert(`Error setting mindmap link: ${error.message}`);
      }
    } else {
      alert(`Invalid mindmap name. Please select from: ${mindmaps.join(", ")}`);
    }
  }
}
