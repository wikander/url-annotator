/* globals titlePrefix, description */

if (document.getElementById("environmentBox") === null) {
  var environmentBox = document.createElement("div");
  environmentBox.id = "environmentBox";
  document.body.appendChild(environmentBox);
}

if (!document.title.startsWith(titlePrefix)) {
  document.title = titlePrefix + "-" + document.title;
}

document.getElementById("environmentBox").innerText = description;
