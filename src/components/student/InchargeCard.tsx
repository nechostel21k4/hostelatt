import { Card } from "primereact/card";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { createLog } from "../../services/AdminService";
import { uploadImage, getProfileImage } from "../../services/ImageService";
import { LOG } from "../interfaces/Log";
import { Toast } from "primereact/toast";

function InchargeCard(props: any) {
  const { incharge, showId } = props;
  const [file, setFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const [enableImageEdit, setEnableImageEdit] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  useEffect(() => {
    getProfileImage(incharge?.eid)
      .then((data) => {
        setProfileImageUrl("/images/Avatar.jpg");
        if (!incharge) {
          setProfileImageUrl("/images/Avatar.jpg");
        } else if (data?.imageExist) {
          setProfileImageUrl(data.imagePath);
        } else {
          setProfileImageUrl("/images/Avatar.jpg");
        }
      })
      .catch((err) => {
        console.log("Error : while getting profile image", err);
      });
  }, [incharge]);

  const handle = () => {
    setEnableImageEdit((prevValue: boolean) => {
      return !prevValue;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const toast = useRef<Toast>(null);

  const handleFileUpload = () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setIsImageUploading(true);
    uploadImage(formData, incharge?.eid)
      .then((data) => {
        if (data?.imageUploaded) {
          let myLog: LOG = {
            date: new Date(),
            userId: incharge?.eid as string,
            username: incharge?.name as string,
            action: `Uploaded profile image`,
          };
          createLog(myLog);
          getProfileImage(incharge?.eid)
            .then((data) => {
              if (data?.imageExist) {
                setProfileImageUrl(data.imagePath);
              } else {
                setProfileImageUrl("/images/Avatar.jpg");
              }
              if (toast?.current) {
                toast.current.show({
                  severity: "info",
                  summary: "Success",
                  detail: "Image Uploaded",
                });
              }
            })
            .catch((err) => {
              console.log("Error : while getting profile image", err);
            });
        } else {
          if (toast?.current) {
            toast.current.show({
              severity: "warn",
              summary: "Fail",
              detail: "Image Upload Failed",
            });
          }
        }
        setIsImageUploading(false);
      })
      .catch((err) => {
        console.log("Error : while uploading image", err);
      });
  };

  return (
    <>
      <div className="card flex justify-content-center w-full">
        <Toast ref={toast} position="center"></Toast>
        <Card className="w-full special-font" >
          <div className="grid">
            <div className="col-12 sm:col-4">
              <div className="card flex justify-content-center">
                <Image
                  src={profileImageUrl}
                  alt="incharge-image"
                  width="120"
                  height="120"
                />
                {showId && (
                  <Button
                    severity={enableImageEdit ? "danger" : "secondary"}
                    title={enableImageEdit ? "close" : "edit"}
                    icon={
                      enableImageEdit ? "pi pi-times" : "pi pi-pen-to-square"
                    }
                    style={{
                      height: "25px",
                      width: "25px",
                      position: "relative",
                    }}
                    onClick={handle}
                  ></Button>
                )}
              </div>
            </div>

            <div className="col-12 sm:col-8">
              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">
                  <i className="pi pi-user"></i>&nbsp;&nbsp; Name
                </div>
                <div className="text-900 font-bold w-6">
                  {incharge?.name || ""}
                </div>
              </div>
              {showId && (
                <div className="flex align-items-center  justify-content-start mt-2">
                  <div className="text-500 font-bold font-medium w-6">
                    <i className="pi pi-id-card"></i>&nbsp;&nbsp; EID
                  </div>
                  <div className="text-900 font-bold w-6">
                    {incharge?.eid || ""}
                  </div>
                </div>
              )}
              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">
                  <i className="pi pi-phone"></i>&nbsp;&nbsp; Contact
                </div>
                <div className="text-900 font-bold w-6">
                  {incharge?.phoneNo || ""}
                </div>
              </div>
              {incharge?.hostelId && (
                <div className="flex align-items-center  justify-content-start mt-2">
                  <div className="text-500 font-bold font-medium w-6">
                    <i className="pi pi-building"></i>&nbsp;&nbsp; Hostel ID
                  </div>
                  <div className="text-900 font-bold w-6">
                    {incharge?.hostelId || ""}
                  </div>
                </div>
              )}

              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">
                  <i className="pi pi-map-marker"></i>&nbsp;&nbsp; Designation
                </div>
                <div className="text-900 font-bold w-6">
                  {incharge?.designation || ""}
                </div>
              </div>
            </div>
          </div>
          {enableImageEdit && showId && (
            <>
              <div className="mb-3 flex align-items-end align-self-end">
                <input
                  type="file"
                  accept=".jpg,.jpeg"
                  onChange={handleFileChange}
                ></input>
                <Button
                  onClick={handleFileUpload}
                  disabled={isImageUploading}
                  className="pl-2 pr-2 sm:pl-3 sm:pr-3"
                >
                  <i
                    className={
                      isImageUploading
                        ? "pi pi-spin pi-spinner"
                        : "pi pi-file-arrow-up"
                    }
                  ></i>
                  &nbsp;&nbsp;{isImageUploading ? "Uploading" : "Upload"}
                </Button>
              </div>
              <p>
                <span style={{ fontWeight: "bold" }}>Note : </span>accepts only{" "}
                <span
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  .jpg / .jpeg
                </span>{" "}
                images
              </p>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

export default InchargeCard;
