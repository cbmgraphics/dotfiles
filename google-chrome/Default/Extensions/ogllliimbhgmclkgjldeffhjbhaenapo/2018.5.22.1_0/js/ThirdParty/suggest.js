(function (window) {

var document = window.document;

var fullUrlRegex = /(?:(?:https?|ftp|chrome|chrome-extension):\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])/gi;

var nakedUrlRegex = /^[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\/?$/gi;

function suggest_init() {
  /*
  var throttle=function(){return function(d,a){a||(a=100);var b,c;return function(){if(b)c=true;else{var e=this,f=arguments;d.apply(e,f);b=setTimeout(function(){if(c){d.apply(e,f);c=false}b=null},a)}}}}();
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  */


  function byId(id) { return document.getElementById(id); }

  var ajax_requests = {};
  var ajax_id = 0;
  var lastXhr;
  function ajax(url, callback) {
    ajax_id += 1;
    var xhr = new XMLHttpRequest();
    stop_last_request();
    lastXhr = xhr;
    ajax_requests[ajax_id] = xhr;
    xhr.onload = function () {
      callback(JSON.parse(xhr.responseText));
      delete ajax_requests[ajax_id];
    };
    xhr.open('GET', url, true);
    xhr.send(null);
  }

  function stop_last_request() {
    if (lastXhr) {
      lastXhr.onload = null;
      lastXhr.abort();
      lastXhr = null;
    }
  }

  function stop_all_requests() {
    stop_last_request();
    /*
    Object.keys(ajax_requests).forEach(function (key) {
      ajax_requests[key].onload = null;
      ajax_requests[key].abort();
    });
    ajax_requests = {};
    */
  }

  var q = document.forms['search-form'].q;
  //q.parentNode.style.position = "relative";
  //q.parentNode.style.padding = "0";
  q.type = "text";
  q.autocomplete = "off";

  var offsetLeft = q.offsetLeft;
  var offsetTop  = q.offsetTop;
  var suggestions = document.createElement("ul");
  suggestions.id = "suggestions";
  suggestions.style.visibility = 'hidden';
  //suggestions.style.top  = (offsetTop + 21) + "px";
  //suggestions.style.left = offsetLeft + "px";
  q.parentNode.appendChild(suggestions);

  var silver_suggest_el = document.createElement("div");
  silver_suggest_el.id = "silver-suggest";
  silver_suggest_el.style.top  = (offsetTop + 0) + "px"; //8
  silver_suggest_el.style.left = (offsetLeft + 9+2) + "px";
  q.parentNode.appendChild(silver_suggest_el);

  /*

  #suggestions    { width:301px; position:absolute; z-index:6; visibility:hidden; border:2px solid #f0f0f0; background:#222; opacity:0.96; border-radius:6px; -moz-border-radius:6px; box-shadow:4px 4px 5px rgba(0, 0, 0, 0.4); -moz-box-shadow:4px 4px 5px rgba(0, 0, 0, 0.4); -webkit-box-shadow:4px 4px 5px rgba(0, 0, 0, 0.4); }
  #suggestions ul { list-style-type:none; padding-top:5px; font-size:11px; }
  #suggestions li a,#suggestions li a:link,#suggestions li a:visited { display:block; cursor:default; font-weight:bold; color:#fff; text-decoration:none; padding:2px 5px; }
  #suggestions li a:hover, #suggestions li a.active { background:#c4c4c4; color:#000; text-shadow:0 0 0.1em #fff; }

  */


  var searchDomain = document.forms['search-form'].action;
  function preconnectToSearchDomain() {
    if (preconnectToSearchDomain.done) return;
    preconnectToSearchDomain.done = true;
    preconnectToURL(searchDomain);
    preconnectToURL('https://www.googleapis.com'); // /generate_204
    //preconnectToURL('http://www.google.com'); // auto complete is enough?
  }

  window.addEventListener("click", function(e) {
    if (e.target.nodeName != 'INPUT') {
      suggestions.style.visibility = 'hidden';
      remove_silver_suggest();
    }
  });

  var suggs = suggestions.getElementsByTagName('li'); // live collection

  var is_first_keydown = true;

  // arrow keys

  function update_searchbox(value) {
    if (value && value.dataset)
      value = value.dataset.term;
    q.value = value;
    // simple value change doesn't trigger change event by default
    var e = document.createEvent("HTMLEvents");
    e.initEvent("change", false, true);
    q.dispatchEvent(e);
  }

  var last_key, is_backspace_sequence;

  function keydown(e) {

      // warm up initial connection and SSL
      /*if (is_first_keydown) {
        (new Image()).src = "https://.../blank.gif";
        is_first_keydown = false;
      }*/

      preconnectToSearchDomain();

      var key = e.keyCode;

      is_backspace_sequence = (last_key == 8 && key == 8);
      last_key = key;

      if (key == 13) {
        stop_all_requests();
        search(e);
        return false;
      }

      // return if there ares no suggestions
      if (!suggestions.innerHTML) return true;
      
      // collect link elements  
      var len, i;
      
      // resume if needed
      if (suggestions.style.visibility === 'hidden') {
        suggestions.style.visibility = 'visible';
        //console.log('resume: ' +  suggestions.style.visibility);
        return true;
      }

      //if ( key >= 65 && key <= 90 && !e.ctrlKey) {
      if ( key !== 8 && key !== 39 && key !== 40) {    
        //var term = this.value + String.fromCharCode(key+32);
        //update_silver_suggest_term(term);
      }

      // used Ctrl+A or equivalent should auto complete suggestion
      setTimeout(function () {
        if (window.silver_suggest.suggestion && q.value && 
            q.selectionEnd - q.selectionStart == q.value.length) {
          update_searchbox(window.silver_suggest.suggestion);
          update_silver_suggest_term(window.silver_suggest.suggestion);
          q.selectionStart = 0;
          //q.selectionEnd = window.silver_suggest.suggestion.length;
          return true;
        }
      }, 1);

      // handle event
      switch (e.keyCode) {  
          case 8: // backspace
            if (window.silver_suggest.suggestion) {
              var term = this.value.slice(0, -1);

              // hitting it continously disables silver suggest
              remove_silver_suggest();

              // first hit just removes current suggestions (not removing a single char)
              if (!is_backspace_sequence) {
                e.preventDefault();
              }
            }
            return true;
          break;

          // TODO: case 46:  // delete 
      
          case 38: // up
          remove_silver_suggest();
          len = suggs.length-1;
          for ( i = len+1; i--; ) {
            if ( suggs[i].classList.contains("active") ) {
              suggs[i].classList.remove("active")
              if ( suggs[i-1] ) {
                suggs[i-1].classList.add("active")
                update_searchbox(suggs[i-1]);
                return false;
              }
            }
          } 
          suggs[len].classList.add("active") 
          update_searchbox(suggs[len]);
          return false;
            
          case 9:  // tab
          case 40: // down
          remove_silver_suggest();
          for ( i = 0, len = suggs.length-1; i <= len; i++ ) {   
            if ( suggs[i].classList.contains("active") ) {
              suggs[i].classList.remove("active");
              if ( suggs[i+1] ) {
                suggs[i+1].classList.add("active");
                update_searchbox(suggs[i+1]);
                return false;
              }
            }
          }   
          suggs[0].classList.add("active"); 
          update_searchbox(suggs[0]);
          return false;  


          case 39: // right (siver-suggest)
          //q.value = suggestions.childNodes[0].textContent;
          if (window.silver_suggest.suggestion) {
            update_searchbox(window.silver_suggest.suggestion);
            update_silver_suggest_term(window.silver_suggest.suggestion);
          }
          break;

          case 37: // left (siver-suggest)
          if (window.silver_suggest.suggestion) {
            //update_searchbox(window.silver_suggest.suggestion);
            remove_silver_suggest();
            e.preventDefault();
            return false;
          }
          break;

          //case 13: // enter
          //search(e);
          //return false;
          
          case 27: // esc
          suggestions.style.visibility = "hidden";
          return false;

          default: return true;
       } // #end switch

      
      return true;
  }

  ///////////////////////////////////////////////////

  //
  // suggestions
  //

  function term_changed(e) {

    var originalTerm = this.value; // no alterations like trimming
    var term = this.value;         // may be altered

    // async function use this to validate they are still relevant
    window.currentSearchTerm = term; 

    if (term) {

      var searchEngineSuggestions;

      function requestDone() {
        updateSuggestions();
      }

      (function () {

        /*if (term.indexOf(' ') != -1) {
          remove_silver_suggest();
          requestDone();
          return;
        }*/

        if (is_backspace_sequence) {
          requestDone();
          return;
        }

        // if he's just keep typing the suggestion we already have
        if (window.silver_suggest.suggestion.indexOf(term) == 0) {
          requestDone();
          update_silver_suggest_term(term);
          return;
        }

        // he's typing something new, look for suggestions
        remove_silver_suggest();
        term = term.trim();

        //if (!window.getHistoryBookmarksSuggestions) 
        return;
      })();

      // get suggestions and silver suggest
      var url = 'http://www.google.com/complete/search?client=firefox&q=' + // &hl=en
                encodeURIComponent(term); // used to be without www. (left for preconnecting)
      ajax(url, function(reponse) {
        // term changed we are no longer relevant
        if (window.currentSearchTerm != originalTerm) return;

        searchEngineSuggestions = reponse[1].slice(0,5);
        requestDone();
      });

      function updateSuggestions() {
        var words = searchEngineSuggestions;
        var html = words.reduce(function (html, word) {
          var highlighted = term + '<b>' + word.slice(term.length) + '</b>';
          return html + '<li data-term="' + word + '">' + highlighted + '</li>';
        }, '');
        suggestions.innerHTML = html;
        suggestions.style.visibility = words.length  ? "visible" : "hidden";
      }
    } else {
      suggestions.style.visibility = "hidden";
      silver_suggest_el.innerHTML = "";
    }
    
    // prevent default
    return false; 
  }

  q.oninput = term_changed;
  q.onkeydown = keydown; // debounce(keyup, 100)

  (function (G) {
    var prerender_id = 'silver_suggest_prerender';
    function addListener(name, fn) {
      window.addEventListener('silver_suggest.' + name, fn);
    }
    function publish(name) {
      window.dispatchEvent(new Event('silver_suggest.' + name));
    }
    function reset_silver_suggest(keep_prerender) {
      G.silver_suggest = {
        el:         silver_suggest_el,
        suggestion: '',
        url:        '',
        term:       '',
        title:      '',
        frecency:   -1,
        addListener: addListener
      };
      silver_suggest_el.innerHTML = '';
      publish('hide');
    }
    function get_silver_suggest_html(e) {
      e || (e = G.silver_suggest);
      var title = e.title ? ' &ndash; ' + e.title : '';
      if (e.term == e.suggestion) e.title = '';
      return "<span id='silver-match'>" + e.suggestion.slice(0, e.term.length) + "</span>" + 
             "<span id='silver-rest'>"  + e.suggestion.slice(e.term.length) + "</span>" +
             "<span id='silver-title'>" + title + "</span>"
    }
    function set_silver_suggest(term, suggestion, url, title, frecency) {
      if (term) {
        if (term)       G.silver_suggest.suggestion  = suggestion;
        if (suggestion) G.silver_suggest.url         = url;
        if (url)        G.silver_suggest.term        = term;
        if (title)      G.silver_suggest.title       = title;
        if (frecency)   G.silver_suggest.frecency    = frecency;
      } 
      var is_full_completion = (G.silver_suggest.term == G.silver_suggest.suggestion);
      if (G.silver_suggest && !is_full_completion) {
        silver_suggest.el.innerHTML = get_silver_suggest_html(G.silver_suggest);
        publish('show');
        if (G.silver_suggest.term.length > 1 && 
            G.silver_suggest.frecency > 10*1000) {
        }
      } else {
        reset_silver_suggest(is_full_completion);
      }
    }
    function update_silver_suggest_term(term) {
      if (G.silver_suggest.suggestion.indexOf(term) == 0) {
        G.silver_suggest.term = term;
        set_silver_suggest();
      } else {
        reset_silver_suggest();
      }
    }
    reset_silver_suggest();

    G.update_silver_suggest_term = update_silver_suggest_term;
    G.set_silver_suggest = set_silver_suggest;
    G.remove_silver_suggest = reset_silver_suggest;
  })(window);


  byId("search-input").addEventListener('mousedown', function () {
    if (window.silver_suggest.suggestion) {
      byId("search-input").value = window.silver_suggest.suggestion;
      update_silver_suggest_term(window.silver_suggest.suggestion);
    }
  });

  suggestions.onclick = function(e) {
    var target = e.target;
    if (target.nodeName.toLowerCase() == 'b')
      target = target.parentNode;
    if (target.nodeName.toLowerCase() == 'li') {
      remove_silver_suggest();
      update_searchbox(target);
      search(e);
    }
  }
  suggestions.onmousedown = function () {
    var active = $('.active', suggestions)[0];
    if (active) active.classList.remove('active');
  }
  


  //
  // Real-time results
  //

  byId("search-button").onclick = function(e) {
    search(e);
  }
  //document.forms["search-form"].p

  function isValidIp(address) {
      var parts = address.split('://');
      var ip = parts[1] || parts[0];
      parts = ip.replace(/[\[\]]/g, '').split('.');
      for (var i = parts.length; i--;) {
          if (isNaN(parts[i]) || parts[i] < 0 || parts[i] > 255) {
              return false;
          }
      }
      return (parts.length == 4);
  }

  // /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  // https://gist.github.com/dperini/729294



  function search(e) {
    e.preventDefault();
    var term = window.silver_suggest.url || byId("search-input").value.trim();
    if (!term) return;
    if (fullUrlRegex.test(term) || nakedUrlRegex.test(term) || isValidIp(term)) {
      if (term.indexOf('://') == -1) {
        term = 'http://' + term;
      }
      chrome.extension.sendMessage({"name": "search-event-url"});
      suggestions.style.display = 'none';
      if (window.silver_suggest.suggestion) {
        byId("search-input").value = window.silver_suggest.suggestion;
        silver_suggest_el.style.display = 'none';
        chrome.extension.sendMessage({"name": "search-event-url-suggested"});
      }
      //document.body.style.transition = 'opacity .35s ease-in-out';
      //document.body.style.opacity = .75;
      byId("search-input").classList.add('navigating');
      window.location = term;
      return;
    }

    chrome.extension.sendMessage({"name": "search-event"});
    suggestions.style.visibility = "hidden";
    remove_silver_suggest();

    // search google.com
    document.forms["search-form"].submit();
  }

  /// Util Goog
  document.forms["search-form"].onsubmit = function (e) {
    e.preventDefault();
    submit();
  }

  function submit() {

  }


  //document.forms["search-form"].onsubmit = function () {
  //  chrome.extension.sendMessage({"name": "search-event"});
  //}

  window.addEventListener("click", function(e) {
    var el = document.activeElement;
    if (/input|textarea/i.test(el.nodeName) || el.isContentEditable) {
      return;
    }
    if (el != byId("search-input"))
      byId("search-input").focus();
  });

}

window.addEventListener("DOMContentLoaded", suggest_init);


//
// Helpers
//

function isElementDescendantOf(el, ancestor) {
  while (el = el.parentNode) {
    if (el === ancestor) return true;
  }
  return false;
}


function addLinkWithRelToURL(rel, url) {
    var hint = document.createElement("link");
    hint.rel = rel;
    hint.href = url;
    document.head.appendChild(hint);
}

function preconnectToURL(url) {
  addLinkWithRelToURL('preconnect', url);
}

function prefetchURL(url) {
  addLinkWithRelToURL('prefetch', url);
}

})(window);