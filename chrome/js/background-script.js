import bookmark from "../internal/bookmark/bookmark.js";
import { notify } from "../internal/helper/chrome.js";

console.log("background-script.js loaded");

// 事件 - 监听
chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponseParam
) {

  var responseStatus = {
    bCalled: false
  }

  console.log("background-script.js onMessage", request);

  function sendResponse(obj) {
    console.log('请求 onMessage -> ', request, obj);
    //dummy wrapper to deal with exceptions and detect async
    try {
      sendResponseParam(obj)
    } catch (e) {
      //error handling
    }
    responseStatus.bCalled = true
  }

  switch (request.cmd || request.method || request.type) {
    case 'ping':
      sendResponse({
        'msg': 'pong'
      })
      break

    case 'notify':
      notify(request.title, request.message)
      sendResponse({
        'status': 'success'
      })
      break

    // 打开远程库 openLibraries
    case "open-libraries":
      bookmark.openLibraries();
      sendResponse({ status: "success" });
      break;

    // 保存书签 saveBookmark
    case "save-bookmark":
      bookmark.saveBookmark(request.tags).then(resp => {
        bookmark.updateIcon();
        sendResponse({ status: "success" });
      }).catch(err => {
        console.error(err);
        sendResponse({ status: "error", message: err });
      });
      break;

    // 删除书签 removeBookmark
    case "remove-bookmark":
      bookmark.removeBookmark().then(resp => {
        bookmark.updateIcon();
      });
      sendResponse({ status: "success" });
      break;



    // 获取配置 getConfig
    case 'GetConfigList':
      Store.get("configList").then(configList => {
        var data = {
          "configList": configList
        }
        sendResponse(data)
      });
      break

    case 'getDefaultConfig':
      sendResponse(Store.getDefaultConfig())
      break


    case 'saveConfig':
      Store.setCfg(request.data.key, request.data.value)

      try {
        var newdata = JSON.stringify(request.data.value)
        JSON.parse(newdata)
        notify("系统通知", "配置保存成功")
      } catch (error) {
        notify("系统通知", "保存失败")
      }


      // 重置
      setTimeout(() => {
        initContextMenus()
      }, 300);

      sendResponse({})
      break
  }

  //if its set, the call wasn't async, else it is.
  if (!responseStatus.bCalled) {
    return true
  }
})

// 安装时打开 onboarding.html
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    bookmark.openOptionsPage();
  }
});

// 监听标签页状态变化
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // 检查标签页是否已完成加载
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('标签页加载完成:', {
      id: tabId,
      url: tab.url,
      title: tab.title,
      windowId: tab.windowId
    });

    // 可以在这里添加更多处理逻辑
    // 例如：注入内容脚本、发送消息等
    bookmark.updateIcon();
  }
});

chrome.bookmarks.onCreated.addListener(bookmark.updateIcon);
chrome.bookmarks.onRemoved.addListener(bookmark.updateIcon);


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

