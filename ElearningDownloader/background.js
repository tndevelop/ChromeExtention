var ids = [];
var lesson = [];
chrome.runtime.onMessage.addListener(function(arg, sender){
	if(arg.sender == "main")
		chrome.downloads.download(
			arg.content, 
			function(id){
				ids[id] =  sender.tab.id;
				lesson[id] = arg.content;
			}
		);
});

chrome.downloads.onChanged.addListener(
	function(downloadDelta){
		if(typeof ids[downloadDelta.id] !== 'undefined'){
			chrome.tabs.sendMessage(
				ids[downloadDelta.id], 
				{
					sender: "slave",
					content: downloadDelta, 
					lesson: lesson[downloadDelta.id]
				}
			);
		}
	}
);
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
	if (tab.active) {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {chrome.browserAction.enable(tabs[0].id);
			if (tabs[0].url == undefined || tabs[0].url.match(/(http[s]?)(:\/\/)(.{0,3}.)?(elearning.polito.it)(.*)/) == null ||  tabs[0].url.indexOf("videolezioni") == -1) 
				chrome.browserAction.setIcon({ path: 'Downloads-icon-16-off.png', tabId: tabs[0].id });
			else {
				chrome.browserAction.setIcon({ path: 'Downloads-icon-16.png', tabId: tabs[0].id });
			}
		});
	}
});
