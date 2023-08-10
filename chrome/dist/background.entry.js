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
  return new Promise(function(resolve, reject) {
    Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])().then((config) => {
      chrome.tabs.create({
        active: true,
        url: config.server
      });
      resolve();
    }).catch((err) => {
      if (err.toString().includes("login")) {
        Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["openOptionsPage"])();
      }
      reject(err);
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
  updateIcon();
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
        return resolve(items);
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
        if (route.indexOf("http") >= 0) {
          url = route;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2JhY2tncm91bmQtc2NyaXB0LmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9qcy9oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2lGZXRjaC5qcyJdLCJuYW1lcyI6WyJzaGlvcmkiLCJkYXRhIiwidG9rZW4iLCJiYXNlVXJsIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZxSztBQUNsSjtBQUVuQixTQUFlLGVBQWUsS0FBSztBQUFBO0FBQ2pDLFFBQUk7QUFDRixVQUFJLFVBQVUsTUFBTSxPQUFPLEtBQUssWUFBWSxJQUFJLElBQUk7QUFBQSxRQUNsRCxNQUFNO0FBQUEsTUFDUixDQUFDO0FBQ0QsYUFBTztBQUFBLElBQ1QsU0FBUSxHQUFOO0FB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Q0FBaUMsS0FBSztBQUNsRCxnRUFBTSxDQUFDLGdCQUFNLHdFQUFpQkUsUUFBTztBQUNyQyxpQkFBTyxPQUFPLEtBQUs7QUFBQSxRQUNyQixDQUFDO0FBQUEsTUFJTCxDQUFDLEVBQUUsTUFBTSxXQUFTO0FBQ2hCLGdCQUFRLElBQUksa0NBQWtDLEtBQUs7QUFDbkQsZUFBTyxPQUFPLEtBQUs7QUFBQSxNQUNyQixDQUFDO0FBQUEsSUFDSCxDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRWUsbUVBQUksT0FBTyxDQUFDIiwiZmlsZSI6ImJhY2tncm91bmQuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9iYWNrZ3JvdW5kLXNjcmlwdC5qc1wiKTtcbiIsImltcG9ydCB7IGdldEV4dGVuc2lvbkNvbmZpZywgZ2V0Q3VycmVudFRhYiwgb3Blbk9wdGlvbnNQYWdlLCBnZXRTaGlvcmlCb29rbWFya0ZvbGRlciwgc2F2ZUxvY2FsQm9va21hcmssIHJlbW92ZUxvY2FsQm9va21hcmssIGZpbmRMb2NhbEJvb2ttYXJrIH0gZnJvbSBcIi4vaGVscGVyLmpzXCI7XG5pbXBvcnQgaWZldGNoIGZyb20gXCIuL2lGZXRjaC5qc1wiXG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBhZ2VDb250ZW50KHRhYikge1xuICB0cnkge1xuICAgIHZhciBjb250ZW50ID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XG4gICAgICB0eXBlOiBcInBhZ2UtY29udGVudFwiXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7fTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvcGVuTGlicmFyaWVzKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGdldEV4dGVuc2lvbkNvbmZpZygpLnRoZW4oY29uZmlnID0+IHtcbiAgICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgdXJsOiBjb25maWcuc2VydmVyLFxuICAgICAgfSk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgIG9wZW5PcHRpb25zUGFnZSgpXG4gICAgICB9XG4gICAgICByZWplY3QoZXJyKVxuICAgIH0pXG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVCb29rbWFyaygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBnZXRDdXJyZW50VGFiKCkudGhlbih0YWIgPT4ge1xuICAgICAgaWZldGNoLnBvc3QoXCIvYXBpL2Jvb2ttYXJrcy9kZWxldGVVcmxcIiwge1xuICAgICAgICB1cmw6IHRhYi51cmwsXG4gICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICBpZiAoZGF0YS5jb2RlICE9IDApIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGRhdGEubXNnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJlbW92ZSBsb2NhbCBib29rbWFya1xuICAgICAgICAgIHJlbW92ZUxvY2FsQm9va21hcmsodGFiLnVybCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgaWYgKGVyci50b1N0cmluZygpLmluY2x1ZGVzKFwibG9naW5cIikpIHtcbiAgICAgICAgICBvcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyLnRvU3RyaW5nKCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxufVxuXG5mdW5jdGlvbiBzYXZlQm9va21hcmsodGFncykge1xuICAvLyBHZXQgdmFsdWUgZnJvbSBhc3luYyBmdW5jdGlvblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG4gICAgICAvLyDmiKrlm75cbiAgICAgIC8vIOaNleiOt+W9k+WJjemAiemhueWNoeS4reWPr+ingeWMuuWfn+eahOWxj+W5leaIquWbvlxuICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIobnVsbCwge30sIGZ1bmN0aW9uIChkYXRhVXJsKSB7XG4gICAgICAgIGlmZXRjaC5wb3N0KFwiL2FwaS9ib29rbWFya3MvYWRkXCIsIHtcbiAgICAgICAgICB1cmw6IHRhYi51cmwsXG4gICAgICAgICAgdGl0bGU6IHRhYi50aXRsZSxcbiAgICAgICAgICBmcm9tOiBcImV4dFwiLFxuICAgICAgICAgIHRhZ3M6IHRhZ3Muam9pbihcIixcIiksXG4gICAgICAgICAgaW1nYmFzZTY0OiBkYXRhVXJsXG4gICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKGRhdGEuY29kZSAhPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGRhdGEubXNnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRvIGxvY2FsIGJvb2ttYXJrXG4gICAgICAgICAgICBzYXZlTG9jYWxCb29rbWFyayh0YWIudXJsLCB0YWIudGl0bGUpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgICAgICBvcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVyci50b1N0cmluZygpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pO1xuXG4gICAgfSlcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUljb24oKSB7XG4gIC8vIFNldCBpbml0aWFsIGljb25cbiAgdmFyIHJ1bnRpbWVVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCIvXCIpLFxuICAgIGljb24gPSB7XG4gICAgICBwYXRoOiB7XG4gICAgICAgIDE2OiBcImljb25zL2FjdGlvbi1kZWZhdWx0LTE2LnBuZ1wiLFxuICAgICAgICAzMjogXCJpY29ucy9hY3Rpb24tZGVmYXVsdC0zMi5wbmdcIixcbiAgICAgICAgNjQ6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtNjQucG5nXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gIC8vIEZpcmVmb3ggYWxsb3dzIHVzaW5nIGVtcHR5IG9iamVjdCBhcyBkZWZhdWx0IGljb24uXG4gIC8vIFRoaXMgd2F5LCBGaXJlZm94IHdpbGwgdXNlIGRlZmF1bHRfaWNvbiB0aGF0IGRlZmluZWQgaW4gbWFuaWZlc3QuanNvblxuICBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwibW96XCIpKSB7XG4gICAgaWNvbiA9IHt9O1xuICB9XG5cbiAgLy8gR2V0IGN1cnJlbnQgYWN0aXZlIHRhYlxuXG4gIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG5cbiAgICBmaW5kTG9jYWxCb29rbWFyayh0YWIudXJsKS50aGVuKGxvY2FsID0+IHtcbiAgICAgIGlmIChsb2NhbCkgaWNvbi5wYXRoID0ge1xuICAgICAgICAxNjogXCJpY29ucy9hY3Rpb24tYm9va21hcmtlZC0xNi5wbmdcIixcbiAgICAgICAgMzI6IFwiaWNvbnMvYWN0aW9uLWJvb2ttYXJrZWQtMzIucG5nXCIsXG4gICAgICAgIDY0OiBcImljb25zL2FjdGlvbi1ib29rbWFya2VkLTY0LnBuZ1wiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRJY29uKGljb24pO1xuICAgIH0pXG5cbiAgfSlcbn1cblxuLy8gRGVmaW5lIGV2ZW50IGhhbmRsZXJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgdmFyIHRhc2sgPSBQcm9taXNlLnJlc29sdmUoKTtcblxuICBzd2l0Y2ggKHJlcXVlc3QudHlwZSkge1xuICAgIGNhc2UgXCJvcGVuLWxpYnJhcmllc1wiOlxuICAgICAgdGFzayA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgb3BlbkxpYnJhcmllcygpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJyZW1vdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHJlbW92ZUJvb2ttYXJrKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInNhdmUtYm9va21hcmtcIjpcbiAgICAgIHRhc2sgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNhdmVCb29rbWFyayhyZXF1ZXN0LnRhZ3MpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZlLWJvb2ttYXJrIGVycm9yXCIsIGVycik7XG4gICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB0YXNrO1xufSk7XG5cbi8vIEFkZCBoYW5kbGVyIGZvciBpY29uIGNoYW5nZVxuZnVuY3Rpb24gdXBkYXRlQWN0aXZlVGFiKCkge1xuICB1cGRhdGVJY29uKClcbn1cblxuY2hyb21lLmJvb2ttYXJrcy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS5ib29rbWFya3Mub25SZW1vdmVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIodXBkYXRlQWN0aXZlVGFiKTtcbmNocm9tZS50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKHVwZGF0ZUFjdGl2ZVRhYik7XG5jaHJvbWUud2luZG93cy5vbkZvY3VzQ2hhbmdlZC5hZGRMaXN0ZW5lcih1cGRhdGVBY3RpdmVUYWIpO1xudXBkYXRlQWN0aXZlVGFiKCk7IiwiZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbkNvbmZpZygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShpdGVtcyk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gR2V0IGFjdGl2ZSB0YWJzIGluIGN1cnJlbnQgd2luZG93ICBcbiAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlXG4gICAgICB9LCAodGFicykgPT4ge1xuICAgICAgICBpZiAoIXRhYnMgfHwgdGFicy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFiIGF2YWlsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBWYWxpZGF0ZSBwcm90b2NvbFxuICAgICAgICBsZXQgYWN0aXZlVGFiID0gdGFic1swXTtcbiAgICAgICAgLy9sZXQgdXJsID0gbmV3IFVSTChhY3RpdmVUYWIudXJsKTtcbiAgICAgICAgLy9sZXQgc3VwcG9ydGVkUHJvdG9jb2xzID0gW1wiaHR0cHM6XCIsIFwiaHR0cDpcIiwgXCJmdHA6XCIsIFwiZmlsZTpcIl07XG5cbiAgICAgICAgLy9pZiAoIXN1cHBvcnRlZFByb3RvY29scy5pbmNsdWRlcyh1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgcHJvdG9jb2wgXCIke3VybC5wcm90b2NvbH1cImApO1xuICAgICAgICAvL31cblxuICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmVUYWIpXG4gICAgICAgIGlmIChhY3RpdmVUYWIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGFjdGl2ZVRhYik7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3Blbk9wdGlvbnNQYWdlKCkge1xuICBjaHJvbWUudGFicy5jcmVhdGUoe1xuICAgIHVybDogXCIvdmlldy9vcHRpb25zLmh0bWxcIlxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAvLyBUT0RPOlxuICAgIC8vIEknbSBub3Qgc3VyZSBpdCdzIHRoZSBtb3N0IGVmZmljaWVudCB3YXksIGJ1dCBpdCdzIHRoZSBzaW1wbGVzdC5cbiAgICAvLyBXZSB3YW50IHRvIHB1dCBTaGlvcmkgZm9sZGVyIGluIGBPdGhlciBib29rbWFya3NgLCB3aGljaCBpZCBkaWZmZXJlbnQgZGVwZW5kaW5nIG9uIGNocm9tZS5cbiAgICAvLyBJbiBGaXJlZm94LCBpdHMgaWQgaXMgYHVuZmlsZWRfX19fX2Agd2hpbGUgaW4gQ2hyb21lIHRoZSBpZCBpcyBgMmAuXG4gICAgdmFyIHBhcmVudElkID0gXCJcIixcbiAgICAgIHJ1bnRpbWVVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCIvXCIpO1xuXG4gICAgaWYgKHJ1bnRpbWVVcmwuc3RhcnRzV2l0aChcIm1velwiKSkge1xuICAgICAgcGFyZW50SWQgPSBcInVuZmlsZWRfX19fX1wiO1xuICAgIH0gZWxzZSBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwiY2hyb21lXCIpKSB7XG4gICAgICBwYXJlbnRJZCA9IFwiMlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyaWdodCBub3cgZXh0ZW5zaW9uIG9ubHkgc3VwcG9ydCBmaXJlZm94IGFuZCBjaHJvbWVcIilcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBhcmVudCBmb2xkZXIgYWxyZWFkeSBoYXMgU2hpb3JpIGZvbGRlclxuICAgIGNocm9tZS5ib29rbWFya3MuZ2V0Q2hpbGRyZW4ocGFyZW50SWQsIGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgdmFyIHNoaW9yaSA9IGNoaWxkcmVuLmZpbmQoZWwgPT4gZWwudXJsID09IG51bGwgJiYgZWwudGl0bGUgPT09IFwiU2hpb3JpXCIpO1xuICAgICAgaWYgKCFzaGlvcmkpIHtcbiAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgICAgIHRpdGxlOiBcIlNoaW9yaVwiLFxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZFxuICAgICAgICB9LCBzaGlvcmkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKHNoaW9yaSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShzaGlvcmkpXG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTG9jYWxCb29rbWFyayh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICB2YXIgaWR4ID0gZXhpc3RpbmdCb29rbWFya3MuZmluZEluZGV4KGJvb2sgPT4ge1xuICAgICAgICAgIHJldHVybiBib29rLnBhcmVudElkID09PSBzaGlvcmlGb2xkZXIuaWQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShleGlzdGluZ0Jvb2ttYXJrc1tpZHhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTG9jYWxCb29rbWFyayh1cmwsIHRpdGxlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkudGhlbihzaGlvcmlGb2xkZXIgPT4ge1xuICAgICAgY2hyb21lLmJvb2ttYXJrcy5zZWFyY2goe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgIH0sIGV4aXN0aW5nQm9va21hcmtzID0+IHtcbiAgICAgICAgdmFyIGlkeCA9IGV4aXN0aW5nQm9va21hcmtzLmZpbmRJbmRleChib29rID0+IHtcbiAgICAgICAgICByZXR1cm4gYm9vay5wYXJlbnRJZCA9PT0gc2hpb3JpRm9sZGVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICAgIGNocm9tZS5ib29rbWFya3MuY3JlYXRlKHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgcGFyZW50SWQ6IHNoaW9yaUZvbGRlci5pZCxcbiAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICB9KVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxvY2FsQm9va21hcmsodXJsKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkudGhlbihzaGlvcmlGb2xkZXIgPT4ge1xuICAgICAgY2hyb21lLmJvb2ttYXJrcy5zZWFyY2goe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgIH0sIGV4aXN0aW5nQm9va21hcmtzID0+IHtcbiAgICAgICAgZXhpc3RpbmdCb29rbWFya3MuZm9yRWFjaChib29rID0+IHtcbiAgICAgICAgICBpZiAoYm9vay5wYXJlbnRJZCAhPT0gc2hpb3JpRm9sZGVyLmlkKSByZXR1cm47XG4gICAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5yZW1vdmUoYm9vay5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90aWZ5KHRpdGxlLCBtZXNzYWdlKSB7XG4gIHRyeSB7XG4gICAgdmFyIGljb24gPSBcIi9pY29ucy9pY29uLnBuZ1wiO1xuICAgIHZhciBpc0Nsb3NlZCA9IGZhbHNlO1xuICAgIHZhciBub3RpZmljYXRpb25JZCA9IFwicG9zdGluZ19cIiArIE1hdGgucmFuZG9tKCk7XG5cbiAgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jcmVhdGUoXG4gICAgICBub3RpZmljYXRpb25JZCwge1xuICAgICAgdHlwZTogXCJiYXNpY1wiLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgIGljb25Vcmw6IGljb24sXG4gICAgfSxcbiAgICAgIGZ1bmN0aW9uIChuSWQpIHsgfVxuICAgICk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWlzQ2xvc2VkKVxuICAgICAgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jbGVhcihub3RpZmljYXRpb25JZCwgZnVuY3Rpb24gKHdhc0NsZWFyZWQpIHsgfSk7XG4gICAgfSwgNTAwMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbGVydChlLm1lc3NhZ2UpO1xuICB9XG59IiwiaW1wb3J0IHtcbiAgZ2V0RXh0ZW5zaW9uQ29uZmlnLCBub3RpZnlcbn0gZnJvbSBcIi4vaGVscGVyXCI7XG5cbmNsYXNzIGlGZXRjaCB7XG4gIGdldChyb3V0ZSwgZGF0YSA9IHt9KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBoZWFkZXJzID0ge31cbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgLy8g6YGN5Y6G5a+56LGhLOa3u+WKoOavj+S4qumUruWAvOWvuVxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICBwYXJhbXMuYXBwZW5kKGtleSwgZGF0YVtrZXldKTtcbiAgICB9XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBwYXJhbXMudG9TdHJpbmcoKTsgLy8gJ2E9MSZiPTInXG5cbiAgICB2YXIgdXJsID0gbmV3IFVSTChyb3V0ZSwgYmFzZVVybCk7XG4gICAgdXJsID0gdXJsICsgYD8ke3F1ZXJ5U3RyaW5nfWA7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKHRva2VuICE9ICcnKSB7XG4gICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIHRva2VuXG4gICAgICB9XG5cbiAgICAgIGZldGNoKHVybCwge1xuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHJlc29sdmUoZGF0YSkpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwb3N0KHJvdXRlLCBkYXRhID0ge30sIGhlYWRlcnMgPSB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6IFwiYXBwbGljYXRpb24vanNvblwiXG4gIH0pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZ2V0RXh0ZW5zaW9uQ29uZmlnKCkudGhlbihjb25maWdEYXRhID0+IHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBjb25maWdEYXRhLnRva2VuXG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBjb25maWdEYXRhLnNlcnZlclxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIHVybCA9IG5ldyBVUkwocm91dGUsIGJhc2VVcmwpO1xuXG4gICAgICAgIGlmIChyb3V0ZS5pbmRleE9mKFwiaHR0cFwiKSA+PSAwKSB7XG4gICAgICAgICAgdXJsID0gcm91dGVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRva2VuXG4gICAgICAgIGlmICh0b2tlbiAhPSAnJykge1xuICAgICAgICAgIGhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgJyArIHRva2VuXG4gICAgICAgIH1cblxuICAgICAgICAvLyDlpITnkIYgYm9keVxuICAgICAgICB2YXIgYm9keSA9IFwiXCI7XG4gICAgICAgIC8vIOaKiuS4gOS4quWPguaVsOWvueixoeagvOW8j+WMluS4uuS4gOS4quWtl+espuS4slxuICAgICAgICBpZiAoaGVhZGVyc1snQ29udGVudC1UeXBlJ10uaW5kZXhPZignYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykgPj0gMCkge1xuICAgICAgICAgIGxldCByZXQgPSAnJ1xuICAgICAgICAgIGZvciAoY29uc3QgaXQgaW4gZGF0YSkge1xuICAgICAgICAgICAgcmV0ICs9XG4gICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChpdCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtpdF0pICsgJyYnXG4gICAgICAgICAgfVxuICAgICAgICAgIGJvZHkgPSByZXQuc3Vic3RyaW5nKDAsIHJldC5sZW5ndGggLSAxKVxuICAgICAgICB9IGVsc2UgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YTtjaGFyc2V0PVVURi04Jykge1xuICAgICAgICAgIGJvZHkgPSBkYXRhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZldGNoKHVybCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayAxXCIpO1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2tcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG9rID0+IHJldHVybiBqc29uXCIsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayAzXCIsIGVycm9yKTtcbiAgICAgICAgICAgIG5vdGlmeShcIumAmuefpVwiLCBcIuacjeWKoeW8guW4uO+8jOaXoOazleiuv+mXruacjeWKoTpcIiArIGJhc2VVcmwpXG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICAgIH0pO1xuXG5cblxuICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvayAxMlwiLCBlcnJvcik7XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBpRmV0Y2goKSJdLCJzb3VyY2VSb290IjoiIn0=