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
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/js/popup.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./chrome/js/popup.js":
/*!****************************!*\
  !*** ./chrome/js/popup.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _internal_helper_chrome_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../internal/helper/chrome.js */ "./chrome/internal/helper/chrome.js");
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

console.log("popup.js loaded");
var inputTags = document.getElementById("input-tags"), btnRemove = document.getElementById("btn-remove"), btnLibraries = document.getElementById("btn-libraries"), btnSave = document.getElementById("btn-save"), loading = document.getElementById("loading-sign");
function showError(err) {
  return __async(this, null, function* () {
    var tabs = yield chrome.tabs.query({
      currentWindow: true,
      active: true
    });
    if (tabs.length < 1) {
      throw new Error("no tab available");
    }
    if (err instanceof Error) {
      err = err.message;
    }
    return chrome.tabs.sendMessage(tabs[0].id, {
      type: "show-error",
      message: err
    });
  });
}
btnRemove.addEventListener("click", (e) => {
  btnSave.style.display = "none";
  loading.style.display = "block";
  btnRemove.style.display = "none";
  chrome.runtime.sendMessage({
    type: "remove-bookmark"
  }, (resp) => {
    window.close();
  });
});
btnLibraries.addEventListener("click", (e) => {
  console.log("open-libraries sent1");
  var msg = { type: "open-libraries" };
  Object(_internal_helper_chrome_js__WEBPACK_IMPORTED_MODULE_0__["sendMessageWithPromise"])(msg).then((resp) => {
    console.log(resp);
    return resp;
  });
});
btnSave.addEventListener("click", (e) => {
  var tags = inputTags.value.toLowerCase().replace(/\s+/g, " ").split(/\s*,\s*/g).filter((tag) => tag.trim() !== "").map((tag) => {
    return tag.trim();
  });
  btnSave.style.display = "none";
  loading.style.display = "block";
  chrome.runtime.sendMessage({
    type: "save-bookmark",
    tags
  }, (resp) => {
    window.close();
  });
});
inputTags.addEventListener("keyup", (e) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnSave.click();
  }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2hlbHBlci9jaHJvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDaEZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFTLHVCQUF1QixTQUFTO0FBQzlDLFNBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFdBQU8sUUFBUSxZQUFZLFNBQVMsQ0FBQyxhQUFhO0FBQ2hELFVBQUksT0FBTyxRQUFRLFdBQVc7QUFFNUIsY0FBTSxRQUFRLE9BQU8sUUFBUTtBQUM3QixnQkFBUSxJQUFJLHlDQUFXLFdBQVcsU0FBUyxTQUFTLEtBQUs7QUFDekQsZUFBTyxLQUFLO0FBQUEsTUFDZCxPQUFPO0FB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Q0FBQztBQUdELFFBQVEsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBRXZDLE1BQUksT0FBTyxVQUFVLE1BQ2xCLFlBQVksRUFDWixRQUFRLFFBQVEsR0FBRyxFQUNuQixNQUFNLFVBQVUsRUFDaEIsT0FBTyxTQUFPLElBQUksS0FBSyxNQUFNLEVBQUUsRUFDL0IsSUFBSSxTQUFPO0FBQ1YsV0FBTyxJQUFJLEtBQUs7QUFBQSxFQUNsQixDQUFDO0FBR0gsVUFBUSxNQUFNLFVBQVU7QUFDeEIsVUFBUSxNQUFNLFVBQVU7QUFHeEIsU0FBTyxRQUFRLFlBQVk7QUFBQSxJQUN6QixNQUFNO0FBQUEsSUFDTjtBQUFBLEVBQ0YsR0FBRyxDQUFDLFNBQVM7QUFDWCxXQUFPLE1BQU07QUFBQSxFQUNmLENBQUM7QUFFSCxDQUFDO0FBRUQsVUFBVSxpQkFBaUIsU0FBUyxDQUFDLE1BQU07QUFFekMsTUFBSSxNQUFNLFlBQVksSUFBSTtBQUN4QixVQUFNLGVBQWU7QUFDckIsWUFBUSxNQUFNO0FBQUEsRUFDaEI7QUFDRixDQUFDIiwiZmlsZSI6InBvcHVwLmVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvanMvcG9wdXAuanNcIik7XG4iLCJcbi8vIOWPkemAgea2iOaBr+W5tui/lOWbnlByb21pc2VcbmV4cG9ydCBmdW5jdGlvbiBzZW5kTWVzc2FnZVdpdGhQcm9taXNlKG1lc3NhZ2UpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgLy8g5Y2z5L2/6KaBcmVqZWN077yM5Lmf6KaB5YWI6K6/6ZeubGFzdEVycm9yXG4gICAgICAgIGNvbnN0IGVycm9yID0gY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKCfmtojmga/lj5HpgIHlpLHotKU6JywgXCJtZXNzYWdlXCIsIG1lc3NhZ2UsIFwiZXJyb3JcIiwgZXJyb3IpXG4gICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocmVzcG9uc2UpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cblxuLy8g6I635Y+W5b2T5YmN5rS75Yqo5qCH562+6aG1XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFRhYigpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgLy8gR2V0IGFjdGl2ZSB0YWJzIGluIGN1cnJlbnQgd2luZG93ICBcbiAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHtcbiAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlXG4gICAgICB9LCAodGFicykgPT4ge1xuICAgICAgICBpZiAoIXRhYnMgfHwgdGFicy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFiIGF2YWlsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBWYWxpZGF0ZSBwcm90b2NvbFxuICAgICAgICBsZXQgYWN0aXZlVGFiID0gdGFic1swXTtcbiAgICAgICAgLy9sZXQgdXJsID0gbmV3IFVSTChhY3RpdmVUYWIudXJsKTtcbiAgICAgICAgLy9sZXQgc3VwcG9ydGVkUHJvdG9jb2xzID0gW1wiaHR0cHM6XCIsIFwiaHR0cDpcIiwgXCJmdHA6XCIsIFwiZmlsZTpcIl07XG5cbiAgICAgICAgLy9pZiAoIXN1cHBvcnRlZFByb3RvY29scy5pbmNsdWRlcyh1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgcHJvdG9jb2wgXCIke3VybC5wcm90b2NvbH1cImApO1xuICAgICAgICAvL31cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhhY3RpdmVUYWIpXG4gICAgICAgIGlmIChhY3RpdmVUYWIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGFjdGl2ZVRhYik7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyDmmoLlgZzmiafooYzmjIflrprmr6vnp5JcbmV4cG9ydCBmdW5jdGlvbiBzbGVlcChtcykge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSlcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbm90aWZ5KHRpdGxlLCBtZXNzYWdlKSB7XG4gIHRyeSB7XG4gICAgdmFyIGljb24gPSBcIi9pY29ucy9pY29uLnBuZ1wiO1xuICAgIHZhciBpc0Nsb3NlZCA9IGZhbHNlO1xuICAgIHZhciBub3RpZmljYXRpb25JZCA9IFwicG9zdGluZ19cIiArIE1hdGgucmFuZG9tKCk7XG5cbiAgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jcmVhdGUoXG4gICAgICBub3RpZmljYXRpb25JZCwge1xuICAgICAgdHlwZTogXCJiYXNpY1wiLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgIGljb25Vcmw6IGljb24sXG4gICAgfSxcbiAgICAgIGZ1bmN0aW9uIChuSWQpIHsgfVxuICAgICk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWlzQ2xvc2VkKVxuICAgICAgICBjaHJvbWUubm90aWZpY2F0aW9ucy5jbGVhcihub3RpZmljYXRpb25JZCwgZnVuY3Rpb24gKHdhc0NsZWFyZWQpIHsgfSk7XG4gICAgfSwgNTAwMCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbGVydChlLm1lc3NhZ2UpO1xuICB9XG59IiwiaW1wb3J0IHsgc2VuZE1lc3NhZ2VXaXRoUHJvbWlzZSB9IGZyb20gXCIuLi9pbnRlcm5hbC9oZWxwZXIvY2hyb21lLmpzXCI7XG5jb25zb2xlLmxvZyhcInBvcHVwLmpzIGxvYWRlZFwiKTtcblxuLy8gR2V0IERPTVxudmFyIGlucHV0VGFncyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtdGFnc1wiKSxcbiAgYnRuUmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcmVtb3ZlXCIpLFxuICBidG5MaWJyYXJpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1saWJyYXJpZXNcIiksXG4gIGJ0blNhdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1zYXZlXCIpLFxuICBsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNpZ25cIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHNob3dFcnJvcihlcnIpIHtcbiAgdmFyIHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcbiAgICBhY3RpdmU6IHRydWUsXG4gIH0pO1xuXG4gIGlmICh0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyB0YWIgYXZhaWxhYmxlXCIpO1xuICB9XG5cbiAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgZXJyID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICByZXR1cm4gY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge1xuICAgIHR5cGU6IFwic2hvdy1lcnJvclwiLFxuICAgIG1lc3NhZ2U6IGVycixcbiAgfSk7XG59XG5cbi8vIEFkZCBldmVudCBoYW5kbGVyXG5idG5SZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIC8vIFNob3cgbG9hZGluZyBpbmRpY2F0b3JcbiAgYnRuU2F2ZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgYnRuUmVtb3ZlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInJlbW92ZS1ib29rbWFya1wiLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHdpbmRvdy5jbG9zZSgpXG4gIH0pO1xufSk7XG5cbmJ0bkxpYnJhcmllcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgY29uc29sZS5sb2coXCJvcGVuLWxpYnJhcmllcyBzZW50MVwiKTtcbiAgdmFyIG1zZyA9IHsgdHlwZTogXCJvcGVuLWxpYnJhcmllc1wiIH1cbiAgc2VuZE1lc3NhZ2VXaXRoUHJvbWlzZShtc2cpLnRoZW4oKHJlc3ApID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICByZXR1cm4gcmVzcDtcbiAgfSlcbn0pO1xuXG5cbmJ0blNhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIC8vIEdldCBpbnB1dCB2YWx1ZVxuICB2YXIgdGFncyA9IGlucHV0VGFncy52YWx1ZVxuICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG4gICAgLnNwbGl0KC9cXHMqLFxccyovZylcbiAgICAuZmlsdGVyKHRhZyA9PiB0YWcudHJpbSgpICE9PSBcIlwiKVxuICAgIC5tYXAodGFnID0+IHtcbiAgICAgIHJldHVybiB0YWcudHJpbSgpO1xuICAgIH0pO1xuXG4gIC8vIFNob3cgbG9hZGluZyBpbmRpY2F0b3JcbiAgYnRuU2F2ZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAvLyBTZW5kIGRhdGFcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwic2F2ZS1ib29rbWFya1wiLFxuICAgIHRhZ3M6IHRhZ3MsXG4gIH0sIChyZXNwKSA9PiB7XG4gICAgd2luZG93LmNsb3NlKClcbiAgfSk7XG5cbn0pO1xuXG5pbnB1dFRhZ3MuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XG4gIC8vIGtleUNvZGUgMTMgPSBcIkVudGVyXCIga2V5IG9uIHRoZSBrZXlib2FyZFxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgYnRuU2F2ZS5jbGljaygpXG4gIH1cbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9