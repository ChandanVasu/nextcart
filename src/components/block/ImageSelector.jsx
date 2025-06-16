"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button, Image, Spinner } from "@heroui/react";
import { FaCheckCircle } from "react-icons/fa";

const ImageSelector = ({ isOpen, onClose, onSelectImages, selectType = "multiple" }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/image");
      const data = await res.json();
      setImages(data); // Expects array of { _id, url, name }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER); 

    try {
      setUploading(true);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      // Step 1: Upload to Cloudinary
      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const cloudData = await cloudRes.json();

      if (!cloudData?.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // Step 2: Save image metadata to your backend
      const backendRes = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cloudData.secure_url,
          name: file.name,
        }),
      });

      const savedImage = await backendRes.json();
      setImages((prev) => [savedImage, ...prev]);
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClickImage = (url) => {
    if (selectType === "single") {
      onSelectImages(url);
      onClose();
    } else {
      setSelected((prev) => {
        const newSet = new Set(prev);
        newSet.has(url) ? newSet.delete(url) : newSet.add(url);
        return newSet;
      });
    }
  };

  const handleDone = () => {
    onSelectImages(Array.from(selected));
    onClose();
    setSelected(new Set());
  };

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen]);

  return (
    <Modal className="min-h-[400px]" size="4xl" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onClose} hideCloseButton="true">
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <span>Select {selectType === "multiple" ? "Images" : "Image"}</span>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            <Button size="sm" className="bg-black text-white" onPress={triggerFileSelect} isLoading={uploading}>
              Upload
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="max-h-[400px] overflow-auto scroll-smooth">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image) => {
                const isSelected = selected.has(image.url);
                return (
                  <div
                    key={image._id}
                    onClick={() => handleClickImage(image.url)}
                    className="relative rounded-lg overflow-hidden cursor-pointer shadow-sm"
                  >
                    <img src={image.url} alt={image.name} className="object-contain object-center w-full h-[150px] rounded-lg" />
                    {selectType === "multiple" && isSelected && (
                      <div className="absolute top-2 right-2 z-50 text-green-500 bg-white rounded-full p-1 shadow-md">
                        <FaCheckCircle className="text-lg" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ModalBody>

        {selectType === "multiple" && (
          <ModalFooter className="justify-between">
            <Button className="bg-red-600 text-white" size="sm" onPress={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-700 text-white" size="sm" onPress={handleDone} isDisabled={selected.size === 0}>
              Select {selected.size} Image{selected.size > 1 ? "s" : ""}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageSelector;
