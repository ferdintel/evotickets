"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RiCloseFill, RiUploadCloud2Fill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";

type ImageFileSelectProps = {
  title?: string;
  imageAddStyles?: string;
  parentWrapperAddStyles?: string;
  imageFile: string | null;
  setImageFile: (file: string | null) => void;
};

const ImageFileSelect = ({
  title = "",
  imageAddStyles = "",
  parentWrapperAddStyles = "",
  imageFile,
  setImageFile,
}: ImageFileSelectProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFile(URL.createObjectURL(files[0]));
    }
  };

  const handleImageUpload = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputFileRef.current?.click();
  };

  const removeSelectedImage = () => setImageFile(null);

  // Gestion du glisser-déposer
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setImageFile(URL.createObjectURL(files[0]));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // required to enable drop
    e.preventDefault();
  };

  const handleDragEnter = () => setIsDragActive(true);
  const handleDragLeave = () => setIsDragActive(false);

  return (
    <div className={`flex flex-col ${parentWrapperAddStyles}`}>
      <input
        type="file"
        ref={inputFileRef}
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      {title && <p className="font-medium pb-1 peer">{title}</p>}

      <div
        tabIndex={0}
        draggable={false}
        onClick={handleImageUpload}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`h-52 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-500
        peer-hover:border-slate-500 focus:border-alternate cursor-pointer
        focus:shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]
        ${
          isDragActive &&
          "border-alternate shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]"
        }
        duration-300 group flex items-center justify-center overflow-hidden`}
      >
        {imageFile ? (
          <div className="h-full w-full relative">
            <Image
              width={200}
              height={200}
              src={imageFile}
              alt="Uploaded Image"
              className={`w-full h-full object-cover ${imageAddStyles}`}
            />

            <button
              title="Supprimer"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedImage();
              }}
              className="absolute right-2 top-2 bg-foreground text-white rounded-md p-1
              hover:bg-foreground/90 duration-300"
            >
              <MdCancel size={24} />
            </button>

            <p
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-foreground/95 text-white
              text-sm rounded-md px-2 py-1 ease-in-out duration-100"
            >
              {isDragActive
                ? "Lachez maintenant"
                : "Cliquez pour sélectionner une autre"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-y-2 rounded-lg text-foreground/60 select-none pointer-events-none">
            <RiUploadCloud2Fill size={48} />
            {isDragActive ? (
              <p className="text-foreground/80 font-medium">
                C'est bon lachez maintenant
              </p>
            ) : (
              <p className="flex flex-col text-center ">
                <span
                  className="text-foreground/80 font-medium underline group-hover:no-underline
                  duration-300"
                >
                  Cliquez pour sélectionner
                </span>
                <span>ou glisser-déposer</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageFileSelect;
