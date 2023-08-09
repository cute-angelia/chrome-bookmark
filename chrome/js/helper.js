export function getExtensionConfig() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(null, function (items) {
        var token = items.token || "";
        var server = items.server || "";
        if (token === "") {
          return reject("no active session, please login first");
        }
        if (server === "") {
          return reject("server url is not specified");
        }
        return resolve({
          token: token,
          server: server
        });
      });

    } catch (err) {
      return reject(err);
    }
  });
}

export function getCurrentTab() {
  return new Promise((resolve, reject) => {
    try {
      // Get active tabs in current window  
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        if (!tabs || tabs.length < 1) {
          // throw new Error("No tab available");
        }
        // Validate protocol
        let activeTab = tabs[0];
        //let url = new URL(activeTab.url);
        //let supportedProtocols = ["https:", "http:", "ftp:", "file:"];

        //if (!supportedProtocols.includes(url.protocol)) {
        // throw new Error(`Unsupported protocol "${url.protocol}"`);
        //}

        console.log(activeTab)
        if (activeTab == undefined) {
          reject()
        } else {
          resolve(activeTab);
        }

      });
    } catch (err) {
      reject(err);
    }
  });
}

export function openOptionsPage() {
  chrome.tabs.create({
    url: "/view/options.html"
  });
}

export function getShioriBookmarkFolder() {
  return new Promise((resolve) => {
    // TODO:
    // I'm not sure it's the most efficient way, but it's the simplest.
    // We want to put Shiori folder in `Other bookmarks`, which id different depending on chrome.
    // In Firefox, its id is `unfiled_____` while in Chrome the id is `2`.
    var parentId = "",
      runtimeUrl = chrome.runtime.getURL("/");

    if (runtimeUrl.startsWith("moz")) {
      parentId = "unfiled_____";
    } else if (runtimeUrl.startsWith("chrome")) {
      parentId = "2";
    } else {
      throw new Error("right now extension only support firefox and chrome")
    }
    // Check if the parent folder already has Shiori folder
    chrome.bookmarks.getChildren(parentId, function (children) {
      var shiori = children.find(el => el.url == null && el.title === "Shiori");
      if (!shiori) {
        chrome.bookmarks.create({
          title: "Shiori",
          parentId: parentId
        }, shiori => {
          return resolve(shiori)
        });
      } else {
        return resolve(shiori)
      }
    });
  })
}

export function findLocalBookmark(url) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then(shioriFolder => {
      chrome.bookmarks.search({
        url: url,
      }, existingBookmarks => {
        var idx = existingBookmarks.findIndex(book => {
          return book.parentId === shioriFolder.id;
        });
        if (idx >= 0) {
          return resolve(existingBookmarks[idx]);
        } else {
          return resolve();
        }
      })
    })

  });
}

export function saveLocalBookmark(url, title) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then(shioriFolder => {
      chrome.bookmarks.search({
        url: url,
      }, existingBookmarks => {
        var idx = existingBookmarks.findIndex(book => {
          return book.parentId === shioriFolder.id;
        });

        if (idx === -1) {
          chrome.bookmarks.create({
            url: url,
            title: title,
            parentId: shioriFolder.id,
          }, () => {
            resolve();
          });
        }
        resolve();
      })
    })
  });
}

export function removeLocalBookmark(url) {
  return new Promise((resolve) => {
    getShioriBookmarkFolder().then(shioriFolder => {
      chrome.bookmarks.search({
        url: url,
      }, existingBookmarks => {
        existingBookmarks.forEach(book => {
          if (book.parentId !== shioriFolder.id) return;
          chrome.bookmarks.remove(book.id);
        });
        return resolve()
      })
    })
  });
}

export function notify(title, message) {
  try {
    var icon = "/icons/icon.png";
    var isClosed = false;
    var notificationId = "posting_" + Math.random();

    chrome.notifications.create(
      notificationId, {
      type: "basic",
      title: title,
      message: message,
      iconUrl: icon,
    },
      function (nId) { }
    );
    setTimeout(function () {
      if (!isClosed)
        chrome.notifications.clear(notificationId, function (wasCleared) { });
    }, 5000);
  } catch (e) {
    alert(e.message);
  }
}