import { config } from "../../package.json";

export async function registerPrefsScripts(_window: Window) {
  ztoolkit.log("Registering preference scripts");
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload

  ztoolkit.log("Preference scripts registered");
  bindPrefEvents();
}

function bindPrefEvents() {
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-directory`,
    )
    ?.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
      );
    });
}
