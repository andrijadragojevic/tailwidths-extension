document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle");

    chrome.storage.sync.get(["enabled"], function (result) {
        toggleButton.textContent = result.enabled ? "Turn Off" : "Turn On";
    });

    toggleButton.addEventListener("click", () => {
        chrome.storage.sync.get(["enabled"], function (result) {
            const newState = !result.enabled;
            chrome.storage.sync.set({ enabled: newState });
            toggleButton.textContent = newState ? "Turn Off" : "Turn On";

            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(tab => {
                    if (tab.url && !tab.url.startsWith("chrome://")) {
                        chrome.tabs.sendMessage(tab.id, { action: "toggleOverlay", enabled: newState }, function (response) {
                            if (chrome.runtime.lastError) {
                                chrome.scripting.executeScript({
                                    target: { tabId: tab.id },
                                    files: ["content.js"]
                                }).then(() => {
                                    chrome.tabs.sendMessage(tab.id, { action: "toggleOverlay", enabled: newState });
                                }).catch(err => console.error("Error injecting script:", err));
                            }
                        });
                    }
                });
            });
        });
    });
});