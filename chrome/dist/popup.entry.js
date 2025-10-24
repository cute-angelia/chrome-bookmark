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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2ludGVybmFsL2hlbHBlci9jaHJvbWUuanMiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDaEZPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFTLHVCQUF1QixTQUFTO0FBQzlDLFNBQU8sSUFBSSxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQ3RDLFdBQU8sUUFBUSxZQUFZLFNBQVMsQ0FBQyxhQUFhO0FBQ2hELFVBQUksT0FBTyxRQUFRLFdBQVc7QUFFNUIsY0FBTSxRQUFRLE9BQU8sUUFBUTtBQUM3QixnQkFBUSxJQUFJLHlDQUFXLFdBQVcsU0FBUyxTQUFTLEtBQUs7QUFDekQsZUFBTyxLQUFLO0FBQUEsTUFDZCxPQUFPO0FB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QUFJLEtBQUs7QUFBQSxFQUNsQixDQUFDO0FBR0gsVUFBUSxNQUFNLFVBQVU7QUFDeEIsVUFBUSxNQUFNLFVBQVU7QUFHeEIsU0FBTyxRQUFRLFlBQVk7QUFBQSxJQUN6QixNQUFNO0FBQUEsSUFDTjtBQUFBLEVBQ0YsR0FBRyxDQUFDLFNBQVM7QUFDWCxZQUFRLElBQUksSUFBSTtBQUNoQixRQUFJLEtBQUssV0FBVyxXQUFXO0FBQzdCLGFBQU8sTUFBTTtBQUFBLElBQ2YsT0FBTztBQUNMLGdCQUFVLEtBQUssT0FBTztBQUFBLElBQ3hCO0FBQUEsRUFDRixDQUFDO0FBRUgsQ0FBQztBQUVELFVBQVUsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBRXpDLE1BQUksTUFBTSxZQUFZLElBQUk7QUFDeEIsVUFBTSxlQUFlO0FBQ3JCLFlBQVEsTUFBTTtBQUFBLEVBQ2hCO0FBQ0YsQ0FBQyIsImZpbGUiOiJwb3B1cC5lbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL2pzL3BvcHVwLmpzXCIpO1xuIiwiXG4vLyDlj5HpgIHmtojmga/lubbov5Tlm55Qcm9taXNlXG5leHBvcnQgZnVuY3Rpb24gc2VuZE1lc3NhZ2VXaXRoUHJvbWlzZShtZXNzYWdlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSwgKHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgIC8vIOWNs+S9v+imgXJlamVjdO+8jOS5n+imgeWFiOiuv+mXrmxhc3RFcnJvclxuICAgICAgICBjb25zdCBlcnJvciA9IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvclxuICAgICAgICBjb25zb2xlLmxvZygn5raI5oGv5Y+R6YCB5aSx6LSlOicsIFwibWVzc2FnZVwiLCBtZXNzYWdlLCBcImVycm9yXCIsIGVycm9yKVxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbi8vIOiOt+WPluW9k+WJjea0u+WKqOagh+etvumhtVxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRUYWIoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIEdldCBhY3RpdmUgdGFicyBpbiBjdXJyZW50IHdpbmRvdyAgXG4gICAgICBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZVxuICAgICAgfSwgKHRhYnMpID0+IHtcbiAgICAgICAgaWYgKCF0YWJzIHx8IHRhYnMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihcIk5vIHRhYiBhdmFpbGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVmFsaWRhdGUgcHJvdG9jb2xcbiAgICAgICAgbGV0IGFjdGl2ZVRhYiA9IHRhYnNbMF07XG4gICAgICAgIC8vbGV0IHVybCA9IG5ldyBVUkwoYWN0aXZlVGFiLnVybCk7XG4gICAgICAgIC8vbGV0IHN1cHBvcnRlZFByb3RvY29scyA9IFtcImh0dHBzOlwiLCBcImh0dHA6XCIsIFwiZnRwOlwiLCBcImZpbGU6XCJdO1xuXG4gICAgICAgIC8vaWYgKCFzdXBwb3J0ZWRQcm90b2NvbHMuaW5jbHVkZXModXJsLnByb3RvY29sKSkge1xuICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHByb3RvY29sIFwiJHt1cmwucHJvdG9jb2x9XCJgKTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coYWN0aXZlVGFiKVxuICAgICAgICBpZiAoYWN0aXZlVGFiID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShhY3RpdmVUYWIpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuLy8g5pqC5YGc5omn6KGM5oyH5a6a5q+r56eSXG5leHBvcnQgZnVuY3Rpb24gc2xlZXAobXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmeSh0aXRsZSwgbWVzc2FnZSkge1xuICB0cnkge1xuICAgIHZhciBpY29uID0gXCIvaWNvbnMvaWNvbi5wbmdcIjtcbiAgICB2YXIgaXNDbG9zZWQgPSBmYWxzZTtcbiAgICB2YXIgbm90aWZpY2F0aW9uSWQgPSBcInBvc3RpbmdfXCIgKyBNYXRoLnJhbmRvbSgpO1xuXG4gICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY3JlYXRlKFxuICAgICAgbm90aWZpY2F0aW9uSWQsIHtcbiAgICAgIHR5cGU6IFwiYmFzaWNcIixcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICBpY29uVXJsOiBpY29uLFxuICAgIH0sXG4gICAgICBmdW5jdGlvbiAobklkKSB7IH1cbiAgICApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpc0Nsb3NlZClcbiAgICAgICAgY2hyb21lLm5vdGlmaWNhdGlvbnMuY2xlYXIobm90aWZpY2F0aW9uSWQsIGZ1bmN0aW9uICh3YXNDbGVhcmVkKSB7IH0pO1xuICAgIH0sIDUwMDApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWxlcnQoZS5tZXNzYWdlKTtcbiAgfVxufSIsImltcG9ydCB7IHNlbmRNZXNzYWdlV2l0aFByb21pc2UgfSBmcm9tIFwiLi4vaW50ZXJuYWwvaGVscGVyL2Nocm9tZS5qc1wiO1xuY29uc29sZS5sb2coXCJwb3B1cC5qcyBsb2FkZWRcIik7XG5cbi8vIEdldCBET01cbnZhciBpbnB1dFRhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXRhZ3NcIiksXG4gIGJ0blJlbW92ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXJlbW92ZVwiKSxcbiAgYnRuTGlicmFyaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbGlicmFyaWVzXCIpLFxuICBidG5TYXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tc2F2ZVwiKSxcbiAgbG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1zaWduXCIpO1xuXG5mdW5jdGlvbiBzaG93RXJyb3IoZXJyKSB7XG4gIHZhciBtc2cgPSB7IHR5cGU6IFwibm90aWZ5XCIsIHRpdGxlOiBcIuezu+e7n+mAmuefpVwiLCBtZXNzYWdlOiBlcnIgfVxuICBzZW5kTWVzc2FnZVdpdGhQcm9taXNlKG1zZykudGhlbigocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHJldHVybiByZXNwO1xuICB9KVxufVxuXG4vLyBBZGQgZXZlbnQgaGFuZGxlclxuYnRuUmVtb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAvLyBTaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gIGJ0blNhdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGJ0blJlbW92ZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJyZW1vdmUtYm9va21hcmtcIixcbiAgfSwgKHJlc3ApID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICB3aW5kb3cuY2xvc2UoKVxuICB9KTtcbn0pO1xuXG5idG5MaWJyYXJpZXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwib3Blbi1saWJyYXJpZXMgc2VudDFcIik7XG4gIHZhciBtc2cgPSB7IHR5cGU6IFwib3Blbi1saWJyYXJpZXNcIiB9XG4gIHNlbmRNZXNzYWdlV2l0aFByb21pc2UobXNnKS50aGVuKChyZXNwKSA9PiB7XG4gICAgY29uc29sZS5sb2cocmVzcCk7XG4gICAgcmV0dXJuIHJlc3A7XG4gIH0pXG59KTtcblxuXG5idG5TYXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAvLyBHZXQgaW5wdXQgdmFsdWVcbiAgdmFyIHRhZ3MgPSBpbnB1dFRhZ3MudmFsdWVcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuICAgIC5zcGxpdCgvXFxzKixcXHMqL2cpXG4gICAgLmZpbHRlcih0YWcgPT4gdGFnLnRyaW0oKSAhPT0gXCJcIilcbiAgICAubWFwKHRhZyA9PiB7XG4gICAgICByZXR1cm4gdGFnLnRyaW0oKTtcbiAgICB9KTtcblxuICAvLyBTaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gIGJ0blNhdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgLy8gU2VuZCBkYXRhXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInNhdmUtYm9va21hcmtcIixcbiAgICB0YWdzOiB0YWdzLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApXG4gICAgaWYgKHJlc3Auc3RhdHVzID09PSBcInN1Y2Nlc3NcIikge1xuICAgICAgd2luZG93LmNsb3NlKClcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvd0Vycm9yKHJlc3AubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcblxufSk7XG5cbmlucHV0VGFncy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgLy8ga2V5Q29kZSAxMyA9IFwiRW50ZXJcIiBrZXkgb24gdGhlIGtleWJvYXJkXG4gIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBidG5TYXZlLmNsaWNrKClcbiAgfVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=