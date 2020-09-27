import React from "react";
import JSZip from "jszip";

const zip = new JSZip();

const XdFileReader = () => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    zip.loadAsync(e.target.files?.[0] ?? "").then((z) => {
      console.log(z);
    });
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default XdFileReader;
