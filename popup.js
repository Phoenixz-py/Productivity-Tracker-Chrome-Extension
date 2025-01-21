document.getElementById('blockSiteButton').addEventListener('click', () => {
  let site = document.getElementById('siteInput').value.trim();
  
  if (site.startsWith('http://') || site.startsWith('https://')) {
    site = site.replace(/^https?:\/\//, '');  // Remove http/https
  }

  if (site) {
    chrome.runtime.sendMessage({ action: "blockSite", site }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError.message);
        document.getElementById('statusMessage').textContent = "Failed to block site.";
      } else if (response && response.success) {
        document.getElementById('statusMessage').textContent = "Site blocked successfully!";
      } else {
        document.getElementById('statusMessage').textContent = "Failed to block site.";
      }
    });
  } else {
    document.getElementById('statusMessage').textContent = "Please enter a valid site.";
  }
});

//popup
// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get(["timeLogs"], (result) => {
//     const logs = result.timeLogs || [];
//     let reportHTML = "<h3>Daily Productivity Report</h3><ul>";
//     logs.forEach(log => {
//       reportHTML += `<li>${log.site}: ${log.duration} seconds</li>`;
//     });
//     reportHTML += "</ul>";
//     document.getElementById("report").innerHTML = reportHTML;
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  const reportDiv = document.getElementById("dailyReport");

  chrome.storage.local.get(["timeLogs"], (result) => {
    let logs = result.timeLogs || [];
    reportDiv.innerHTML = logs.length
      ? logs.map(log => `<p>${log.site}: ${log.duration} seconds</p>`).join("")
      : "<p>No data tracked yet.</p>";
  });
});
