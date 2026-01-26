const globalSettings = turbine.getExtensionSettings();
const myObjects = globalSettings.myObjects || [];
const Som = require("./som.js");
window.Som = Som;
if (Array.isArray(myObjects) && myObjects.length > 0) {
  myObjects.forEach(obj => {
    window[obj.name] = new Som()
  })
}