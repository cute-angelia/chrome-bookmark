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
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/js/content-script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./chrome/js/content-script.js":
/*!*************************************!*\
  !*** ./chrome/js/content-script.js ***!
  \*************************************/
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
function getPageContent() {
  return __async(this, null, function* () {
    var html = document.documentElement.innerHTML, title = document.title;
    if (typeof html !== "string") {
      throw new Error("html content not available");
    }
    return {
      title,
      html: html.replace(/\s+/g, " ")
    };
  });
}
function showError(msg) {
  return __async(this, null, function* () {
    document.querySelectorAll(".shiori-ext-dialog-overlay").forEach((node) => node.remove());
    var overlay = document.createElement("div"), dialog = document.createElement("div"), header = document.createElement("p"), body = document.createElement("p"), footer = document.createElement("div"), button = document.createElement("a");
    overlay.className = "shiori-ext-dialog-overlay";
    dialog.className = "shiori-ext-dialog";
    header.className = "shiori-ext-dialog-header";
    body.className = "shiori-ext-dialog-body";
    footer.className = "shiori-ext-dialog-footer";
    header.textContent = "Shiori Error";
    body.textContent = msg;
    button.textContent = "OK";
    button.addEventListener("click", () => {
      overlay.remove();
    });
    overlay.appendChild(dialog);
    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);
    footer.appendChild(button);
    document.body.appendChild(overlay);
  });
}
chrome.runtime.onMessage.addListener((request) => {
  switch (request.type) {
    case "page-content":
      return getPageContent();
    case "show-error":
      return showError(request.message);
      break;
  }
});
const wakeup = () => {
  chrome.runtime.sendMessage(
    {
      cmd: "ping",
      data: {}
    },
    function(resp) {
    }
  );
};
setInterval(wakeup, 3e4);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL2NvbnRlbnQtc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxTQUFlLGlCQUFpQjtBQUFBO0FBQzlCLFFBQUksT0FBTyxTQUFTLGdCQUFnQixXQUNsQyxRQUFRLFNBQVM7QUFFbkIsUUFBSSxPQUFPLFNBQVMsVUFBVTtBQUM1QixZQUFNLElBQUksTUFBTSw0QkFBNEI7QUFBQSxJQUM5QztBQUVBLFdBQU87QUFBQSxNQUNMO0FBQUEsTUFDQSxNQUFNLEtBQUssUUFBUSxRQUFRLEdBQUc7QUFBQSxJQUNoQztBQUFBLEVBQ0Y7QUFBQTtBQUVBLFNBQWUsVUFBVSxLQUFLO0FBQUE7QUFFNUIsYUFBUyxpQkFBaUIsNEJBQTRCLEVBQ25ELFFBQVEsVUFBUSxLQUFLLE9BQU8sQ0FBQztBQUdoQyxRQUFJLFVBQVUsU0FBUyxjQUFjLEtBQUssR0FDeEMsU0FBUyxTQUFTLGNBQWMsS0FBSyxHQUNyQyxTQUFTLFNBQVMsY0FBYyxHQUFHLEdBQ25DLE9BQU8sU0FBUyxjQUFjLEdBQUcsR0FDakMsU0FBUyxTQUFTLGNBQWMsS0FBSyxHQUNyQyxTQUFTLFNBQVMsY0FBYyxHQUFHO0FBRXJDLFlBQVEsWUFBWTtBQUNwQixXQUFPLFlBQVk7QUFDbkIsV0FBTyxZQUFZO0FBQ25CLFNBQUssWUFBWTtBQUNqQixXQUFPLFlBQVk7QUFFbkIsV0FBTyxjQUFjO0FBQ3JCLFNBQUssY0FBYztBQUNuQixXQUFPLGNBQWM7QUFFckIsV0FBTyxpQkFBaUIsU0FBUyxNQUFNO0FBQ3JDLGNBQVEsT0FBTztBQUFBLElBQ2pCLENBQUM7QUFFRCxZQUFRLFlBQVksTUFBTTtBQUMxQixXQUFPLFlBQVksTUFBTTtBQUN6QixXQUFPLFlBQVksSUFBSTtBQUN2QixXQUFPLFlBQVksTUFBTTtBQUN6QixXQUFPLFlBQVksTUFBTTtBQUV6QixhQUFTLEtBQUssWUFBWSxPQUFPO0FBQUEsRUFDbkM7QUFBQTtBQUVBLE9BQU8sUUFBUSxVQUFVLFlBQVksYUFBVztBQUM5QyxVQUFRLFFBQVEsTUFBTTtBQUFBLElBQ3BCLEtBQUs7QUFDSCxhQUFPLGVBQWU7QUFBQSxJQUN4QixLQUFLO0FBQ0gsYUFBTyxVQUFVLFFBQVEsT0FBTztBQUNoQztBQUFBLEVBQ0o7QUFDRixDQUFDO0FBR0QsTUFBTSxTQUFTLE1BQU07QUFDbkIsU0FBTyxRQUFRO0FBQUEsSUFBWTtBQUFBLE1BQ3pCLEtBQUs7QUFBQSxNQUNMLE1BQU0sQ0FBQztBQUFBLElBQ1Q7QUFBQSxJQUNFLFNBQVUsTUFBTTtBQUFBLElBRWhCO0FBQUEsRUFDRjtBQUNGO0FBQ0EsWUFBWSxRQUFRLEdBQUsiLCJmaWxlIjoiY29udGVudC1zY3JpcHQuZW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9qcy9jb250ZW50LXNjcmlwdC5qc1wiKTtcbiIsImFzeW5jIGZ1bmN0aW9uIGdldFBhZ2VDb250ZW50KCkge1xuICB2YXIgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwsXG4gICAgdGl0bGUgPSBkb2N1bWVudC50aXRsZTtcblxuICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJodG1sIGNvbnRlbnQgbm90IGF2YWlsYWJsZVwiKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGl0bGU6IHRpdGxlLFxuICAgIGh0bWw6IGh0bWwucmVwbGFjZSgvXFxzKy9nLCBcIiBcIiksXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNob3dFcnJvcihtc2cpIHtcbiAgLy8gUmVtb3ZlIG9sZCBlcnJvciBkaWFsb2dcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zaGlvcmktZXh0LWRpYWxvZy1vdmVybGF5XCIpXG4gICAgLmZvckVhY2gobm9kZSA9PiBub2RlLnJlbW92ZSgpKTtcblxuICAvLyBDcmVhdGUgbmV3IGVycm9yIGRpYWxvZ1xuICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG4gICAgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKSxcbiAgICBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIiksXG4gICAgZm9vdGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICBvdmVybGF5LmNsYXNzTmFtZSA9IFwic2hpb3JpLWV4dC1kaWFsb2ctb3ZlcmxheVwiO1xuICBkaWFsb2cuY2xhc3NOYW1lID0gXCJzaGlvcmktZXh0LWRpYWxvZ1wiO1xuICBoZWFkZXIuY2xhc3NOYW1lID0gXCJzaGlvcmktZXh0LWRpYWxvZy1oZWFkZXJcIjtcbiAgYm9keS5jbGFzc05hbWUgPSBcInNoaW9yaS1leHQtZGlhbG9nLWJvZHlcIjtcbiAgZm9vdGVyLmNsYXNzTmFtZSA9IFwic2hpb3JpLWV4dC1kaWFsb2ctZm9vdGVyXCI7XG5cbiAgaGVhZGVyLnRleHRDb250ZW50ID0gXCJTaGlvcmkgRXJyb3JcIjtcbiAgYm9keS50ZXh0Q29udGVudCA9IG1zZztcbiAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJPS1wiO1xuXG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIG92ZXJsYXkucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIG92ZXJsYXkuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgZGlhbG9nLmFwcGVuZENoaWxkKGhlYWRlcik7XG4gIGRpYWxvZy5hcHBlbmRDaGlsZChib2R5KTtcbiAgZGlhbG9nLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gIGZvb3Rlci5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG59XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyZXF1ZXN0ID0+IHtcbiAgc3dpdGNoIChyZXF1ZXN0LnR5cGUpIHtcbiAgICBjYXNlIFwicGFnZS1jb250ZW50XCI6XG4gICAgICByZXR1cm4gZ2V0UGFnZUNvbnRlbnQoKTtcbiAgICBjYXNlIFwic2hvdy1lcnJvclwiOlxuICAgICAgcmV0dXJuIHNob3dFcnJvcihyZXF1ZXN0Lm1lc3NhZ2UpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG4vLyDkv53mjIHllKTphpLnirbmgIFcbmNvbnN0IHdha2V1cCA9ICgpID0+IHtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgIGNtZDogXCJwaW5nXCIsXG4gICAgZGF0YToge31cbiAgfSxcbiAgICBmdW5jdGlvbiAocmVzcCkge1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcCk7XG4gICAgfVxuICApO1xufVxuc2V0SW50ZXJ2YWwod2FrZXVwLCAzMDAwMCk7Il0sInNvdXJjZVJvb3QiOiIifQ==