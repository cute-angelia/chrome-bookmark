
// 发送消息并返回Promise
export function sendMessageWithPromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        // 即使要reject，也要先访问lastError
        const error = chrome.runtime.lastError
        console.log('消息发送失败:', "message", message, "error", error)
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

// 获取当前活动标签页
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

        // console.log(activeTab)
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

// 暂停执行指定毫秒
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
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