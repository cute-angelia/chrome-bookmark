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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9jaHJvbWUvanMvb3B0aW9ucy5qcyJdLCJuYW1lcyI6WyJlcnIiXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZPO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBUyxxQkFBcUI7QUFDbkMsU0FBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsUUFBSTtBQUNGLGFBQU8sUUFBUSxNQUFNLElBQUksTUFBTSxTQUFVLE9BQU87QUFDOUMsWUFBSSxRQUFRLE1BQU0sU0FBUztBQUMzQixZQUFJLFNBQVMsTUFBTSxVQUFVO0FBQzdCLFlBQUksVUFBVSxJQUFJO0FBQ2hCLGlCQUFPLE9BQU8sdUNBQXVDO0FBQUEsUUFDdkQ7QUFDQSxZQUFJLFdBQVcsSUFBSTtB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QUEsRUFDekI7QUFBQTtBQUVBLFNBQVMsaUJBQWlCLFNBQVMsTUFBTTtBQUN2QyxZQUFVO0FBQ1YsY0FBWTtBQUVaLGdCQUFjLEVBQ1gsTUFBTSxTQUFPLFVBQVUsR0FBRyxDQUFDLEVBQzNCLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFDaEMsQ0FBQyIsImZpbGUiOiJvcHRpb25zLmVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvanMvb3B0aW9ucy5qc1wiKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRFeHRlbnNpb25Db25maWcoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChudWxsLCBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgICAgdmFyIHRva2VuID0gaXRlbXMudG9rZW4gfHwgXCJcIjtcbiAgICAgICAgdmFyIHNlcnZlciA9IGl0ZW1zLnNlcnZlciB8fCBcIlwiO1xuICAgICAgICBpZiAodG9rZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KFwibm8gYWN0aXZlIHNlc3Npb24sIHBsZWFzZSBsb2dpbiBmaXJzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VydmVyID09PSBcIlwiKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChcInNlcnZlciB1cmwgaXMgbm90IHNwZWNpZmllZFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgICAgIHNlcnZlcjogc2VydmVyXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gR2V0IGFjdGl2ZSB0YWJzIGluIGN1cnJlbnQgd2luZG93ICBcbiAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlXG4gICAgICB9LCAodGFicykgPT4ge1xuICAgICAgICBpZiAoIXRhYnMgfHwgdGFicy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFiIGF2YWlsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBWYWxpZGF0ZSBwcm90b2NvbFxuICAgICAgICBsZXQgYWN0aXZlVGFiID0gdGFic1swXTtcbiAgICAgICAgLy9sZXQgdXJsID0gbmV3IFVSTChhY3RpdmVUYWIudXJsKTtcbiAgICAgICAgLy9sZXQgc3VwcG9ydGVkUHJvdG9jb2xzID0gW1wiaHR0cHM6XCIsIFwiaHR0cDpcIiwgXCJmdHA6XCIsIFwiZmlsZTpcIl07XG5cbiAgICAgICAgLy9pZiAoIXN1cHBvcnRlZFByb3RvY29scy5pbmNsdWRlcyh1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgcHJvdG9jb2wgXCIke3VybC5wcm90b2NvbH1cImApO1xuICAgICAgICAvL31cbiAgICAgICAgcmVzb2x2ZShhY3RpdmVUYWIpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuT3B0aW9uc1BhZ2UoKSB7XG4gIGNocm9tZS50YWJzLmNyZWF0ZSh7XG4gICAgdXJsOiBcIi92aWV3L29wdGlvbnMuaHRtbFwiXG4gIH0pO1xufSIsImltcG9ydCB7IGdldEV4dGVuc2lvbkNvbmZpZyB9IGZyb20gXCIuL2hlbHBlci5qc1wiO1xuXG4vLyBhc3luYyBmdW5jdGlvbiBnZXRFeHRlbnNpb25Db25maWcoKSB7XG4vLyAgIHZhciBpdGVtcyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgpO1xuXG4vLyAgIHJldHVybiB7XG4vLyAgICAgc2VydmVyOiBpdGVtcy5zZXJ2ZXIgfHwgXCJcIixcbi8vICAgICB0b2tlbjogaXRlbXMudG9rZW4gfHwgXCJcIixcbi8vICAgICB1c2VybmFtZTogaXRlbXMudXNlcm5hbWUgfHwgXCJcIixcbi8vICAgICBwYXNzd29yZDogaXRlbXMucGFzc3dvcmQgfHwgXCJcIixcbi8vICAgICByZW1lbWJlcjogaXRlbXMucmVtZW1iZXIgfHwgZmFsc2UsXG4vLyAgIH07XG4vLyB9XG5cbmFzeW5jIGZ1bmN0aW9uIHNhdmVFeHRlbnNpb25Db25maWcoY2ZnKSB7XG4gIHJldHVybiBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoY2ZnKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9nb3V0KHNlcnZlciwgdG9rZW4pIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2dpbihzZXJ2ZXIsIHVzZXJuYW1lLCBwYXNzd29yZCwgcmVtZW1iZXIpIHtcbiAgLy8gVmFsaWRhdGUgaW5wdXRcbiAgaWYgKHNlcnZlciA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlNlcnZlciBtdXN0IG5vdCBlbXB0eVwiKTtcbiAgfVxuXG4gIGlmICh1c2VybmFtZSA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVzZXJuYW1lIG11c3Qgbm90IGVtcHR5XCIpO1xuICB9XG5cbiAgaWYgKHBhc3N3b3JkID09PSBcIlwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUGFzc3dvcmQgbXVzdCBub3QgZW1wdHlcIik7XG4gIH1cblxuICBpZiAodHlwZW9mIHJlbWVtYmVyICE9PSAnYm9vbGVhbicpIHtcbiAgICByZW1lbWJlciA9IGZhbHNlO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGxvZ2luIFVSTFxuICB2YXIgbG9naW5VUkwgPSBcIlwiO1xuICB2YXIgbG9naW5QYXRoID0gXCJhcGkvYXV0aC9sb2dpblwiO1xuICB0cnkge1xuICAgIGxvZ2luVVJMID0gbmV3IFVSTChzZXJ2ZXIpO1xuICAgIGlmIChsb2dpblVSTC5wYXRobmFtZS5zbGljZSgtMSkgPT0gXCIvXCIpIHtcbiAgICAgIGxvZ2luVVJMLnBhdGhuYW1lID0gbG9naW5VUkwucGF0aG5hbWUgKyBsb2dpblBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2luVVJMLnBhdGhuYW1lID0gbG9naW5VUkwucGF0aG5hbWUgKyBcIi9cIiArIGxvZ2luUGF0aDtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtzZXJ2ZXJ9IGlzIG5vdCBhIHZhbGlkIHVybGApO1xuICB9XG5cbiAgLy8gU2VuZCBsb2dpbiByZXF1ZXN0XG4gIHZhciByZXNwb25zZSA9IGF3YWl0IGZldGNoKGxvZ2luVVJMLCB7XG4gICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICByZW1lbWJlcl9tZTogcmVtZW1iZXIsXG4gICAgfSksXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfVxuICB9KTtcblxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdmFyIGVyciA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgfVxuXG4gIHZhciBqc29uUmVzcCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKSxcbiAgICB0b2tlbiA9IGpzb25SZXNwLmRhdGEudG9rZW47XG5cbiAgY29uc29sZS5sb2codG9rZW4pO1xuXG4gIHJldHVybiB0b2tlbjtcbn1cblxuLy8gRGVmaW5lIGZ1bmN0aW9uIGZvciBVSSBoYW5kbGVyXG52YXIgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlcnJvci1tZXNzYWdlXCIpLFxuICB0eHRTZXNzaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtc2Vzc2lvblwiKSxcbiAgaW5wdXRTZXJ2ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXNlcnZlclwiKSxcbiAgaW5wdXRVc2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtdXNlcm5hbWVcIiksXG4gIGlucHV0UGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXBhc3N3b3JkXCIpLFxuICBpbnB1dFJlbWVtYmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1yZW1lbWJlclwiKSxcbiAgYnRuTG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1sb2dpblwiKSxcbiAgbG9hZGluZ1NpZ24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctc2lnblwiKSxcbiAgY29uZmlnID0ge307XG5cbmZ1bmN0aW9uIHNob3dMb2FkaW5nKCkge1xuICBidG5Mb2dpbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGxvYWRpbmdTaWduLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmZ1bmN0aW9uIGhpZGVMb2FkaW5nKCkge1xuICBidG5Mb2dpbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cbmZ1bmN0aW9uIHNob3dFcnJvcihtc2cpIHtcbiAgZXJyb3JNZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IG1zZztcbn1cblxuZnVuY3Rpb24gaGlkZUVycm9yKCkge1xuICBlcnJvck1lc3NhZ2Uuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5nZXRFeHRlbnNpb25Db25maWcoKVxuICAudGhlbihjZmcgPT4ge1xuICAgIGNvbmZpZyA9IGNmZztcblxuICAgIGlmIChjZmcudG9rZW4gPT09IFwiXCIpIHR4dFNlc3Npb24udGV4dENvbnRlbnQgPSBcIk5vIGFjdGl2ZSBzZXNzaW9uXCI7XG4gICAgZWxzZSB0eHRTZXNzaW9uLnRleHRDb250ZW50ID0gYExvZ2dlZCBpbiBzdWNjZXNzIGJ5YCArIGNmZy51c2VybmFtZTtcblxuICAgIGlucHV0U2VydmVyLnZhbHVlID0gY2ZnLnNlcnZlcjtcbiAgICBpbnB1dFVzZXJuYW1lLnZhbHVlID0gY2ZnLnVzZXJuYW1lO1xuICAgIGlucHV0UGFzc3dvcmQudmFsdWUgPSBjZmcucGFzc3dvcmQ7XG4gICAgLy8gaW5wdXRSZW1lbWJlci5jaGVja2VkID0gY2ZnLnJlbWVtYmVyO1xuICB9KVxuICAuY2F0Y2goZXJyID0+IHNob3dFcnJvcihlcnIpKTtcblxuLy8gUmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJcbmFzeW5jIGZ1bmN0aW9uIGJ0bkxvZ2luQ2xpY2soKSB7XG4gIC8vIEdldCBpbnB1dCB2YWx1ZVxuICB2YXIgc2VydmVyID0gaW5wdXRTZXJ2ZXIudmFsdWUsXG4gICAgdXNlcm5hbWUgPSBpbnB1dFVzZXJuYW1lLnZhbHVlLFxuICAgIHBhc3N3b3JkID0gaW5wdXRQYXNzd29yZC52YWx1ZTtcbiAgLy8gcmVtZW1iZXIgPSBpbnB1dFJlbWVtYmVyLmNoZWNrZWQ7XG5cbiAgLy8gTG9naW4gdXNpbmcgaW5wdXQgdmFsdWVcbiAgdmFyIHRva2VuID0gYXdhaXQgbG9naW4oc2VydmVyLCB1c2VybmFtZSwgcGFzc3dvcmQsIHRydWUpO1xuXG4gIC8vIFNhdmUgaW5wdXQgdmFsdWUgYW5kIHRva2VuIHRvIGNvbmZpZ1xuXG4gIGlmIChzZXJ2ZXIuZW5kc1dpdGgoXCIvXCIpKSB7XG4gICAgc2VydmVyID0gc2VydmVyLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIGNvbmZpZy5zZXJ2ZXIgPSBzZXJ2ZXI7XG4gIGNvbmZpZy50b2tlbiA9IHRva2VuO1xuICBjb25maWcudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgLy8gY29uZmlnLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gIGNvbmZpZy5yZW1lbWJlciA9IHRydWU7XG4gIGF3YWl0IHNhdmVFeHRlbnNpb25Db25maWcoY29uZmlnKTtcbiAgdHh0U2Vzc2lvbi50ZXh0Q29udGVudCA9IGBMb2dnZWQgaW4uYDtcblxuICBpZiAodG9rZW4ubGVuZ3RoID4gMTApIHtcbiAgICBsb2FkaW5nU2lnbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG59XG5cbmJ0bkxvZ2luLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGhpZGVFcnJvcigpO1xuICBzaG93TG9hZGluZygpO1xuXG4gIGJ0bkxvZ2luQ2xpY2soKVxuICAgIC5jYXRjaChlcnIgPT4gc2hvd0Vycm9yKGVycikpXG4gICAgLmZpbmFsbHkoKCkgPT4gaGlkZUxvYWRpbmcoKSk7XG59KTsiXSwic291cmNlUm9vdCI6IiJ9