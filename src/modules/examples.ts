import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";

function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value;
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`);
      return original.apply(this, args);
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e);
      throw e;
    }
  };
  return descriptor;
}

export class BasicExampleFactory {
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
    });
  }
}

export class UIExampleFactory {
  static registerRightClickMenuItem() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon@0.5x.png`;
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-addontemplate-test",
      label: getString("menuitem-label"),
      commandListener: (ev) => {
        for (const item of ztoolkit.getGlobal("ZoteroPane").getSelectedItems()) {
          // ztoolkit.log(item);
          if (item.isAttachment()) {
            if (item.isPDFAttachment()) {
              ztoolkit.log(item.getFilePath());
            } else {
              ztoolkit.log(item.id + "Not a PDF attachment!");
            }
          } else {
            item.getAttachments().forEach((attachment) => {
              if (!Zotero.Items.get(attachment).getFilePath()) {
                return;
              }
              // copy the file to perf-directory
              const filePath = Zotero.Items.get(attachment).getFilePath();
              ztoolkit.log(Zotero.Prefs.get("extensions.zotero.SendToTablet.directory"));
              // if (typeof filePath === 'string') {
              //   Zotero.File.copyToUnique(filePath, Zotero.Prefs.get("perf-directory") + "/" + Zotero.Items.get(attachment).getField("title") + ".pdf");
              // }
            })
          }
        }
      },
      icon: menuIcon,
    });
  }
}
