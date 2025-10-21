import store from "../store/store.js";
import { getCurrentTab } from "../helper/chrome.js";
import iFetch from "../helper/iFetch.js";


// 查找本地书签  
function findLocalBookmarkX(url) {
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

function getShioriBookmarkFolder() {
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


function saveLocalBookmark(url, title) {
  var that = this;
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

function removeLocalBookmark(url) {
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


class bookmark {
  // 打开选项页 openOptionsPage
  openOptionsPage() {
    chrome.tabs.create({
      active: true,
      url: "/view/options.html"
    });
  }

  // 打开远程库 openLibraries
  openLibraries() {
    return new Promise(function (resolve, reject) {
      store.get("server").then(server => {
        if (server === "") {
          this.openOptionsPage()
          reject("Server must not empty")
        } else {
          chrome.tabs.create({
            active: true,
            url: server,
          });
          resolve();
        }
      })
    });
  }

  // 保存书签 saveBookmark
  saveBookmark(tags) {
    var that = this;
    return new Promise(function (resolve, reject) {
      store.get().then(cnf => {
        getCurrentTab().then(tab => {
          // 截图
          // 捕获当前选项卡中可见区域的屏幕截图
          chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
            const ihttp = new iFetch(cnf.server, cnf.token)
            const data = {
              url: tab.url,
              title: tab.title,
              from: "ext",
              tags: tags.join(","),
              imgbase64: dataUrl,
            }
            ihttp.post("/api/bookmarks/add", data).then(resp => {
              if (resp.code != 0) {
                return reject(resp.msg)
              } else {
                // Save to local bookmark
                saveLocalBookmark(data.url, data.title);
                return resolve();
              }
            }).catch(err => {
              console.log(err.toString());
              if (err.toString().includes("login")) {
                that.openOptionsPage()
              } else {
                return reject(err.toString())
              }
            })
          });
        })
      });
    }).catch(err => {
      console.log(err.toString());
    })
  }

  // 删除书签 removeBookmark
  removeBookmark() {
    var that = this;
    return new Promise(function (resolve, reject) {
      store.get().then(cnf => {
        getCurrentTab().then(tab => {
          const ihttp = new iFetch(cnf.server, cnf.token)
          var data = {
            url: tab.url,
          }
          ihttp.post("/api/bookmarks/deleteUrl", data).then(resp => {
            if (resp.code != 0) {
              console.log(resp.msg)
            }
            // Remove local bookmark
            removeLocalBookmark(data.url);
            return resolve();
          }).catch(err => {
            if (err.toString().includes("login")) {
              that.openOptionsPage()
            } else {
              return reject(err.toString())
            }
          })
        })
      })
    });
  }

  updateIcon() {
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
      return findLocalBookmarkX(tab.url).then(local => {
        const iconUpdate = local ? {
          path: {
            16: "icons/action-bookmarked-16.png",
            32: "icons/action-bookmarked-32.png",
            64: "icons/action-bookmarked-64.png"
          }
        } : icon; // 确保icon有默认值

        return chrome.action.setIcon(iconUpdate);
      });
    }).catch(err => console.error("图标更新失败:", err));
  }





}

export default new bookmark()