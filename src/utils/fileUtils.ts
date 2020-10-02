export async function openFile(accept?: string): Promise<File | undefined> {
  const elementId = "__file_utils__open_file";
  return new Promise((resolve) => {
    let fileInput: HTMLInputElement | null = document.querySelector(
      `input#${elementId}`
    );
    if (fileInput) {
      console.log(fileInput);
      fileInput.remove();
    }

    fileInput = document.createElement("input");
    fileInput.setAttribute("id", elementId);
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("hidden", "");
    accept && fileInput.setAttribute("accept", accept);
    document.body.appendChild(fileInput);
    fileInput.click();
    fileInput.addEventListener("change", () => {
      resolve(fileInput?.files?.[0]);
    });
  });
}

export async function openFiles(accept?: string): Promise<FileList | null> {
  const elementId = "__file_utils__open_files";
  return new Promise((resolve) => {
    let fileInput: HTMLInputElement | null = document.querySelector(
      `input#${elementId}`
    );
    if (fileInput) {
      fileInput.remove();
    }

    fileInput = document.createElement("input");
    fileInput.setAttribute("id", elementId);
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("hidden", "");
    accept && fileInput.setAttribute("accept", accept);
    document.body.appendChild(fileInput);
    fileInput.click();
    fileInput.addEventListener("change", () => {
      resolve(fileInput?.files);
    });
  });
}
