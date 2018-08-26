/*
http://developer.chrome.com/extensions/browsingData.html
http://developer.chrome.com/extensions/contentSettings.html
http://developer.chrome.com/extensions/cookies.html
http://developer.chrome.com/extensions/history.html
http://developer.chrome.com/extensions/management.html
http://developer.chrome.com/extensions/privacy.html
http://developer.chrome.com/extensions/proxy.html
*/

var _gaq = _gaq || [];
var abpId = "cfhdojbkjhnklbpkdaibdccddilifddb";
var httpsId = "gcbommkclmclpchllfjekcdonpmejbdp";

(function()
{
  function init()
  {
    var features = document.querySelectorAll("*[data-feature]");
    var feature;
    for (var i = 0, len = features.length; i < len; i++)
    {
      feature = FEATURES[features[i].dataset.feature];
      
      if (!feature)
      {
        continue;
      }
      
      feature.done.bind(features[i])(function(isDone)
      {
        if (isDone)
        {
          markAsDone(this);
        }
        else
        {
          var onclick = FEATURES[this.dataset.feature].exec.bind(this);
          this.addEventListener("click", function()
          {
            var count = 0;
            
            function clear(count)
            {
              if (count < 10)
              {
                try
                {
                  onclick();
                  this.removeEventListener(onclick);
                }
                catch(ex)
                {
                  setTimeout(clear, 100, ++count)
                  console.error(ex.message);
                  console.log(ex.stack);
                }
              }
            }
            
            clear(count);
          }.bind(this), false);
        }
      }.bind(features[i]));
    }
    
    var images = document.querySelectorAll("section .title img");
    for (var i = 0, len = images.length; i < len; i++)
    {
      images[i].style.webkitFilter = "opacity(70%) hue-rotate(" + (i * 30) + "deg)";
    }
    
    // init tracking
    _gaq.push(["_setAccount", "UA-37216075-2"]);
    _gaq.push(["_setSiteSpeedSampleRate", 25]);
    _gaq.push(["_trackPageview"]);
    _gaq.push(["_trackPageLoadTime"]);
    (function()
    {
      var ga = document.createElement("script");
      ga.type = "text/javascript";
      ga.async = true;
      ga.src = "https://ssl.google-analytics.com/ga.js";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(ga, s);
    })();
  }
  
  document.addEventListener("DOMContentLoaded", init, false);
})();

function removeData(element, options)
{
  chrome.browsingData.remove({}, options, function()
  {
    //element.classList.add("again");
  });
}

function checkDone(element, category, key, value, callback)
{
  try
  {
    chrome.privacy[category][key].get({}, function(details)
    {
      if (details.levelOfControl === "controllable_by_this_extension")
      {
        callback(details.value == value);
      }
      else
      {
        element.parentNode.removeChild(element);
      }
    });
  }
  catch(ex)
  {
    callback(true);
    //console.error(ex.message);
    //console.log(ex.stack);
  }
}

function setEnabled(element, category, key, value)
{
  checkDone(element, category, key, value, function(isDone)
  {
    if (isDone)
    {
      chrome.privacy[category][key].set({value: value}, function()
      {
        if (chrome.extension.lastError === undefined)
        {
          markAsDone(element);
        }
      });
    }
  });
}

function markAsDone(element)
{
  if (element.nodeName == "SECTION")
  {
    element.classList.add("done");
  }
  else
  {
    if (element.parentNode)
    {
      markAsDone(element.parentNode);
    }
  }
}

function showDialog(title, text, callback)
{
  var confirmed = confirm(title + ": \n" + text);
  if (confirmed)
  {
    callback();
  }
}

var SETTINGS = {
  "adchoices": "http://www.aboutads.info/choices/",
  "dnt": "chrome://settings/search#Do%20Not%20Track",
  "facebook": "https://www.facebook.com/settings/?tab=account",
  "facebook-ads": "https://www.facebook.com/settings?tab=ads",
  "facebook-privacy": "https://www.facebook.com/settings/?tab=privacy",
  "facebook-security": "https://www.facebook.com/settings/?tab=security",
  "google": "https://www.google.com/settings/account",
  "google-ads": "https://www.google.com/settings/ads/onweb/",
  "google-dashboard": "https://www.google.com/dashboard/",
  "google-security": "https://www.google.com/settings/security",
  "twitter": "https://twitter.com/settings/account"
};

var FEATURES = {
  clearHistory: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {history: true});
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "history"]);
    }
  },
  clearCookies: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {cookies: true});
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "cookies"]);
    }
  },
  clearCache: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {
        appcache: true,
        cache: true
      });
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "cache"]);
    }
  },
  clearDownloads: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {downloads: true});
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "downloads"]);
    }
  },
  clearStorage: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {
        fileSystems: true,
        formData: true,
        indexedDB: true,
        localStorage: true,
        webSQL: true
      });
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "storage"]);
    }
  },
  clearPluginData: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      removeData(this, {pluginData: true});
      markAsDone(this);
      _gaq.push(["_trackEvent", "feature", "clear", "plugin-data"]);
    }
  },
  enableAdblocking: {
    done: function(callback)
    {
      chrome.management.get(abpId, function(ext)
      {
        if (ext)
        {
          callback(ext.enabled);
          _gaq.push(["_trackEvent", "adblocking", "check", (ext.enable) ? "enabled" : "disabled"]);
        }
        else
        {
          callback(false);
        }
        _gaq.push(["_trackEvent", "adblocking", "check", (ext) ? "installed" : "not-installed"]);
      });
    },
    exec: function()
    {
      chrome.management.get(abpId, function(ext)
      {
        var install = !ext;
        var enable = ext && !ext.enabled;
        
        if (install)
        {
          // install
          chrome.tabs.create({
            url: "https://chrome.google.com/webstore/detail/" + abpId
          });
          
          var listener = function(ext)
          {
            if (ext.id == abpId)
            {
              chrome.management.onInstalled.removeListener(listener);
              markAsDone(this);
              _gaq.push(["_trackEvent", "adblockplus", "install", "finished"]);
            }
          }
          chrome.management.onInstalled.addListener(listener.bind(this));
        }
        else if (enable)
        {
          // enable
          chrome.management.setEnabled(abpId, true, function()
          {
            this.removeEventListener(this.onClick);
            markAsDone(this);
            _gaq.push(["_trackEvent", "adblockplus", "enable", "finished"]);
          }.bind(this));
        }
      }.bind(this));
      _gaq.push(["_trackEvent", "feature", "enable", "adblocking"]);
    }
  },
  enableHTTPS: {
    done: function(callback)
    {
      chrome.management.get(httpsId, function(ext)
      {
        if (ext)
        {
          callback(ext.enabled);
          _gaq.push(["_trackEvent", "https", "check", (ext.enabled) ? "enabled" : "disabled"]);
        }
        else
        {
          callback(false);
        }
        _gaq.push(["_trackEvent", "https", "check", (ext) ? "installed" : "not-installed"]);
      });
    },
    exec: function()
    {
      chrome.management.get(httpsId, function(ext)
      {
        var install = !ext;
        var enable = ext && !ext.enabled;
        
        if (install)
        {
          // install
          chrome.tabs.create({
            url: "https://chrome.google.com/webstore/detail/" + httpsId
          });
          
          var listener = function(ext)
          {
            if (ext.id == httpsId)
            {
              chrome.management.onInstalled.removeListener(listener);
              markAsDone(this);
              _gaq.push(["_trackEvent", "https-everywhere", "install", "finished"]);
            }
          }
          chrome.management.onInstalled.addListener(listener.bind(this));
        }
        else if (enable)
        {
          // enable
          chrome.management.setEnabled(httpsId, true, function()
          {
            this.removeEventListener(this.onClick);
            markAsDone(this);
            _gaq.push(["_trackEvent", "https-everywhere", "enable", "finished"]);
          }.bind(this));
        }
      }.bind(this));
      _gaq.push(["_trackEvent", "feature", "enable", "https"]);
    }
  },
  manageAccount: {
    done: function(callback)
    {
      callback(false);
    },
    exec: function()
    {
      chrome.tabs.create({url: SETTINGS[this.dataset.service]});
      _gaq.push(["_trackEvent", "feature", "manage", this.dataset.service]);
    }
  }
};
