const globalSettings = turbine.getExtensionSettings();
const objects = globalSettings.myObjects || [];
window.Som = require("Som.js")
if (Array.isArray(objects) && objects.length > 0) {
  objects.forEach(obj => {
    window.obj = new Som()
  })
}