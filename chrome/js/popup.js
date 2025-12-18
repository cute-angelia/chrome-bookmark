import { sendMessageWithPromise } from "../internal/helper/chrome.js";
console.log("popup.js loaded");

// Get DOM
var inputTags = document.getElementById("input-tags"),
  btnRemove = document.getElementById("btn-remove"),
  btnLibraries = document.getElementById("btn-libraries"),
  btnSave = document.getElementById("btn-save"),
  loading = document.getElementById("loading-sign");

var isButtonDisabled = false;

function showError(err) {
  var msg = { type: "notify", title: "系统通知", message: err }
  sendMessageWithPromise(msg).then((resp) => {
    console.log(resp);
    return resp;
  })
}

// Add event handler
btnRemove.addEventListener("click", (e) => {
  // Show loading indicator
  btnSave.style.display = "none";
  loading.style.display = "block";
  btnRemove.style.display = "none";


  chrome.runtime.sendMessage({
    type: "remove-bookmark",
  }, (resp) => {
    // console.log(resp);
    window.close()
  });
});

btnLibraries.addEventListener("click", (e) => {
  console.log("open-libraries sent1");
  var msg = { type: "open-libraries" }
  sendMessageWithPromise(msg).then((resp) => {
    console.log(resp);
    return resp;
  })
});


btnSave.addEventListener("click", (e) => {
  if (isButtonDisabled) return;
  isButtonDisabled = true;

  // Get input value
  var tags = inputTags.value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(/\s*,\s*/g)
    .filter(tag => tag.trim() !== "")
    .map(tag => {
      return tag.trim();
    });

  // Show loading indicator
  btnSave.style.display = "none";
  loading.style.display = "block";

  // Send data
  chrome.runtime.sendMessage({
    type: "save-bookmark",
    tags: tags,
  }, (resp) => {
    console.log(resp)
    if (resp.status === "success") {
      window.close()
    } else {
      showError(resp.message);
      isButtonDisabled = false;
    }
  });

});

inputTags.addEventListener("keyup", (e) => {
  // keyCode 13 = "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault()
    btnSave.click()
  }
})
