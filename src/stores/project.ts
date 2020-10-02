import JSZip from "jszip";

import { openFile } from "../utils/fileUtils";

const zip = new JSZip();

const artboardFileNameRegexp = /^artwork\/artboard-([\w | -]+)\/(.+)(graphicContent\.agc)/;

export class ProjectStore {
  async loadXDFile() {
    const xdProjectFile = await openFile(".xd");
    if (!xdProjectFile) return;
    const xdProjectData = await zip.loadAsync(xdProjectFile);
    console.log(xdProjectData);
    for (const [xdProjectFilePath, xdProjectFileInfo] of Object.entries(
      xdProjectData.file
    )) {
      if (artboardFileNameRegexp.test(xdProjectFilePath)) {
      }
    }
  }
}
