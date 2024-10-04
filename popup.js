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

  // Fetch data from storage
  chrome.storage.local.get('channelTimes', data => {
    const channelTimes = data.channelTimes || {};
    for (const channel in channelTimes) {
      const li = document.createElement('li');
      li.textContent = `${channel}: ${formatTime(channelTimes[channel])}`;
      channelList.appendChild(li);
    }
  });

  // Reset data
  resetButton.addEventListener('click', () => {
    chrome.storage.local.set({ channelTimes: {} }, () => {
      channelList.innerHTML = '';
    });
  });
});
