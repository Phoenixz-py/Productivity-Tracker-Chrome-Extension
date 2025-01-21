console.log("Content script running...");

// let startTime = Date.now();

// window.addEventListener("beforeunload", () => {
//   let timeSpent = Math.floor((Date.now() - startTime) / 1000);
//   chrome.runtime.sendMessage({ action: "logTime", site: window.location.hostname, time: timeSpent });
// });

let startTime;
let currentSite = window.location.hostname;

window.addEventListener("load", () => {
  startTime = Date.now();
});

window.addEventListener("beforeunload", () => {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
  chrome.runtime.sendMessage({ action: "logTime", site: currentSite, duration: timeSpent });
});


let activeSite;

function startTracking() {
  startTime = Date.now();
  activeSite = window.location.hostname;
}

function stopTracking() {
  if (startTime && activeSite) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    chrome.runtime.sendMessage({
      action: "logTime",
      site: activeSite,
      duration: duration,
    });
  }
}

window.addEventListener("focus", startTracking);
window.addEventListener("blur", stopTracking);
window.addEventListener("beforeunload", stopTracking);
