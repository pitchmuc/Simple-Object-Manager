"use strict";class Som{constructor(t,a,s=!0){function e(){const t=new WeakSet;return(a,s)=>{if("object"==typeof s&&null!==s){if(t.has(s))return;t.add(s)}return s}}if(this.data={},this.defaultvalue=a,"object"==typeof t&&t instanceof Som==0)if(Array.isArray(t)&&t.length>0){let a=this.data;t.forEach((function(t){a=s?Object.assign(a,JSON.parse(JSON.stringify(t))):Object.assign(a,t)}))}else try{this.data=s?Object.assign({},JSON.parse(JSON.stringify(t))):t}catch(a){console.warn("issue assigning object, trying removing circular references."),this.data=Object.assign({},JSON.parse(JSON.stringify(t,e())))}else if("object"==typeof t&&t instanceof Som==1)try{this.data=Object.assign({},JSON.parse(JSON.stringify(t.data)))}catch(a){console.warn("issue assigning object, trying removing circular references."),this.data=Object.assign({},JSON.parse(JSON.stringify(t.data,e())))}}get(t,a){if(void 0===t||""==t)return this.data;if("string"==typeof t){for(var s=t.split("."),e=this.data,r=0;r<s.length&&null!=e;r++)e=Array.isArray(e)&&Math.abs(parseInt(s[r]))<=e.length?parseInt(s[r])<0?e[e.length-Math.abs(parseInt(s[r]))]:e[parseInt(s[r])]:Array.isArray(e)&&Math.abs(parseInt(s[r]))>e.length?a||this.defaultvalue||void 0:e[s[r]];return e||a||this.defaultvalue||void 0}}assign(t,a,s){if(void 0===a&&(a=s),void 0!==t&&""!=t&&"string"==typeof t)for(var e=t.split("."),r=this.data,i=0;i<e.length&&null!=r;i++)if("string"==typeof e[i]&&1==isNaN(e[i]))if(Object(r).hasOwnProperty(e[i]))i==e.length-1?Array.isArray(r[e[i]])?r[e[i]].push(a):r[e[i]]=a:("string"==typeof r[e[i]]&&(r[e[i]]={}),r=r[e[i]]);else if(i==e.length-1){if("object"!=typeof r)return;r[e[i]]=a}else isNaN(e[i+1])?r[e[i]]={}:r[e[i]]=[],r=r[e[i]];else"string"==typeof e[i]&&0==isNaN(e[i])&&(Array.isArray(r)&&Math.abs(e[i])<r.length?i==e.length-1?r[e[i]]=a:r=r[e[i]]:Array.isArray(r)&&e[i]>=r.length&&(i==e.length-1?r.push(a):(r.push({}),r=r[r.length-1])));else"object"==typeof t&&(this.data=Object.assign(this.data,t));return this.data}merge(t,a){if(void 0===a||""==a)return this.data=Object.assign(this.data,JSON.parse(JSON.stringify(t))),this.data;for(var s=a.split("."),e=this.data,r=0;r<s.length&&null!=e;r++)e=Array.isArray(e)&&Math.abs(parseInt(s[r]))<=e.length?parseInt(s[r])<0?e[e.length-Math.abs(parseInt(s[r]))]:e[parseInt(s[r])]:Array.isArray(e)&&Math.abs(parseInt(s[r]))>e.length?this.defaultvalue||void 0:e[s[r]];if(void 0!==e||e!=this.defaultvalue){if(Array.isArray(e)&&Array.isArray(t))t.forEach((function(t){e.push(t)}));else{var i=Object.assign(e,JSON.parse(JSON.stringify(t)));this.data=this.assign(a,i)}return this.data}}remove(t,a){if(void 0===a&&(a=!1),""==t||void 0===t)this.clear();else for(var s=t.split("."),e=this.data,r=0;r<s.length&&null!=e;r++)if("string"==typeof s[r]&&1==isNaN(s[r])){if(!Object(e).hasOwnProperty(s[r]))return this.data;r==s.length-1?"object"==typeof e[s[r]]||a?delete e[s[r]]:e[s[r]]=void 0:e=e[s[r]]}else if("string"==typeof s[r]&&0==isNaN(s[r])){if(!(Array.isArray(e)&&Math.abs(s[r])<e.length))return this.data;if(r==s.length-1)return e.splice(s[r],1),this.data;e=e[s[r]]}}clear(){this.data={}}}