(function()
{
  function init()
  {
    var elements = document.querySelectorAll("*[data-i18n]");
    for (var i=0, len=elements.length; i<len; i++)
    {
      elements[i].innerText = chrome.i18n.getMessage(elements[i].dataset.i18n);
    }
  }
  
  document.addEventListener("DOMContentLoaded", init, false);
})();
