import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { getPref } from "../utils/prefs";

export class SyncToTablet {
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.jpg`,
    });
  }

  static registerSendToTablet() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon@0.5x.jpg`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-sync-to-tablet-send",
      label: getString("send-label"),
      commandListener: () => {
        if (getPref("directory") === undefined || getPref("directory") === "") {
          Zotero.alert(window, "Error", "Please set the directory in the preferences first.");
          return;
        }
        for (const item of ztoolkit.getGlobal("ZoteroPane").getSelectedItems()) {
          // ztoolkit.log(item);
          if (item.isAttachment()) {
            if (item.isFileAttachment()) {
              // copy the file to perf-directory
              copyFileToDirectory(item);
            } else {
              ztoolkit.log(item.id + "Not a File attachment!");
            }
          } else {
            item.getAttachments().forEach((attachment) => {
              if (!Zotero.Items.get(attachment).getFilePath()) {
                return;
              }
              copyFileToDirectory(Zotero.Items.get(attachment));
            })
          }
        }
      },
      icon: menuIcon,
    });

    function copyFileToDirectory(item: Zotero.Item) {
      const filePath = item.getFilePath();
      if (typeof filePath === 'string') {
        const fileName = Zotero.File.encodeFilePath(filePath).split("/").pop();
        Zotero.File.removeIfExists(getPref("directory") + "/" + fileName);
        Zotero.File.copyToUnique(filePath, getPref("directory") + "/" + fileName);
      }
    }
  }

  static registerRetrieveFromTablet() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon@0.5x.jpg`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-sync-to-tablet-retrieve",
      label: getString("retrieve-label"),
      commandListener: () => {
        if (getPref("directory") === undefined || getPref("directory") === "") {
          Zotero.alert(window, "Error", "Please set the directory in the preferences first.");
          return;
        }
        for (const item of ztoolkit.getGlobal("ZoteroPane").getSelectedItems()) {
          // ztoolkit.log(item);
          if (item.isAttachment()) {
            if (item.isFileAttachment()) {
              storeFileToItem(item);
            } else {
              ztoolkit.log(item.id + "Not a File attachment!");
            }
          } else {
            item.getAttachments().forEach((attachment) => {
              if (!Zotero.Items.get(attachment).getFilePath()) {
                return;
              }
              storeFileToItem(Zotero.Items.get(attachment));
            })
          }
        }
      },
      icon: menuIcon,
    });

    function storeFileToItem(item: Zotero.Item) {
      const directory = getPref("directory")!.toString();
      const filePath = item.getFilePath();
      if (filePath == false) {
        return;
      }
      const filename = Zotero.File.encodeFilePath(filePath).split("/").pop()!;
      Zotero.File.iterateDirectory(directory, (entry: any) => {
        if (entry.name === filename) {
          ztoolkit.log("File Found: " + entry.path);
          ztoolkit.log("Item Path: " + item.getFilePath()!.toString());
          Zotero.File.removeIfExists(item.getFilePath()!.toString());
          Zotero.File.copyToUnique(entry.path, item.getFilePath()!.toString());
          return;
        }
      });
    }

  }
}
