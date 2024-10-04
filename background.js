let currentChannel = null;
let channelStartTime = null;
let channelTimes = {};

// Listen for tab updates to detect when a Twitch channel is active
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('twitch.tv/')) {
    updateChannel(tab.url);
  }
});

// Listen for tab switches
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url.includes('twitch.tv/') && !tab.url.includes('twitch.tv/directory')) {
      updateChannel(tab.url);
    } else {
      switchChannel(null);
    }
  });
});

// Function to update the current channel
function updateChannel(url) {
  const channel = getChannelFromUrl(url);
  if (channel !== currentChannel) {
    switchChannel(channel);
  }
}

// Function to switch channels
function switchChannel(newChannel) {
  const now = Date.now();
  if (currentChannel) {
    // Update time spent on the previous channel
    const timeSpent = now - channelStartTime;
    if (!channelTimes[currentChannel]) {
      channelTimes[currentChannel] = 0;
    }
    channelTimes[currentChannel] += timeSpent;

    // Save to storage
    chrome.storage.local.set({ channelTimes });
  }
  // Start timing the new channel
  currentChannel = newChannel;
  channelStartTime = now;
}

// Helper function to extract channel name from URL
function getChannelFromUrl(url) {
  const match = url.match(/twitch\.tv\/([^\/\?]+)/);
  return match ? match[1] : null;
}

// Save data when the browser is closed or refreshed
chrome.runtime.onSuspend.addListener(() => {
  if (currentChannel) {
    switchChannel(null);
  }
});
