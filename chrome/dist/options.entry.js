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
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/js/options.js");
/******/ })
/************************************************************************/
/******/ ({

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


/***/ }),

/***/ "./chrome/js/options.js":
/*!******************************!*\
  !*** ./chrome/js/options.js ***!
  \******************************/
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


function saveExtensionConfig(cfg) {
  chrome.storage.local.set(cfg);
  return;
}
function logout(server, token) {
  return __async(this, null, function* () {
    return Promise.resolve();
  });
}
function login(server, username, password, remember) {
  return new Promise((resolve, reject) => {
    if (server === "") {
      throw new Error("Server must not empty");
    }
    if (username === "") {
      throw new Error("Username must not empty");
    }
    if (password === "") {
      throw new Error("Password must not empty");
    }
    if (typeof remember !== "boolean") {
      remember = false;
    }
    var loginURL = "";
    var loginPath = "api/auth/login";
    try {
      loginURL = new URL(server);
      if (loginURL.pathname.slice(-1) == "/") {
        loginURL.pathname = loginURL.pathname + loginPath;
      } else {
        loginURL.pathname = loginURL.pathname + "/" + loginPath;
      }
    } catch (err) {
      throw new Error(`${server} is not a valid url`);
    }
    _iFetch_js__WEBPACK_IMPORTED_MODULE_1__["default"].post(loginURL.href, {
      username,
      password,
      remember_me: remember
    }).then((resp) => {
      if (resp.code != 0) {
        return reject(resp.msg);
      } else {
        return resolve(resp.data.token);
      }
    }).catch((err) => {
      return reject(err.toString());
    });
  });
}
var errorMessage = document.getElementById("error-message"), txtSession = document.getElementById("txt-session"), inputServer = document.getElementById("input-server"), inputUsername = document.getElementById("input-username"), inputPassword = document.getElementById("input-password"), inputRemember = document.getElementById("input-remember"), btnLogin = document.getElementById("btn-login"), loadingSign = document.getElementById("loading-sign"), config = {};
function showLoading() {
  btnLogin.style.display = "none";
  loadingSign.style.display = "block";
}
function hideLoading() {
  btnLogin.style.display = "block";
  loadingSign.style.display = "none";
}
function showError(msg) {
  errorMessage.style.display = "block";
  errorMessage.textContent = msg;
}
function hideError() {
  errorMessage.style.display = "none";
}
Object(_helper_js__WEBPACK_IMPORTED_MODULE_0__["getExtensionConfig"])().then((cfg) => {
  console.log("cfg", cfg);
  config = cfg;
  if (cfg.token === "")
    txtSession.textContent = "No active session";
  else
    txtSession.textContent = `Logged in success by` + cfg.username;
  inputServer.value = cfg.server;
  inputUsername.value = cfg.username;
  inputPassword.value = cfg.password;
}).catch((err) => showError(err));
function btnLoginClick() {
  return __async(this, null, function* () {
    var server = inputServer.value, username = inputUsername.value, password = inputPassword.value;
    login(server, username, password, true).then((token) => {
      if (server.endsWith("/")) {
        server = server.slice(0, -1);
      }
      config.server = server;
      config.token = token;
      config.username = username;
      config.remember = true;
      saveExtensionConfig(config);
      txtSession.textContent = `Logged in.`;
      if (token.length > 10) {
        loadingSign.style.display = "none";
      }
      return Promise.resolve();
    }).catch((err) => {
      txtSession.textContent = err.toString();
    });
  });
}
btnLogin.addEventListener("click", () => {
  hideError();
  showLoading();
  btnLoginClick().catch((err) => showError(err)).finally(() => hideLoading());
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9jaHJvbWUvanMvaUZldGNoLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9qcy9vcHRpb25zLmpzIl0sIm5hbWVzIjpbInNoaW9yaSIsImRhdGEiLCJ0b2tlbiIsImJhc2VVcmwiXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQVMscUJBQXFCO0FBQ25DLFNBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFFBQUk7QUFDRixhQUFPLFFBQVEsTUFBTSxJQUFJLE1BQU0sU0FBVSxPQUFPO0FBQzlDLGVBQU8sUUFBUSxLQUFLO0FBQUEsTUFDdEIsQ0FBQztBQUFB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QUFHO0FBQ3hCLGlCQUFTLE9BQU8sTUFBTSxHQUFHLEVBQUU7QUFBQSxNQUM3QjtBQUVBLGFBQU8sU0FBUztBQUNoQixhQUFPLFFBQVE7QUFDZixhQUFPLFdBQVc7QUFFbEIsYUFBTyxXQUFXO0FBQ2xCLDBCQUFvQixNQUFNO0FBQzFCLGlCQUFXLGNBQWM7QUFFekIsVUFBSSxNQUFNLFNBQVMsSUFBSTtBQUNyQixvQkFBWSxNQUFNLFVBQVU7QUFBQSxNQUM5QjtBQUNBLGFBQU8sUUFBUSxRQUFRO0FBQUEsSUFDekIsQ0FBQyxFQUFFLE1BQU0sU0FBTztBQUNkLGlCQUFXLGNBQWMsSUFBSSxTQUFTO0FBQUEsSUFDeEMsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUVBLFNBQVMsaUJBQWlCLFNBQVMsTUFBTTtBQUN2QyxZQUFVO0FBQ1YsY0FBWTtBQUVaLGdCQUFjLEVBQ1gsTUFBTSxTQUFPLFVBQVUsR0FBRyxDQUFDLEVBQzNCLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFDaEMsQ0FBQyIsImZpbGUiOiJvcHRpb25zLmVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvanMvb3B0aW9ucy5qc1wiKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb25Db25maWcoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsLCBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoaXRlbXMpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUYWIoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEdldCBhY3RpdmUgdGFicyBpbiBjdXJyZW50IHdpbmRvdyAgXG4gICAgICBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZVxuICAgICAgfSwgKHRhYnMpID0+IHtcbiAgICAgICAgaWYgKCF0YWJzIHx8IHRhYnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihcIk5vIHRhYiBhdmFpbGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVmFsaWRhdGUgcHJvdG9jb2xcbiAgICAgICAgbGV0IGFjdGl2ZVRhYiA9IHRhYnNbMF07XG4gICAgICAgIC8vbGV0IHVybCA9IG5ldyBVUkwoYWN0aXZlVGFiLnVybCk7XG4gICAgICAgIC8vbGV0IHN1cHBvcnRlZFByb3RvY29scyA9IFtcImh0dHBzOlwiLCBcImh0dHA6XCIsIFwiZnRwOlwiLCBcImZpbGU6XCJdO1xuXG4gICAgICAgIC8vaWYgKCFzdXBwb3J0ZWRQcm90b2NvbHMuaW5jbHVkZXModXJsLnByb3RvY29sKSkge1xuICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHByb3RvY29sIFwiJHt1cmwucHJvdG9jb2x9XCJgKTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgY29uc29sZS5sb2coYWN0aXZlVGFiKVxuICAgICAgICBpZiAoYWN0aXZlVGFiID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShhY3RpdmVUYWIpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5PcHRpb25zUGFnZSgpIHtcbiAgY2hyb21lLnRhYnMuY3JlYXRlKHtcbiAgICB1cmw6IFwiL3ZpZXcvb3B0aW9ucy5odG1sXCJcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgLy8gVE9ETzpcbiAgICAvLyBJJ20gbm90IHN1cmUgaXQncyB0aGUgbW9zdCBlZmZpY2llbnQgd2F5LCBidXQgaXQncyB0aGUgc2ltcGxlc3QuXG4gICAgLy8gV2Ugd2FudCB0byBwdXQgU2hpb3JpIGZvbGRlciBpbiBgT3RoZXIgYm9va21hcmtzYCwgd2hpY2ggaWQgZGlmZmVyZW50IGRlcGVuZGluZyBvbiBjaHJvbWUuXG4gICAgLy8gSW4gRmlyZWZveCwgaXRzIGlkIGlzIGB1bmZpbGVkX19fX19gIHdoaWxlIGluIENocm9tZSB0aGUgaWQgaXMgYDJgLlxuICAgIHZhciBwYXJlbnRJZCA9IFwiXCIsXG4gICAgICBydW50aW1lVXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiL1wiKTtcblxuICAgIGlmIChydW50aW1lVXJsLnN0YXJ0c1dpdGgoXCJtb3pcIikpIHtcbiAgICAgIHBhcmVudElkID0gXCJ1bmZpbGVkX19fX19cIjtcbiAgICB9IGVsc2UgaWYgKHJ1bnRpbWVVcmwuc3RhcnRzV2l0aChcImNocm9tZVwiKSkge1xuICAgICAgcGFyZW50SWQgPSBcIjJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmlnaHQgbm93IGV4dGVuc2lvbiBvbmx5IHN1cHBvcnQgZmlyZWZveCBhbmQgY2hyb21lXCIpXG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwYXJlbnQgZm9sZGVyIGFscmVhZHkgaGFzIFNoaW9yaSBmb2xkZXJcbiAgICBjaHJvbWUuYm9va21hcmtzLmdldENoaWxkcmVuKHBhcmVudElkLCBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgIHZhciBzaGlvcmkgPSBjaGlsZHJlbi5maW5kKGVsID0+IGVsLnVybCA9PSBudWxsICYmIGVsLnRpdGxlID09PSBcIlNoaW9yaVwiKTtcbiAgICAgIGlmICghc2hpb3JpKSB7XG4gICAgICAgIGNocm9tZS5ib29rbWFya3MuY3JlYXRlKHtcbiAgICAgICAgICB0aXRsZTogXCJTaGlvcmlcIixcbiAgICAgICAgICBwYXJlbnRJZDogcGFyZW50SWRcbiAgICAgICAgfSwgc2hpb3JpID0+IHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShzaGlvcmkpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoc2hpb3JpKVxuICAgICAgfVxuICAgIH0pO1xuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZExvY2FsQm9va21hcmsodXJsKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGdldFNoaW9yaUJvb2ttYXJrRm9sZGVyKCkudGhlbihzaGlvcmlGb2xkZXIgPT4ge1xuICAgICAgY2hyb21lLmJvb2ttYXJrcy5zZWFyY2goe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgIH0sIGV4aXN0aW5nQm9va21hcmtzID0+IHtcbiAgICAgICAgdmFyIGlkeCA9IGV4aXN0aW5nQm9va21hcmtzLmZpbmRJbmRleChib29rID0+IHtcbiAgICAgICAgICByZXR1cm4gYm9vay5wYXJlbnRJZCA9PT0gc2hpb3JpRm9sZGVyLmlkO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZXhpc3RpbmdCb29rbWFya3NbaWR4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUxvY2FsQm9va21hcmsodXJsLCB0aXRsZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpLnRoZW4oc2hpb3JpRm9sZGVyID0+IHtcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9LCBleGlzdGluZ0Jvb2ttYXJrcyA9PiB7XG4gICAgICAgIHZhciBpZHggPSBleGlzdGluZ0Jvb2ttYXJrcy5maW5kSW5kZXgoYm9vayA9PiB7XG4gICAgICAgICAgcmV0dXJuIGJvb2sucGFyZW50SWQgPT09IHNoaW9yaUZvbGRlci5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgICBjaHJvbWUuYm9va21hcmtzLmNyZWF0ZSh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHBhcmVudElkOiBzaGlvcmlGb2xkZXIuaWQsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVMb2NhbEJvb2ttYXJrKHVybCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpLnRoZW4oc2hpb3JpRm9sZGVyID0+IHtcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9LCBleGlzdGluZ0Jvb2ttYXJrcyA9PiB7XG4gICAgICAgIGV4aXN0aW5nQm9va21hcmtzLmZvckVhY2goYm9vayA9PiB7XG4gICAgICAgICAgaWYgKGJvb2sucGFyZW50SWQgIT09IHNoaW9yaUZvbGRlci5pZCkgcmV0dXJuO1xuICAgICAgICAgIGNocm9tZS5ib29rbWFya3MucmVtb3ZlKGJvb2suaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmeSh0aXRsZSwgbWVzc2FnZSkge1xuICB0cnkge1xuICAgIHZhciBpY29uID0gXCIvaWNvbnMvaWNvbi5wbmdcIjtcbiAgICB2YXIgaXNDbG9zZWQgPSBmYWxzZTtcbiAgICB2YXIgbm90aWZpY2F0aW9uSWQgPSBcInBvc3RpbmdfXCIgKyBNYXRoLnJhbmRvbSgpO1xuXG4gICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKFxuICAgICAgbm90aWZpY2F0aW9uSWQsIHtcbiAgICAgIHR5cGU6IFwiYmFzaWNcIixcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICBpY29uVXJsOiBpY29uLFxuICAgIH0sXG4gICAgICBmdW5jdGlvbiAobklkKSB7IH1cbiAgICApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpc0Nsb3NlZClcbiAgICAgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY2xlYXIobm90aWZpY2F0aW9uSWQsIGZ1bmN0aW9uICh3YXNDbGVhcmVkKSB7IH0pO1xuICAgIH0sIDUwMDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgfVxufSIsImltcG9ydCB7XG4gIGdldEV4dGVuc2lvbkNvbmZpZywgbm90aWZ5XG59IGZyb20gXCIuL2hlbHBlclwiO1xuXG5jbGFzcyBpRmV0Y2gge1xuICBnZXQocm91dGUsIGRhdGEgPSB7fSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgaGVhZGVycyA9IHt9XG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIC8vIOmBjeWOhuWvueixoSzmt7vliqDmr4/kuKrplK7lgLzlr7lcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgcGFyYW1zLmFwcGVuZChrZXksIGRhdGFba2V5XSk7XG4gICAgfVxuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcGFyYW1zLnRvU3RyaW5nKCk7IC8vICdhPTEmYj0yJ1xuXG4gICAgdmFyIHVybCA9IG5ldyBVUkwocm91dGUsIGJhc2VVcmwpO1xuICAgIHVybCA9IHVybCArIGA/JHtxdWVyeVN0cmluZ31gO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmICh0b2tlbiAhPSAnJykge1xuICAgICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyB0b2tlblxuICAgICAgfVxuXG4gICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiByZXNvbHZlKGRhdGEpKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcG9zdChyb3V0ZSwgZGF0YSA9IHt9LCBoZWFkZXJzID0ge1xuICAgICdDb250ZW50LVR5cGUnOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICB9KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGdldEV4dGVuc2lvbkNvbmZpZygpLnRoZW4oY29uZmlnRGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gY29uZmlnRGF0YS50b2tlblxuICAgICAgICBjb25zdCBiYXNlVXJsID0gY29uZmlnRGF0YS5zZXJ2ZXJcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciB1cmwgPSBuZXcgVVJMKHJvdXRlLCBiYXNlVXJsKTtcblxuICAgICAgICBpZiAocm91dGUuaW5kZXhPZihcImh0dHBcIikgPj0gMCkge1xuICAgICAgICAgIHVybCA9IHJvdXRlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2tlblxuICAgICAgICBpZiAodG9rZW4gIT0gJycpIHtcbiAgICAgICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyICcgKyB0b2tlblxuICAgICAgICB9XG5cbiAgICAgICAgLy8g5aSE55CGIGJvZHlcbiAgICAgICAgdmFyIGJvZHkgPSBcIlwiO1xuICAgICAgICAvLyDmiorkuIDkuKrlj4LmlbDlr7nosaHmoLzlvI/ljJbkuLrkuIDkuKrlrZfnrKbkuLJcbiAgICAgICAgaWYgKGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpID49IDApIHtcbiAgICAgICAgICBsZXQgcmV0ID0gJydcbiAgICAgICAgICBmb3IgKGNvbnN0IGl0IGluIGRhdGEpIHtcbiAgICAgICAgICAgIHJldCArPVxuICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoaXQpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFbaXRdKSArICcmJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBib2R5ID0gcmV0LnN1YnN0cmluZygwLCByZXQubGVuZ3RoIC0gMSlcbiAgICAgICAgfSBlbHNlIGlmIChoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9PT0gJ211bHRpcGFydC9mb3JtLWRhdGE7Y2hhcnNldD1VVEYtOCcpIHtcbiAgICAgICAgICBib2R5ID0gZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBjcmVkZW50aWFsczogXCJzYW1lLW9yaWdpblwiLFxuICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgYm9keTogYm9keSxcbiAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgMVwiKTtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBvayA9PiByZXR1cm4ganNvblwiLCBkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgM1wiLCBlcnJvcik7XG4gICAgICAgICAgICBub3RpZnkoXCLpgJrnn6VcIiwgXCLmnI3liqHlvILluLjvvIzml6Dms5Xorr/pl67mnI3liqE6XCIgKyBiYXNlVXJsKVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcbiAgICAgICAgICB9KTtcblxuXG5cbiAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2sgMTJcIiwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgaUZldGNoKCkiLCJpbXBvcnQgeyBnZXRFeHRlbnNpb25Db25maWcgfSBmcm9tIFwiLi9oZWxwZXIuanNcIjtcbmltcG9ydCBpZmV0Y2ggZnJvbSBcIi4vaUZldGNoLmpzXCJcblxuLy8gYXN5bmMgZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uQ29uZmlnKCkge1xuLy8gICB2YXIgaXRlbXMgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoKTtcblxuLy8gICByZXR1cm4ge1xuLy8gICAgIHNlcnZlcjogaXRlbXMuc2VydmVyIHx8IFwiXCIsXG4vLyAgICAgdG9rZW46IGl0ZW1zLnRva2VuIHx8IFwiXCIsXG4vLyAgICAgdXNlcm5hbWU6IGl0ZW1zLnVzZXJuYW1lIHx8IFwiXCIsXG4vLyAgICAgcGFzc3dvcmQ6IGl0ZW1zLnBhc3N3b3JkIHx8IFwiXCIsXG4vLyAgICAgcmVtZW1iZXI6IGl0ZW1zLnJlbWVtYmVyIHx8IGZhbHNlLFxuLy8gICB9O1xuLy8gfVxuXG5mdW5jdGlvbiBzYXZlRXh0ZW5zaW9uQ29uZmlnKGNmZykge1xuICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoY2ZnKVxuICByZXR1cm5cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHNlcnZlciwgdG9rZW4pIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5mdW5jdGlvbiBsb2dpbihzZXJ2ZXIsIHVzZXJuYW1lLCBwYXNzd29yZCwgcmVtZW1iZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBWYWxpZGF0ZSBpbnB1dFxuICAgIGlmIChzZXJ2ZXIgPT09IFwiXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNlcnZlciBtdXN0IG5vdCBlbXB0eVwiKTtcbiAgICB9XG5cbiAgICBpZiAodXNlcm5hbWUgPT09IFwiXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVzZXJuYW1lIG11c3Qgbm90IGVtcHR5XCIpO1xuICAgIH1cblxuICAgIGlmIChwYXNzd29yZCA9PT0gXCJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmQgbXVzdCBub3QgZW1wdHlcIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZW1lbWJlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByZW1lbWJlciA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBsb2dpbiBVUkxcbiAgICB2YXIgbG9naW5VUkwgPSBcIlwiO1xuICAgIHZhciBsb2dpblBhdGggPSBcImFwaS9hdXRoL2xvZ2luXCI7XG4gICAgdHJ5IHtcbiAgICAgIGxvZ2luVVJMID0gbmV3IFVSTChzZXJ2ZXIpO1xuICAgICAgaWYgKGxvZ2luVVJMLnBhdGhuYW1lLnNsaWNlKC0xKSA9PSBcIi9cIikge1xuICAgICAgICBsb2dpblVSTC5wYXRobmFtZSA9IGxvZ2luVVJMLnBhdGhuYW1lICsgbG9naW5QYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9naW5VUkwucGF0aG5hbWUgPSBsb2dpblVSTC5wYXRobmFtZSArIFwiL1wiICsgbG9naW5QYXRoO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3NlcnZlcn0gaXMgbm90IGEgdmFsaWQgdXJsYCk7XG4gICAgfVxuXG4gICAgaWZldGNoLnBvc3QobG9naW5VUkwuaHJlZiwge1xuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgcmVtZW1iZXJfbWU6IHJlbWVtYmVyLFxuICAgIH0pLnRoZW4ocmVzcCA9PiB7XG4gICAgICBpZiAocmVzcC5jb2RlICE9IDApIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChyZXNwLm1zZylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlc3AuZGF0YS50b2tlbik7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyLnRvU3RyaW5nKCkpXG4gICAgfSlcbiAgfSk7XG59XG5cbi8vIERlZmluZSBmdW5jdGlvbiBmb3IgVUkgaGFuZGxlclxudmFyIGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3ItbWVzc2FnZVwiKSxcbiAgdHh0U2Vzc2lvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHh0LXNlc3Npb25cIiksXG4gIGlucHV0U2VydmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1zZXJ2ZXJcIiksXG4gIGlucHV0VXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXVzZXJuYW1lXCIpLFxuICBpbnB1dFBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1wYXNzd29yZFwiKSxcbiAgaW5wdXRSZW1lbWJlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtcmVtZW1iZXJcIiksXG4gIGJ0bkxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbG9naW5cIiksXG4gIGxvYWRpbmdTaWduID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNpZ25cIiksXG4gIGNvbmZpZyA9IHt9O1xuXG5mdW5jdGlvbiBzaG93TG9hZGluZygpIHtcbiAgYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufVxuXG5mdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgbG9hZGluZ1NpZ24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5mdW5jdGlvbiBzaG93RXJyb3IobXNnKSB7XG4gIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2c7XG59XG5cbmZ1bmN0aW9uIGhpZGVFcnJvcigpIHtcbiAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuZ2V0RXh0ZW5zaW9uQ29uZmlnKClcbiAgLnRoZW4oY2ZnID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImNmZ1wiLCBjZmcpO1xuICAgIGNvbmZpZyA9IGNmZztcblxuICAgIGlmIChjZmcudG9rZW4gPT09IFwiXCIpIHR4dFNlc3Npb24udGV4dENvbnRlbnQgPSBcIk5vIGFjdGl2ZSBzZXNzaW9uXCI7XG4gICAgZWxzZSB0eHRTZXNzaW9uLnRleHRDb250ZW50ID0gYExvZ2dlZCBpbiBzdWNjZXNzIGJ5YCArIGNmZy51c2VybmFtZTtcblxuICAgIGlucHV0U2VydmVyLnZhbHVlID0gY2ZnLnNlcnZlcjtcbiAgICBpbnB1dFVzZXJuYW1lLnZhbHVlID0gY2ZnLnVzZXJuYW1lO1xuICAgIGlucHV0UGFzc3dvcmQudmFsdWUgPSBjZmcucGFzc3dvcmQ7XG4gICAgLy8gaW5wdXRSZW1lbWJlci5jaGVja2VkID0gY2ZnLnJlbWVtYmVyO1xuICB9KVxuICAuY2F0Y2goZXJyID0+IHNob3dFcnJvcihlcnIpKTtcblxuLy8gUmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJcbmFzeW5jIGZ1bmN0aW9uIGJ0bkxvZ2luQ2xpY2soKSB7XG4gIC8vIEdldCBpbnB1dCB2YWx1ZVxuICB2YXIgc2VydmVyID0gaW5wdXRTZXJ2ZXIudmFsdWUsXG4gICAgdXNlcm5hbWUgPSBpbnB1dFVzZXJuYW1lLnZhbHVlLFxuICAgIHBhc3N3b3JkID0gaW5wdXRQYXNzd29yZC52YWx1ZTtcbiAgLy8gcmVtZW1iZXIgPSBpbnB1dFJlbWVtYmVyLmNoZWNrZWQ7XG5cbiAgLy8gTG9naW4gdXNpbmcgaW5wdXQgdmFsdWVcbiAgbG9naW4oc2VydmVyLCB1c2VybmFtZSwgcGFzc3dvcmQsIHRydWUpLnRoZW4odG9rZW4gPT4ge1xuICAgIC8vIFNhdmUgaW5wdXQgdmFsdWUgYW5kIHRva2VuIHRvIGNvbmZpZ1xuICAgIGlmIChzZXJ2ZXIuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgICBzZXJ2ZXIgPSBzZXJ2ZXIuc2xpY2UoMCwgLTEpO1xuICAgIH1cblxuICAgIGNvbmZpZy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgY29uZmlnLnRva2VuID0gdG9rZW47XG4gICAgY29uZmlnLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgLy8gY29uZmlnLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgY29uZmlnLnJlbWVtYmVyID0gdHJ1ZTtcbiAgICBzYXZlRXh0ZW5zaW9uQ29uZmlnKGNvbmZpZyk7XG4gICAgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IGBMb2dnZWQgaW4uYDtcblxuICAgIGlmICh0b2tlbi5sZW5ndGggPiAxMCkge1xuICAgICAgbG9hZGluZ1NpZ24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IGVyci50b1N0cmluZygpO1xuICB9KTtcbn1cblxuYnRuTG9naW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaGlkZUVycm9yKCk7XG4gIHNob3dMb2FkaW5nKCk7XG5cbiAgYnRuTG9naW5DbGljaygpXG4gICAgLmNhdGNoKGVyciA9PiBzaG93RXJyb3IoZXJyKSlcbiAgICAuZmluYWxseSgoKSA9PiBoaWRlTG9hZGluZygpKTtcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=