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
    return tag.trim();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL2pzL3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pGQSxJQUFJLFlBQVksU0FBUyxlQUFlLFlBQVksR0FDbEQsWUFBWSxTQUFTLGVBQWUsWUFBWSxHQUNoRCxlQUFlLFNBQVMsZUFBZSxlQUFlLEdBQ3RELFVBQVUsU0FBUyxlQUFlLFVBQVUsR0FDNUMsVUFBVSxTQUFTLGVBQWUsY0FBYztBQUVsRCxTQUFlLFVBQVUsS0FBSztBQUFBO0FBQzVCLFFBQUksT0FBTyxNQUFNLE9BQU8sS0FBSyxNQUFNO0FBQUEsTUFDakMsZUFBZTtBQUFBLE1BQ2YsUUFBUTtBQUFBLElBQ1YsQ0FBQztBQUVELFFBQUksS0FBSyxTQUFTLEdBQUc7QUFDbkIsWUFBTSxJQUFJLE1BQU0sa0JBQWtCO0FBQUEsSUFDcEM7QUFFQSxRQUFJLGVBQWUsT0FBTztBQUN4QixZQUFNLElBQUk7QUFBQSxJQUNaO0FBRUEsV0FBTyxPQUFPLEtBQUssWUFBWSxLQUFLLENBQUMsRUFBRSxJQUFJO0FBQUEsTUFDekMsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQTtBQUdBLFVBQVUsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBRXpDLFVBQVEsTUFBTSxVQUFVO0FBQ3hCLFVBQVEsTUFBTSxVQUFVO0FBQ3hCLFlBQVUsTUFBTSxVQUFVO0FBRzFCLFNBQU8sUUFBUSxZQUFZO0FBQUEsSUFDekIsTUFBTTtBQUFBLEVBQ1IsR0FBRyxDQUFDLFNBQVM7QUFDWCxZQUFRLElBQUksSUFBSTtBQUNoQixXQUFPLE1BQU07QUFBQSxFQUNmLENBQUM7QUFHSCxDQUFDO0FBRUQsYUFBYSxpQkFBaUIsU0FBUyxDQUFDLE1BQU07QUFDNUMsU0FBTyxRQUFRLFlBQVk7QUFBQSxJQUN6QixNQUFNO0FBQUEsRUFDUixHQUFHLENBQUMsU0FBUztBQUNYLFlBQVEsSUFBSSxJQUFJO0FBQ2hCLFdBQU8sTUFBTTtBQUFBLEVBQ2YsQ0FBQztBQUVILENBQUM7QUFFRCxRQUFRLGlCQUFpQixTQUFTLENBQUMsTUFBTTtBQUV2QyxNQUFJLE9BQU8sVUFBVSxNQUNsQixZQUFZLEVBQ1osUUFBUSxRQUFRLEdBQUcsRUFDbkIsTUFBTSxVQUFVLEVBQ2hCLE9BQU8sU0FBTyxJQUFJLEtBQUssTUFBTSxFQUFFLEVBQy9CLElBQUksU0FBTztBQUNWLFdBQU8sSUFBSSxLQUFLO0FBQUEsRUFDbEIsQ0FBQztBQUdILFVBQVEsTUFBTSxVQUFVO0FBQ3hCLFVBQVEsTUFBTSxVQUFVO0FBR3hCLFNBQU8sUUFBUSxZQUFZO0FBQUEsSUFDekIsTUFBTTtBQUFBLElBQ047QUFBQSxFQUNGLEdBQUcsQ0FBQyxTQUFTO0FBQ1gsWUFBUSxJQUFJLElBQUk7QUFDaEIsV0FBTyxNQUFNO0FBQUEsRUFDZixDQUFDO0FBRUgsQ0FBQztBQUVELFVBQVUsaUJBQWlCLFNBQVMsQ0FBQyxNQUFNO0FBRXpDLE1BQUksTUFBTSxZQUFZLElBQUk7QUFDeEIsVUFBTSxlQUFlO0FBQ3JCLFlBQVEsTUFBTTtBQUFBLEVBQ2hCO0FBQ0YsQ0FBQyIsImZpbGUiOiJwb3B1cC5lbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL2pzL3BvcHVwLmpzXCIpO1xuIiwiLy8gR2V0IERPTVxudmFyIGlucHV0VGFncyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtdGFnc1wiKSxcbiAgYnRuUmVtb3ZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcmVtb3ZlXCIpLFxuICBidG5MaWJyYXJpZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1saWJyYXJpZXNcIiksXG4gIGJ0blNhdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1zYXZlXCIpLFxuICBsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXNpZ25cIik7XG5cbmFzeW5jIGZ1bmN0aW9uIHNob3dFcnJvcihlcnIpIHtcbiAgdmFyIHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcbiAgICBhY3RpdmU6IHRydWUsXG4gIH0pO1xuXG4gIGlmICh0YWJzLmxlbmd0aCA8IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJubyB0YWIgYXZhaWxhYmxlXCIpO1xuICB9XG5cbiAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgZXJyID0gZXJyLm1lc3NhZ2U7XG4gIH1cblxuICByZXR1cm4gY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge1xuICAgIHR5cGU6IFwic2hvdy1lcnJvclwiLFxuICAgIG1lc3NhZ2U6IGVycixcbiAgfSk7XG59XG5cbi8vIEFkZCBldmVudCBoYW5kbGVyXG5idG5SZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIC8vIFNob3cgbG9hZGluZyBpbmRpY2F0b3JcbiAgYnRuU2F2ZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgYnRuUmVtb3ZlLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInJlbW92ZS1ib29rbWFya1wiLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHdpbmRvdy5jbG9zZSgpXG4gIH0pO1xuXG5cbn0pO1xuXG5idG5MaWJyYXJpZXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcIm9wZW4tbGlicmFyaWVzXCIsXG4gIH0sIChyZXNwKSA9PiB7XG4gICAgY29uc29sZS5sb2cocmVzcCk7XG4gICAgd2luZG93LmNsb3NlKClcbiAgfSk7XG5cbn0pO1xuXG5idG5TYXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAvLyBHZXQgaW5wdXQgdmFsdWVcbiAgdmFyIHRhZ3MgPSBpbnB1dFRhZ3MudmFsdWVcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuICAgIC5zcGxpdCgvXFxzKixcXHMqL2cpXG4gICAgLmZpbHRlcih0YWcgPT4gdGFnLnRyaW0oKSAhPT0gXCJcIilcbiAgICAubWFwKHRhZyA9PiB7XG4gICAgICByZXR1cm4gdGFnLnRyaW0oKTtcbiAgICB9KTtcblxuICAvLyBTaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gIGJ0blNhdmUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgLy8gU2VuZCBkYXRhXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB0eXBlOiBcInNhdmUtYm9va21hcmtcIixcbiAgICB0YWdzOiB0YWdzLFxuICB9LCAocmVzcCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIHdpbmRvdy5jbG9zZSgpXG4gIH0pO1xuXG59KTtcblxuaW5wdXRUYWdzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZSkgPT4ge1xuICAvLyBrZXlDb2RlIDEzID0gXCJFbnRlclwiIGtleSBvbiB0aGUga2V5Ym9hcmRcbiAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGJ0blNhdmUuY2xpY2soKVxuICB9XG59KVxuIl0sInNvdXJjZVJvb3QiOiIifQ==