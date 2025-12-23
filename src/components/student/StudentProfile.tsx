import React, { useContext, useEffect, useRef, useState } from "react";
import { StudentContext } from "./StudentHome";
import { Chip } from "primereact/chip";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { getProfileImage, uploadImage } from "../../services/ImageService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";

function StudentProfile() {
  const { student, setStudent } = useContext(StudentContext);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [enableImageEdit, setEnableImageEdit] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  useEffect(() => {
    getProfileImage(student?.rollNo)
      .then((data) => {
        if (data?.imageExist) {
          setProfileImageUrl(data.imagePath);
        } else {
          setProfileImageUrl("/images/Avatar.jpg");
        }
      })
      .catch((err) => {
        console.log("Error : while getting profile image", err);
      });
  }, [student]);

  const toast = useRef<Toast>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setIsImageUploading(true);
    uploadImage(formData, student.rollNo)
      .then((data) => {
        if (data?.imageUploaded) {
          let myLog: LOG = {
            date: new Date(),
            userId: student?.rollNo as string,
            username: student?.name as string,
            action: `Uploaded profile image`,
          };
          createLog(myLog);
          getProfileImage(student?.rollNo)
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

  const handle = () => {
    setEnableImageEdit((prevValue: boolean) => {
      return !prevValue;
    });
  };

  return (
    <>
      <div
        className="p-1 w-12"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Toast ref={toast} position="center"></Toast>
        <Card>
          <div className="surface-0">
            <div className="flex align-items-start justify-content-between mb-3">
              <div
                className="card flex justify-content-center"
                style={{ position: "relative" }}
              >
                <Image
                  src={profileImageUrl}
                  alt="Image"
                  width="120"
                  height="120"
                />
                <Button
                  severity={enableImageEdit ? "danger" : "secondary"}
                  title={enableImageEdit ? "close" : "edit"}
                  icon={enableImageEdit ? "pi pi-times" : "pi pi-pen-to-square"}
                  style={{
                    height: "25px",
                    width: "25px",
                    position: "absolute",
                    left: "0",
                  }}
                  onClick={handle}
                  disabled={student?.lastRequest?.isActive}
                ></Button>
              </div>

              <div className="status">
                <Chip
                  className={`${student?.currentStatus === "HOSTEL"
                      ? "bg-green-500"
                      : "bg-orange-500"
                    } text-white-alpha-90`}
                  icon={"pi pi-circle-fill"}
                  label={student?.currentStatus}
                ></Chip>
              </div>
            </div>
            {enableImageEdit && (
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
                  <span style={{ fontWeight: "bold" }}>Note : </span>accepts
                  only{" "}
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

            <ul
              className="list-none p-0 m-0"
              style={{ wordWrap: "break-word" }}
            >
              <li className="grid  py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Name</div>
                  <div className="text-900 w-6">{student?.name}</div>
                </div>
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Roll Number</div>
                  <div className="text-900 w-6">{student?.rollNo}</div>
                </div>
              </li>

              <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Hostel ID</div>
                  <div className="text-900 w-6">{student?.hostelId}</div>
                </div>
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Room No</div>
                  <div className="text-900 w-6">{student?.roomNo}</div>
                </div>
              </li>

              <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">College</div>
                  <div className="text-900 w-6 ">{student?.college}</div>
                </div>
                <div className="flex  mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 w-6 font-medium">Year</div>
                  <div className="text-900 w-6">{student?.year}</div>
                </div>
              </li>

              <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Branch</div>
                  <div className="text-900 w-6">{student?.branch}</div>
                </div>
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 w-6 font-medium">Gender</div>
                  <div className="text-900 w-6">{student?.gender}</div>
                </div>
              </li>

              <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 w-6 font-medium">Phone No</div>
                  <div className="text-900 w-6">{student?.phoneNo}</div>
                </div>
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Email</div>
                  <div
                    className="text-900 w-6"
                    style={{ wordWrap: "break-word" }}
                  >
                    {student?.email}
                  </div>
                </div>
              </li>

              <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 w-6 font-medium">Parent Name</div>
                  <div className="text-900 w-6">{student?.parentName}</div>
                </div>
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                  <div className="text-500 font-medium w-6">Parent PhoneNo</div>
                  <div className="text-900 w-6">{student?.parentPhoneNo}</div>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}

export default StudentProfile;
