/*! Copyright banther@pm.me */!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";function r(){return new Promise((e,t)=>{try{chrome.storage.local.get(null,(function(n){var r=n.token||"",o=n.server||"";return""===r?t("no active session, please login first"):""===o?t("server url is not specified"):e({token:r,server:o})}))}catch(e){return t(e)}})}function o(){return new Promise((e,t)=>{try{chrome.tabs.query({active:!0,currentWindow:!0},n=>{!n||n.length;let r=n[0];null==r?t():e(r)})}catch(e){t(e)}})}function i(){chrome.tabs.create({url:"/view/options.html"})}function u(){return new Promise(e=>{var t="",n=chrome.runtime.getURL("/");if(n.startsWith("moz"))t="unfiled_____";else{if(!n.startsWith("chrome"))throw new Error("right now extension only support firefox and chrome");t="2"}chrome.bookmarks.getChildren(t,(function(n){var r=n.find(e=>null==e.url&&"Shiori"===e.title);if(r)return e(r);chrome.bookmarks.create({title:"Shiori",parentId:t},t=>e(t))}))})}function a(e){return new Promise(t=>{u().then(n=>{chrome.bookmarks.search({url:e},e=>{var r=e.findIndex(e=>e.parentId===n.id);return r>=0?t(e[r]):t()})})})}function c(e,t){return new Promise(n=>{u().then(r=>{chrome.bookmarks.search({url:e},o=>{-1===o.findIndex(e=>e.parentId===r.id)&&chrome.bookmarks.create({url:e,title:t,parentId:r.id},()=>{n()}),n()})})})}function s(e){return new Promise(t=>{u().then(n=>{chrome.bookmarks.search({url:e},e=>(e.forEach(e=>{e.parentId===n.id&&chrome.bookmarks.remove(e.id)}),t()))})})}function l(e,t){try{var n="posting_"+Math.random();chrome.notifications.create(n,{type:"basic",title:e,message:t,iconUrl:"/icons/icon.png"},(function(e){})),setTimeout((function(){chrome.notifications.clear(n,(function(e){}))}),5e3)}catch(e){alert(e.message)}}n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return o})),n.d(t,"e",(function(){return i})),n.d(t,"a",(function(){return a})),n.d(t,"g",(function(){return c})),n.d(t,"f",(function(){return s})),n.d(t,"d",(function(){return l}))},function(e,t,n){"use strict";n.r(t);var r=n(0),o=(e,t,n)=>new Promise((r,o)=>{var i=e=>{try{a(n.next(e))}catch(e){o(e)}},u=e=>{try{a(n.throw(e))}catch(e){o(e)}},a=e=>e.done?r(e.value):Promise.resolve(e.value).then(i,u);a((n=n.apply(e,t)).next())});var i=document.getElementById("error-message"),u=document.getElementById("txt-session"),a=document.getElementById("input-server"),c=document.getElementById("input-username"),s=document.getElementById("input-password"),l=(document.getElementById("input-remember"),document.getElementById("btn-login")),d=document.getElementById("loading-sign"),m={};function f(e){i.style.display="block",i.textContent=e}function h(){return o(this,null,(function*(){var e=a.value,t=c.value,n=s.value,r=yield function(e,t,n,r){return o(this,null,(function*(){if(""===e)throw new Error("Server must not empty");if(""===t)throw new Error("Username must not empty");if(""===n)throw new Error("Password must not empty");"boolean"!=typeof r&&(r=!1);var o="";try{"/"==(o=new URL(e)).pathname.slice(-1)?o.pathname=o.pathname+"api/auth/login":o.pathname=o.pathname+"/api/auth/login"}catch(t){throw new Error(e+" is not a valid url")}var i=yield fetch(o,{method:"post",body:JSON.stringify({username:t,password:n,remember_me:r}),headers:{"Content-Type":"application/json"}});if(!i.ok){var u=yield i.text();throw new Error(u)}return(yield i.json()).data.token}))}(e,t,n,!0);return e.endsWith("/")&&(e=e.slice(0,-1)),m.server=e,m.token=r,m.username=t,m.remember=!0,yield function(e){return o(this,null,(function*(){return chrome.storage.local.set(e)}))}(m),u.textContent="Logged in.",r.length>10&&(d.style.display="none"),Promise.resolve()}))}Object(r.c)().then(e=>{m=e,""===e.token?u.textContent="No active session":u.textContent="Logged in success by"+e.username,a.value=e.server,c.value=e.username,s.value=e.password}).catch(e=>f(e)),l.addEventListener("click",()=>{i.style.display="none",l.style.display="none",d.style.display="block",h().catch(e=>f(e)).finally(()=>(l.style.display="block",void(d.style.display="none")))})}]);