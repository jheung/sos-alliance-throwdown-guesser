import React, { useRef } from "react";
import Jimp from "jimp";
import styles from "./file-uploader.module.scss";

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (res) => {
      resolve(res.target.result);
    };
    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
}

const FilesUploader = ({ id, label, onChange }) => {
  const filesRef = useRef();

  const handleFileUpload = async (event) => {
    const images = [];
    for (let index = 0; index < filesRef.current.files.length; index++) {
      const image = filesRef.current.files[index];
      images.push(await processImage(image));
    }

    onChange(id, images);
  };

  const processImage = async (image) => {
    const img = await readFile(image);

    const imgDataUrl = await Jimp.read(img);

    const inverted = await imgDataUrl
      .crop(490, 255, 1280, 800)
      .invert()
      .grayscale()
      .contrast(+1)
      .resize(800, Jimp.AUTO, Jimp.RESIZE_BICUBIC)
      .getBase64Async(Jimp.MIME_PNG);

    return inverted;
  };

  return (
    <div className={styles.wrapper}>
      <label>{label}:</label>
      <input
        type="file"
        name="screenshot"
        ref={filesRef}
        onChange={handleFileUpload}
        multiple
      />
    </div>
  );
};

export default FilesUploader;
