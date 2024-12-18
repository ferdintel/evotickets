"use client";

import Image from "next/image";
import toast from "react-hot-toast";

import { useRef, useState } from "react";
import { EventCover } from "types/Events";
import { RiCloseFill, RiUploadCloud2Fill } from "react-icons/ri";

type ImageFileSelectProps = {
  title?: string;
  imageAddStyles?: string;
  parentWrapperAddStyles?: string;
  eventCoverPreview: string | null;
  setEventCover: React.Dispatch<React.SetStateAction<EventCover>>;
  maxSizeInByte?: number;
};

const ImageFileSelect = ({
  title = "",
  imageAddStyles = "",
  parentWrapperAddStyles = "",
  eventCoverPreview,
  setEventCover,
  maxSizeInByte,
}: ImageFileSelectProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const updateImageState = (file: File | null) => {
    if (file) {
      // check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`Le fichier sélectionné n'est pas une image.`);
      }
      // check image max size
      else if (maxSizeInByte && file.size > maxSizeInByte) {
        toast.error(
          `L'image sélectionnée est trop grande (${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}Mo, max autorisé: ${maxSizeInByte / (1024 * 1024)}Mo).`
        );
      } else {
        const previewUrl = URL.createObjectURL(file);
        setEventCover({
          imageFile: file,
          imagePreview: previewUrl,
        });
      }
    } else {
      setEventCover({ imageFile: null, imagePreview: null });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      updateImageState(files[0]);
    }
  };

  const handleImageUpload = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputFileRef.current?.click();
  };

  const removeSelectedImage = () => updateImageState(null);

  // handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      updateImageState(files[0]);
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
        className={`h-52 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-500
        peer-hover:border-gray-500 focus:border-alternate cursor-pointer
        focus:shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]
        ${
          isDragActive &&
          "border-alternate shadow-[0_0_0_1px_var(--alternate),0_0_0_3px_inset_var(--alternate-light)]"
        }
        duration-300 group flex items-center justify-center overflow-hidden`}
      >
        {eventCoverPreview ? (
          <div className="h-full w-full relative">
            <Image
              width={200}
              height={200}
              src={eventCoverPreview}
              alt="Uploaded image"
              className={`w-full h-full object-cover ${imageAddStyles}`}
            />

            <button
              title="Supprimer"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSelectedImage();
              }}
              className="absolute right-2 top-2 bg-foreground text-white rounded-md p-[2px]
              hover:bg-foreground/90 duration-300"
            >
              <RiCloseFill size={24} />
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
