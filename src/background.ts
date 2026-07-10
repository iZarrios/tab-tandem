interface WindowTabHistory {
  current: number;
  previous: number | null;
}

const SWAP_GUARD_MS = 100;

let swapping = false;

function storageKey(windowId: number): string {
  return `tabHistory_${windowId}`;
}

function isInternalTab(tab: chrome.tabs.Tab): boolean {
  const url = tab.url ?? tab.pendingUrl ?? "";
  return (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("about:")
  );
}

async function getHistory(windowId: number): Promise<WindowTabHistory | null> {
  try {
    const result = await chrome.storage.session.get(storageKey(windowId));
    const value = result[storageKey(windowId)];
    return value === undefined ? null : (value as WindowTabHistory);
  } catch {
    return null;
  }
}

async function setHistory(
  windowId: number,
  history: WindowTabHistory,
): Promise<void> {
  try {
    await chrome.storage.session.set({ [storageKey(windowId)]: history });
  } catch {
    /* storage unavailable; nothing we can do */
  }
}

async function clearHistory(windowId: number): Promise<void> {
  try {
    await chrome.storage.session.remove(storageKey(windowId));
  } catch {
    /* storage unavailable; nothing we can do */
  }
}

async function swapToPrevious(windowId: number): Promise<void> {
  const history = await getHistory(windowId);
  if (history === null || history.previous === null) {
    return;
  }

  const target = history.previous;

  try {
    await chrome.tabs.get(target);
  } catch {
    history.previous = null;
    await setHistory(windowId, history);
    return;
  }

  const leaving = history.current;
  history.current = target;
  history.previous = leaving;
  await setHistory(windowId, history);

  swapping = true;
  try {
    await chrome.tabs.update(target, { active: true });
  } catch {
    swapping = false;
    return;
  }

  setTimeout(() => {
    swapping = false;
  }, SWAP_GUARD_MS);
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const { tabId, windowId } = activeInfo;

  if (swapping) {
    swapping = false;
    return;
  }

  let tab: chrome.tabs.Tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch {
    return;
  }

  if (isInternalTab(tab)) {
    return;
  }

  const history = await getHistory(windowId);
  if (history === null) {
    await setHistory(windowId, { current: tabId, previous: null });
    return;
  }

  if (history.current === tabId) {
    return;
  }

  history.previous = history.current;
  history.current = tabId;
  await setHistory(windowId, history);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-last-tab") {
    return;
  }
  const window = await chrome.windows.getLastFocused();
  if (window?.id === undefined) {
    return;
  }
  await swapToPrevious(window.id);
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "swap-last-tab") {
    return;
  }
  const windowId = sender.tab?.windowId;
  if (windowId === undefined) {
    return;
  }
  void swapToPrevious(windowId);
});

chrome.windows.onRemoved.addListener((windowId) => {
  void clearHistory(windowId);
});
