/* globals cssMatcher, outlineColor */
var matched = document.querySelectorAll(cssMatcher);
for (var i = 0; i < matched.length; ++i) {
  var item = matched[i];

  item.style.outline = "2px solid " + outlineColor;
}
