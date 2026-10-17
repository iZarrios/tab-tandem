import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'TabTandem',
    description:
      'Swap between the two last active tabs in the current window using a keyboard shortcut.',
    permissions: ['tabs', 'storage'],
    host_permissions: ['<all_urls>'],
    icons: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
    action: {
      default_title: 'TabTandem',
      default_icon: {
        16: 'icons/icon-16.png',
        32: 'icons/icon-32.png',
        48: 'icons/icon-48.png',
        128: 'icons/icon-128.png',
      },
    },
    commands: {
      'toggle-last-tab': {
        suggested_key: {
          default: 'Ctrl+Period',
        },
        description: 'Swap to the previously active tab in the current window',
      },
    },
  },
  webExt: {
    chromiumArgs: ['--disable-features=DisableLoadExtensionCommandLineSwitch'],
  },
});
