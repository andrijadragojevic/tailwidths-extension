chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "toggleOverlay") {
        if (message.enabled) {
            createOverlay();
        } else {
            const existingOverlay = document.getElementById("tailwind-overlay");
            if (existingOverlay) existingOverlay.remove();
        }
    }
});

// Check stored state when the content script loads
chrome.storage.sync.get(["enabled"], function (result) {
    if (result.enabled) {
        createOverlay();
    }
});

function createOverlay() {
    let overlay = document.getElementById("tailwind-overlay");

    // If overlay already exists, just update it
    if (overlay) {
        updateOverlay();
        return;
    }

    overlay = document.createElement("div");
    overlay.id = "tailwind-overlay";
    overlay.style.position = "fixed";
    overlay.style.bottom = "10px";
    overlay.style.right = "10px"; // Start on the right
    overlay.style.padding = "8px 12px";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.color = "white";
    overlay.style.borderRadius = "5px";
    overlay.style.fontSize = "14px";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.zIndex = "9999";
    overlay.style.cursor = "ew-resize";
    overlay.style.transition = "all 0.5s ease-in-out"; // Smooth transition
    overlay.style.userSelect = "none"; // Make text unselectable

    let isOnRight = true; // Track position

    overlay.addEventListener("click", function () {
        if (isOnRight) {
            overlay.style.right = `calc(100% - ${overlay.offsetWidth}px - 10px)`;
        } else {
            overlay.style.right = "10px";
        }
        isOnRight = !isOnRight; // Toggle position state
    });

    document.body.appendChild(overlay);


    function updateOverlay() {
        const width = window.innerWidth;
        const breakpoint = getBreakpoint(width);
        overlay.textContent = `${width}px = ${breakpoint}`;
    }

    function getBreakpoint(width) {
        if (width >= 1536) return "2XL";
        if (width >= 1280) return "XL";
        if (width >= 1024) return "LG";
        if (width >= 768) return "MD";
        if (width >= 640) return "SM";
        return "XS";
    }

    // Immediately update the overlay content
    updateOverlay();

    // Update on resize
    window.addEventListener("resize", updateOverlay);
}
