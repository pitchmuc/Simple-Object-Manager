"use strict";class Xom{constructor(t,a,e){this.data={},this.defaultValue=e,null!=a?this.data={tenant:{}}:"object"==typeof t&&t instanceof Xom==0?this.data=Object.assign({},t):"object"==typeof t&&t instanceof Xom==1&&(this.data=Object.assign({},t.data))}get(t){if(void 0===t||""==t)return this.data;if("string"==typeof t){for(var a=t.split("."),e=this.data,s=0;s<a.length&&null!=e;s++)e=Array.isArray(e)&&Math.abs(parseInt(a[s]))<=e.length?parseInt(a[s])<0?e[e.length-Math.abs(parseInt(a[s]))]:e[parseInt(a[s])]:Array.isArray(e)&&Math.abs(parseInt(a[s]))>e.length?this.defaultValue||void 0:e[a[s]];return e||this.defaultValue||void 0}}assign(t,a){if(void 0!==t&&""!=t&&"string"==typeof t)for(var e=t.split("."),s=this.data,r=0;r<e.length&&null!=s;r++)if("string"==typeof e[r]&&1==isNaN(e[r]))if(Object(s).hasOwnProperty(e[r]))r==e.length-1?Array.isArray(s[e[r]])?s[e[r]].push(a):s[e[r]]=a:("string"==typeof s[e[r]]&&(s[e[r]]={}),s=s[e[r]]);else if(console.log("new path"),r==e.length-1){if("object"!=typeof s)return;s[e[r]]=a}else isNaN(e[r+1])?s[e[r]]={}:s[e[r]]=[],s=s[e[r]];else"string"==typeof e[r]&&0==isNaN(e[r])&&(Array.isArray(s)&&Math.abs(e[r])<s.length?(console.log("existing element"),r==e.length-1?s[e[r]]=a:s=s[e[r]]):Array.isArray(s)&&e[r]>=s.length&&(console.log("new element"),r==e.length-1?s.push(a):(s.push({}),s=s[s.length-1])));else"object"==typeof t&&(this.data=Object.assign(this.data,t));return this.data}merge(t,a){if(void 0===a||""==a)return this.data=Object.assign(this.data,t),this.data;for(var e=a.split("."),s=this.data,r=0;r<e.length&&null!=s;r++)Array.isArray(s)&&Math.abs(parseInt(e[r]))<=s.length?(s=parseInt(e[r])<0?s[s.length-Math.abs(parseInt(e[r]))]:s[parseInt(e[r])],console.log(s)):s=Array.isArray(s)&&Math.abs(parseInt(e[r]))>s.length?this.defaultValue||void 0:s[e[r]];if(void 0!==s||s!=this.defaultValue){if(Array.isArray(s)&&Array.isArray(t))t.forEach(function(t){s.push(t)});else{var i=Object.assign(s,t);this.data=this.assign(a,i)}return this.data}}remove(t){if(""==t||void 0===t)this.clear();else for(var a=t.split("."),e=this.data,s=0;s<a.length&&null!=e;s++)if("string"==typeof a[s]&&1==isNaN(a[s])){if(console.log("string"),!Object(e).hasOwnProperty(a[s]))return this.data;s==a.length-1?"object"==typeof e[a[s]]?delete e[a[s]]:e[a[s]]=void 0:e=e[a[s]]}else if("string"==typeof a[s]&&0==isNaN(a[s])){if(console.log("number"),!(Array.isArray(e)&&Math.abs(a[s])<e.length))return this.data;if(s==a.length-1)return e.splice(a[s],1),this.data;e=e[a[s]]}}clear(){this.data={}}partialClear(t){this.data={},"str"==typeof t?this.data={object:{}}:"object"==typeof t&&(this.data=t)}}