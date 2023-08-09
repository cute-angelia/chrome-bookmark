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

/***/ "./chrome/js/options.js":
/*!******************************!*\
  !*** ./chrome/js/options.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper.js */ "./chrome/js/helper.js");
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
  return __async(this, null, function* () {
    return chrome.storage.local.set(cfg);
  });
}
function logout(server, token) {
  return __async(this, null, function* () {
    return Promise.resolve();
  });
}
function login(server, username, password, remember) {
  return __async(this, null, function* () {
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
    } catch (err2) {
      throw new Error(`${server} is not a valid url`);
    }
    var response = yield fetch(loginURL, {
      method: "post",
      body: JSON.stringify({
        username,
        password,
        remember_me: remember
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      var err = yield response.text();
      throw new Error(err);
    }
    var jsonResp = yield response.json(), token = jsonResp.data.token;
    console.log(token);
    return token;
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
    var token = yield login(server, username, password, true);
    if (server.endsWith("/")) {
      server = server.slice(0, -1);
    }
    config.server = server;
    config.token = token;
    config.username = username;
    config.remember = true;
    yield saveExtensionConfig(config);
    txtSession.textContent = `Logged in.`;
    if (token.length > 10) {
      loadingSign.style.display = "none";
    }
    return Promise.resolve();
  });
}
btnLogin.addEventListener("click", () => {
  hideError();
  showLoading();
  btnLoginClick().catch((err) => showError(err)).finally(() => hideLoading());
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9jaHJvbWUvanMvb3B0aW9ucy5qcyJdLCJuYW1lcyI6WyJzaGlvcmkiLCJlcnIiXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQVMscUJBQXFCO0FBQ25DLFNBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFFBQUk7QUFDRixhQUFPLFFBQVEsTUFBTSxJQUFJLE1BQU0sU0FBVSxPQUFPO0FBQzlDLFlBQUksUUFBUSxNQUFNLFNBQVM7QUFDM0IsWUFBSSxTQUFTLE1BQU0sVUFBVTtBQUM3QixZQUFJLFVBQVUsSUFBSTtBQUNoQixpQkFBTyxPQUFPLHVDQUF1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WUFBWSxPQUN2QixXQUFXLGNBQWMsT0FDekIsV0FBVyxjQUFjO0FBSTNCLFFBQUksUUFBUSxNQUFNLE1BQU0sUUFBUSxVQUFVLFVBQVUsSUFBSTtBQUl4RCxRQUFJLE9BQU8sU0FBUyxHQUFHLEdBQUc7QUFDeEIsZUFBUyxPQUFPLE1BQU0sR0FBRyxFQUFFO0FBQUEsSUFDN0I7QUFFQSxXQUFPLFNBQVM7QUFDaEIsV0FBTyxRQUFRO0FBQ2YsV0FBTyxXQUFXO0FBRWxCLFdBQU8sV0FBVztBQUNsQixVQUFNLG9CQUFvQixNQUFNO0FBQ2hDLGVBQVcsY0FBYztBQUV6QixRQUFJLE1BQU0sU0FBUyxJQUFJO0FBQ3JCLGtCQUFZLE1BQU0sVUFBVTtBQUFBLElBQzlCO0FBRUEsV0FBTyxRQUFRLFFBQVE7QUFBQSxFQUN6QjtBQUFBO0FBRUEsU0FBUyxpQkFBaUIsU0FBUyxNQUFNO0FBQ3ZDLFlBQVU7QUFDVixjQUFZO0FBRVosZ0JBQWMsRUFDWCxNQUFNLFNBQU8sVUFBVSxHQUFHLENBQUMsRUFDM0IsUUFBUSxNQUFNLFlBQVksQ0FBQztBQUNoQyxDQUFDIiwiZmlsZSI6Im9wdGlvbnMuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9vcHRpb25zLmpzXCIpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEV4dGVuc2lvbkNvbmZpZygpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KG51bGwsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICB2YXIgdG9rZW4gPSBpdGVtcy50b2tlbiB8fCBcIlwiO1xuICAgICAgICB2YXIgc2VydmVyID0gaXRlbXMuc2VydmVyIHx8IFwiXCI7XG4gICAgICAgIGlmICh0b2tlbiA9PT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoXCJubyBhY3RpdmUgc2Vzc2lvbiwgcGxlYXNlIGxvZ2luIGZpcnN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXJ2ZXIgPT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KFwic2VydmVyIHVybCBpcyBub3Qgc3BlY2lmaWVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlKHtcbiAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgc2VydmVyOiBzZXJ2ZXJcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgYWN0aXZlIHRhYnMgaW4gY3VycmVudCB3aW5kb3cgIFxuICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWVcbiAgICAgIH0sICh0YWJzKSA9PiB7XG4gICAgICAgIGlmICghdGFicyB8fCB0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YWIgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHByb3RvY29sXG4gICAgICAgIGxldCBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuICAgICAgICAvL2xldCB1cmwgPSBuZXcgVVJMKGFjdGl2ZVRhYi51cmwpO1xuICAgICAgICAvL2xldCBzdXBwb3J0ZWRQcm90b2NvbHMgPSBbXCJodHRwczpcIiwgXCJodHRwOlwiLCBcImZ0cDpcIiwgXCJmaWxlOlwiXTtcblxuICAgICAgICAvL2lmICghc3VwcG9ydGVkUHJvdG9jb2xzLmluY2x1ZGVzKHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiR7dXJsLnByb3RvY29sfVwiYCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZVRhYilcbiAgICAgICAgaWYgKGFjdGl2ZVRhYiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoYWN0aXZlVGFiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuT3B0aW9uc1BhZ2UoKSB7XG4gIGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi92aWV3L29wdGlvbnMuaHRtbFwiXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIC8vIFRPRE86XG4gICAgLy8gSSdtIG5vdCBzdXJlIGl0J3MgdGhlIG1vc3QgZWZmaWNpZW50IHdheSwgYnV0IGl0J3MgdGhlIHNpbXBsZXN0LlxuICAgIC8vIFdlIHdhbnQgdG8gcHV0IFNoaW9yaSBmb2xkZXIgaW4gYE90aGVyIGJvb2ttYXJrc2AsIHdoaWNoIGlkIGRpZmZlcmVudCBkZXBlbmRpbmcgb24gY2hyb21lLlxuICAgIC8vIEluIEZpcmVmb3gsIGl0cyBpZCBpcyBgdW5maWxlZF9fX19fYCB3aGlsZSBpbiBDaHJvbWUgdGhlIGlkIGlzIGAyYC5cbiAgICB2YXIgcGFyZW50SWQgPSBcIlwiLFxuICAgICAgcnVudGltZVVybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcIi9cIik7XG5cbiAgICBpZiAocnVudGltZVVybC5zdGFydHNXaXRoKFwibW96XCIpKSB7XG4gICAgICBwYXJlbnRJZCA9IFwidW5maWxlZF9fX19fXCI7XG4gICAgfSBlbHNlIGlmIChydW50aW1lVXJsLnN0YXJ0c1dpdGgoXCJjaHJvbWVcIikpIHtcbiAgICAgIHBhcmVudElkID0gXCIyXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInJpZ2h0IG5vdyBleHRlbnNpb24gb25seSBzdXBwb3J0IGZpcmVmb3ggYW5kIGNocm9tZVwiKVxuICAgIH1cbiAgICAvLyBDaGVjayBpZiB0aGUgcGFyZW50IGZvbGRlciBhbHJlYWR5IGhhcyBTaGlvcmkgZm9sZGVyXG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRDaGlsZHJlbihwYXJlbnRJZCwgZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICB2YXIgc2hpb3JpID0gY2hpbGRyZW4uZmluZChlbCA9PiBlbC51cmwgPT0gbnVsbCAmJiBlbC50aXRsZSA9PT0gXCJTaGlvcmlcIik7XG4gICAgICBpZiAoIXNoaW9yaSkge1xuICAgICAgICBjaHJvbWUuYm9va21hcmtzLmNyZWF0ZSh7XG4gICAgICAgICAgdGl0bGU6IFwiU2hpb3JpXCIsXG4gICAgICAgICAgcGFyZW50SWQ6IHBhcmVudElkXG4gICAgICAgIH0sIHNoaW9yaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoc2hpb3JpKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKHNoaW9yaSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMb2NhbEJvb2ttYXJrKHVybCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBnZXRTaGlvcmlCb29rbWFya0ZvbGRlcigpLnRoZW4oc2hpb3JpRm9sZGVyID0+IHtcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICB9LCBleGlzdGluZ0Jvb2ttYXJrcyA9PiB7XG4gICAgICAgIHZhciBpZHggPSBleGlzdGluZ0Jvb2ttYXJrcy5maW5kSW5kZXgoYm9vayA9PiB7XG4gICAgICAgICAgcmV0dXJuIGJvb2sucGFyZW50SWQgPT09IHNoaW9yaUZvbGRlci5pZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKGV4aXN0aW5nQm9va21hcmtzW2lkeF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVMb2NhbEJvb2ttYXJrKHVybCwgdGl0bGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICB2YXIgaWR4ID0gZXhpc3RpbmdCb29rbWFya3MuZmluZEluZGV4KGJvb2sgPT4ge1xuICAgICAgICAgIHJldHVybiBib29rLnBhcmVudElkID09PSBzaGlvcmlGb2xkZXIuaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpZHggPT09IC0xKSB7XG4gICAgICAgICAgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBwYXJlbnRJZDogc2hpb3JpRm9sZGVyLmlkLFxuICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KVxuICAgIH0pXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTG9jYWxCb29rbWFyayh1cmwpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZ2V0U2hpb3JpQm9va21hcmtGb2xkZXIoKS50aGVuKHNoaW9yaUZvbGRlciA9PiB7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgfSwgZXhpc3RpbmdCb29rbWFya3MgPT4ge1xuICAgICAgICBleGlzdGluZ0Jvb2ttYXJrcy5mb3JFYWNoKGJvb2sgPT4ge1xuICAgICAgICAgIGlmIChib29rLnBhcmVudElkICE9PSBzaGlvcmlGb2xkZXIuaWQpIHJldHVybjtcbiAgICAgICAgICBjaHJvbWUuYm9va21hcmtzLnJlbW92ZShib29rLmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnkodGl0bGUsIG1lc3NhZ2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaWNvbiA9IFwiL2ljb25zL2ljb24ucG5nXCI7XG4gICAgdmFyIGlzQ2xvc2VkID0gZmFsc2U7XG4gICAgdmFyIG5vdGlmaWNhdGlvbklkID0gXCJwb3N0aW5nX1wiICsgTWF0aC5yYW5kb20oKTtcblxuICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShcbiAgICAgIG5vdGlmaWNhdGlvbklkLCB7XG4gICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgaWNvblVybDogaWNvbixcbiAgICB9LFxuICAgICAgZnVuY3Rpb24gKG5JZCkgeyB9XG4gICAgKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNDbG9zZWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGlmaWNhdGlvbklkLCBmdW5jdGlvbiAod2FzQ2xlYXJlZCkgeyB9KTtcbiAgICB9LCA1MDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gIH1cbn0iLCJpbXBvcnQgeyBnZXRFeHRlbnNpb25Db25maWcgfSBmcm9tIFwiLi9oZWxwZXIuanNcIjtcblxuLy8gYXN5bmMgZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uQ29uZmlnKCkge1xuLy8gICB2YXIgaXRlbXMgPSBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoKTtcblxuLy8gICByZXR1cm4ge1xuLy8gICAgIHNlcnZlcjogaXRlbXMuc2VydmVyIHx8IFwiXCIsXG4vLyAgICAgdG9rZW46IGl0ZW1zLnRva2VuIHx8IFwiXCIsXG4vLyAgICAgdXNlcm5hbWU6IGl0ZW1zLnVzZXJuYW1lIHx8IFwiXCIsXG4vLyAgICAgcGFzc3dvcmQ6IGl0ZW1zLnBhc3N3b3JkIHx8IFwiXCIsXG4vLyAgICAgcmVtZW1iZXI6IGl0ZW1zLnJlbWVtYmVyIHx8IGZhbHNlLFxuLy8gICB9O1xuLy8gfVxuXG5hc3luYyBmdW5jdGlvbiBzYXZlRXh0ZW5zaW9uQ29uZmlnKGNmZykge1xuICByZXR1cm4gY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGNmZyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvZ291dChzZXJ2ZXIsIHRva2VuKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9naW4oc2VydmVyLCB1c2VybmFtZSwgcGFzc3dvcmQsIHJlbWVtYmVyKSB7XG4gIC8vIFZhbGlkYXRlIGlucHV0XG4gIGlmIChzZXJ2ZXIgPT09IFwiXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXJ2ZXIgbXVzdCBub3QgZW1wdHlcIik7XG4gIH1cblxuICBpZiAodXNlcm5hbWUgPT09IFwiXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2VybmFtZSBtdXN0IG5vdCBlbXB0eVwiKTtcbiAgfVxuXG4gIGlmIChwYXNzd29yZCA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBhc3N3b3JkIG11c3Qgbm90IGVtcHR5XCIpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiByZW1lbWJlciAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmVtZW1iZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBsb2dpbiBVUkxcbiAgdmFyIGxvZ2luVVJMID0gXCJcIjtcbiAgdmFyIGxvZ2luUGF0aCA9IFwiYXBpL2F1dGgvbG9naW5cIjtcbiAgdHJ5IHtcbiAgICBsb2dpblVSTCA9IG5ldyBVUkwoc2VydmVyKTtcbiAgICBpZiAobG9naW5VUkwucGF0aG5hbWUuc2xpY2UoLTEpID09IFwiL1wiKSB7XG4gICAgICBsb2dpblVSTC5wYXRobmFtZSA9IGxvZ2luVVJMLnBhdGhuYW1lICsgbG9naW5QYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dpblVSTC5wYXRobmFtZSA9IGxvZ2luVVJMLnBhdGhuYW1lICsgXCIvXCIgKyBsb2dpblBhdGg7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c2VydmVyfSBpcyBub3QgYSB2YWxpZCB1cmxgKTtcbiAgfVxuXG4gIC8vIFNlbmQgbG9naW4gcmVxdWVzdFxuICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChsb2dpblVSTCwge1xuICAgIG1ldGhvZDogXCJwb3N0XCIsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgcmVtZW1iZXJfbWU6IHJlbWVtYmVyLFxuICAgIH0pLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIHZhciBlcnIgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gIH1cblxuICB2YXIganNvblJlc3AgPSBhd2FpdCByZXNwb25zZS5qc29uKCksXG4gICAgdG9rZW4gPSBqc29uUmVzcC5kYXRhLnRva2VuO1xuXG4gIGNvbnNvbGUubG9nKHRva2VuKTtcblxuICByZXR1cm4gdG9rZW47XG59XG5cbi8vIERlZmluZSBmdW5jdGlvbiBmb3IgVUkgaGFuZGxlclxudmFyIGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3ItbWVzc2FnZVwiKSxcbiAgdHh0U2Vzc2lvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHh0LXNlc3Npb25cIiksXG4gIGlucHV0U2VydmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1zZXJ2ZXJcIiksXG4gIGlucHV0VXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXVzZXJuYW1lXCIpLFxuICBpbnB1dFBhc3N3b3JkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1wYXNzd29yZFwiKSxcbiAgaW5wdXRSZW1lbWJlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtcmVtZW1iZXJcIiksXG4gIGJ0bkxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbG9naW5cIiksXG4gIGxvYWRpbmdTaWduID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNpZ25cIiksXG4gIGNvbmZpZyA9IHt9O1xuXG5mdW5jdGlvbiBzaG93TG9hZGluZygpIHtcbiAgYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufVxuXG5mdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgbG9hZGluZ1NpZ24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5mdW5jdGlvbiBzaG93RXJyb3IobXNnKSB7XG4gIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2c7XG59XG5cbmZ1bmN0aW9uIGhpZGVFcnJvcigpIHtcbiAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuZ2V0RXh0ZW5zaW9uQ29uZmlnKClcbiAgLnRoZW4oY2ZnID0+IHtcbiAgICBjb25maWcgPSBjZmc7XG5cbiAgICBpZiAoY2ZnLnRva2VuID09PSBcIlwiKSB0eHRTZXNzaW9uLnRleHRDb250ZW50ID0gXCJObyBhY3RpdmUgc2Vzc2lvblwiO1xuICAgIGVsc2UgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IGBMb2dnZWQgaW4gc3VjY2VzcyBieWAgKyBjZmcudXNlcm5hbWU7XG5cbiAgICBpbnB1dFNlcnZlci52YWx1ZSA9IGNmZy5zZXJ2ZXI7XG4gICAgaW5wdXRVc2VybmFtZS52YWx1ZSA9IGNmZy51c2VybmFtZTtcbiAgICBpbnB1dFBhc3N3b3JkLnZhbHVlID0gY2ZnLnBhc3N3b3JkO1xuICAgIC8vIGlucHV0UmVtZW1iZXIuY2hlY2tlZCA9IGNmZy5yZW1lbWJlcjtcbiAgfSlcbiAgLmNhdGNoKGVyciA9PiBzaG93RXJyb3IoZXJyKSk7XG5cbi8vIFJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG5hc3luYyBmdW5jdGlvbiBidG5Mb2dpbkNsaWNrKCkge1xuICAvLyBHZXQgaW5wdXQgdmFsdWVcbiAgdmFyIHNlcnZlciA9IGlucHV0U2VydmVyLnZhbHVlLFxuICAgIHVzZXJuYW1lID0gaW5wdXRVc2VybmFtZS52YWx1ZSxcbiAgICBwYXNzd29yZCA9IGlucHV0UGFzc3dvcmQudmFsdWU7XG4gIC8vIHJlbWVtYmVyID0gaW5wdXRSZW1lbWJlci5jaGVja2VkO1xuXG4gIC8vIExvZ2luIHVzaW5nIGlucHV0IHZhbHVlXG4gIHZhciB0b2tlbiA9IGF3YWl0IGxvZ2luKHNlcnZlciwgdXNlcm5hbWUsIHBhc3N3b3JkLCB0cnVlKTtcblxuICAvLyBTYXZlIGlucHV0IHZhbHVlIGFuZCB0b2tlbiB0byBjb25maWdcblxuICBpZiAoc2VydmVyLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgIHNlcnZlciA9IHNlcnZlci5zbGljZSgwLCAtMSk7XG4gIH1cblxuICBjb25maWcuc2VydmVyID0gc2VydmVyO1xuICBjb25maWcudG9rZW4gPSB0b2tlbjtcbiAgY29uZmlnLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gIC8vIGNvbmZpZy5wYXNzd29yZCA9IHBhc3N3b3JkO1xuICBjb25maWcucmVtZW1iZXIgPSB0cnVlO1xuICBhd2FpdCBzYXZlRXh0ZW5zaW9uQ29uZmlnKGNvbmZpZyk7XG4gIHR4dFNlc3Npb24udGV4dENvbnRlbnQgPSBgTG9nZ2VkIGluLmA7XG5cbiAgaWYgKHRva2VuLmxlbmd0aCA+IDEwKSB7XG4gICAgbG9hZGluZ1NpZ24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5idG5Mb2dpbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBoaWRlRXJyb3IoKTtcbiAgc2hvd0xvYWRpbmcoKTtcblxuICBidG5Mb2dpbkNsaWNrKClcbiAgICAuY2F0Y2goZXJyID0+IHNob3dFcnJvcihlcnIpKVxuICAgIC5maW5hbGx5KCgpID0+IGhpZGVMb2FkaW5nKCkpO1xufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==