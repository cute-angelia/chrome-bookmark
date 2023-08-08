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
        resolve(activeTab);
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