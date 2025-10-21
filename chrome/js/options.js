import store from "../internal/store/store.js";

// login api
async function login(server, username, password, remember) {
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

  // Send login request
  var response = await fetch(loginURL, {
    method: "post",
    body: JSON.stringify({
      username: username,
      password: password,
      remember_me: remember,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    var err = await response.text();
    throw new Error(err);
  }

  var jsonResp = await response.json();
  return jsonResp;
}

// Define function for UI handler
var errorMessage = document.getElementById("error-message"),
  txtSession = document.getElementById("txt-session"),
  inputServer = document.getElementById("input-server"),
  inputUsername = document.getElementById("input-username"),
  inputPassword = document.getElementById("input-password"),
  inputRemember = document.getElementById("input-remember"),
  btnLogin = document.getElementById("btn-login"),
  btnLogout = document.getElementById("btn-logout"),
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

// 读取配置
store.get().then(cfg => {
  if (cfg.token === "") txtSession.textContent = "No active session";
  else txtSession.textContent = `Logged in success by ` + cfg.username;

  inputServer.value = cfg.server;
  inputUsername.value = cfg.username;
  inputPassword.value = cfg.password;

  // Show logout button if token is not empty
  if (cfg.token !== "") {
    btnLogout.style.display = "block";
    btnLogin.style.display = "none";
  }

}).catch(err => showError(err));


// Register event listener
async function btnLoginClick() {
  // Get input value
  var server = inputServer.value,
    username = inputUsername.value,
    password = inputPassword.value;
  // remember = inputRemember.checked;

  // Login using input value
  const resp = await login(server, username, password, true);

  if (resp.code !== 0) {
    throw new Error(resp.msg || "login failed");
  } else {
    const token = resp.data?.token || "";
    // Save input value and token to config
    if (server.endsWith("/")) {
      server = server.slice(0, -1);
    }
    config.server = server;
    config.token = token;
    config.username = username;
    // config.password = password;
    config.remember = true;
    console.log(config, "config");

    // Update store
    store.trigger('save', config)

    // txtSession.textContent = `Logged in.`;
    setTipMsg(`Logged in success by ${username}`);

    if (token.length > 10) {
      loadingSign.style.display = "none";

      // ui
      btnLogout.style.display = "block";
      btnLogin.style.display = "none";
    }

    store.get().then(cfg => {
      console.log(cfg, "cfg");
    })
    return Promise.resolve();
  }
}

function setTipMsg(msg) {
  txtSession.textContent = msg;
  txtSession.style.color = "red";
}

btnLogin.addEventListener("click", () => {
  hideError();
  showLoading();

  btnLoginClick()
    .catch(err => showError(err))
    .finally(() => hideLoading());
});

btnLogout.addEventListener("click", () => {
  hideError();
  hideLoading();

  store.clear();

  inputUsername.value = "";
  inputPassword.value = "";

  // Update UI
  txtSession.textContent = "";
  btnLogout.style.display = "none";
  btnLogin.style.display = "block";
});
