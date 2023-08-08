// Get DOM
var inputTags = document.getElementById("input-tags"),
  btnRemove = document.getElementById("btn-remove"),
  btnLibraries = document.getElementById("btn-libraries"),
  btnSave = document.getElementById("btn-save"),
  loading = document.getElementById("loading-sign");

async function showError(err) {
  var tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  if (tabs.length < 1) {
    throw new Error("no tab available");
  }

  if (err instanceof Error) {
    err = err.message;
  }

  return chrome.tabs.sendMessage(tabs[0].id, {
    type: "show-error",
    message: err,
  });
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
    console.log(resp);
    window.close()
  });


});

btnLibraries.addEventListener("click", (e) => {
  chrome.runtime.sendMessage({
    type: "open-libraries",
  }, (resp) => {
    console.log(resp);
    window.close()
  });

});

btnSave.addEventListener("click", (e) => {
  // Get input value
  var tags = inputTags.value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(/\s*,\s*/g)
    .filter(tag => tag.trim() !== "")
    .map(tag => {
      return {
        name: tag.trim()
      };
    });

  // Show loading indicator
  btnSave.style.display = "none";
  loading.style.display = "block";

  // Send data
  chrome.runtime.sendMessage({
    type: "save-bookmark",
    tags: tags,
  }, (resp) => {
    console.log(resp);
    window.close()
  });

});

inputTags.addEventListener("keyup", (e) => {
  // keyCode 13 = "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault()
    btnSave.click()
  }
})
