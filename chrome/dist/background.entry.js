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
function openLibraries() {
  Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])().then((config) => {
    return chrome.tabs.create({
      active: true,
      url: config.server
    });
  });
}
function removeBookmark() {
  return new Promise(function(resolve, reject) {
    Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])().then((tab) => {
      _iFetch_js__WEBPACK_IMPORTED_MODULE_1__["default"].post("/api/bookmarks/deleteUrl", {
        url: tab.url
      }).then((data) => {
        if (data.code != 0) {
          return reject(data.msg);
        } else {
          Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["removeLocalBookmark"])(tab.url);
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
function saveBookmark(tags) {
  return new Promise(function(resolve, reject) {
    Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])().then((tab) => {
      chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
        _iFetch_js__WEBPACK_IMPORTED_MODULE_1__["default"].post("/api/bookmarks/add", {
          url: tab.url,
          title: tab.title,
          from: "ext",
          tags: tags.join(","),
          imgbase64: dataUrl
        }).then((data) => {
          if (data.code != 0) {
            return reject(data.msg);
          } else {
            Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["saveLocalBookmark"])(tab.url, tab.title);
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
  });
}
function updateIcon() {
  var runtimeUrl = chrome.runtime.getURL("/"), icon = {
    path: {
      16: "icons/action-default-16.png",
      32: "icons/action-default-32.png",
      64: "icons/action-default-64.png"
    }
  };
  if (runtimeUrl.startsWith("moz")) {
    icon = {};
  }
  Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getCurrentTab"])().then((tab) => {
    Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["findLocalBookmark"])(tab.url).then((local) => {
      if (local)
        icon.path = {
          16: "icons/action-bookmarked-16.png",
          32: "icons/action-bookmarked-32.png",
          64: "icons/action-bookmarked-64.png"
        };
      return chrome.browserAction.setIcon(icon);
    });
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
/*! exports provided: getExtensionConfig, getCurrentTab, openOptionsPage, getShioriBookmarkFolder, findLocalBookmark, saveLocalBookmark, removeLocalBookmark, notify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtensionConfig", function() { return getExtensionConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentTab", function() { return getCurrentTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openOptionsPage", function() { return openOptionsPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getShioriBookmarkFolder", function() { return getShioriBookmarkFolder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLocalBookmark", function() { return findLocalBookmark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveLocalBookmark", function() { return saveLocalBookmark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeLocalBookmark", function() { return removeLocalBookmark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "notify", function() { return notify; });
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
        console.log(activeTab);
        if (activeTab == void 0) {
          reject();
        } else {
          resolve(activeTab);
        }
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
function getShioriBookmarkFolder() {
  return new Promise((resolve) => {
    var parentId = "", runtimeUrl = chrome.runtime.getURL("/");
    if (runtimeUrl.startsWith("moz")) {
      parentId = "unfiled_____";
    } else if (runtimeUrl.startsWith("chrome")) {
      parentId = "2";
    } else {
      throw new Error("right now extension only support firefox and chrome");
    }
    chrome.bookmarks.getChildren(parentId, function(children) {
      var shiori = children.find((el) => el.url == null && el.title === "Shiori");
      if (!shiori) {
        chrome.bookmarks.create({
          title: "Shiori",
          parentId
        }, (shiori2) => {
          return resolve(shiori2);
        });
      } else {
        return resolve(shiori);
      }
    });
  });
}
function findLocalBookmark(url) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then((shioriFolder) => {
      chrome.bookmarks.search({
        url
      }, (existingBookmarks) => {
        var idx = existingBookmarks.findIndex((book) => {
          return book.parentId === shioriFolder.id;
        });
        if (idx >= 0) {
          return resolve(existingBookmarks[idx]);
        } else {
          return resolve();
        }
      });
    });
  });
}
function saveLocalBookmark(url, title) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then((shioriFolder) => {
      chrome.bookmarks.search({
        url
      }, (existingBookmarks) => {
        var idx = existingBookmarks.findIndex((book) => {
          return book.parentId === shioriFolder.id;
        });
        if (idx === -1) {
          chrome.bookmarks.create({
            url,
            title,
            parentId: shioriFolder.id
          }, () => {
            resolve();
          });
        }
        resolve();
      });
    });
  });
}
function removeLocalBookmark(url) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then((shioriFolder) => {
      chrome.bookmarks.search({
        url
      }, (existingBookmarks) => {
        existingBookmarks.forEach((book) => {
          if (book.parentId !== shioriFolder.id)
            return;
          chrome.bookmarks.remove(book.id);
        });
        return resolve();
      });
    });
  });
}
function notify(title, message) {
  try {
    var icon = "/icons/icon.png";
    var isClosed = false;
    var notificationId = "posting_" + Math.random();
    chrome.notifications.create(
      notificationId,
      {
        type: "basic",
        title,
        message,
        iconUrl: icon
      },
      function(nId) {
      }
    );
    setTimeout(function() {
      if (!isClosed)
        chrome.notifications.clear(notificationId, function(wasCleared) {
        });
    }, 5e3);
  } catch (e) {
    alert(e.message);
  }
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
          Object(_helper__WEBPACK_IMPORTED_MODULE_0__["notify"])("\u901A\u77E5", "\u670D\u52A1\u5F02\u5E38\uFF0C\u65E0\u6CD5\u8BBF\u95EE\u670D\u52A1:" + baseUrl2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2JhY2tncm91bmQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9qcy9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2lGZXRjaC5qcyJdLCJuYW1lcyI6WyJzaGlvcmkiLCJkYXRhIiwidG9rZW4iLCJiYXNlVXJsIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZxSztBQUNsSjtBQUVuQixTQUFlLGVBQWUsS0FBSztBQUFBO0FBQ2pDLFFBQUk7QUFDRixVQUFJLFVBQVUsTUFBTSxPQUFPLEtBQUssWUFBWSxJQUFJLElBQUk7QUFBQSxRQUNsRCxNQUFNO0FBQUEsTUFDUixDQUFDO0FBQ0QsYUFBTztBQUFBLElBQ1QsU0FBUSxHQUFOO0FB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RUFDQSxNQUFNLENBQUMsVUFBVTtBQUNoQixrQkFBUSxJQUFJLGlDQUFpQyxLQUFLO0FBQ2xELGdFQUFNLENBQUMsZ0JBQU0sd0VBQWlCRSxRQUFPO0FBQ3JDLGlCQUFPLE9BQU8sS0FBSztBQUFBLFFBQ3JCLENBQUM7QUFBQSxNQUlMLENBQUMsRUFBRSxNQUFNLFdBQVM7QUFDaEIsZ0JBQVEsSUFBSSxrQ0FBa0MsS0FBSztBQUNuRCxlQUFPLE9BQU8sS0FBSztBQUFBLE1BQ3JCLENBQUM7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNIO0FBQ0Y7QUFFZSxtRUFBSSxPQUFPLENBQUMiLCJmaWxlIjoiYmFja2dyb3VuZC5lbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL2pzL2JhY2tncm91bmQtc2NyaXB0LmpzXCIpO1xuIiwiaW1wb3J0IHsgZ2V0RXh0ZW5zaW9uQ29uZmlnLCBnZXRDdXJyZW50VGFiLCBvcGVuT3B0aW9uc1BhZ2UsIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyLCBzYXZlTG9jYWxCb29rbWFyaywgcmVtb3ZlTG9jYWxCb29rbWFyaywgZmluZExvY2FsQm9va21hcmsgfSBmcm9tIFwiLi9oZWxwZXIuanNcIjtcbmltcG9ydCBpZmV0Y2ggZnJvbSBcIi4vaUZldGNoLmpzXCJcblxuYXN5bmMgZnVuY3Rpb24gZ2V0UGFnZUNvbnRlbnQodGFiKSB7XG4gIHRyeSB7XG4gICAgdmFyIGNvbnRlbnQgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHtcbiAgICAgIHR5cGU6IFwicGFnZS1jb250ZW50XCJcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG9wZW5MaWJyYXJpZXMoKSB7XG4gIGdldEV4dGVuc2lvbkNvbmZpZygpLnRoZW4oY29uZmlnID0+IHtcbiAgICByZXR1cm4gY2hyb21lLnRhYnMuY3JlYXRlKHtcbiAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgIHVybDogY29uZmlnLnNlcnZlcixcbiAgICB9KTtcbiAgfSlcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQm9va21hcmsoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZ2V0Q3VycmVudFRhYigpLnRoZW4odGFiID0+IHtcbiAgICAgIGlmZXRjaC5wb3N0KFwiL2FwaS9ib29rbWFya3MvZGVsZXRlVXJsXCIsIHtcbiAgICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgICAgaWYgKGRhdGEuY29kZSAhPSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChkYXRhLm1zZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZW1vdmUgbG9jYWwgYm9va21hcmtcbiAgICAgICAgICByZW1vdmVMb2NhbEJvb2ttYXJrKHRhYi51cmwpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVyci50b1N0cmluZygpKTtcbiAgICAgICAgaWYgKGVyci50b1N0cmluZygpLmluY2x1ZGVzKFwibG9naW5cIikpIHtcbiAgICAgICAgICBvcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyLnRvU3RyaW5nKCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxufVxuXG5mdW5jdGlvbiBzYXZlQm9va21hcmsodGFncykge1xuICAvLyBHZXQgdmFsdWUgZnJvbSBhc3luYyBmdW5jdGlvblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG4gICAgICAvLyDmiKrlm75cbiAgICAgIC8vIOaNleiOt+W9k+WJjemAiemhueWNoeS4reWPr+ingeWMuuWfn+eahOWxj+W5leaIquWbvlxuICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIobnVsbCwge30sIGZ1bmN0aW9uIChkYXRhVXJsKSB7XG4gICAgICAgIGlmZXRjaC5wb3N0KFwiL2FwaS9ib29rbWFya3MvYWRkXCIsIHtcbiAgICAgICAgICB1cmw6IHRhYi51cmwsXG4gICAgICAgICAgdGl0bGU6IHRhYi50aXRsZSxcbiAgICAgICAgICBmcm9tOiBcImV4dFwiLFxuICAgICAgICAgIHRhZ3M6IHRhZ3Muam9pbihcIixcIiksXG4gICAgICAgICAgaW1nYmFzZTY0OiBkYXRhVXJsXG4gICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuY29kZSAhPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGRhdGEubXNnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRvIGxvY2FsIGJvb2ttYXJrXG4gICAgICAgICAgICBzYXZlTG9jYWxCb29rbWFyayh0YWIudXJsLCB0YWIudGl0bGUpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgICAgICBvcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVyci50b1N0cmluZygpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgfSlcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUljb24oKSB7XG4gIC8vIFNldCBpbml0aWFsIGljb25cbiAgdmFyIHJ1bnRpbWVVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCIvXCIpLFxuICAgIGljb24gPSB7XG4gICAgICBwYXRoOiB7XG4gICAgICAgIDE2OiBcImljb25zL2FjdGlvbi1kZWZhdWx0LTE2LnBuZ1wiLFxuICAgICAgICAzMjogXCJpY29ucy9hY3Rpb24tZGVmYXVsdC0zMi5wbmdcIixcbiAgICAgICAgNjQ6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtNjQucG5nXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gIC8vIEZpcmVmb3ggYWxsb3dzIHVzaW5nIGVtcHR5IG9iamVjdCBhcyBkZWZhdWx0IGljb24uXG4gIC8vIFRoaXMgd2F5LCBGaXJlZm94IHdpbGwgdXNlIGRlZmF1bHRfaWNvbiB0aGF0IGRlZmluZWQgaW4gbWFuaWZlc3QuanNvblxuICBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwibW96XCIpKSB7XG4gICAgaWNvbiA9IHt9O1xuICB9XG5cbiAgLy8gR2V0IGN1cnJlbnQgYWN0aXZlIHRhYlxuXG4gIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG5cbiAgICBmaW5kTG9jYWxCb29rbWFyayh0YWIudXJsKS50aGVuKGxvY2FsID0+IHtcbiAgICAgIGlmIChsb2NhbCkgaWNvbi5wYXRoID0ge1xuICAgICAgICAxNjogXCJpY29ucy9hY3Rpb24tYm9va21hcmtlZC0xNi5wbmdcIixcbiAgICAgICAgMzI6IFwiaWNvbnMvYWN0aW9uLWJvb2ttYXJrZWQtMzIucG5nXCIsXG4gICAgICAgIDY0OiBcImljb25zL2FjdGlvbi1ib29rbWFya2VkLTY0LnBuZ1wiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRJY29uKGljb24pO1xuICAgIH0pXG5cbiAgfSlcbn1cblxuLy8gRGVmaW5lIGV2ZW50IGhhbmRsZXJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgdmFyIHRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICBzd2l0Y2ggKHJlcXVlc3QudHlwZSkge1xuICAgIGNhc2UgXCJvcGVuLWxpYnJhcmllc1wiOlxuICAgICAgdGFzayA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgb3BlbkxpYnJhcmllcygpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyZW1vdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlbW92ZUJvb2ttYXJrKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNhdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNhdmVCb29rbWFyayhyZXF1ZXN0LnRhZ3MpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIGVycm9yXCIsIGVycik7XG4gICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB0YXNrO1xufSk7XG5cbi8vIEFkZCBoYW5kbGVyIGZvciBpY29uIGNoYW5nZVxuZnVuY3Rpb24gdXBkYXRlQWN0aXZlVGFiKCkge1xuICB1cGRhdGVJY29uKCkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpKTtcbn1cblxuY2hyb21lLmJvb2ttYXJrcy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS5ib29rbWFya3Mub25SZW1vdmVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUud2luZG93cy5vbkZvY3VzQ2hhbmdlZC5hZGRMaXN0ZW5lcih1cGRhdGVBY3RpdmVUYWIpO1xudXBkYXRlQWN0aXZlVGFiKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbkNvbmZpZygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICB2YXIgdG9rZW4gPSBpdGVtcy50b2tlbiB8fCBcIlwiO1xuICAgICAgICB2YXIgc2VydmVyID0gaXRlbXMuc2VydmVyIHx8IFwiXCI7XG4gICAgICAgIGlmICh0b2tlbiA9PT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoXCJubyBhY3RpdmUgc2Vzc2lvbiwgcGxlYXNlIGxvZ2luIGZpcnN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXJ2ZXIgPT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KFwic2VydmVyIHVybCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgc2VydmVyOiBzZXJ2ZXJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgYWN0aXZlIHRhYnMgaW4gY3VycmVudCB3aW5kb3cgIFxuICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWVcbiAgICAgIH0sICh0YWJzKSA9PiB7XG4gICAgICAgIGlmICghdGFicyB8fCB0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YWIgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHByb3RvY29sXG4gICAgICAgIGxldCBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuICAgICAgICAvL2xldCB1cmwgPSBuZXcgVVJMKGFjdGl2ZVRhYi51cmwpO1xuICAgICAgICAvL2xldCBzdXBwb3J0ZWRQcm90b2NvbHMgPSBbXCJodHRwczpcIiwgXCJodHRwOlwiLCBcImZ0cDpcIiwgXCJmaWxlOlwiXTtcblxuICAgICAgICAvL2lmICghc3VwcG9ydGVkUHJvdG9jb2xzLmluY2x1ZGVzKHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiR7dXJsLnByb3RvY29sfVwiYCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZVRhYilcbiAgICAgICAgaWYgKGFjdGl2ZVRhYiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoYWN0aXZlVGFiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuT3B0aW9uc1BhZ2UoKSB7XG4gIGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi92aWV3L29wdGlvbnMuaHRtbFwiXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIC8vIFRPRE86XG4gICAgLy8gSSdtIG5vdCBzdXJlIGl0J3MgdGhlIG1vc3QgZWZmaWNpZW50IHdheSwgYnV0IGl0J3MgdGhlIHNpbXBsZXN0LlxuICAgIC8vIFdlIHdhbnQgdG8gcHV0IFNoaW9yaSBmb2xkZXIgaW4gYE90aGVyIGJvb2ttYXJrc2AsIHdoaWNoIGlkIGRpZmZlcmVudCBkZXBlbmRpbmcgb24gY2hyb21lLlxuICAgIC8vIEluIEZpcmVmb3gsIGl0cyBpZCBpcyBgdW5maWxlZF9fX19fYCB3aGlsZSBpbiBDaHJvbWUgdGhlIGlkIGlzIGAyYC5cbiAgICB2YXIgcGFyZW50SWQgPSBcIlwiLFxuICAgICAgcnVudGltZVVybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIi9cIik7XG5cbiAgICBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwibW96XCIpKSB7XG4gICAgICBwYXJlbnRJZCA9IFwidW5maWxlZF9fX19fXCI7XG4gICAgfSBlbHNlIGlmIChydW50aW1lVXJsLnN0YXJ0c1dpdGgoXCJjaHJvbWVcIikpIHtcbiAgICAgIHBhcmVudElkID0gXCIyXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInJpZ2h0IG5vdyBleHRlbnNpb24gb25seSBzdXBwb3J0IGZpcmVmb3ggYW5kIGNocm9tZVwiKVxuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgcGFyZW50IGZvbGRlciBhbHJlYWR5IGhhcyBTaGlvcmkgZm9sZGVyXG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRDaGlsZHJlbihwYXJlbnRJZCwgZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICB2YXIgc2hpb3JpID0gY2hpbGRyZW4uZmluZChlbCA9PiBlbC51cmwgPT0gbnVsbCAmJiBlbC50aXRsZSA9PT0gXCJTaGlvcmlcIik7XG4gICAgICBpZiAoIXNoaW9yaSkge1xuICAgICAgICBjaHJvbWUuYm9va21hcmtzLmNyZWF0ZSh7XG4gICAgICAgICAgdGl0bGU6IFwiU2hpb3JpXCIsXG4gICAgICAgICAgcGFyZW50SWQ6IHBhcmVudElkXG4gICAgICAgIH0sIHNoaW9yaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoc2hpb3JpKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHNoaW9yaSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMb2NhbEJvb2ttYXJrKHVybCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpLnRoZW4oc2hpb3JpRm9sZGVyID0+IHtcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9LCBleGlzdGluZ0Jvb2ttYXJrcyA9PiB7XG4gICAgICAgIHZhciBpZHggPSBleGlzdGluZ0Jvb2ttYXJrcy5maW5kSW5kZXgoYm9vayA9PiB7XG4gICAgICAgICAgcmV0dXJuIGJvb2sucGFyZW50SWQgPT09IHNoaW9yaUZvbGRlci5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4aXN0aW5nQm9va21hcmtzW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVMb2NhbEJvb2ttYXJrKHVybCwgdGl0bGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICB2YXIgaWR4ID0gZXhpc3RpbmdCb29rbWFya3MuZmluZEluZGV4KGJvb2sgPT4ge1xuICAgICAgICAgIHJldHVybiBib29rLnBhcmVudElkID09PSBzaGlvcmlGb2xkZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBwYXJlbnRJZDogc2hpb3JpRm9sZGVyLmlkLFxuICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTG9jYWxCb29rbWFyayh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICBleGlzdGluZ0Jvb2ttYXJrcy5mb3JFYWNoKGJvb2sgPT4ge1xuICAgICAgICAgIGlmIChib29rLnBhcmVudElkICE9PSBzaGlvcmlGb2xkZXIuaWQpIHJldHVybjtcbiAgICAgICAgICBjaHJvbWUuYm9va21hcmtzLnJlbW92ZShib29rLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnkodGl0bGUsIG1lc3NhZ2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaWNvbiA9IFwiL2ljb25zL2ljb24ucG5nXCI7XG4gICAgdmFyIGlzQ2xvc2VkID0gZmFsc2U7XG4gICAgdmFyIG5vdGlmaWNhdGlvbklkID0gXCJwb3N0aW5nX1wiICsgTWF0aC5yYW5kb20oKTtcblxuICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShcbiAgICAgIG5vdGlmaWNhdGlvbklkLCB7XG4gICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgaWNvblVybDogaWNvbixcbiAgICB9LFxuICAgICAgZnVuY3Rpb24gKG5JZCkgeyB9XG4gICAgKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNDbG9zZWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGlmaWNhdGlvbklkLCBmdW5jdGlvbiAod2FzQ2xlYXJlZCkgeyB9KTtcbiAgICB9LCA1MDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gIH1cbn0iLCJpbXBvcnQge1xuICBnZXRFeHRlbnNpb25Db25maWcsIG5vdGlmeVxufSBmcm9tIFwiLi9oZWxwZXJcIjtcblxuY2xhc3MgaUZldGNoIHtcbiAgZ2V0KHJvdXRlLCBkYXRhID0ge30pIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGhlYWRlcnMgPSB7fVxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAvLyDpgY3ljoblr7nosaEs5re75Yqg5q+P5Liq6ZSu5YC85a+5XG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCBkYXRhW2tleV0pO1xuICAgIH1cbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IHBhcmFtcy50b1N0cmluZygpOyAvLyAnYT0xJmI9MidcblxuICAgIHZhciB1cmwgPSBuZXcgVVJMKHJvdXRlLCBiYXNlVXJsKTtcbiAgICB1cmwgPSB1cmwgKyBgPyR7cXVlcnlTdHJpbmd9YDtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAodG9rZW4gIT0gJycpIHtcbiAgICAgICAgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgdG9rZW5cbiAgICAgIH1cblxuICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB9KVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4gcmVzb2x2ZShkYXRhKSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3Qocm91dGUsIGRhdGEgPSB7fSwgaGVhZGVycyA9IHtcbiAgICAnQ29udGVudC1UeXBlJzogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgfSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBnZXRFeHRlbnNpb25Db25maWcoKS50aGVuKGNvbmZpZ0RhdGEgPT4ge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGNvbmZpZ0RhdGEudG9rZW5cbiAgICAgICAgY29uc3QgYmFzZVVybCA9IGNvbmZpZ0RhdGEuc2VydmVyXG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB2YXIgdXJsID0gbmV3IFVSTChyb3V0ZSwgYmFzZVVybCk7XG5cblxuICAgICAgICAvLyB0b2tlblxuICAgICAgICBpZiAodG9rZW4gIT0gJycpIHtcbiAgICAgICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5aSE55CGIGJvZHlcbiAgICAgICAgdmFyIGJvZHkgPSBcIlwiO1xuICAgICAgICAvLyDmiorkuIDkuKrlj4LmlbDlr7nosaHmoLzlvI/ljJbkuLrkuIDkuKrlrZfnrKbkuLJcbiAgICAgICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpID49IDApIHtcbiAgICAgICAgICBsZXQgcmV0ID0gJydcbiAgICAgICAgICBmb3IgKGNvbnN0IGl0IGluIGRhdGEpIHtcbiAgICAgICAgICAgIHJldCArPVxuICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoaXQpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFbaXRdKSArICcmJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBib2R5ID0gcmV0LnN1YnN0cmluZygwLCByZXQubGVuZ3RoIC0gMSlcbiAgICAgICAgfSBlbHNlIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gJ211bHRpcGFydC9mb3JtLWRhdGE7Y2hhcnNldD1VVEYtOCcpIHtcbiAgICAgICAgICBib2R5ID0gZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgMVwiKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBvayA9PiByZXR1cm4ganNvblwiLCBkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgM1wiLCBlcnJvcik7XG4gICAgICAgICAgICBub3RpZnkoXCLpgJrnn6VcIiwgXCLmnI3liqHlvILluLjvvIzml6Dms5Xorr/pl67mnI3liqE6XCIgKyBiYXNlVXJsKVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgICB9KTtcblxuXG5cbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgMTJcIiwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgaUZldGNoKCkiXSwic291cmNlUm9vdCI6IiJ9