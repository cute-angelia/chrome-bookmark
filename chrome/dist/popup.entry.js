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

console.log("popup.js loaded");
var inputTags = document.getElementById("input-tags"), btnRemove = document.getElementById("btn-remove"), btnLibraries = document.getElementById("btn-libraries"), btnSave = document.getElementById("btn-save"), loading = document.getElementById("loading-sign");
var isButtonDisabled = false;
function showError(err) {
  var msg = { type: "notify", title: "\u7CFB\u7EDF\u901A\u77E5", message: err };
  Object(_internal_helper_chrome_js__WEBPACK_IMPORTED_MODULE_0__["sendMessageWithPromise"])(msg).then((resp) => {
    console.log(resp);
    return resp;
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
  if (isButtonDisabled)
    return;
  isButtonDisabled = true;
  var tags = inputTags.value.toLowerCase().replace(/\s+/g, " ").split(/\s*,\s*/g).filter((tag) => tag.trim() !== "").map((tag) => {
    return tag.trim();
  });
  btnSave.style.display = "none";
  loading.style.display = "block";
  chrome.runtime.sendMessage({
    type: "save-bookmark",
    tags
  }, (resp) => {
    console.log(resp);
    if (resp.status === "success") {
      window.close();
    } else {
      showError(resp.message);
      isButtonDisabled = false;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2hlbHBlci9jaHJvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDaEZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFTLHVCQUF1QixTQUFTO0FBQzlDLFNBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFdBQU8sUUFBUSxZQUFZLFNBQVMsQ0FBQyxhQUFhO0FBQ2hELFVBQUksT0FBTyxRQUFRLFdBQVc7QUFFNUIsY0FBTSxRQUFRLE9BQU8sUUFBUTtBQUM3QixnQkFBUSxJQUFJLHlDQUFXLFdBQVcsU0FBUyxTQUFTLEtBQUs7QUFDekQsZUFBTyxLQUFLO0FBQUEsTUFDZCxPQUFPO0FB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LElBQUksS0FBSyxNQUFNLEVBQUUsRUFDL0IsSUFBSSxTQUFPO0FBQ1YsV0FBTyxJQUFJLEtBQUs7QUFBQSxFQUNsQixDQUFDO0FBR0gsVUFBUSxNQUFNLFVBQVU7QUFDeEIsVUFBUSxNQUFNLFVBQVU7QUFHeEIsU0FBTyxRQUFRLFlBQVk7QUFBQSxJQUN6QixNQUFNO0FBQUEsSUFDTjtBQUFBLEVBQ0YsR0FBRyxDQUFDLFNBQVM7QUFDWCxZQUFRLElBQUksSUFBSTtBQUNoQixRQUFJLEtBQUssV0FBVyxXQUFXO0FBQzdCLGFBQU8sTUFBTTtBQUFBLElBQ2YsT0FBTztBQUNMLGdCQUFVLEtBQUssT0FBTztBQUN0Qix5QkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0YsQ0FBQztBQUVILENBQUM7QUFFRCxVQUFVLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUV6QyxNQUFJLE1BQU0sWUFBWSxJQUFJO0FBQ3hCLFVBQU0sZUFBZTtBQUNyQixZQUFRLE1BQU07QUFBQSxFQUNoQjtBQUNGLENBQUMiLCJmaWxlIjoicG9wdXAuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9wb3B1cC5qc1wiKTtcbiIsIlxuLy8g5Y+R6YCB5raI5oGv5bm26L+U5ZueUHJvbWlzZVxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRNZXNzYWdlV2l0aFByb21pc2UobWVzc2FnZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAvLyDljbPkvb/opoFyZWplY3TvvIzkuZ/opoHlhYjorr/pl65sYXN0RXJyb3JcbiAgICAgICAgY29uc3QgZXJyb3IgPSBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coJ+a2iOaBr+WPkemAgeWksei0pTonLCBcIm1lc3NhZ2VcIiwgbWVzc2FnZSwgXCJlcnJvclwiLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG4vLyDojrflj5blvZPliY3mtLvliqjmoIfnrb7pobVcbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgYWN0aXZlIHRhYnMgaW4gY3VycmVudCB3aW5kb3cgIFxuICAgICAgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWVcbiAgICAgIH0sICh0YWJzKSA9PiB7XG4gICAgICAgIGlmICghdGFicyB8fCB0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJObyB0YWIgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFZhbGlkYXRlIHByb3RvY29sXG4gICAgICAgIGxldCBhY3RpdmVUYWIgPSB0YWJzWzBdO1xuICAgICAgICAvL2xldCB1cmwgPSBuZXcgVVJMKGFjdGl2ZVRhYi51cmwpO1xuICAgICAgICAvL2xldCBzdXBwb3J0ZWRQcm90b2NvbHMgPSBbXCJodHRwczpcIiwgXCJodHRwOlwiLCBcImZ0cDpcIiwgXCJmaWxlOlwiXTtcblxuICAgICAgICAvL2lmICghc3VwcG9ydGVkUHJvdG9jb2xzLmluY2x1ZGVzKHVybC5wcm90b2NvbCkpIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBwcm90b2NvbCBcIiR7dXJsLnByb3RvY29sfVwiYCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGFjdGl2ZVRhYilcbiAgICAgICAgaWYgKGFjdGl2ZVRhYiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoYWN0aXZlVGFiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJlamVjdChlcnIpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIOaaguWBnOaJp+ihjOaMh+Wumuavq+enklxuZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1zKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnkodGl0bGUsIG1lc3NhZ2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaWNvbiA9IFwiL2ljb25zL2ljb24ucG5nXCI7XG4gICAgdmFyIGlzQ2xvc2VkID0gZmFsc2U7XG4gICAgdmFyIG5vdGlmaWNhdGlvbklkID0gXCJwb3N0aW5nX1wiICsgTWF0aC5yYW5kb20oKTtcblxuICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNyZWF0ZShcbiAgICAgIG5vdGlmaWNhdGlvbklkLCB7XG4gICAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgICB0aXRsZTogdGl0bGUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgaWNvblVybDogaWNvbixcbiAgICB9LFxuICAgICAgZnVuY3Rpb24gKG5JZCkgeyB9XG4gICAgKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXNDbG9zZWQpXG4gICAgICAgIGNocm9tZS5ub3RpZmljYXRpb25zLmNsZWFyKG5vdGlmaWNhdGlvbklkLCBmdW5jdGlvbiAod2FzQ2xlYXJlZCkgeyB9KTtcbiAgICB9LCA1MDAwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFsZXJ0KGUubWVzc2FnZSk7XG4gIH1cbn0iLCJpbXBvcnQgeyBzZW5kTWVzc2FnZVdpdGhQcm9taXNlIH0gZnJvbSBcIi4uL2ludGVybmFsL2hlbHBlci9jaHJvbWUuanNcIjtcbmNvbnNvbGUubG9nKFwicG9wdXAuanMgbG9hZGVkXCIpO1xuXG4vLyBHZXQgRE9NXG52YXIgaW5wdXRUYWdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC10YWdzXCIpLFxuICBidG5SZW1vdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1yZW1vdmVcIiksXG4gIGJ0bkxpYnJhcmllcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWxpYnJhcmllc1wiKSxcbiAgYnRuU2F2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXNhdmVcIiksXG4gIGxvYWRpbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctc2lnblwiKTtcblxudmFyIGlzQnV0dG9uRGlzYWJsZWQgPSBmYWxzZTtcblxuZnVuY3Rpb24gc2hvd0Vycm9yKGVycikge1xuICB2YXIgbXNnID0geyB0eXBlOiBcIm5vdGlmeVwiLCB0aXRsZTogXCLns7vnu5/pgJrnn6VcIiwgbWVzc2FnZTogZXJyIH1cbiAgc2VuZE1lc3NhZ2VXaXRoUHJvbWlzZShtc2cpLnRoZW4oKHJlc3ApID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICByZXR1cm4gcmVzcDtcbiAgfSlcbn1cblxuLy8gQWRkIGV2ZW50IGhhbmRsZXJcbmJ0blJlbW92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgLy8gU2hvdyBsb2FkaW5nIGluZGljYXRvclxuICBidG5TYXZlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICBidG5SZW1vdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIHR5cGU6IFwicmVtb3ZlLWJvb2ttYXJrXCIsXG4gIH0sIChyZXNwKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2cocmVzcCk7XG4gICAgd2luZG93LmNsb3NlKClcbiAgfSk7XG59KTtcblxuYnRuTGlicmFyaWVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBjb25zb2xlLmxvZyhcIm9wZW4tbGlicmFyaWVzIHNlbnQxXCIpO1xuICB2YXIgbXNnID0geyB0eXBlOiBcIm9wZW4tbGlicmFyaWVzXCIgfVxuICBzZW5kTWVzc2FnZVdpdGhQcm9taXNlKG1zZykudGhlbigocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHJldHVybiByZXNwO1xuICB9KVxufSk7XG5cblxuYnRuU2F2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgaWYgKGlzQnV0dG9uRGlzYWJsZWQpIHJldHVybjtcbiAgaXNCdXR0b25EaXNhYmxlZCA9IHRydWU7XG5cbiAgLy8gR2V0IGlucHV0IHZhbHVlXG4gIHZhciB0YWdzID0gaW5wdXRUYWdzLnZhbHVlXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAuc3BsaXQoL1xccyosXFxzKi9nKVxuICAgIC5maWx0ZXIodGFnID0+IHRhZy50cmltKCkgIT09IFwiXCIpXG4gICAgLm1hcCh0YWcgPT4ge1xuICAgICAgcmV0dXJuIHRhZy50cmltKCk7XG4gICAgfSk7XG5cbiAgLy8gU2hvdyBsb2FkaW5nIGluZGljYXRvclxuICBidG5TYXZlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gIC8vIFNlbmQgZGF0YVxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJzYXZlLWJvb2ttYXJrXCIsXG4gICAgdGFnczogdGFncyxcbiAgfSwgKHJlc3ApID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKVxuICAgIGlmIChyZXNwLnN0YXR1cyA9PT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgIHdpbmRvdy5jbG9zZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dFcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgaXNCdXR0b25EaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5pbnB1dFRhZ3MuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlKSA9PiB7XG4gIC8vIGtleUNvZGUgMTMgPSBcIkVudGVyXCIga2V5IG9uIHRoZSBrZXlib2FyZFxuICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgYnRuU2F2ZS5jbGljaygpXG4gIH1cbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9