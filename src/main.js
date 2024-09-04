import SystemCore from "./core/SystemCore.js";
import ScriptLoader from "./util/script/ScriptLoader.js";

const scriptsToLoad = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
];

ScriptLoader.loadScripts(scriptsToLoad)
  .then(() => {
    console.log("All scripts have been loaded");
  })
  .catch((error) => {
    console.error("Error loading scripts:", error);
  });

const systemCore = new SystemCore();
systemCore.startApplication();
