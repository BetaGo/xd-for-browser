import JSZip from "jszip";

import { openFile } from "../utils/fileUtils";
import { RootNode } from "../draw/elements/rootNode";

const zip = new JSZip();

const artboardFileNameRegexp = /^artwork\/artboard-([\w | -]+)\/(.+)(graphicContent\.agc)/;

export class ProjectStore {
  rootNode: RootNode | null = null;
  async loadXDFile() {
    const xdProjectFile = await openFile(".xd");
    if (!xdProjectFile) return;
    const xdProjectData = await zip.loadAsync(xdProjectFile);
    console.log(xdProjectData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [xdProjectFilePath, xdProjectFileInfo] of Object.entries(
      xdProjectData.file
    )) {
      if (artboardFileNameRegexp.test(xdProjectFilePath)) {
      }
    }
  }
}
