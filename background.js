var currentTabsMatchObject = {};

chrome.tabs.onActivated.addListener(function(activeInfo) {
  setTabDetails(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  setTabDetails(tabId);
});

function setTabDetails(tabId) {
  chrome.tabs.get(tabId, function(activeTab) {
    getEnvironment(activeTab.url, function(environment) {
      if (environment != undefined) {
        chrome.tabs.executeScript(activeTab.id, {
          code: "var titlePrefix = '" + environment.name + "', description = '" + environment.description + "';"
        }, function() {
          chrome.tabs.executeScript(activeTab.id, {
            file: "insertScript.js"
          });
        });

        chrome.tabs.insertCSS(activeTab.id, {
          file: "insertStyle.css"
        });

        chrome.tabs.insertCSS(activeTab.id, {
          code: "#environmentBox { background-color: " + environment.color + "; border-color: " + lightenDarkenColor(environment.color, -40) + ";}"
        });

        if (environment.outlineMatcher != undefined) {
          chrome.tabs.executeScript(activeTab.id, {
            code: "var cssMatcher = '" + environment.outlineMatcher + "', outlineColor = '" + environment.color + "';"
          }, function() {
            chrome.tabs.executeScript(activeTab.id, {
              file: "outlineScript.js"
            });
          });
        }

        chrome.pageAction.setIcon({
          "tabId": activeTab.id,
          "imageData": getIconImageData(environment.color)
        });
        chrome.pageAction.show(tabId);
        currentTabsMatchObject = environment;
      }
    });
  });
}


CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

function getIconImageData(color) {
  if (color === undefined) {
    return undefined;
  }
  var canvas = document.createElement("canvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(9.5, 9.5, 9.5, 0, Math.PI * 2, true); // Outer circle
    ctx.fill();

    return ctx.getImageData(0, 0, 19, 19);
  }
}

function getEnvironment(url, callback) {
  var parsedUrl = parseURL(url);
  if (parsedUrl.protocol != "http:" && parsedUrl.protocol != "https:") {
    typeof callback === "function" && callback(undefined);
  }
  if (parsedUrl.host != undefined && parsedUrl.host != "") {
    chrome.storage.sync.get("urlMappingData", function(items) {
      typeof callback === "function" && callback(
        items.urlMappingData.find(function(env, index, arr) {
          return env.host === parsedUrl.host;
        })
      );
    });
  } else {
    typeof callback === "function" && callback(undefined);
  }
}


function parseURL(url) {
  var parser = document.createElement("a"),
    searchObject = {},
    queries, split, i;
  parser.href = url;
  queries = parser.search.replace(/^\?/, "").split("&");
  for (i = 0; i < queries.length; i++) {
    split = queries[i].split("=");
    searchObject[split[0]] = split[1];
  }
  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject: searchObject,
    hash: parser.hash
  };
}

function lightenDarkenColor(col, amt) {
  var usePound = true;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}
