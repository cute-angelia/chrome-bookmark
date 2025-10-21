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

/***/ "./chrome/internal/bookmark/bookmark.js":
/*!**********************************************!*\
  !*** ./chrome/internal/bookmark/bookmark.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/store.js */ "./chrome/internal/store/store.js");
/* harmony import */ var _helper_chrome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper/chrome.js */ "./chrome/internal/helper/chrome.js");
/* harmony import */ var _helper_iFetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helper/iFetch.js */ "./chrome/internal/helper/iFetch.js");



function findLocalBookmarkX(url) {
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
function saveLocalBookmark(url, title) {
  var that = this;
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
class bookmark {
  // 打开选项页 openOptionsPage
  openOptionsPage() {
    chrome.tabs.create({
      active: true,
      url: "/view/options.html"
    });
  }
  // 打开远程库 openLibraries
  openLibraries() {
    return new Promise(function(resolve, reject) {
      _store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].get("server").then((server) => {
        if (server === "") {
          this.openOptionsPage();
          reject("Server must not empty");
        } else {
          chrome.tabs.create({
            active: true,
            url: server
          });
          resolve();
        }
      });
    });
  }
  // 保存书签 saveBookmark
  saveBookmark(tags) {
    var that = this;
    return new Promise(function(resolve, reject) {
      _store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].get().then((cnf) => {
        Object(_helper_chrome_js__WEBPACK_IMPORTED_MODULE_1__["getCurrentTab"])().then((tab) => {
          chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
            const ihttp = new _helper_iFetch_js__WEBPACK_IMPORTED_MODULE_2__["default"](cnf.server, cnf.token);
            const data = {
              url: tab.url,
              title: tab.title,
              from: "ext",
              tags: tags.join(","),
              imgbase64: dataUrl
            };
            ihttp.post("/api/bookmarks/add", data).then((resp) => {
              if (resp.code != 0) {
                return reject(resp.msg);
              } else {
                saveLocalBookmark(data.url, data.title);
                return resolve();
              }
            }).catch((err) => {
              console.log(err.toString());
              if (err.toString().includes("login")) {
                that.openOptionsPage();
              } else {
                return reject(err.toString());
              }
            });
          });
        });
      });
    }).catch((err) => {
      console.log(err.toString());
    });
  }
  // 删除书签 removeBookmark
  removeBookmark() {
    var that = this;
    return new Promise(function(resolve, reject) {
      _store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].get().then((cnf) => {
        Object(_helper_chrome_js__WEBPACK_IMPORTED_MODULE_1__["getCurrentTab"])().then((tab) => {
          const ihttp = new _helper_iFetch_js__WEBPACK_IMPORTED_MODULE_2__["default"](cnf.server, cnf.token);
          var data = {
            url: tab.url
          };
          ihttp.post("/api/bookmarks/deleteUrl", data).then((resp) => {
            if (resp.code != 0) {
              console.log(resp.msg);
            }
            removeLocalBookmark(data.url);
            return resolve();
          }).catch((err) => {
            if (err.toString().includes("login")) {
              that.openOptionsPage();
            } else {
              return reject(err.toString());
            }
          });
        });
      });
    });
  }
  updateIcon() {
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
    Object(_helper_chrome_js__WEBPACK_IMPORTED_MODULE_1__["getCurrentTab"])().then((tab) => {
      return findLocalBookmarkX(tab.url).then((local) => {
        const iconUpdate = local ? {
          path: {
            16: "icons/action-bookmarked-16.png",
            32: "icons/action-bookmarked-32.png",
            64: "icons/action-bookmarked-64.png"
          }
        } : icon;
        return chrome.action.setIcon(iconUpdate);
      });
    }).catch((err) => console.error("\u56FE\u6807\u66F4\u65B0\u5931\u8D25:", err));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (new bookmark());


/***/ }),

/***/ "./chrome/internal/eventEmitter.js":
/*!*****************************************!*\
  !*** ./chrome/internal/eventEmitter.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class eventEmitter {
  constructor() {
    this._listeners = {};
  }
  /**
   * @param {string} name - event name
   * @param {function(data: *): void} fn - listener function
   */
  on(name, fn) {
    const list = this._listeners[name] = this._listeners[name] || [];
    list.push(fn);
  }
  /**
   * @param {string} name - event name
   * @param {*} data - data to emit event listeners
   */
  trigger(name, data) {
    const fns = this._listeners[name] || [];
    fns.forEach((fn) => fn(data));
  }
  /**
   * @param {string} name - event name
   */
  off(name) {
    delete this._listeners[name];
  }
}
/* harmony default export */ __webpack_exports__["default"] = (eventEmitter);


/***/ }),

/***/ "./chrome/internal/helper/chrome.js":
/*!******************************************!*\
  !*** ./chrome/internal/helper/chrome.js ***!
  \******************************************/
/*! exports provided: sendMessageWithPromise, getCurrentTab, sleep, notify */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendMessageWithPromise", function() { return sendMessageWithPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentTab", function() { return getCurrentTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return sleep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "notify", function() { return notify; });
function sendMessageWithPromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError;
        console.log("\u6D88\u606F\u53D1\u9001\u5931\u8D25:", "message", message, "error", error);
        reject(error);
      } else {
        resolve(response);
      }
    });
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
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/***/ "./chrome/internal/helper/iFetch.js":
/*!******************************************!*\
  !*** ./chrome/internal/helper/iFetch.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chrome_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chrome.js */ "./chrome/internal/helper/chrome.js");

class iFetch {
  constructor(baseUrl2, token2 = "") {
    this.baseUrl = baseUrl2;
    this.token = token2;
  }
  get(route, data = {}) {
    var headers = {};
    const params = new URLSearchParams();
    for (let key in data) {
      params.append(key, data[key]);
    }
    const queryString = params.toString();
    var url = new URL(route, this.baseUrl);
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
    var that = this;
    return new Promise(function(resolve, reject) {
      const token2 = that.token;
      var url = new URL(route, that.baseUrl);
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
        Object(_chrome_js__WEBPACK_IMPORTED_MODULE_0__["notify"])("\u901A\u77E5", "\u670D\u52A1\u5F02\u5E38\uFF0C\u65E0\u6CD5\u8BBF\u95EE\u670D\u52A1:" + baseUrl);
        return reject(error);
      });
    });
  }
}
/* harmony default export */ __webpack_exports__["default"] = (iFetch);


/***/ }),

/***/ "./chrome/internal/store/store.js":
/*!****************************************!*\
  !*** ./chrome/internal/store/store.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eventEmitter */ "./chrome/internal/eventEmitter.js");

class store extends _eventEmitter__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
    this.defaultConfigData = {
      username: "",
      token: "",
      server: "http://192.168.3.36:38112"
    };
    this.on("init", this.init.bind(this));
    this.on("get", this.get.bind(this));
    this.on("set", this.set.bind(this));
    this.on("save", this.save.bind(this));
    this.on("getDefaultConfig", this.getDefaultConfig.bind(this));
    this.on("clear", this.clear.bind(this));
    this.trigger("init");
  }
  init() {
    chrome.storage.local.get(null, (items) => {
      var configData = Object.assign({}, this.defaultConfigData, items);
      this.save(configData);
      console.log("init.this.configData", configData);
    });
  }
  getDefaultConfig() {
    return this.defaultConfigData;
  }
  get(key = null) {
    if (key) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], function(result) {
          console.log("get:", key, result[key]);
          resolve(result[key]);
        });
      });
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (items) => {
          var configData = Object.assign({}, this.defaultConfigData, items);
          resolve(configData);
        });
      });
    }
  }
  set(key, value) {
    console.log("store.js set", key, value);
    if (value == void 0) {
      return;
    }
    chrome.storage.local.set({
      [key]: value
    }, () => {
    });
  }
  save(configData) {
    for (const key in configData) {
      chrome.storage.local.set({
        [key]: configData[key]
      }, () => {
        console.log("chrome local set: %s, %s", key, configData[key]);
      });
    }
  }
  clear() {
    chrome.storage.local.clear();
  }
}
/* harmony default export */ __webpack_exports__["default"] = (new store());


/***/ }),

/***/ "./chrome/js/background-script.js":
/*!****************************************!*\
  !*** ./chrome/js/background-script.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/bookmark/bookmark.js */ "./chrome/internal/bookmark/bookmark.js");
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

console.log("background-script.js loaded");
chrome.runtime.onMessage.addListener(function(request, sender, sendResponseParam) {
  var responseStatus = {
    bCalled: false
  };
  console.log("background-script.js onMessage", request);
  function sendResponse(obj) {
    console.log("\u8BF7\u6C42 onMessage -> ", request, obj);
    try {
      sendResponseParam(obj);
    } catch (e) {
    }
    responseStatus.bCalled = true;
  }
  switch (request.cmd || request.method || request.type) {
    case "ping":
      sendResponse({
        "msg": "pong"
      });
      break;
    case "open-libraries":
      _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].openLibraries();
      sendResponse({ status: "success" });
      break;
    case "save-bookmark":
      _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].saveBookmark(request.tags).then((resp) => {
        _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateIcon();
      });
      sendResponse({ status: "success" });
      break;
    case "remove-bookmark":
      _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].removeBookmark().then((resp) => {
        _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateIcon();
      });
      sendResponse({ status: "success" });
      break;
    case "GetConfigList":
      Store.get("configList").then((configList) => {
        var data = {
          "configList": configList
        };
        sendResponse(data);
      });
      break;
    case "getDefaultConfig":
      sendResponse(Store.getDefaultConfig());
      break;
    case "saveConfig":
      Store.setCfg(request.data.key, request.data.value);
      try {
        var newdata = JSON.stringify(request.data.value);
        JSON.parse(newdata);
        notify("\u7CFB\u7EDF\u901A\u77E5", "\u914D\u7F6E\u4FDD\u5B58\u6210\u529F");
      } catch (error) {
        notify("\u7CFB\u7EDF\u901A\u77E5", "\u4FDD\u5B58\u5931\u8D25");
      }
      setTimeout(() => {
        initContextMenus();
      }, 300);
      sendResponse({});
      break;
  }
  if (!responseStatus.bCalled) {
    return true;
  }
});
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].openOptionsPage();
  }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("\u6807\u7B7E\u9875\u52A0\u8F7D\u5B8C\u6210:", {
      id: tabId,
      url: tab.url,
      title: tab.title,
      windowId: tab.windowId
    });
    _internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateIcon();
  }
});
chrome.bookmarks.onCreated.addListener(_internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateIcon);
chrome.bookmarks.onRemoved.addListener(_internal_bookmark_bookmark_js__WEBPACK_IMPORTED_MODULE_0__["default"].updateIcon);
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2Jvb2ttYXJrL2Jvb2ttYXJrLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9pbnRlcm5hbC9ldmVudEVtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2hlbHBlci9jaHJvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2hlbHBlci9pRmV0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL3N0b3JlL3N0b3JlLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9qcy9iYWNrZ3JvdW5kLXNjcmlwdC5qcyJdLCJuYW1lcyI6WyJzaGlvcmkiLCJiYXNlVXJsIiwidG9rZW4iLCJkYXRhIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFB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TztBQUFBLElBQ1QsU0FBUSxHQUFOO0FBQ0EsYUFBTyxDQUFDO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSIsImZpbGUiOiJiYWNrZ3JvdW5kLmVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvanMvYmFja2dyb3VuZC1zY3JpcHQuanNcIik7XG4iLCJpbXBvcnQgc3RvcmUgZnJvbSBcIi4uL3N0b3JlL3N0b3JlLmpzXCI7XG5pbXBvcnQgeyBnZXRDdXJyZW50VGFiIH0gZnJvbSBcIi4uL2hlbHBlci9jaHJvbWUuanNcIjtcbmltcG9ydCBpRmV0Y2ggZnJvbSBcIi4uL2hlbHBlci9pRmV0Y2guanNcIjtcblxuXG4vLyDmn6Xmib7mnKzlnLDkuabnrb4gIFxuZnVuY3Rpb24gZmluZExvY2FsQm9va21hcmtYKHVybCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpLnRoZW4oc2hpb3JpRm9sZGVyID0+IHtcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9LCBleGlzdGluZ0Jvb2ttYXJrcyA9PiB7XG4gICAgICAgIHZhciBpZHggPSBleGlzdGluZ0Jvb2ttYXJrcy5maW5kSW5kZXgoYm9vayA9PiB7XG4gICAgICAgICAgcmV0dXJuIGJvb2sucGFyZW50SWQgPT09IHNoaW9yaUZvbGRlci5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4aXN0aW5nQm9va21hcmtzW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAvLyBUT0RPOlxuICAgIC8vIEknbSBub3Qgc3VyZSBpdCdzIHRoZSBtb3N0IGVmZmljaWVudCB3YXksIGJ1dCBpdCdzIHRoZSBzaW1wbGVzdC5cbiAgICAvLyBXZSB3YW50IHRvIHB1dCBTaGlvcmkgZm9sZGVyIGluIGBPdGhlciBib29rbWFya3NgLCB3aGljaCBpZCBkaWZmZXJlbnQgZGVwZW5kaW5nIG9uIGNocm9tZS5cbiAgICAvLyBJbiBGaXJlZm94LCBpdHMgaWQgaXMgYHVuZmlsZWRfX19fX2Agd2hpbGUgaW4gQ2hyb21lIHRoZSBpZCBpcyBgMmAuXG4gICAgdmFyIHBhcmVudElkID0gXCJcIixcbiAgICAgIHJ1bnRpbWVVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCIvXCIpO1xuXG4gICAgaWYgKHJ1bnRpbWVVcmwuc3RhcnRzV2l0aChcIm1velwiKSkge1xuICAgICAgcGFyZW50SWQgPSBcInVuZmlsZWRfX19fX1wiO1xuICAgIH0gZWxzZSBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwiY2hyb21lXCIpKSB7XG4gICAgICBwYXJlbnRJZCA9IFwiMlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyaWdodCBub3cgZXh0ZW5zaW9uIG9ubHkgc3VwcG9ydCBmaXJlZm94IGFuZCBjaHJvbWVcIilcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBhcmVudCBmb2xkZXIgYWxyZWFkeSBoYXMgU2hpb3JpIGZvbGRlclxuICAgIGNocm9tZS5ib29rbWFya3MuZ2V0Q2hpbGRyZW4ocGFyZW50SWQsIGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgdmFyIHNoaW9yaSA9IGNoaWxkcmVuLmZpbmQoZWwgPT4gZWwudXJsID09IG51bGwgJiYgZWwudGl0bGUgPT09IFwiU2hpb3JpXCIpO1xuICAgICAgaWYgKCFzaGlvcmkpIHtcbiAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgICAgIHRpdGxlOiBcIlNoaW9yaVwiLFxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZFxuICAgICAgICB9LCBzaGlvcmkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKHNoaW9yaSlcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShzaGlvcmkpXG4gICAgICB9XG4gICAgfSk7XG4gIH0pXG59XG5cblxuZnVuY3Rpb24gc2F2ZUxvY2FsQm9va21hcmsodXJsLCB0aXRsZSkge1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkudGhlbihzaGlvcmlGb2xkZXIgPT4ge1xuICAgICAgY2hyb21lLmJvb2ttYXJrcy5zZWFyY2goe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgIH0sIGV4aXN0aW5nQm9va21hcmtzID0+IHtcbiAgICAgICAgdmFyIGlkeCA9IGV4aXN0aW5nQm9va21hcmtzLmZpbmRJbmRleChib29rID0+IHtcbiAgICAgICAgICByZXR1cm4gYm9vay5wYXJlbnRJZCA9PT0gc2hpb3JpRm9sZGVyLmlkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xuICAgICAgICAgIGNocm9tZS5ib29rbWFya3MuY3JlYXRlKHtcbiAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgcGFyZW50SWQ6IHNoaW9yaUZvbGRlci5pZCxcbiAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSlcbiAgICB9KVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTG9jYWxCb29rbWFyayh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICBleGlzdGluZ0Jvb2ttYXJrcy5mb3JFYWNoKGJvb2sgPT4ge1xuICAgICAgICAgIGlmIChib29rLnBhcmVudElkICE9PSBzaGlvcmlGb2xkZXIuaWQpIHJldHVybjtcbiAgICAgICAgICBjaHJvbWUuYm9va21hcmtzLnJlbW92ZShib29rLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG59XG5cblxuY2xhc3MgYm9va21hcmsge1xuICAvLyDmiZPlvIDpgInpobnpobUgb3Blbk9wdGlvbnNQYWdlXG4gIG9wZW5PcHRpb25zUGFnZSgpIHtcbiAgICBjaHJvbWUudGFicy5jcmVhdGUoe1xuICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgdXJsOiBcIi92aWV3L29wdGlvbnMuaHRtbFwiXG4gICAgfSk7XG4gIH1cblxuICAvLyDmiZPlvIDov5znqIvlupMgb3BlbkxpYnJhcmllc1xuICBvcGVuTGlicmFyaWVzKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzdG9yZS5nZXQoXCJzZXJ2ZXJcIikudGhlbihzZXJ2ZXIgPT4ge1xuICAgICAgICBpZiAoc2VydmVyID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhpcy5vcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICAgIHJlamVjdChcIlNlcnZlciBtdXN0IG5vdCBlbXB0eVwiKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICB1cmw6IHNlcnZlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICAvLyDkv53lrZjkuabnrb4gc2F2ZUJvb2ttYXJrXG4gIHNhdmVCb29rbWFyayh0YWdzKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzdG9yZS5nZXQoKS50aGVuKGNuZiA9PiB7XG4gICAgICAgIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG4gICAgICAgICAgLy8g5oiq5Zu+XG4gICAgICAgICAgLy8g5o2V6I635b2T5YmN6YCJ6aG55Y2h5Lit5Y+v6KeB5Yy65Z+f55qE5bGP5bmV5oiq5Zu+XG4gICAgICAgICAgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIobnVsbCwge30sIGZ1bmN0aW9uIChkYXRhVXJsKSB7XG4gICAgICAgICAgICBjb25zdCBpaHR0cCA9IG5ldyBpRmV0Y2goY25mLnNlcnZlciwgY25mLnRva2VuKVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgICAgICAgICB0aXRsZTogdGFiLnRpdGxlLFxuICAgICAgICAgICAgICBmcm9tOiBcImV4dFwiLFxuICAgICAgICAgICAgICB0YWdzOiB0YWdzLmpvaW4oXCIsXCIpLFxuICAgICAgICAgICAgICBpbWdiYXNlNjQ6IGRhdGFVcmwsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpaHR0cC5wb3N0KFwiL2FwaS9ib29rbWFya3MvYWRkXCIsIGRhdGEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZXNwLmNvZGUgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QocmVzcC5tc2cpXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2F2ZSB0byBsb2NhbCBib29rbWFya1xuICAgICAgICAgICAgICAgIHNhdmVMb2NhbEJvb2ttYXJrKGRhdGEudXJsLCBkYXRhLnRpdGxlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5vcGVuT3B0aW9uc1BhZ2UoKVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyLnRvU3RyaW5nKCkpO1xuICAgIH0pXG4gIH1cblxuICAvLyDliKDpmaTkuabnrb4gcmVtb3ZlQm9va21hcmtcbiAgcmVtb3ZlQm9va21hcmsoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBzdG9yZS5nZXQoKS50aGVuKGNuZiA9PiB7XG4gICAgICAgIGdldEN1cnJlbnRUYWIoKS50aGVuKHRhYiA9PiB7XG4gICAgICAgICAgY29uc3QgaWh0dHAgPSBuZXcgaUZldGNoKGNuZi5zZXJ2ZXIsIGNuZi50b2tlbilcbiAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHVybDogdGFiLnVybCxcbiAgICAgICAgICB9XG4gICAgICAgICAgaWh0dHAucG9zdChcIi9hcGkvYm9va21hcmtzL2RlbGV0ZVVybFwiLCBkYXRhKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3AuY29kZSAhPSAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3AubXNnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVtb3ZlIGxvY2FsIGJvb2ttYXJrXG4gICAgICAgICAgICByZW1vdmVMb2NhbEJvb2ttYXJrKGRhdGEudXJsKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIudG9TdHJpbmcoKS5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gICAgICAgICAgICAgIHRoYXQub3Blbk9wdGlvbnNQYWdlKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVJY29uKCkge1xuICAgIC8vIFNldCBpbml0aWFsIGljb25cbiAgICB2YXIgcnVudGltZVVybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIi9cIiksXG4gICAgICBpY29uID0ge1xuICAgICAgICBwYXRoOiB7XG4gICAgICAgICAgMTY6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtMTYucG5nXCIsXG4gICAgICAgICAgMzI6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtMzIucG5nXCIsXG4gICAgICAgICAgNjQ6IFwiaWNvbnMvYWN0aW9uLWRlZmF1bHQtNjQucG5nXCJcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIC8vIEZpcmVmb3ggYWxsb3dzIHVzaW5nIGVtcHR5IG9iamVjdCBhcyBkZWZhdWx0IGljb24uXG4gICAgLy8gVGhpcyB3YXksIEZpcmVmb3ggd2lsbCB1c2UgZGVmYXVsdF9pY29uIHRoYXQgZGVmaW5lZCBpbiBtYW5pZmVzdC5qc29uXG4gICAgaWYgKHJ1bnRpbWVVcmwuc3RhcnRzV2l0aChcIm1velwiKSkge1xuICAgICAgaWNvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIEdldCBjdXJyZW50IGFjdGl2ZSB0YWJcbiAgICBnZXRDdXJyZW50VGFiKCkudGhlbih0YWIgPT4ge1xuICAgICAgcmV0dXJuIGZpbmRMb2NhbEJvb2ttYXJrWCh0YWIudXJsKS50aGVuKGxvY2FsID0+IHtcbiAgICAgICAgY29uc3QgaWNvblVwZGF0ZSA9IGxvY2FsID8ge1xuICAgICAgICAgIHBhdGg6IHtcbiAgICAgICAgICAgIDE2OiBcImljb25zL2FjdGlvbi1ib29rbWFya2VkLTE2LnBuZ1wiLFxuICAgICAgICAgICAgMzI6IFwiaWNvbnMvYWN0aW9uLWJvb2ttYXJrZWQtMzIucG5nXCIsXG4gICAgICAgICAgICA2NDogXCJpY29ucy9hY3Rpb24tYm9va21hcmtlZC02NC5wbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSA6IGljb247IC8vIOehruS/nWljb27mnInpu5jorqTlgLxcblxuICAgICAgICByZXR1cm4gY2hyb21lLmFjdGlvbi5zZXRJY29uKGljb25VcGRhdGUpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoXCLlm77moIfmm7TmlrDlpLHotKU6XCIsIGVycikpO1xuICB9XG5cblxuXG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgYm9va21hcmsoKSIsImNsYXNzIGV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBldmVudCBuYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZGF0YTogKik6IHZvaWR9IGZuIC0gbGlzdGVuZXIgZnVuY3Rpb25cbiAgICovXG4gIG9uKG5hbWUsIGZuKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IHRoaXMuX2xpc3RlbmVyc1tuYW1lXSB8fCBbXVxuICAgIGxpc3QucHVzaChmbilcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGV2ZW50IG5hbWVcbiAgICogQHBhcmFtIHsqfSBkYXRhIC0gZGF0YSB0byBlbWl0IGV2ZW50IGxpc3RlbmVyc1xuICAgKi9cbiAgdHJpZ2dlcihuYW1lLCBkYXRhKSB7XG4gICAgY29uc3QgZm5zID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdIHx8IFtdXG4gICAgZm5zLmZvckVhY2goZm4gPT4gZm4oZGF0YSkpXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBldmVudCBuYW1lXG4gICAqL1xuICBvZmYobmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNbbmFtZV1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBldmVudEVtaXR0ZXJcbiIsIlxuLy8g5Y+R6YCB5raI5oGv5bm26L+U5ZueUHJvbWlzZVxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRNZXNzYWdlV2l0aFByb21pc2UobWVzc2FnZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAvLyDljbPkvb/opoFyZWplY3TvvIzkuZ/opoHlhYjorr/pl65sYXN0RXJyb3JcbiAgICAgICAgY29uc3QgZXJyb3IgPSBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coJ+a2iOaBr+WPkemAgeWksei0pTonLCBcIm1lc3NhZ2VcIiwgbWVzc2FnZSwgXCJlcnJvclwiLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG4vLyDojrflj5blvZPliY3mtLvliqjmoIfnrb7pobVcbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgYWN0aXZlIHRhYnMgaW4gY3VycmVudCB3aW5kb3cgIFxuICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWVcbiAgICAgIH0sICh0YWJzKSA9PiB7XG4gICAgICAgIGlmICghdGFicyB8fCB0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YWIgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHByb3RvY29sXG4gICAgICAgIGxldCBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuICAgICAgICAvL2xldCB1cmwgPSBuZXcgVVJMKGFjdGl2ZVRhYi51cmwpO1xuICAgICAgICAvL2xldCBzdXBwb3J0ZWRQcm90b2NvbHMgPSBbXCJodHRwczpcIiwgXCJodHRwOlwiLCBcImZ0cDpcIiwgXCJmaWxlOlwiXTtcblxuICAgICAgICAvL2lmICghc3VwcG9ydGVkUHJvdG9jb2xzLmluY2x1ZGVzKHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiR7dXJsLnByb3RvY29sfVwiYCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFjdGl2ZVRhYilcbiAgICAgICAgaWYgKGFjdGl2ZVRhYiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoYWN0aXZlVGFiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIOaaguWBnOaJp+ihjOaMh+Wumuavq+enklxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnkodGl0bGUsIG1lc3NhZ2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaWNvbiA9IFwiL2ljb25zL2ljb24ucG5nXCI7XG4gICAgdmFyIGlzQ2xvc2VkID0gZmFsc2U7XG4gICAgdmFyIG5vdGlmaWNhdGlvbklkID0gXCJwb3N0aW5nX1wiICsgTWF0aC5yYW5kb20oKTtcblxuICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShcbiAgICAgIG5vdGlmaWNhdGlvbklkLCB7XG4gICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgaWNvblVybDogaWNvbixcbiAgICB9LFxuICAgICAgZnVuY3Rpb24gKG5JZCkgeyB9XG4gICAgKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNDbG9zZWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGlmaWNhdGlvbklkLCBmdW5jdGlvbiAod2FzQ2xlYXJlZCkgeyB9KTtcbiAgICB9LCA1MDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gIH1cbn0iLCJpbXBvcnQgeyBub3RpZnkgfSBmcm9tIFwiLi9jaHJvbWUuanNcIjtcblxuY2xhc3MgaUZldGNoIHtcblxuICBjb25zdHJ1Y3RvcihiYXNlVXJsLCB0b2tlbiA9IFwiXCIpIHtcbiAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsXG4gICAgdGhpcy50b2tlbiA9IHRva2VuXG4gIH1cblxuICBnZXQocm91dGUsIGRhdGEgPSB7fSkge1xuICAgIHZhciBoZWFkZXJzID0ge31cbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgLy8g6YGN5Y6G5a+56LGhLOa3u+WKoOavj+S4qumUruWAvOWvuVxuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICBwYXJhbXMuYXBwZW5kKGtleSwgZGF0YVtrZXldKTtcbiAgICB9XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBwYXJhbXMudG9TdHJpbmcoKTsgLy8gJ2E9MSZiPTInXG5cbiAgICB2YXIgdXJsID0gbmV3IFVSTChyb3V0ZSwgdGhpcy5iYXNlVXJsKTtcbiAgICB1cmwgPSB1cmwgKyBgPyR7cXVlcnlTdHJpbmd9YDtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAodG9rZW4gIT0gJycpIHtcbiAgICAgICAgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgdG9rZW5cbiAgICAgIH1cblxuICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICB9KVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4gcmVzb2x2ZShkYXRhKSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3Qocm91dGUsIGRhdGEgPSB7fSwgaGVhZGVycyA9IHtcbiAgICAnQ29udGVudC1UeXBlJzogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgfSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY29uc3QgdG9rZW4gPSB0aGF0LnRva2VuXG4gICAgICB2YXIgdXJsID0gbmV3IFVSTChyb3V0ZSwgdGhhdC5iYXNlVXJsKTtcbiAgICAgIC8vIHRva2VuXG4gICAgICBpZiAodG9rZW4gIT0gJycpIHtcbiAgICAgICAgaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgdG9rZW5cbiAgICAgIH1cbiAgICAgIC8vIOWkhOeQhiBib2R5XG4gICAgICB2YXIgYm9keSA9IFwiXCI7XG4gICAgICAvLyDmiorkuIDkuKrlj4LmlbDlr7nosaHmoLzlvI/ljJbkuLrkuIDkuKrlrZfnrKbkuLJcbiAgICAgIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXS5pbmRleE9mKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKSA+PSAwKSB7XG4gICAgICAgIGxldCByZXQgPSAnJ1xuICAgICAgICBmb3IgKGNvbnN0IGl0IGluIGRhdGEpIHtcbiAgICAgICAgICByZXQgKz1cbiAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChpdCkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtpdF0pICsgJyYnXG4gICAgICAgIH1cbiAgICAgICAgYm9keSA9IHJldC5zdWJzdHJpbmcoMCwgcmV0Lmxlbmd0aCAtIDEpXG4gICAgICB9IGVsc2UgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID09PSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YTtjaGFyc2V0PVVURi04Jykge1xuICAgICAgICBib2R5ID0gZGF0YVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICB9XG5cbiAgICAgIGZldGNoKHVybCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgYm9keTogYm9keSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rIDFcIik7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2tcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBvayA9PiByZXR1cm4ganNvblwiLCBkYXRhKTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rIDNcIiwgZXJyb3IpO1xuICAgICAgICAgIG5vdGlmeShcIumAmuefpVwiLCBcIuacjeWKoeW8guW4uO+8jOaXoOazleiuv+mXruacjeWKoTpcIiArIGJhc2VVcmwpXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBpRmV0Y2giLCJpbXBvcnQgZXZlbnRFbWl0dGVyIGZyb20gJy4uL2V2ZW50RW1pdHRlcidcblxuY2xhc3Mgc3RvcmUgZXh0ZW5kcyBldmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLmRlZmF1bHRDb25maWdEYXRhID0ge1xuICAgICAgdXNlcm5hbWU6IFwiXCIsXG4gICAgICB0b2tlbjogXCJcIixcbiAgICAgIHNlcnZlcjogXCJodHRwOi8vMTkyLjE2OC4zLjM2OjM4MTEyXCIsXG4gICAgfVxuXG4gICAgdGhpcy5vbignaW5pdCcsIHRoaXMuaW5pdC5iaW5kKHRoaXMpKVxuICAgIHRoaXMub24oJ2dldCcsIHRoaXMuZ2V0LmJpbmQodGhpcykpXG4gICAgdGhpcy5vbignc2V0JywgdGhpcy5zZXQuYmluZCh0aGlzKSlcbiAgICB0aGlzLm9uKCdzYXZlJywgdGhpcy5zYXZlLmJpbmQodGhpcykpXG4gICAgdGhpcy5vbignZ2V0RGVmYXVsdENvbmZpZycsIHRoaXMuZ2V0RGVmYXVsdENvbmZpZy5iaW5kKHRoaXMpKVxuICAgIHRoaXMub24oJ2NsZWFyJywgdGhpcy5jbGVhci5iaW5kKHRoaXMpKVxuXG4gICAgLy8g5Yid5aeL5YyW6YWN572u5pWw5o2uXG4gICAgdGhpcy50cmlnZ2VyKCdpbml0JylcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIChpdGVtcykgPT4ge1xuICAgICAgdmFyIGNvbmZpZ0RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRDb25maWdEYXRhLCBpdGVtcylcbiAgICAgIHRoaXMuc2F2ZShjb25maWdEYXRhKVxuICAgICAgY29uc29sZS5sb2coXCJpbml0LnRoaXMuY29uZmlnRGF0YVwiLCBjb25maWdEYXRhKVxuICAgIH0pXG4gIH1cblxuICBnZXREZWZhdWx0Q29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRDb25maWdEYXRhXG4gIH1cblxuICBnZXQoa2V5ID0gbnVsbCkge1xuICAgIGlmIChrZXkpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW2tleV0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImdldDpcIiwga2V5LCByZXN1bHRba2V5XSk7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHRba2V5XSlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsLCAoaXRlbXMpID0+IHtcbiAgICAgICAgICB2YXIgY29uZmlnRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdENvbmZpZ0RhdGEsIGl0ZW1zKVxuICAgICAgICAgIHJlc29sdmUoY29uZmlnRGF0YSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICBjb25zb2xlLmxvZyhcInN0b3JlLmpzIHNldFwiLCBrZXksIHZhbHVlKTtcbiAgICBpZiAodmFsdWUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICAgIFtrZXldOiB2YWx1ZVxuICAgIH0sICgpID0+IHtcbiAgICAgIC8vY29uc29sZS5sb2coJ2Nocm9tZSBsb2NhbCBzZXQ6ICVzLCAldicsIGtleSwgdmFsdWUpXG4gICAgfSlcbiAgfVxuXG4gIHNhdmUoY29uZmlnRGF0YSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZ0RhdGEpIHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICAgIFtrZXldOiBjb25maWdEYXRhW2tleV1cbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Nocm9tZSBsb2NhbCBzZXQ6ICVzLCAlcycsIGtleSwgY29uZmlnRGF0YVtrZXldKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5jbGVhcigpXG4gICAgLy8gdGhpcy50cmlnZ2VyKCd1cGRhdGVWaWV3JywgdGhpcy5jb25maWdEYXRhKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBzdG9yZSgpIiwiaW1wb3J0IGJvb2ttYXJrIGZyb20gXCIuLi9pbnRlcm5hbC9ib29rbWFyay9ib29rbWFyay5qc1wiO1xuXG5jb25zb2xlLmxvZyhcImJhY2tncm91bmQtc2NyaXB0LmpzIGxvYWRlZFwiKTtcblxuLy8g5LqL5Lu2IC0g55uR5ZCsXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKFxuICByZXF1ZXN0LFxuICBzZW5kZXIsXG4gIHNlbmRSZXNwb25zZVBhcmFtXG4pIHtcblxuICB2YXIgcmVzcG9uc2VTdGF0dXMgPSB7XG4gICAgYkNhbGxlZDogZmFsc2VcbiAgfVxuXG4gIGNvbnNvbGUubG9nKFwiYmFja2dyb3VuZC1zY3JpcHQuanMgb25NZXNzYWdlXCIsIHJlcXVlc3QpO1xuXG4gIGZ1bmN0aW9uIHNlbmRSZXNwb25zZShvYmopIHtcbiAgICBjb25zb2xlLmxvZygn6K+35rGCIG9uTWVzc2FnZSAtPiAnLCByZXF1ZXN0LCBvYmopO1xuICAgIC8vZHVtbXkgd3JhcHBlciB0byBkZWFsIHdpdGggZXhjZXB0aW9ucyBhbmQgZGV0ZWN0IGFzeW5jXG4gICAgdHJ5IHtcbiAgICAgIHNlbmRSZXNwb25zZVBhcmFtKG9iailcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvL2Vycm9yIGhhbmRsaW5nXG4gICAgfVxuICAgIHJlc3BvbnNlU3RhdHVzLmJDYWxsZWQgPSB0cnVlXG4gIH1cblxuICBzd2l0Y2ggKHJlcXVlc3QuY21kIHx8IHJlcXVlc3QubWV0aG9kIHx8IHJlcXVlc3QudHlwZSkge1xuICAgIGNhc2UgJ3BpbmcnOlxuICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgJ21zZyc6ICdwb25nJ1xuICAgICAgfSlcbiAgICAgIGJyZWFrXG5cbiAgICAvLyDmiZPlvIDov5znqIvlupMgb3BlbkxpYnJhcmllc1xuICAgIGNhc2UgXCJvcGVuLWxpYnJhcmllc1wiOlxuICAgICAgYm9va21hcmsub3BlbkxpYnJhcmllcygpO1xuICAgICAgc2VuZFJlc3BvbnNlKHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgLy8g5L+d5a2Y5Lmm562+IHNhdmVCb29rbWFya1xuICAgIGNhc2UgXCJzYXZlLWJvb2ttYXJrXCI6XG4gICAgICBib29rbWFyay5zYXZlQm9va21hcmsocmVxdWVzdC50YWdzKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICBib29rbWFyay51cGRhdGVJY29uKCk7XG4gICAgICB9KTtcbiAgICAgIHNlbmRSZXNwb25zZSh7IHN0YXR1czogXCJzdWNjZXNzXCIgfSk7XG4gICAgICBicmVhaztcblxuICAgIC8vIOWIoOmZpOS5puetviByZW1vdmVCb29rbWFya1xuICAgIGNhc2UgXCJyZW1vdmUtYm9va21hcmtcIjpcbiAgICAgIGJvb2ttYXJrLnJlbW92ZUJvb2ttYXJrKCkudGhlbihyZXNwID0+IHtcbiAgICAgICAgYm9va21hcmsudXBkYXRlSWNvbigpO1xuICAgICAgfSk7XG4gICAgICBzZW5kUmVzcG9uc2UoeyBzdGF0dXM6IFwic3VjY2Vzc1wiIH0pO1xuICAgICAgYnJlYWs7XG5cblxuXG4gICAgLy8g6I635Y+W6YWN572uIGdldENvbmZpZ1xuICAgIGNhc2UgJ0dldENvbmZpZ0xpc3QnOlxuICAgICAgU3RvcmUuZ2V0KFwiY29uZmlnTGlzdFwiKS50aGVuKGNvbmZpZ0xpc3QgPT4ge1xuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICBcImNvbmZpZ0xpc3RcIjogY29uZmlnTGlzdFxuICAgICAgICB9XG4gICAgICAgIHNlbmRSZXNwb25zZShkYXRhKVxuICAgICAgfSk7XG4gICAgICBicmVha1xuXG4gICAgY2FzZSAnZ2V0RGVmYXVsdENvbmZpZyc6XG4gICAgICBzZW5kUmVzcG9uc2UoU3RvcmUuZ2V0RGVmYXVsdENvbmZpZygpKVxuICAgICAgYnJlYWtcblxuXG4gICAgY2FzZSAnc2F2ZUNvbmZpZyc6XG4gICAgICBTdG9yZS5zZXRDZmcocmVxdWVzdC5kYXRhLmtleSwgcmVxdWVzdC5kYXRhLnZhbHVlKVxuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbmV3ZGF0YSA9IEpTT04uc3RyaW5naWZ5KHJlcXVlc3QuZGF0YS52YWx1ZSlcbiAgICAgICAgSlNPTi5wYXJzZShuZXdkYXRhKVxuICAgICAgICBub3RpZnkoXCLns7vnu5/pgJrnn6VcIiwgXCLphY3nva7kv53lrZjmiJDlip9cIilcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5vdGlmeShcIuezu+e7n+mAmuefpVwiLCBcIuS/neWtmOWksei0pVwiKVxuICAgICAgfVxuXG5cbiAgICAgIC8vIOmHjee9rlxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGluaXRDb250ZXh0TWVudXMoKVxuICAgICAgfSwgMzAwKTtcblxuICAgICAgc2VuZFJlc3BvbnNlKHt9KVxuICAgICAgYnJlYWtcbiAgfVxuXG4gIC8vaWYgaXRzIHNldCwgdGhlIGNhbGwgd2Fzbid0IGFzeW5jLCBlbHNlIGl0IGlzLlxuICBpZiAoIXJlc3BvbnNlU3RhdHVzLmJDYWxsZWQpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59KVxuXG4vLyDlronoo4Xml7bmiZPlvIAgb25ib2FyZGluZy5odG1sXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoeyByZWFzb24gfSkgPT4ge1xuICBpZiAocmVhc29uID09PSAnaW5zdGFsbCcpIHtcbiAgICBib29rbWFyay5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgfVxufSk7XG5cbi8vIOebkeWQrOagh+etvumhteeKtuaAgeWPmOWMllxuY2hyb21lLnRhYnMub25VcGRhdGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uICh0YWJJZCwgY2hhbmdlSW5mbywgdGFiKSB7XG4gIC8vIOajgOafpeagh+etvumhteaYr+WQpuW3suWujOaIkOWKoOi9vVxuICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT09ICdjb21wbGV0ZScgJiYgdGFiLnVybCkge1xuICAgIGNvbnNvbGUubG9nKCfmoIfnrb7pobXliqDovb3lrozmiJA6Jywge1xuICAgICAgaWQ6IHRhYklkLFxuICAgICAgdXJsOiB0YWIudXJsLFxuICAgICAgdGl0bGU6IHRhYi50aXRsZSxcbiAgICAgIHdpbmRvd0lkOiB0YWIud2luZG93SWRcbiAgICB9KTtcblxuICAgIC8vIOWPr+S7peWcqOi/memHjOa3u+WKoOabtOWkmuWkhOeQhumAu+i+kVxuICAgIC8vIOS+i+Wmgu+8muazqOWFpeWGheWuueiEmuacrOOAgeWPkemAgea2iOaBr+etiVxuICAgIGJvb2ttYXJrLnVwZGF0ZUljb24oKTtcbiAgfVxufSk7XG5cbmNocm9tZS5ib29rbWFya3Mub25DcmVhdGVkLmFkZExpc3RlbmVyKGJvb2ttYXJrLnVwZGF0ZUljb24pO1xuY2hyb21lLmJvb2ttYXJrcy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoYm9va21hcmsudXBkYXRlSWNvbik7XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UGFnZUNvbnRlbnQodGFiKSB7XG4gIHRyeSB7XG4gICAgdmFyIGNvbnRlbnQgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHtcbiAgICAgIHR5cGU6IFwicGFnZS1jb250ZW50XCJcbiAgICB9KTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbiJdLCJzb3VyY2VSb290IjoiIn0=