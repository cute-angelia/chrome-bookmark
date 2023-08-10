import { getExtensionConfig } from "./helper.js";
import ifetch from "./iFetch.js"

// async function getExtensionConfig() {
//   var items = await chrome.storage.local.get();

//   return {
//     server: items.server || "",
//     token: items.token || "",
//     username: items.username || "",
//     password: items.password || "",
//     remember: items.remember || false,
//   };
// }

function saveExtensionConfig(cfg) {
  chrome.storage.local.set(cfg)
  return
}

async function logout(server, token) {
  return Promise.resolve();
}

function login(server, username, password, remember) {
  return new Promise((resolve, reject) => {
    // Validate input
    if (server === "") {
      throw new Error("Server must not empty");
    }

    if (username === "") {
      throw new Error("Username must not empty");
    }

    if (password === "") {
      throw new Error("Password must not empty");
    }

    if (typeof remember !== 'boolean') {
      remember = false;
    }

    // Create login URL
    var loginURL = "";
    var loginPath = "api/auth/login";
    try {
      loginURL = new URL(server);
      if (loginURL.pathname.slice(-1) == "/") {
        loginURL.pathname = loginURL.pathname + loginPath;
      } else {
        loginURL.pathname = loginURL.pathname + "/" + loginPath;
      }
    } catch (err) {
      throw new Error(`${server} is not a valid url`);
    }

    ifetch.post(loginURL.href, {
      username: username,
      password: password,
      remember_me: remember,
    }).then(resp => {
      if (resp.code != 0) {
        return reject(resp.msg)
      } else {
        return resolve(resp.data.token);
      }
    }).catch(err => {
      return reject(err.toString())
    })
  });
}

// Define function for UI handler
var errorMessage = document.getElementById("error-message"),
  txtSession = document.getElementById("txt-session"),
  inputServer = document.getElementById("input-server"),
  inputUsername = document.getElementById("input-username"),
  inputPassword = document.getElementById("input-password"),
  inputRemember = document.getElementById("input-remember"),
  btnLogin = document.getElementById("btn-login"),
  loadingSign = document.getElementById("loading-sign"),
  config = {};

function showLoading() {
  btnLogin.style.display = "none";
  loadingSign.style.display = "block";
}

function hideLoading() {
  btnLogin.style.display = "block";
  loadingSign.style.display = "none";
}

function showError(msg) {
  errorMessage.style.display = "block";
  errorMessage.textContent = msg;
}

function hideError() {
  errorMessage.style.display = "none";
}

getExtensionConfig()
  .then(cfg => {
    console.log("cfg", cfg);
    config = cfg;

    if (cfg.token === "") txtSession.textContent = "No active session";
    else txtSession.textContent = `Logged in success by` + cfg.username;

    inputServer.value = cfg.server || "";
    inputUsername.value = cfg.username || "";
    inputPassword.value = cfg.password || "";
    // inputRemember.checked = cfg.remember;
  })
  .catch(err => showError(err));

// Register event listener
async function btnLoginClick() {
  // Get input value
  var server = inputServer.value,
    username = inputUsername.value,
    password = inputPassword.value;
  // remember = inputRemember.checked;

  // Login using input value
  login(server, username, password, true).then(token => {
    // Save input value and token to config
    if (server.endsWith("/")) {
      server = server.slice(0, -1);
    }

    config.server = server;
    config.token = token;
    config.username = username;
    // config.password = password;
    config.remember = true;
    saveExtensionConfig(config);
    txtSession.textContent = `Logged in.`;

    if (token.length > 10) {
      loadingSign.style.display = "none";
    }
    return Promise.resolve();
  }).catch(err => {
    txtSession.textContent = err.toString();
  });
}

btnLogin.addEventListener("click", () => {
  hideError();
  showLoading();

  btnLoginClick()
    .catch(err => showError(err))
    .finally(() => hideLoading());
});