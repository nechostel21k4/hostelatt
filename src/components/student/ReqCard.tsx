import React, { useContext, useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import ReqTimeline from "./ReqTimeline";
import { formatDate, formatDateWithTime, formatTime } from "../interfaces/Date";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Image } from "primereact/image";
import { getProfileImage } from "../../services/ImageService";
import { Leave, Permission } from "../interfaces/Request";

import { Toast } from "primereact/toast";
import { CancelRequest } from "../../services/StudentService";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";

import QRCode from "qrcode";
import { Messages } from "primereact/messages";
import { Link } from "react-router-dom";

function ReqCard(props: any) {
  const { request, showCancel } = props;

  //permission
  const [date, setDate] = useState<string>("");
  const [fromTime, setFromTime] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");

  //leave
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [QRURl, setQRURL] = useState<string>("");

  const cancelToast = useRef<Toast>(null);

  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const msgs = useRef<Messages>(null);

  const GenerateQR = async () => {
    try {
      const result = await QRCode.toDataURL(
        request?.id ? request?.id : "Failed to Generate QR"
      );
      setQRURL(result);
    } catch (err) {
      console.log("Error while creating QR code", err);
    }
  };

  useEffect(() => {
    getProfileImage(request?.rollNo)
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

    GenerateQR();
    if (request) {
      let displayMsg: any;

      if (request?.status === "SUBMITTED" && request?.isActive) {
        displayMsg = (
          <span>
            You can cancel this {request?.type} at any time before ACCEPTED
          </span>
        );
      } else if (request?.status === "ACCEPTED" && request?.isActive) {
        displayMsg = (
          <span>
            You are only allowed to cancel this Accepted {request?.type} before{" "}
            <b>
              {request?.type === "LEAVE"
                ? formatDateWithTime(new Date(request.fromDate))
                : formatDateWithTime(new Date(request.fromTime))}
            </b>
          </span>
        );
      }

      msgs.current?.clear();
      msgs.current?.show({
        id: "1",
        icon: "pi pi-send",
        sticky: true,
        severity: "info",
        summary: "Request Info",
        content: (
          <>
            <span className="special-font">
              {displayMsg} . Any Queries contact&nbsp;
              <Link
                to={`/student/${request.rollNo}/incharge`}
                className="no-underline cursor-pointer  w-full"
              >
                <span className="font-medium">Incharges</span>
              </Link>
            </span>
          </>
        ),
        closable: false,
      });
    }
  }, [request]);

  useEffect(() => {
    if (request?.type === "LEAVE") {
      let startDate = formatDateWithTime(new Date(request?.fromDate));
      let endDate = formatDateWithTime(new Date(request?.toDate));
      setFromDate(startDate);
      setToDate(endDate);
    } else if (request?.type === "PERMISSION") {
      let date = formatDate(new Date(request?.date));
      let fromTime = formatTime(new Date(request?.fromTime));
      let toTime = formatTime(new Date(request?.toTime));
      setDate(date);
      setFromTime(fromTime);
      setToTime(toTime);
    }
  }, [request]);

  const requestCardHeader = (
    <div className="text-center">
      <Chip
        label={request?.type}
        className="bg-primary mt-2"
        icon="pi pi-circle-fill"
      />
    </div>
  );

  const cancelRequest = () => {
    const accept = () => {
      setIsCancelling(true);
      let tempRequest: Permission | Leave | null = null;
      if (request?.status === "SUBMITTED") {
        console.log("submitted", { request })
        tempRequest = {
          ...request,
          cancelled01: {
            time: new Date(),
            name: request.name,
            rollNo: request.rollNo,
          },
          status: "CANCELLED01",
          isActive: false,
        };
      } else if (request?.status === "ACCEPTED") {
        tempRequest = {
          ...request,
          cancelled02: {
            time: new Date(),
            name: request.name,
            rollNo: request.rollNo,
          },
          status: "CANCELLED02",
          isActive: false,
        };
      }
      console.log("temp", tempRequest)
      CancelRequest(tempRequest?.id as string, tempRequest)
        .then((data) => {
          setIsCancelling(false);
          if (data?.updated) {
            let myLog: LOG = {
              date: new Date(),
              userId: tempRequest?.rollNo as string,
              username: tempRequest?.name as string,
              action: `Cancelled   ${tempRequest?.status === "CANCELLED01" ? "SUBMITTED" : "ACCEPTED"
                }
               ${tempRequest?.type}`,
            };
            createLog(myLog);
            cancelToast.current &&
              cancelToast.current?.show({
                severity: "success",
                summary: "Request Cancelled Successfully",
                detail: data?.message,
              });
          } else {
            cancelToast.current &&
              cancelToast.current?.show({
                severity: "error",
                summary: "Request Cancellation",
                detail: data?.message,
              });
          }
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message:
        request?.status === "ACCEPTED"
          ? "Do you really want to Cancel this Accepted Request ? Please Recheck"
          : "Do you want to cancel this request?",
      header: "Cancel Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  return (
    <>
      <div
        className="mt-2 w-12"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Toast ref={cancelToast} position="center" />

        <Card header={requestCardHeader} className="special-font">
          <div className="grid align-items-center ">
            <div className="col-6 card flex justify-content-center ">
              <Image src={QRURl} alt="Image" width="150" />
            </div>
            <div className="col-6 card flex justify-content-center">
              <Image
                src={profileImageUrl}
                alt="Image"
                width="120"
                height="120"
              />
            </div>
          </div>
          <div className="grid">
            <div className="timeline col-12 sm:col-6 md:col-5 align-self-start flex align-items-start justify-content-center">
              <ReqTimeline
                submitted={request?.submitted}
                accORrejORcancel={{
                  acc: request?.accepted,
                  rej: request?.rejected,
                  cancel: request?.cancelled01,
                }}
                arrivedORcancel={{
                  arr: request?.arrived,
                  cancel: request?.cancelled02,
                }}
              />
            </div>
            <div className="flex flex-column gap-6 align-self-start align-items-center col-12 sm:col-6 md:col-7">
              <div className=" p-0 m-0 mt-1 w-10">
                <div className="flex align-items-center  justify-content-center mt-2">
                  <div className="text-500 font-bold font-medium w-6">
                    Request ID
                  </div>
                  <div className="text-900 font-bold w-6">{request?.id}</div>
                </div>
                <div className="flex align-items-center  justify-content-start mt-2">
                  <div className="text-500 font-bold font-medium w-6">
                    Roll Number
                  </div>
                  <div className="text-900 font-bold w-6">
                    {request?.rollNo}
                  </div>
                </div>
                <div className="flex align-items-center  justify-content-start mt-2">
                  <div className="text-500 font-bold font-medium w-6">Name</div>
                  <div className="text-900 font-bold w-6">{request?.name}</div>
                </div>
                {request?.type === "LEAVE" ? (
                  <>
                    <div className="flex align-items-center  justify-content-start mt-2">
                      <div className="text-500 font-bold font-medium w-6">
                        Start Date
                      </div>
                      <div className="text-900 font-bold w-6">{fromDate}</div>
                    </div>
                    <div className="flex align-items-center  justify-content-start mt-2">
                      <div className="text-500 font-bold font-medium w-6">
                        End Date
                      </div>
                      <div className="text-900 font-bold w-6">{toDate}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex align-items-center  justify-content-start mt-2">
                      <div className="text-500 font-bold font-medium w-6">
                        Date
                      </div>
                      <div className="text-900 font-bold w-6">{date}</div>
                    </div>
                    <div className="flex align-items-center  justify-content-start mt-2">
                      <div className="text-500 font-bold font-medium w-6">
                        From Time
                      </div>
                      <div className="text-900 font-bold w-6">{fromTime}</div>
                    </div>
                    <div className="flex align-items-center  justify-content-start mt-2">
                      <div className="text-500 font-bold font-medium w-6">
                        To Time
                      </div>
                      <div className="text-900 font-bold w-6">{toTime}</div>
                    </div>
                  </>
                )}
                <div className="flex align-items-center  justify-content-start mt-2">
                  <div className="text-500 font-bold font-medium w-6">
                    Reason
                  </div>
                  <div className="text-900 font-bold w-6">
                    {request?.reason}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showCancel &&
            (request.status === "ACCEPTED" || request.status === "SUBMITTED") &&
            request.isActive && (
              <div className="grid mt-2 justify-content-around">
                <div className="col-12 sm:col-6 md:col-9">
                  <Messages ref={msgs} />
                </div>
                <div className="flex align-items-center justify-content-center col-12 sm:col-6 md:col-3">
                  <Button
                    className=""
                    disabled={
                      !(
                        (request?.status === "SUBMITTED" ||
                          request?.status === "ACCEPTED") &&
                        request.isActive
                      ) ||
                      isCancelling ||
                      (request.type === "LEAVE"
                        ? !(new Date(request.fromDate).getTime() > Date.now())
                        : !(new Date(request.fromTime).getTime() > Date.now()))
                    }
                    severity="warning"
                    onClick={cancelRequest}
                  >
                    <i
                      className={
                        isCancelling
                          ? "pi pi-spin pi-spinner"
                          : "pi pi-times-circle"
                      }
                    ></i>
                    &nbsp;&nbsp;{isCancelling ? "Cancelling" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}
        </Card>
      </div>
    </>
  );
}

export default ReqCard;
