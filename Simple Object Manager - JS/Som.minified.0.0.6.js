"use strict";class Som{constructor(t,i,s=!0){function e(){let t=new WeakSet;return(i,s)=>{if("object"==typeof s&&null!==s){if(t.has(s))return;t.add(s)}return s}}if(this.data={},this.defaultvalue=i,"object"==typeof t&&t instanceof Som==!1){if(Array.isArray(t)&&t.length>0){let a=this.data;t.forEach(function(t){if(s)try{a=Object.assign(a,JSON.parse(JSON.stringify(t)))}catch(i){console.warn("issue assigning object, trying removing circular references."),a=Object.assign(a,JSON.parse(JSON.stringify(t,e())))}else a=Object.assign(a,t)})}else try{s?this.data=Object.assign({},JSON.parse(JSON.stringify(t))):this.data=t}catch(r){console.warn("issue assigning object, trying removing circular references."),this.data=Object.assign({},JSON.parse(JSON.stringify(t,e())))}}else if("object"==typeof t&&t instanceof Som==!0)try{this.data=Object.assign({},JSON.parse(JSON.stringify(t.data)))}catch(n){console.warn("issue assigning object, trying removing circular references."),this.data=Object.assign({},JSON.parse(JSON.stringify(t.data,e())))}}get(t,i){if(void 0===t||""==t)return this.data;if("string"==typeof t){for(var s=t.split("."),e=this.data,a=0;a<s.length&&void 0!=e;a++)e=Array.isArray(e)&&Math.abs(parseInt(s[a]))<=e.length?0>parseInt(s[a])?e[e.length-Math.abs(parseInt(s[a]))]:e[parseInt(s[a])]:Array.isArray(e)&&Math.abs(parseInt(s[a]))>e.length?i||this.defaultvalue||void 0:e[s[a]];return e||i||this.defaultvalue||void 0}}assign(t,i,s){void 0===i&&(i=s);let e="override"==arguments[3];if(void 0!==t&&""!=t&&"string"==typeof t)for(var a=t.split("."),r=this.data,n=0;n<a.length&&void 0!=r;n++)if("string"==typeof a[n]&&!0==isNaN(a[n])){if(Object(r).hasOwnProperty(a[n]))n==a.length-1?Array.isArray(r[a[n]])?e?r[a[n]]=i:r[a[n]].push(i):r[a[n]]=i:("string"==typeof r[a[n]]&&(r[a[n]]={}),r=r[a[n]]);else if(n==a.length-1){if("object"!=typeof r)return;r[a[n]]=i}else isNaN(a[n+1])?r[a[n]]={}:r[a[n]]=[],r=r[a[n]]}else"string"==typeof a[n]&&!1==isNaN(a[n])&&(Array.isArray(r)&&Math.abs(a[n])<r.length?n==a.length-1?r[a[n]]=i:r=r[a[n]]:Array.isArray(r)&&a[n]>=r.length&&(n==a.length-1?r.push(i):(r.push({}),r=r[r.length-1])));else"object"==typeof t&&(this.data=Object.assign(this.data,t));return this.data}merge(t,i){if("object"==typeof t&&void 0===i)i=t,t=void 0;else if("string"==typeof t&&"object"==typeof i);else if("object"==typeof t&&"string"==typeof i){let s=t;t=i,i=s}if(void 0===t||""==t)return this.data=Object.assign(this.data,JSON.parse(JSON.stringify(i))),this.data;for(var e=t.split("."),a=this.data,r=0;r<e.length&&void 0!=a;r++)a=Array.isArray(a)&&Math.abs(parseInt(e[r]))<=a.length?0>parseInt(e[r])?a[a.length-Math.abs(parseInt(e[r]))]:a[parseInt(e[r])]:Array.isArray(a)&&Math.abs(parseInt(e[r]))>a.length?this.defaultvalue||void 0:a[e[r]];if(void 0!==a||a!=this.defaultvalue){if(Array.isArray(a)&&Array.isArray(i))i.forEach(function(t){a.push(t)});else{var n=Object.assign(a,JSON.parse(JSON.stringify(i)));this.data=this.assign(t,n)}return this.data}}remove(t,i){if(void 0===i&&(i=!1),""==t||void 0===t)this.clear();else for(var s=t.split("."),e=this.data,a=0;a<s.length&&void 0!=e;a++)if("string"==typeof s[a]&&!0==isNaN(s[a])){if(!Object(e).hasOwnProperty(s[a]))return this.data;a==s.length-1?"object"==typeof e[s[a]]?delete e[s[a]]:i?delete e[s[a]]:e[s[a]]=void 0:e=e[s[a]]}else if("string"==typeof s[a]&&!1==isNaN(s[a])){if(!(Array.isArray(e)&&Math.abs(s[a])<e.length))return this.data;if(a==s.length-1)return e.splice(s[a],1),this.data;e=e[s[a]]}}push(t,i,s=!1){if(""==t||void 0===t)this.data=[this.data],this.data.push(i);else if(t.length>0){let e=this.get(t);void 0===e||s?this.assign(t,[i],void 0,"override"):Array.isArray(e)?e.push(i):("object"==typeof e||"string"==typeof e)&&!1==s&&this.assign(t,[e,i])}return this.data}clear(){this.data={}}}