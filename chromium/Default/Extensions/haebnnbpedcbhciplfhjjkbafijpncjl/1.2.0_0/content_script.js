var tineye = tineye || {};

tineye.SERVER = 'tineye.com';
tineye.VERSION = '1.2.0';
tineye.BROWSER = 'chrome';

// Check which sort order the user wants
tineye.sortOrder = function(sort_order) {
    var query_string = "";
    switch(sort_order) {
        case "best_match":
            query_string = "&sort=score&order=desc";
            break;
        case "most_changed":
            query_string = "&sort=score&order=asc";
            break;
        case "biggest_image":
            query_string = "&sort=size&order=desc";
            break;
        case "newest":
            query_string = "&sort=crawl_date&order=desc";
            break;
        case "oldest":
            query_string = "&sort=crawl_date&order=asc";
            break;
        default:
            query_string = "";
    }
    return query_string;
};

// Check where the user want to open the search result
tineye.openUrl = function(tab_visibility, url) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {

        // Get new tab index and open new tabs next to current one
        var new_tab_index = tabs[0].index + 1;

        // Check where the user wants the url to be open
        switch(tab_visibility) {
            case "background":
                chrome.tabs.create({url: url, active: false, index: new_tab_index});
                break;
            case "foreground":
                chrome.tabs.create({url: url, active: true, index: new_tab_index});
                break;
            case "current":
                chrome.tabs.update(tabs[0].id, {url: url});
                break;
            default:
                chrome.tabs.create({url: url, active: false, index: new_tab_index});                   
        }

    });
};

// Send the selected image to TinEye
tineye.imageSearch = function(info, tab) {
    chrome.storage.local.get(['sort_order', 'tab_visibility'], function(result) {
        var sort_order_query_string = tineye.sortOrder(result.sort_order);
        var url = encodeURIComponent(info.srcUrl);
        tineye.openUrl(
            result.tab_visibility,
            "https://" + tineye.SERVER + "/search/?pluginver=" +
            tineye.BROWSER + "-" + tineye.VERSION +
            sort_order_query_string + "&url=" + url);
    });
};

// Send the selected page to TinEye
tineye.pageSearch = function(info, tab) {
    chrome.storage.local.get(['sort_order', 'tab_visibility'], function(result) {
        var sort_order_query_string = tineye.sortOrder(result.sort_order);
        var url = encodeURIComponent(info.pageUrl);
        tineye.openUrl(
            result.tab_visibility,
            "https://" + tineye.SERVER + "/search/?pluginver=" +
            tineye.BROWSER + "-" + tineye.VERSION +
            sort_order_query_string + "&url=" + url);
    });
};

// Create two context menu items for image, and page clicks
chrome.contextMenus.create({
    "title": "Search Image on TinEye",
    "contexts": ["image"],
    "onclick": tineye.imageSearch});

chrome.contextMenus.create({
    "title": "Search Page on TinEye", 
    "contexts": ["page"],
    "onclick": tineye.pageSearch});
