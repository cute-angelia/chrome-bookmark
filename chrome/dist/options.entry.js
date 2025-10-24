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

/***/ "./chrome/js/options.js":
/*!******************************!*\
  !*** ./chrome/js/options.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _internal_store_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/store/store.js */ "./chrome/internal/store/store.js");
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
    var jsonResp = yield response.json();
    return jsonResp;
  });
}
var errorMessage = document.getElementById("error-message"), txtSession = document.getElementById("txt-session"), inputServer = document.getElementById("input-server"), inputUsername = document.getElementById("input-username"), inputPassword = document.getElementById("input-password"), inputRemember = document.getElementById("input-remember"), btnLogin = document.getElementById("btn-login"), btnLogout = document.getElementById("btn-logout"), loadingSign = document.getElementById("loading-sign"), config = {};
function showLoading() {
  loadingSign.style.display = "block";
}
function hideLoading() {
  loadingSign.style.display = "none";
}
function showError(msg) {
  errorMessage.style.display = "block";
  errorMessage.textContent = msg;
}
function hideError() {
  errorMessage.style.display = "none";
}
_internal_store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].get().then((cfg) => {
  if (cfg.token === "")
    txtSession.textContent = "No active session";
  else
    txtSession.textContent = `Logged in success by ` + cfg.username;
  inputServer.value = cfg.server;
  inputUsername.value = cfg.username;
  inputPassword.value = cfg.password;
  if (cfg.token !== "") {
    btnLogout.style.display = "block";
    btnLogin.style.display = "none";
  }
}).catch((err) => showError(err));
function btnLoginClick() {
  return __async(this, null, function* () {
    var _a;
    var server = inputServer.value, username = inputUsername.value, password = inputPassword.value;
    const resp = yield login(server, username, password, true);
    if (resp.code !== 0) {
      throw new Error(resp.msg || "login failed");
    } else {
      const token = ((_a = resp.data) == null ? void 0 : _a.token) || "";
      if (server.endsWith("/")) {
        server = server.slice(0, -1);
      }
      config.server = server;
      config.token = token;
      config.username = username;
      config.remember = true;
      console.log(config, "config");
      _internal_store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].trigger("save", config);
      setTipMsg(`Logged in success by ${username}`);
      if (token.length > 10) {
        loadingSign.style.display = "none";
        btnLogout.style.display = "block";
        btnLogin.style.display = "none";
      }
      _internal_store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].get().then((cfg) => {
        console.log(cfg, "cfg");
      });
      return Promise.resolve();
    }
  });
}
function setTipMsg(msg) {
  txtSession.textContent = msg;
  txtSession.style.color = "red";
}
btnLogin.addEventListener("click", () => {
  hideError();
  showLoading();
  btnLoginClick().catch((err) => showError(err)).finally(() => hideLoading());
});
btnLogout.addEventListener("click", () => {
  hideError();
  hideLoading();
  _internal_store_store_js__WEBPACK_IMPORTED_MODULE_0__["default"].clear();
  inputUsername.value = "";
  inputPassword.value = "";
  txtSession.textContent = "";
  btnLogout.style.display = "none";
  btnLogin.style.display = "block";
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2V2ZW50RW1pdHRlci5qcyIsIndlYnBhY2s6Ly8vLi9jaHJvbWUvaW50ZXJuYWwvc3RvcmUvc3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL29wdGlvbnMuanMiXSwibmFtZXMiOlsiZXJyIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBLE1BQU0sYUFBYTtBQUFBLEVBQ2pCLGNBQWM7QUFDWixTQUFLLGFBQWEsQ0FBQztBQUFBLEVBQ3JCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLEdBQUcsTUFBTSxJQUFJO0FBQ1gsVUFBTSxPQUFPLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxXQUFXLElBQUksS0FBSyxDQUFDO0FBQy9ELFNBQUssS0FBSyxFQUFFO0FB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QUFDIiwiZmlsZSI6Im9wdGlvbnMuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9vcHRpb25zLmpzXCIpO1xuIiwiY2xhc3MgZXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge31cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGV2ZW50IG5hbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbihkYXRhOiAqKTogdm9pZH0gZm4gLSBsaXN0ZW5lciBmdW5jdGlvblxuICAgKi9cbiAgb24obmFtZSwgZm4pIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdIHx8IFtdXG4gICAgbGlzdC5wdXNoKGZuKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gZXZlbnQgbmFtZVxuICAgKiBAcGFyYW0geyp9IGRhdGEgLSBkYXRhIHRvIGVtaXQgZXZlbnQgbGlzdGVuZXJzXG4gICAqL1xuICB0cmlnZ2VyKG5hbWUsIGRhdGEpIHtcbiAgICBjb25zdCBmbnMgPSB0aGlzLl9saXN0ZW5lcnNbbmFtZV0gfHwgW11cbiAgICBmbnMuZm9yRWFjaChmbiA9PiBmbihkYXRhKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIGV2ZW50IG5hbWVcbiAgICovXG4gIG9mZihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuX2xpc3RlbmVyc1tuYW1lXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50RW1pdHRlclxuIiwiaW1wb3J0IGV2ZW50RW1pdHRlciBmcm9tICcuLi9ldmVudEVtaXR0ZXInXG5cbmNsYXNzIHN0b3JlIGV4dGVuZHMgZXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5kZWZhdWx0Q29uZmlnRGF0YSA9IHtcbiAgICAgIHVzZXJuYW1lOiBcIlwiLFxuICAgICAgdG9rZW46IFwiXCIsXG4gICAgICBzZXJ2ZXI6IFwiaHR0cDovLzE5Mi4xNjguMy4zNjozODExMlwiLFxuICAgIH1cblxuICAgIHRoaXMub24oJ2luaXQnLCB0aGlzLmluaXQuYmluZCh0aGlzKSlcbiAgICB0aGlzLm9uKCdnZXQnLCB0aGlzLmdldC5iaW5kKHRoaXMpKVxuICAgIHRoaXMub24oJ3NldCcsIHRoaXMuc2V0LmJpbmQodGhpcykpXG4gICAgdGhpcy5vbignc2F2ZScsIHRoaXMuc2F2ZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMub24oJ2dldERlZmF1bHRDb25maWcnLCB0aGlzLmdldERlZmF1bHRDb25maWcuYmluZCh0aGlzKSlcbiAgICB0aGlzLm9uKCdjbGVhcicsIHRoaXMuY2xlYXIuYmluZCh0aGlzKSlcblxuICAgIC8vIOWIneWni+WMlumFjee9ruaVsOaNrlxuICAgIHRoaXMudHJpZ2dlcignaW5pdCcpXG4gIH1cblxuICBpbml0KCkge1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsLCAoaXRlbXMpID0+IHtcbiAgICAgIHZhciBjb25maWdEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0Q29uZmlnRGF0YSwgaXRlbXMpXG4gICAgICB0aGlzLnNhdmUoY29uZmlnRGF0YSlcbiAgICAgIGNvbnNvbGUubG9nKFwiaW5pdC50aGlzLmNvbmZpZ0RhdGFcIiwgY29uZmlnRGF0YSlcbiAgICB9KVxuICB9XG5cbiAgZ2V0RGVmYXVsdENvbmZpZygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0Q29uZmlnRGF0YVxuICB9XG5cbiAgZ2V0KGtleSA9IG51bGwpIHtcbiAgICBpZiAoa2V5KSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtrZXldLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJnZXQ6XCIsIGtleSwgcmVzdWx0W2tleV0pO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0W2tleV0pXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQobnVsbCwgKGl0ZW1zKSA9PiB7XG4gICAgICAgICAgdmFyIGNvbmZpZ0RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRDb25maWdEYXRhLCBpdGVtcylcbiAgICAgICAgICByZXNvbHZlKGNvbmZpZ0RhdGEpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgY29uc29sZS5sb2coXCJzdG9yZS5qcyBzZXRcIiwga2V5LCB2YWx1ZSk7XG4gICAgaWYgKHZhbHVlID09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBba2V5XTogdmFsdWVcbiAgICB9LCAoKSA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdjaHJvbWUgbG9jYWwgc2V0OiAlcywgJXYnLCBrZXksIHZhbHVlKVxuICAgIH0pXG4gIH1cblxuICBzYXZlKGNvbmZpZ0RhdGEpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWdEYXRhKSB7XG4gICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgICAgICBba2V5XTogY29uZmlnRGF0YVtrZXldXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjaHJvbWUgbG9jYWwgc2V0OiAlcywgJXMnLCBrZXksIGNvbmZpZ0RhdGFba2V5XSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuY2xlYXIoKVxuICAgIC8vIHRoaXMudHJpZ2dlcigndXBkYXRlVmlldycsIHRoaXMuY29uZmlnRGF0YSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgc3RvcmUoKSIsImltcG9ydCBzdG9yZSBmcm9tIFwiLi4vaW50ZXJuYWwvc3RvcmUvc3RvcmUuanNcIjtcblxuLy8gbG9naW4gYXBpXG5hc3luYyBmdW5jdGlvbiBsb2dpbihzZXJ2ZXIsIHVzZXJuYW1lLCBwYXNzd29yZCwgcmVtZW1iZXIpIHtcbiAgLy8gVmFsaWRhdGUgaW5wdXRcbiAgaWYgKHNlcnZlciA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNlcnZlciBtdXN0IG5vdCBlbXB0eVwiKTtcbiAgfVxuXG4gIGlmICh1c2VybmFtZSA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVzZXJuYW1lIG11c3Qgbm90IGVtcHR5XCIpO1xuICB9XG5cbiAgaWYgKHBhc3N3b3JkID09PSBcIlwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmQgbXVzdCBub3QgZW1wdHlcIik7XG4gIH1cblxuICBpZiAodHlwZW9mIHJlbWVtYmVyICE9PSAnYm9vbGVhbicpIHtcbiAgICByZW1lbWJlciA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGxvZ2luIFVSTFxuICB2YXIgbG9naW5VUkwgPSBcIlwiO1xuICB2YXIgbG9naW5QYXRoID0gXCJhcGkvYXV0aC9sb2dpblwiO1xuICB0cnkge1xuICAgIGxvZ2luVVJMID0gbmV3IFVSTChzZXJ2ZXIpO1xuICAgIGlmIChsb2dpblVSTC5wYXRobmFtZS5zbGljZSgtMSkgPT0gXCIvXCIpIHtcbiAgICAgIGxvZ2luVVJMLnBhdGhuYW1lID0gbG9naW5VUkwucGF0aG5hbWUgKyBsb2dpblBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2luVVJMLnBhdGhuYW1lID0gbG9naW5VUkwucGF0aG5hbWUgKyBcIi9cIiArIGxvZ2luUGF0aDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtzZXJ2ZXJ9IGlzIG5vdCBhIHZhbGlkIHVybGApO1xuICB9XG5cbiAgLy8gU2VuZCBsb2dpbiByZXF1ZXN0XG4gIHZhciByZXNwb25zZSA9IGF3YWl0IGZldGNoKGxvZ2luVVJMLCB7XG4gICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICByZW1lbWJlcl9tZTogcmVtZW1iZXIsXG4gICAgfSksXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfVxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdmFyIGVyciA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgfVxuXG4gIHZhciBqc29uUmVzcCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgcmV0dXJuIGpzb25SZXNwO1xufVxuXG4vLyBEZWZpbmUgZnVuY3Rpb24gZm9yIFVJIGhhbmRsZXJcbnZhciBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVycm9yLW1lc3NhZ2VcIiksXG4gIHR4dFNlc3Npb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR4dC1zZXNzaW9uXCIpLFxuICBpbnB1dFNlcnZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtc2VydmVyXCIpLFxuICBpbnB1dFVzZXJuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC11c2VybmFtZVwiKSxcbiAgaW5wdXRQYXNzd29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtcGFzc3dvcmRcIiksXG4gIGlucHV0UmVtZW1iZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXJlbWVtYmVyXCIpLFxuICBidG5Mb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWxvZ2luXCIpLFxuICBidG5Mb2dvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1sb2dvdXRcIiksXG4gIGxvYWRpbmdTaWduID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNpZ25cIiksXG4gIGNvbmZpZyA9IHt9O1xuXG5mdW5jdGlvbiBzaG93TG9hZGluZygpIHtcbiAgLy8gYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xufVxuXG5mdW5jdGlvbiBoaWRlTG9hZGluZygpIHtcbiAgLy8gYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgbG9hZGluZ1NpZ24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5mdW5jdGlvbiBzaG93RXJyb3IobXNnKSB7XG4gIGVycm9yTWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBtc2c7XG59XG5cbmZ1bmN0aW9uIGhpZGVFcnJvcigpIHtcbiAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuLy8g6K+75Y+W6YWN572uXG5zdG9yZS5nZXQoKS50aGVuKGNmZyA9PiB7XG4gIGlmIChjZmcudG9rZW4gPT09IFwiXCIpIHR4dFNlc3Npb24udGV4dENvbnRlbnQgPSBcIk5vIGFjdGl2ZSBzZXNzaW9uXCI7XG4gIGVsc2UgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IGBMb2dnZWQgaW4gc3VjY2VzcyBieSBgICsgY2ZnLnVzZXJuYW1lO1xuXG4gIGlucHV0U2VydmVyLnZhbHVlID0gY2ZnLnNlcnZlcjtcbiAgaW5wdXRVc2VybmFtZS52YWx1ZSA9IGNmZy51c2VybmFtZTtcbiAgaW5wdXRQYXNzd29yZC52YWx1ZSA9IGNmZy5wYXNzd29yZDtcblxuICAvLyBTaG93IGxvZ291dCBidXR0b24gaWYgdG9rZW4gaXMgbm90IGVtcHR5XG4gIGlmIChjZmcudG9rZW4gIT09IFwiXCIpIHtcbiAgICBidG5Mb2dvdXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICBidG5Mb2dpbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxufSkuY2F0Y2goZXJyID0+IHNob3dFcnJvcihlcnIpKTtcblxuXG4vLyBSZWdpc3RlciBldmVudCBsaXN0ZW5lclxuYXN5bmMgZnVuY3Rpb24gYnRuTG9naW5DbGljaygpIHtcbiAgLy8gR2V0IGlucHV0IHZhbHVlXG4gIHZhciBzZXJ2ZXIgPSBpbnB1dFNlcnZlci52YWx1ZSxcbiAgICB1c2VybmFtZSA9IGlucHV0VXNlcm5hbWUudmFsdWUsXG4gICAgcGFzc3dvcmQgPSBpbnB1dFBhc3N3b3JkLnZhbHVlO1xuICAvLyByZW1lbWJlciA9IGlucHV0UmVtZW1iZXIuY2hlY2tlZDtcblxuICAvLyBMb2dpbiB1c2luZyBpbnB1dCB2YWx1ZVxuICBjb25zdCByZXNwID0gYXdhaXQgbG9naW4oc2VydmVyLCB1c2VybmFtZSwgcGFzc3dvcmQsIHRydWUpO1xuXG4gIGlmIChyZXNwLmNvZGUgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocmVzcC5tc2cgfHwgXCJsb2dpbiBmYWlsZWRcIik7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdG9rZW4gPSByZXNwLmRhdGE/LnRva2VuIHx8IFwiXCI7XG4gICAgLy8gU2F2ZSBpbnB1dCB2YWx1ZSBhbmQgdG9rZW4gdG8gY29uZmlnXG4gICAgaWYgKHNlcnZlci5lbmRzV2l0aChcIi9cIikpIHtcbiAgICAgIHNlcnZlciA9IHNlcnZlci5zbGljZSgwLCAtMSk7XG4gICAgfVxuICAgIGNvbmZpZy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gICAgY29uZmlnLnRva2VuID0gdG9rZW47XG4gICAgY29uZmlnLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgLy8gY29uZmlnLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgY29uZmlnLnJlbWVtYmVyID0gdHJ1ZTtcbiAgICBjb25zb2xlLmxvZyhjb25maWcsIFwiY29uZmlnXCIpO1xuXG4gICAgLy8gVXBkYXRlIHN0b3JlXG4gICAgc3RvcmUudHJpZ2dlcignc2F2ZScsIGNvbmZpZylcblxuICAgIC8vIHR4dFNlc3Npb24udGV4dENvbnRlbnQgPSBgTG9nZ2VkIGluLmA7XG4gICAgc2V0VGlwTXNnKGBMb2dnZWQgaW4gc3VjY2VzcyBieSAke3VzZXJuYW1lfWApO1xuXG4gICAgaWYgKHRva2VuLmxlbmd0aCA+IDEwKSB7XG4gICAgICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgIC8vIHVpXG4gICAgICBidG5Mb2dvdXQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIGJ0bkxvZ2luLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG5cbiAgICBzdG9yZS5nZXQoKS50aGVuKGNmZyA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhjZmcsIFwiY2ZnXCIpO1xuICAgIH0pXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFRpcE1zZyhtc2cpIHtcbiAgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IG1zZztcbiAgdHh0U2Vzc2lvbi5zdHlsZS5jb2xvciA9IFwicmVkXCI7XG59XG5cbmJ0bkxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGhpZGVFcnJvcigpO1xuICBzaG93TG9hZGluZygpO1xuXG4gIGJ0bkxvZ2luQ2xpY2soKVxuICAgIC5jYXRjaChlcnIgPT4gc2hvd0Vycm9yKGVycikpXG4gICAgLmZpbmFsbHkoKCkgPT4gaGlkZUxvYWRpbmcoKSk7XG59KTtcblxuYnRuTG9nb3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGhpZGVFcnJvcigpO1xuICBoaWRlTG9hZGluZygpO1xuXG4gIHN0b3JlLmNsZWFyKCk7XG5cbiAgaW5wdXRVc2VybmFtZS52YWx1ZSA9IFwiXCI7XG4gIGlucHV0UGFzc3dvcmQudmFsdWUgPSBcIlwiO1xuXG4gIC8vIFVwZGF0ZSBVSVxuICB0eHRTZXNzaW9uLnRleHRDb250ZW50ID0gXCJcIjtcbiAgYnRuTG9nb3V0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgYnRuTG9naW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==