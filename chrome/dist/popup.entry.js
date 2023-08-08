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

/***/ "./chrome/js/popup.js":
/*!****************************!*\
  !*** ./chrome/js/popup.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
    console.log(resp);
    window.close();
  });
});
btnLibraries.addEventListener("click", (e) => {
  chrome.runtime.sendMessage({
    type: "open-libraries"
  }, (resp) => {
    console.log(resp);
    window.close();
  });
});
btnSave.addEventListener("click", (e) => {
  var tags = inputTags.value.toLowerCase().replace(/\s+/g, " ").split(/\s*,\s*/g).filter((tag) => tag.trim() !== "").map((tag) => {
    return {
      name: tag.trim()
    };
  });
  btnSave.style.display = "none";
  loading.style.display = "block";
  chrome.runtime.sendMessage({
    type: "save-bookmark",
    tags
  }, (resp) => {
    console.log(resp);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGQSxJQUFJLFlBQVksU0FBUyxlQUFlLFlBQVksR0FDbEQsWUFBWSxTQUFTLGVBQWUsWUFBWSxHQUNoRCxlQUFlLFNBQVMsZUFBZSxlQUFlLEdBQ3RELFVBQVUsU0FBUyxlQUFlLFVBQVUsR0FDNUMsVUFBVSxTQUFTLGVBQWUsY0FBYztBQUVsRCxTQUFlLFVBQVUsS0FBSztBQUFBO0FBQzVCLFFBQUksT0FBTyxNQUFNLE9BQU8sS0FBSyxNQUFNO0FBQUEsTUFDakMsZUFBZTtBQUFBLE1BQ2YsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUVELFFBQUksS0FBSyxTQUFTLEdBQUc7QUFDbkIsWUFBTSxJQUFJLE1BQU0sa0JBQWtCO0FBQUEsSUFDcEM7QUFFQSxRQUFJLGVBQWUsT0FBTztBQUN4QixZQUFNLElBQUk7QUFBQSxJQUNaO0FBRUEsV0FBTyxPQUFPLEtBQUssWUFBWSxLQUFLLENBQUMsRUFBRSxJQUFJO0FBQUEsTUFDekMsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUdBLFVBQVUsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBRXpDLFVBQVEsTUFBTSxVQUFVO0FBQ3hCLFVBQVEsTUFBTSxVQUFVO0FBQ3hCLFlBQVUsTUFBTSxVQUFVO0FBRzFCLFNBQU8sUUFBUSxZQUFZO0FBQUEsSUFDekIsTUFBTTtBQUFBLEVBQ1IsR0FBRyxDQUFDLFNBQVM7QUFDWCxZQUFRLElBQUksSUFBSTtBQUNoQixXQUFPLE1BQU07QUFBQSxFQUNmLENBQUM7QUFHSCxDQUFDO0FBRUQsYUFBYSxpQkFBaUIsU0FBUyxDQUFDLE1BQU07QUFDNUMsU0FBTyxRQUFRLFlBQVk7QUFBQSxJQUN6QixNQUFNO0FBQUEsRUFDUixHQUFHLENBQUMsU0FBUztBQUNYLFlBQVEsSUFBSSxJQUFJO0FBQ2hCLFdBQU8sTUFBTTtBQUFBLEVBQ2YsQ0FBQztBQUVILENBQUM7QUFFRCxRQUFRLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUV2QyxNQUFJLE9BQU8sVUFBVSxNQUNsQixZQUFZLEVBQ1osUUFBUSxRQUFRLEdBQUcsRUFDbkIsTUFBTSxVQUFVLEVBQ2hCLE9BQU8sU0FBTyxJQUFJLEtBQUssTUFBTSxFQUFFLEVBQy9CLElBQUksU0FBTztBQUNWLFdBQU87QUFBQSxNQUNMLE1BQU0sSUFBSSxLQUFLO0FBQUEsSUFDakI7QUFBQSxFQUNGLENBQUM7QUFHSCxVQUFRLE1BQU0sVUFBVTtBQUN4QixVQUFRLE1BQU0sVUFBVTtBQUd4QixTQUFPLFFBQVEsWUFBWTtBQUFBLElBQ3pCLE1BQU07QUFBQSxJQUNOO0FBQUEsRUFDRixHQUFHLENBQUMsU0FBUztBQUNYLFlBQVEsSUFBSSxJQUFJO0FBQ2hCLFdBQU8sTUFBTTtBQUFBLEVBQ2YsQ0FBQztBQUVILENBQUM7QUFFRCxVQUFVLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUV6QyxNQUFJLE1BQU0sWUFBWSxJQUFJO0FBQ3hCLFVBQU0sZUFBZTtBQUNyQixZQUFRLE1BQU07QUFBQSxFQUNoQjtBQUNGLENBQUMiLCJmaWxlIjoicG9wdXAuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9wb3B1cC5qc1wiKTtcbiIsIi8vIEdldCBET01cbnZhciBpbnB1dFRhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXRhZ3NcIiksXG4gIGJ0blJlbW92ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXJlbW92ZVwiKSxcbiAgYnRuTGlicmFyaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tbGlicmFyaWVzXCIpLFxuICBidG5TYXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tc2F2ZVwiKSxcbiAgbG9hZGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1zaWduXCIpO1xuXG5hc3luYyBmdW5jdGlvbiBzaG93RXJyb3IoZXJyKSB7XG4gIHZhciB0YWJzID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXG4gICAgYWN0aXZlOiB0cnVlLFxuICB9KTtcblxuICBpZiAodGFicy5sZW5ndGggPCAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gdGFiIGF2YWlsYWJsZVwiKTtcbiAgfVxuXG4gIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIGVyciA9IGVyci5tZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYnNbMF0uaWQsIHtcbiAgICB0eXBlOiBcInNob3ctZXJyb3JcIixcbiAgICBtZXNzYWdlOiBlcnIsXG4gIH0pO1xufVxuXG4vLyBBZGQgZXZlbnQgaGFuZGxlclxuYnRuUmVtb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAvLyBTaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gIGJ0blNhdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gIGJ0blJlbW92ZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJyZW1vdmUtYm9va21hcmtcIixcbiAgfSwgKHJlc3ApID0+IHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICB3aW5kb3cuY2xvc2UoKVxuICB9KTtcblxuXG59KTtcblxuYnRuTGlicmFyaWVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogXCJvcGVuLWxpYnJhcmllc1wiLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHdpbmRvdy5jbG9zZSgpXG4gIH0pO1xuXG59KTtcblxuYnRuU2F2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgLy8gR2V0IGlucHV0IHZhbHVlXG4gIHZhciB0YWdzID0gaW5wdXRUYWdzLnZhbHVlXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAuc3BsaXQoL1xccyosXFxzKi9nKVxuICAgIC5maWx0ZXIodGFnID0+IHRhZy50cmltKCkgIT09IFwiXCIpXG4gICAgLm1hcCh0YWcgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogdGFnLnRyaW0oKVxuICAgICAgfTtcbiAgICB9KTtcblxuICAvLyBTaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gIGJ0blNhdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgLy8gU2VuZCBkYXRhXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInNhdmUtYm9va21hcmtcIixcbiAgICB0YWdzOiB0YWdzLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHdpbmRvdy5jbG9zZSgpXG4gIH0pO1xuXG59KTtcblxuaW5wdXRUYWdzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xuICAvLyBrZXlDb2RlIDEzID0gXCJFbnRlclwiIGtleSBvbiB0aGUga2V5Ym9hcmRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGJ0blNhdmUuY2xpY2soKVxuICB9XG59KVxuIl0sInNvdXJjZVJvb3QiOiIifQ==