function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    (hours > 0 ? hours + 'h ' : '') +
    (minutes > 0 ? minutes + 'm ' : '') +
    seconds + 's'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const channelList = document.getElementById('channel-list');
  const resetButton = document.getElementById('reset');

  // Function to update the display
  function updateDisplay() {
    // Request data from background script
    chrome.runtime.sendMessage({ type: 'getChannelData' }, response => {
      const channelTimes = response.channelTimes || {};
      channelList.innerHTML = '';
      for (const channel in channelTimes) {
        const li = document.createElement('li');
        li.textContent = `${channel}: ${formatTime(channelTimes[channel])}`;
        channelList.appendChild(li);
      }
    });
  }

  // Update display every second
  updateDisplay(); // Initial call
  const intervalId = setInterval(updateDisplay, 1000);

  // Clear interval when popup is closed
  window.addEventListener('unload', () => {
    clearInterval(intervalId);
  });

  // Reset data
  resetButton.addEventListener('click', () => {
    // Send message to background script to reset data
    chrome.runtime.sendMessage({ type: 'resetData' }, () => {
      channelList.innerHTML = '';
    });
  });
});
