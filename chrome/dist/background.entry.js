/*! Copyright banther@pm.me */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/js/background-script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./chrome/js/background-script.js":
/*!****************************************!*\
  !*** ./chrome/js/background-script.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper.js */ "./chrome/js/helper.js");
/* harmony import */ var _iFetch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iFetch.js */ "./chrome/js/iFetch.js");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};


function getPageContent(tab) {
  return __async(this, null, function* () {
    try {
      var content = yield chrome.tabs.sendMessage(tab.id, {
        type: "page-content"
      });
      return content;
    } catch (e) {
      return {};
    }
  });
}
function getShioriBookmarkFolder() {
  return __async(this, null, function* () {
    var parentId = "", runtimeUrl = yield chrome.runtime.getURL("/");
    if (runtimeUrl.startsWith("moz")) {
      parentId = "unfiled_____";
    } else if (runtimeUrl.startsWith("chrome")) {
      parentId = "2";
    } else {
      throw new Error("right now extension only support firefox and chrome");
    }
    var children = yield chrome.bookmarks.getChildren(parentId), shiori = children.find((el) => el.url == null && el.title === "Shiori");
    if (!shiori) {
      shiori = yield chrome.bookmarks.create({
        title: "Shiori",
        parentId
      });
    }
    return shiori;
  });
}
function findLocalBookmark(url) {
  return __async(this, null, function* () {
    var shioriFolder = yield getShioriBookmarkFolder(), existingBookmarks = yield chrome.bookmarks.search({
      url
    });
    var idx = existingBookmarks.findIndex((book) => {
      return book.parentId === shioriFolder.id;
    });
    if (idx >= 0) {
      return existingBookmarks[idx];
    } else {
      return null;
    }
  });
}
function saveLocalBookmark(url, title) {
  return __async(this, null, function* () {
    var shioriFolder = yield getShioriBookmarkFolder(), existingBookmarks = yield chrome.bookmarks.search({
      url
    });
    var idx = existingBookmarks.findIndex((book) => {
      return book.parentId === shioriFolder.id;
    });
    if (idx === -1) {
      yield chrome.bookmarks.create({
        url,
        title,
        parentId: shioriFolder.id
      });
    }
    return Promise.resolve();
  });
}
function removeLocalBookmark(url) {
  return __async(this, null, function* () {
    var shioriFolder = yield getShioriBookmarkFolder(), existingBookmarks = yield chrome.bookmarks.search({
      url
    });
    existingBookmarks.forEach((book) => {
      if (book.parentId !== shioriFolder.id)
        return;
      chrome.bookmarks.remove(book.id);
    });
    return Promise.resolve();
  });
}
function openLibraries() {
  return __async(this, null, function* () {
    console.log("openLibraries");
    var config = yield Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])();
    return chrome.tabs.create({
      active: true,
      url: config.server
    });
  });
}
function removeBookmark() {
  return __async(this, null, function* () {
    var tab = yield Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])(), config = yield Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])();
    var apiURL = "";
    try {
      var api = new URL(config.server);
      if (api.pathname.slice(-1) == "/") {
        api.pathname = api.pathname + "api/bookmarks/ext";
      } else {
        api.pathname = api.pathname + "/api/bookmarks/ext";
      }
      apiURL = api.toString();
    } catch (err2) {
      throw new Error(`${config.server} is not a valid url`);
    }
    var response = yield fetch(apiURL, {
      method: "delete",
      body: JSON.stringify({
        url: tab.url
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`
      }
    });
    if (!response.ok) {
      var err = yield response.text();
      throw new Error(err);
    }
    yield removeLocalBookmark(tab.url);
    return Promise.resolve();
  });
}
function saveBookmark(tags) {
  return new Promise(function(resolve, reject) {
    Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])().then((tab) => {
      _iFetch_js__WEBPACK_IMPORTED_MODULE_1__["default"].post("/api/bookmarks/add", {
        url: tab.url,
        title: tab.title,
        tags: tags.join(",")
      }).then((data) => {
        if (data.code != 0) {
          return reject(data.msg);
        } else {
          return resolve();
        }
      }).catch((err) => {
        console.log(err.toString());
        if (err.toString().includes("login")) {
          Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["openOptionsPage"])();
        } else {
          return reject(err.toString());
        }
      });
    });
  });
}
function updateIcon() {
  return __async(this, null, function* () {
    var runtimeUrl = yield chrome.runtime.getURL("/"), icon = {
      path: {
        16: "icons/action-default-16.png",
        32: "icons/action-default-32.png",
        64: "icons/action-default-64.png"
      }
    };
    if (runtimeUrl.startsWith("moz")) {
      icon = {};
    }
    try {
      var tab = yield Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])(), local = yield findLocalBookmark(tab.url);
      if (local)
        icon.path = {
          16: "icons/action-bookmarked-16.png",
          32: "icons/action-bookmarked-32.png",
          64: "icons/action-bookmarked-64.png"
        };
    } catch (e) {
    }
    return chrome.browserAction.setIcon(icon);
  });
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var task = Promise.resolve();
  switch (request.type) {
    case "open-libraries":
      task = new Promise((resolve, reject) => {
        openLibraries().then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
      break;
    case "remove-bookmark":
      task = new Promise((resolve, reject) => {
        removeBookmark().then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
      break;
    case "save-bookmark":
      task = new Promise((resolve, reject) => {
        saveBookmark(request.tags).then(() => {
          console.log("save-bookmark success");
          resolve();
        }).catch((err) => {
          console.log("save-bookmark error", err);
          reject(err);
        });
      });
      break;
  }
  return task;
});
function updateActiveTab() {
  updateIcon().catch((err) => console.error(err.message));
}
chrome.bookmarks.onCreated.addListener(updateActiveTab);
chrome.bookmarks.onRemoved.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.windows.onFocusChanged.addListener(updateActiveTab);
updateActiveTab();


/***/ }),

/***/ "./chrome/js/helper.js":
/*!*****************************!*\
  !*** ./chrome/js/helper.js ***!
  \*****************************/
/*! exports provided: getExtensionConfig, getCurrentTab, openOptionsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtensionConfig", function() { return getExtensionConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentTab", function() { return getCurrentTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openOptionsPage", function() { return openOptionsPage; });
function getExtensionConfig() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(null, function(items) {
        var token = items.token || "";
        var server = items.server || "";
        if (token === "") {
          return reject("no active session, please login first");
        }
        if (server === "") {
          return reject("server url is not specified");
        }
        return resolve({
          token,
          server
        });
      });
    } catch (err) {
      return reject(err);
    }
  });
}
function getCurrentTab() {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        if (!tabs || tabs.length < 1) {
        }
        let activeTab = tabs[0];
        resolve(activeTab);
      });
    } catch (err) {
      reject(err);
    }
  });
}
function openOptionsPage() {
  chrome.tabs.create({
    url: "/view/options.html"
  });
}


/***/ }),

/***/ "./chrome/js/iFetch.js":
/*!*****************************!*\
  !*** ./chrome/js/iFetch.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper */ "./chrome/js/helper.js");

class iFetch {
  get(route, data = {}) {
    var that = this;
    var headers = {};
    const params = new URLSearchParams();
    for (let key in data) {
      params.append(key, data[key]);
    }
    const queryString = params.toString();
    var url = new URL(route, baseUrl);
    url = url + `?${queryString}`;
    return new Promise(function(resolve, reject) {
      if (token != "") {
        headers["Authorization"] = "Bearer " + token;
      }
      fetch(url, {
        headers
      }).then((response) => response.json()).then((data2) => resolve(data2)).catch((error) => {
        reject(error);
      });
    });
  }
  post(route, data = {}, headers = {
    "Content-Type": "application/json"
  }) {
    return new Promise(function(resolve, reject) {
      Object(_helper__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])().then((configData) => {
        const token2 = configData.token;
        const baseUrl2 = configData.server;
        var that = this;
        var url = new URL(route, baseUrl2);
        if (token2 != "") {
          headers["Authorization"] = "Bearer " + token2;
        }
        var body = "";
        if (headers["Content-Type"].indexOf("application/x-www-form-urlencoded") >= 0) {
          let ret = "";
          for (const it in data) {
            ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
          body = ret.substring(0, ret.length - 1);
        } else if (headers["Content-Type"] === "multipart/form-data;charset=UTF-8") {
          body = data;
        } else {
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(data);
        }
        fetch(url, {
          method: "POST",
          credentials: "same-origin",
          headers,
          body
        }).then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok 1");
            throw new Error("Network response was not ok");
          }
          return response.json();
        }).then((data2) => {
          console.log("Network response was ok => return json", data2);
          return resolve(data2);
        }).catch((error) => {
          console.log("Network response was not ok 3", error);
          return reject(error);
        });
      }).catch((error) => {
        console.log("Network response was not ok 12", error);
        return reject(error);
      });
    });
  }
}
/* harmony default export */ __webpack_exports__["default"] = (new iFetch());


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2JhY2tncm91bmQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9qcy9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2lGZXRjaC5qcyJdLCJuYW1lcyI6WyJlcnIiLCJkYXRhIiwidG9rZW4iLCJiYXNlVXJsIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZpRjtBQUM5RDtBQUVuQixTQUFlLGVBQWUsS0FBSztBQUFBO0FBQ2pDLFFBQUk7QUFDRixVQUFJLFVBQVUsTUFBTSxPQUFPLEtBQUssWUFBWSxJQUFJLElBQUk7QUFBQSxRQUNsRCxNQUFNO0FBQUEsTUFDUixDQUFDO0FBQ0QsYUFBTztBQUFBLElBQ1QsU0FBUSxHQUFOO0FBQ0Es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QUksK0JBQStCO0FBQzNDLGtCQUFNLElBQUksTUFBTSw2QkFBNkI7QUFBQSxVQUMvQztBQUNBLGlCQUFPLFNBQVMsS0FBSztBQUFBLFFBQ3ZCLENBQUMsRUFBRSxLQUFLLENBQUFELFVBQVE7QUFDZCxrQkFBUSxJQUFJLDBDQUEwQ0EsS0FBSTtBQUMxRCxpQkFBTyxRQUFRQSxLQUFJO0FBQUEsUUFDckIsQ0FBQyxFQUNBLE1BQU0sQ0FBQyxVQUFVO0FBQ2hCLGtCQUFRLElBQUksaUNBQWlDLEtBQUs7QUFDbEQsaUJBQU8sT0FBTyxLQUFLO0FBQUEsUUFDckIsQ0FBQztBQUFBLE1BSUwsQ0FBQyxFQUFFLE1BQU0sV0FBUztBQUNoQixnQkFBUSxJQUFJLGtDQUFrQyxLQUFLO0FBQ25ELGVBQU8sT0FBTyxLQUFLO0FBQUEsTUFDckIsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVlLG1FQUFJLE9BQU8sQ0FBQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvanMvYmFja2dyb3VuZC1zY3JpcHQuanNcIik7XG4iLCJpbXBvcnQgeyBnZXRFeHRlbnNpb25Db25maWcsIGdldEN1cnJlbnRUYWIsIG9wZW5PcHRpb25zUGFnZSB9IGZyb20gXCIuL2hlbHBlci5qc1wiO1xuaW1wb3J0IGlmZXRjaCBmcm9tIFwiLi9pRmV0Y2guanNcIlxuXG5hc3luYyBmdW5jdGlvbiBnZXRQYWdlQ29udGVudCh0YWIpIHtcbiAgdHJ5IHtcbiAgICB2YXIgY29udGVudCA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgdHlwZTogXCJwYWdlLWNvbnRlbnRcIlxuICAgIH0pO1xuICAgIHJldHVybiBjb250ZW50O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKSB7XG4gIC8vIFRPRE86XG4gIC8vIEknbSBub3Qgc3VyZSBpdCdzIHRoZSBtb3N0IGVmZmljaWVudCB3YXksIGJ1dCBpdCdzIHRoZSBzaW1wbGVzdC5cbiAgLy8gV2Ugd2FudCB0byBwdXQgU2hpb3JpIGZvbGRlciBpbiBgT3RoZXIgYm9va21hcmtzYCwgd2hpY2ggaWQgZGlmZmVyZW50IGRlcGVuZGluZyBvbiBjaHJvbWUuXG4gIC8vIEluIEZpcmVmb3gsIGl0cyBpZCBpcyBgdW5maWxlZF9fX19fYCB3aGlsZSBpbiBDaHJvbWUgdGhlIGlkIGlzIGAyYC5cbiAgdmFyIHBhcmVudElkID0gXCJcIixcbiAgICBydW50aW1lVXJsID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiL1wiKTtcblxuICBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwibW96XCIpKSB7XG4gICAgcGFyZW50SWQgPSBcInVuZmlsZWRfX19fX1wiO1xuICB9IGVsc2UgaWYgKHJ1bnRpbWVVcmwuc3RhcnRzV2l0aChcImNocm9tZVwiKSkge1xuICAgIHBhcmVudElkID0gXCIyXCI7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicmlnaHQgbm93IGV4dGVuc2lvbiBvbmx5IHN1cHBvcnQgZmlyZWZveCBhbmQgY2hyb21lXCIpXG4gIH1cblxuICAvLyBDaGVjayBpZiB0aGUgcGFyZW50IGZvbGRlciBhbHJlYWR5IGhhcyBTaGlvcmkgZm9sZGVyXG4gIHZhciBjaGlsZHJlbiA9IGF3YWl0IGNocm9tZS5ib29rbWFya3MuZ2V0Q2hpbGRyZW4ocGFyZW50SWQpLFxuICAgIHNoaW9yaSA9IGNoaWxkcmVuLmZpbmQoZWwgPT4gZWwudXJsID09IG51bGwgJiYgZWwudGl0bGUgPT09IFwiU2hpb3JpXCIpO1xuXG4gIGlmICghc2hpb3JpKSB7XG4gICAgc2hpb3JpID0gYXdhaXQgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgdGl0bGU6IFwiU2hpb3JpXCIsXG4gICAgICBwYXJlbnRJZDogcGFyZW50SWRcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBzaGlvcmk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRMb2NhbEJvb2ttYXJrKHVybCkge1xuICB2YXIgc2hpb3JpRm9sZGVyID0gYXdhaXQgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKSxcbiAgICBleGlzdGluZ0Jvb2ttYXJrcyA9IGF3YWl0IGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgIHVybDogdXJsLFxuICAgIH0pO1xuXG4gIHZhciBpZHggPSBleGlzdGluZ0Jvb2ttYXJrcy5maW5kSW5kZXgoYm9vayA9PiB7XG4gICAgcmV0dXJuIGJvb2sucGFyZW50SWQgPT09IHNoaW9yaUZvbGRlci5pZDtcbiAgfSk7XG5cblxuXG4gIGlmIChpZHggPj0gMCkge1xuICAgIHJldHVybiBleGlzdGluZ0Jvb2ttYXJrc1tpZHhdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVMb2NhbEJvb2ttYXJrKHVybCwgdGl0bGUpIHtcbiAgdmFyIHNoaW9yaUZvbGRlciA9IGF3YWl0IGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCksXG4gICAgZXhpc3RpbmdCb29rbWFya3MgPSBhd2FpdCBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICB1cmw6IHVybCxcbiAgICB9KTtcblxuICB2YXIgaWR4ID0gZXhpc3RpbmdCb29rbWFya3MuZmluZEluZGV4KGJvb2sgPT4ge1xuICAgIHJldHVybiBib29rLnBhcmVudElkID09PSBzaGlvcmlGb2xkZXIuaWQ7XG4gIH0pO1xuXG4gIGlmIChpZHggPT09IC0xKSB7XG4gICAgYXdhaXQgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBwYXJlbnRJZDogc2hpb3JpRm9sZGVyLmlkLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVMb2NhbEJvb2ttYXJrKHVybCkge1xuICB2YXIgc2hpb3JpRm9sZGVyID0gYXdhaXQgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKSxcbiAgICBleGlzdGluZ0Jvb2ttYXJrcyA9IGF3YWl0IGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgIHVybDogdXJsLFxuICAgIH0pO1xuXG4gIGV4aXN0aW5nQm9va21hcmtzLmZvckVhY2goYm9vayA9PiB7XG4gICAgaWYgKGJvb2sucGFyZW50SWQgIT09IHNoaW9yaUZvbGRlci5pZCkgcmV0dXJuO1xuICAgIGNocm9tZS5ib29rbWFya3MucmVtb3ZlKGJvb2suaWQpO1xuICB9KTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gb3BlbkxpYnJhcmllcygpIHtcbiAgY29uc29sZS5sb2coXCJvcGVuTGlicmFyaWVzXCIpO1xuICB2YXIgY29uZmlnID0gYXdhaXQgZ2V0RXh0ZW5zaW9uQ29uZmlnKCk7XG4gIHJldHVybiBjaHJvbWUudGFicy5jcmVhdGUoe1xuICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICB1cmw6IGNvbmZpZy5zZXJ2ZXIsXG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZW1vdmVCb29rbWFyaygpIHtcbiAgdmFyIHRhYiA9IGF3YWl0IGdldEN1cnJlbnRUYWIoKSxcbiAgICBjb25maWcgPSBhd2FpdCBnZXRFeHRlbnNpb25Db25maWcoKTtcblxuICAvLyBDcmVhdGUgQVBJIFVSTFxuICB2YXIgYXBpVVJMID0gXCJcIjtcbiAgdHJ5IHtcbiAgICB2YXIgYXBpID0gbmV3IFVSTChjb25maWcuc2VydmVyKTtcbiAgICBpZiAoYXBpLnBhdGhuYW1lLnNsaWNlKC0xKSA9PSBcIi9cIikge1xuICAgICAgYXBpLnBhdGhuYW1lID0gYXBpLnBhdGhuYW1lICsgXCJhcGkvYm9va21hcmtzL2V4dFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucGF0aG5hbWUgPSBhcGkucGF0aG5hbWUgKyBcIi9hcGkvYm9va21hcmtzL2V4dFwiO1xuICAgIH1cbiAgICBhcGlVUkwgPSBhcGkudG9TdHJpbmcoKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke2NvbmZpZy5zZXJ2ZXJ9IGlzIG5vdCBhIHZhbGlkIHVybGApO1xuICB9XG5cbiAgLy8gU2VuZCByZXF1ZXN0IHZpYSBiYWNrZ3JvdW5kIHNjcmlwdFxuICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcGlVUkwsIHtcbiAgICBtZXRob2Q6IFwiZGVsZXRlXCIsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXJsOiB0YWIudXJsXG4gICAgfSksXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICBcIkF1dGhvcml6YXRpb25cIjogYEJlYXJlciAke2NvbmZpZy50b2tlbn1gLFxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIHZhciBlcnIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gIH1cblxuICAvLyBSZW1vdmUgbG9jYWwgYm9va21hcmtcbiAgYXdhaXQgcmVtb3ZlTG9jYWxCb29rbWFyayh0YWIudXJsKTtcblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbmZ1bmN0aW9uIHNhdmVCb29rbWFyayh0YWdzKSB7XG4gIC8vIEdldCB2YWx1ZSBmcm9tIGFzeW5jIGZ1bmN0aW9uXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZ2V0Q3VycmVudFRhYigpLnRoZW4odGFiID0+IHtcbiAgICAgIGlmZXRjaC5wb3N0KFwiL2FwaS9ib29rbWFya3MvYWRkXCIsIHtcbiAgICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgICB0aXRsZTogdGFiLnRpdGxlLFxuICAgICAgICB0YWdzOiB0YWdzLmpvaW4oXCIsXCIpLFxuICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgaWYgKGRhdGEuY29kZSAhPSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChkYXRhLm1zZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgICAgb3Blbk9wdGlvbnNQYWdlKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVyci50b1N0cmluZygpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gdG9kb1xuICAgICAgLy8gU2F2ZSB0byBsb2NhbCBib29rbWFya1xuICAgICAgLy8gdmFyIHBhZ2VUaXRsZSA9IGNvbnRlbnQudGl0bGUgfHwgdGFiLnRpdGxlO1xuICAgICAgLy8gYXdhaXQgc2F2ZUxvY2FsQm9va21hcmsodGFiLnVybCwgcGFnZVRpdGxlKTtcbiAgICB9KVxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdXBkYXRlSWNvbigpIHtcbiAgLy8gU2V0IGluaXRpYWwgaWNvblxuICB2YXIgcnVudGltZVVybCA9IGF3YWl0IGNocm9tZS5ydW50aW1lLmdldFVSTChcIi9cIiksXG4gICAgaWNvbiA9IHtcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgMTY6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtMTYucG5nXCIsXG4gICAgICAgIDMyOiBcImljb25zL2FjdGlvbi1kZWZhdWx0LTMyLnBuZ1wiLFxuICAgICAgICA2NDogXCJpY29ucy9hY3Rpb24tZGVmYXVsdC02NC5wbmdcIlxuICAgICAgfVxuICAgIH07XG5cbiAgLy8gRmlyZWZveCBhbGxvd3MgdXNpbmcgZW1wdHkgb2JqZWN0IGFzIGRlZmF1bHQgaWNvbi5cbiAgLy8gVGhpcyB3YXksIEZpcmVmb3ggd2lsbCB1c2UgZGVmYXVsdF9pY29uIHRoYXQgZGVmaW5lZCBpbiBtYW5pZmVzdC5qc29uXG4gIGlmIChydW50aW1lVXJsLnN0YXJ0c1dpdGgoXCJtb3pcIikpIHtcbiAgICBpY29uID0ge307XG4gIH1cblxuICAvLyBHZXQgY3VycmVudCBhY3RpdmUgdGFiXG4gIHRyeSB7XG4gICAgdmFyIHRhYiA9IGF3YWl0IGdldEN1cnJlbnRUYWIoKSxcbiAgICAgIGxvY2FsID0gYXdhaXQgZmluZExvY2FsQm9va21hcmsodGFiLnVybCk7XG5cbiAgICBpZiAobG9jYWwpIGljb24ucGF0aCA9IHtcbiAgICAgIDE2OiBcImljb25zL2FjdGlvbi1ib29rbWFya2VkLTE2LnBuZ1wiLFxuICAgICAgMzI6IFwiaWNvbnMvYWN0aW9uLWJvb2ttYXJrZWQtMzIucG5nXCIsXG4gICAgICA2NDogXCJpY29ucy9hY3Rpb24tYm9va21hcmtlZC02NC5wbmdcIlxuICAgIH1cbiAgfSBjYXRjaCB7IH1cblxuICByZXR1cm4gY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0SWNvbihpY29uKTtcbn1cblxuLy8gRGVmaW5lIGV2ZW50IGhhbmRsZXJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgdmFyIHRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICBzd2l0Y2ggKHJlcXVlc3QudHlwZSkge1xuICAgIGNhc2UgXCJvcGVuLWxpYnJhcmllc1wiOlxuICAgICAgdGFzayA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgb3BlbkxpYnJhcmllcygpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyZW1vdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlbW92ZUJvb2ttYXJrKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNhdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNhdmVCb29rbWFyayhyZXF1ZXN0LnRhZ3MpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIGVycm9yXCIsIGVycik7XG4gICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB0YXNrO1xufSk7XG5cbi8vIEFkZCBoYW5kbGVyIGZvciBpY29uIGNoYW5nZVxuZnVuY3Rpb24gdXBkYXRlQWN0aXZlVGFiKCkge1xuICB1cGRhdGVJY29uKCkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpKTtcbn1cblxuY2hyb21lLmJvb2ttYXJrcy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS5ib29rbWFya3Mub25SZW1vdmVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUud2luZG93cy5vbkZvY3VzQ2hhbmdlZC5hZGRMaXN0ZW5lcih1cGRhdGVBY3RpdmVUYWIpO1xudXBkYXRlQWN0aXZlVGFiKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbkNvbmZpZygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICB2YXIgdG9rZW4gPSBpdGVtcy50b2tlbiB8fCBcIlwiO1xuICAgICAgICB2YXIgc2VydmVyID0gaXRlbXMuc2VydmVyIHx8IFwiXCI7XG4gICAgICAgIGlmICh0b2tlbiA9PT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoXCJubyBhY3RpdmUgc2Vzc2lvbiwgcGxlYXNlIGxvZ2luIGZpcnN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXJ2ZXIgPT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KFwic2VydmVyIHVybCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgc2VydmVyOiBzZXJ2ZXJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgYWN0aXZlIHRhYnMgaW4gY3VycmVudCB3aW5kb3cgIFxuICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWVcbiAgICAgIH0sICh0YWJzKSA9PiB7XG4gICAgICAgIGlmICghdGFicyB8fCB0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YWIgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHByb3RvY29sXG4gICAgICAgIGxldCBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuICAgICAgICAvL2xldCB1cmwgPSBuZXcgVVJMKGFjdGl2ZVRhYi51cmwpO1xuICAgICAgICAvL2xldCBzdXBwb3J0ZWRQcm90b2NvbHMgPSBbXCJodHRwczpcIiwgXCJodHRwOlwiLCBcImZ0cDpcIiwgXCJmaWxlOlwiXTtcblxuICAgICAgICAvL2lmICghc3VwcG9ydGVkUHJvdG9jb2xzLmluY2x1ZGVzKHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiR7dXJsLnByb3RvY29sfVwiYCk7XG4gICAgICAgIC8vfVxuICAgICAgICByZXNvbHZlKGFjdGl2ZVRhYik7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cblxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5PcHRpb25zUGFnZSgpIHtcbiAgY2hyb21lLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IFwiL3ZpZXcvb3B0aW9ucy5odG1sXCJcbiAgfSk7XG59IiwiaW1wb3J0IHtcbiAgZ2V0RXh0ZW5zaW9uQ29uZmlnXG59IGZyb20gXCIuL2hlbHBlclwiO1xuXG5jbGFzcyBpRmV0Y2gge1xuICBnZXQocm91dGUsIGRhdGEgPSB7fSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgaGVhZGVycyA9IHt9XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIC8vIOmBjeWOhuWvueixoSzmt7vliqDmr4/kuKrplK7lgLzlr7lcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgcGFyYW1zLmFwcGVuZChrZXksIGRhdGFba2V5XSk7XG4gICAgfVxuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcGFyYW1zLnRvU3RyaW5nKCk7IC8vICdhPTEmYj0yJ1xuXG4gICAgdmFyIHVybCA9IG5ldyBVUkwocm91dGUsIGJhc2VVcmwpO1xuICAgIHVybCA9IHVybCArIGA/JHtxdWVyeVN0cmluZ31gO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmICh0b2tlbiAhPSAnJykge1xuICAgICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyB0b2tlblxuICAgICAgfVxuXG4gICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiByZXNvbHZlKGRhdGEpKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcG9zdChyb3V0ZSwgZGF0YSA9IHt9LCBoZWFkZXJzID0ge1xuICAgICdDb250ZW50LVR5cGUnOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICB9KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGdldEV4dGVuc2lvbkNvbmZpZygpLnRoZW4oY29uZmlnRGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gY29uZmlnRGF0YS50b2tlblxuICAgICAgICBjb25zdCBiYXNlVXJsID0gY29uZmlnRGF0YS5zZXJ2ZXJcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciB1cmwgPSBuZXcgVVJMKHJvdXRlLCBiYXNlVXJsKTtcblxuXG4gICAgICAgIC8vIHRva2VuXG4gICAgICAgIGlmICh0b2tlbiAhPSAnJykge1xuICAgICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIHRva2VuXG4gICAgICAgIH1cblxuICAgICAgICAvLyDlpITnkIYgYm9keVxuICAgICAgICB2YXIgYm9keSA9IFwiXCI7XG4gICAgICAgIC8vIOaKiuS4gOS4quWPguaVsOWvueixoeagvOW8j+WMluS4uuS4gOS4quWtl+espuS4slxuICAgICAgICBpZiAoaGVhZGVyc1snQ29udGVudC1UeXBlJ10uaW5kZXhPZignYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgPj0gMCkge1xuICAgICAgICAgIGxldCByZXQgPSAnJ1xuICAgICAgICAgIGZvciAoY29uc3QgaXQgaW4gZGF0YSkge1xuICAgICAgICAgICAgcmV0ICs9XG4gICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChpdCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtpdF0pICsgJyYnXG4gICAgICAgICAgfVxuICAgICAgICAgIGJvZHkgPSByZXQuc3Vic3RyaW5nKDAsIHJldC5sZW5ndGggLSAxKVxuICAgICAgICB9IGVsc2UgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YTtjaGFyc2V0PVVURi04Jykge1xuICAgICAgICAgIGJvZHkgPSBkYXRhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayAxXCIpO1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2tcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG9rID0+IHJldHVybiBqc29uXCIsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayAzXCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgICAgfSk7XG5cblxuXG4gICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rIDEyXCIsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IGlGZXRjaCgpIl0sInNvdXJjZVJvb3QiOiIifQ==