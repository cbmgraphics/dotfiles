var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58644010-2']);
_gaq.push(['_trackPageview', 'background.html']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name == "pageview") {
     _gaq.push(['_trackPageview', 'Default.html']);
  } else if (message.name == "search-event") {
     _gaq.push(['_trackEvent', 'search', 'click']);
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  if ('install' == details.reason) {
    _gaq.push(['_trackPageview', 'install.html']);
  }
});
