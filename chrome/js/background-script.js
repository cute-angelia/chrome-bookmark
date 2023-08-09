import { getExtensionConfig, getCurrentTab, openOptionsPage, getShioriBookmarkFolder, saveLocalBookmark, removeLocalBookmark, findLocalBookmark } from "./helper.js";
import ifetch from "./iFetch.js"

async function getPageContent(tab) {
  try {
    var content = await chrome.tabs.sendMessage(tab.id, {
      type: "page-content"
    });
    return content;
  } catch {
    return {};
  }
}

function openLibraries() {
  getExtensionConfig().then(config => {
    return chrome.tabs.create({
      active: true,
      url: config.server,
    });
  })
}

function removeBookmark() {
  return new Promise(function (resolve, reject) {
    getCurrentTab().then(tab => {
      ifetch.post("/api/bookmarks/deleteUrl", {
        url: tab.url,
      }).then(data => {
        if (data.code != 0) {
          return reject(data.msg)
        } else {
          // Remove local bookmark
          removeLocalBookmark(tab.url);
          return resolve();
        }
      }).catch(err => {
        console.log(err.toString());
        if (err.toString().includes("login")) {
          openOptionsPage()
        } else {
          return reject(err.toString())
        }
      })
    })
  })

}

function saveBookmark(tags) {
  // Get value from async function
  return new Promise(function (resolve, reject) {
    getCurrentTab().then(tab => {
      // 截图
      // 捕获当前选项卡中可见区域的屏幕截图
      chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        ifetch.post("/api/bookmarks/add", {
          url: tab.url,
          title: tab.title,
          from: "ext",
          tags: tags.join(","),
          imgbase64: dataUrl
        }).then(data => {
          if (data.code != 0) {
            return reject(data.msg)
          } else {
            // Save to local bookmark
            saveLocalBookmark(tab.url, tab.title);
            return resolve();
          }
        }).catch(err => {
          console.log(err.toString());
          if (err.toString().includes("login")) {
            openOptionsPage()
          } else {
            return reject(err.toString())
          }
        })
      });

    })
  });
}

function updateIcon() {
  // Set initial icon
  var runtimeUrl = chrome.runtime.getURL("/"),
    icon = {
      path: {
        16: "icons/action-default-16.png",
        32: "icons/action-default-32.png",
        64: "icons/action-default-64.png"
      }
    };

  // Firefox allows using empty object as default icon.
  // This way, Firefox will use default_icon that defined in manifest.json
  if (runtimeUrl.startsWith("moz")) {
    icon = {};
  }

  // Get current active tab

  getCurrentTab().then(tab => {

    findLocalBookmark(tab.url).then(local => {
      if (local) icon.path = {
        16: "icons/action-bookmarked-16.png",
        32: "icons/action-bookmarked-32.png",
        64: "icons/action-bookmarked-64.png"
      }

      return chrome.browserAction.setIcon(icon);
    })

  })
}

// Define event handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var task = Promise.resolve();

  switch (request.type) {
    case "open-libraries":
      task = new Promise((resolve, reject) => {
        openLibraries()
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject(err)
          });
      });
      break;
    case "remove-bookmark":
      task = new Promise((resolve, reject) => {
        removeBookmark()
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject(err)
          });
      });
      break;
    case "save-bookmark":
      task = new Promise((resolve, reject) => {
        saveBookmark(request.tags)
          .then(() => {
            console.log("save-bookmark success");
            resolve()
          })
          .catch(err => {
            console.log("save-bookmark error", err);
            reject(err)
          });
      });
      break;
  }

  return task;
});

// Add handler for icon change
function updateActiveTab() {
  updateIcon().catch(err => console.error(err.message));
}

chrome.bookmarks.onCreated.addListener(updateActiveTab);
chrome.bookmarks.onRemoved.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.windows.onFocusChanged.addListener(updateActiveTab);
updateActiveTab();