function save_options() {
  var urlMappingString = document.getElementById("urlMappingData").value;
  var urlMappingData = parseJson(urlMappingString);
  if (urlMappingData != undefined) {
    chrome.storage.sync.set({
      urlMappingData: urlMappingData
    }, function() {
      updateStatus("Options saved.");
    });
  }
}

function updateStatus(text) {
  var status = document.getElementById("status");
  status.textContent = text;
  setTimeout(function() {
    status.textContent = "";
  }, 2000);
}

function parseJson(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    updateStatus("Unable to parse JSON");
    return undefined;
  }
}

function restore_options() {
  chrome.storage.sync.get("urlMappingData", function(items) {
    document.getElementById("urlMappingData").value = JSON.stringify(items.urlMappingData, null, 2);
  });
}

function getTemplateMapping() {
  var templateMapping = [],
    page1 = {},
    page2 = {},
    page3 = {};

  page1.description = "This is Facebook";
  page1.host = "www.facebook.com";
  page1.name = "FB";
  page1.color = "#0000FF";
  page1.outlineMatcher = "button";

  page2.description = "Instagram on the web";
  page2.host = "www.instagram.com";
  page2.name = "Insta";
  page2.color = "#0FF000";
  page2.outlineMatcher = "div";

  page3.description = "Stackoverflow!";
  page3.host = "stackoverflow.com";
  page3.name = "SO";
  page3.color = "#00FF0F";
  page3.outlineMatcher = "a";

  templateMapping.push(page1);
  templateMapping.push(page2);
  templateMapping.push(page3);



  document.getElementById("urlMappingData").value = JSON.stringify(templateMapping, null, 2);
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
  save_options);

document.getElementById("generateTemplate").addEventListener("click",
  getTemplateMapping);
