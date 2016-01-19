var background = chrome.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("matchedRule").innerHTML = JSON.stringify(background.currentTabsMatchObject, null, 2);
});
