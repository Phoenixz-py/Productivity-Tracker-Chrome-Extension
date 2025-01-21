chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "blockSite") {
    const site = message.site.replace(/^https?:\/\//, ''); // Remove http/https

    const rule = {
      id: parseInt(Date.now().toString().slice(-6), 10),  // Ensure ID is a 6-digit integer
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `*://${site}/*`, 
        resourceTypes: ["main_frame"],
      },
    };

    chrome.declarativeNetRequest.updateDynamicRules(
      { addRules: [rule], removeRuleIds: [] },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError.message);
          sendResponse({ success: false, message: chrome.runtime.lastError.message });
        } else {
          console.log(`Blocking rule added for ${site}`);
          sendResponse({ success: true });
        }
      }
    );

    return true; // Keep message channel open for async response
  }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logTime") {
    chrome.storage.local.get(["timeLogs"], (result) => {
      let timeLogs = result.timeLogs || [];
      timeLogs.push({
        site: message.site,
        duration: message.duration,
        timestamp: new Date().toISOString(),
      });
      chrome.storage.local.set({ timeLogs });
    });
  }
});
