import { Card } from "primereact/card";
import React, { useContext, useEffect, useRef, useState } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Leave, Permission } from "../interfaces/Request";
import { formatDate, formatDateWithTime, formatTime } from "../interfaces/Date";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  AcceptORRejectRequest,
  getPendingRequests,
} from "../../services/InchargeService";
import { InchargeContext } from "./InchargeHome";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";

function InchargePendingRequest() {
  const incharge = useContext(InchargeContext);

  const [selectionOption, setSelectionOption] = useState<
    "Permissions" | "Leaves"
  >("Permissions");

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const pendingRequestToast = useRef<Toast>(null);

  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const [activeRID, setActiveRID] = useState<string>("");
  const [imageURLS, setImageURLS] = useState<
    { username: string; imagePath: string }[]
  >([]);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (incharge) {
      getPendingRequests(incharge?.hostelId)
        .then((data) => {
          let leaves: any = [];
          let permissions: any = [];

          if (data?.pendingRequests.length > 0) {
            data.pendingRequests.forEach((request: any) => {
              if (request.type === "LEAVE") {
                leaves = [...leaves, request];
              } else if (request.type === "PERMISSION") {
                permissions = [...permissions, request];
              }
            });
          }
          setLeaves(leaves);
          setPermissions(permissions);
          if (data?.images) {
            setImageURLS(data.images);
          } else {
            setImageURLS([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [incharge]);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon={isRefreshing ? "pi pi-spin pi-spinner" : "pi pi-refresh"}
          label={isRefreshing ? "Fetching..." : "Refresh"}
          text
          raised
          outlined
          onClick={() => {
            setIsRefreshing(true);

            setGlobalFilterValue("");
            getPendingRequests(incharge?.hostelId)
              .then((data) => {
                let leaves: any = [];
                let permissions: any = [];
                if (data?.pendingRequests.length > 0) {
                  data.pendingRequests.forEach((request: any) => {
                    if (request.type === "LEAVE") {
                      leaves = [...leaves, request];
                    } else if (request.type === "PERMISSION") {
                      permissions = [...permissions, request];
                    }
                  });
                }
                setLeaves(leaves);
                setPermissions(permissions);

                if (data?.images) {
                  setImageURLS(data.images);
                } else {
                  setImageURLS([]);
                }
                setIsRefreshing(false);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />

        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            id="ad-pen-req-filter"
            onChange={(e) => {
              setGlobalFilterValue(e.target.value);
            }}
            placeholder="Search"
          />
        </IconField>
      </div>
    );
  };
  const tableHeader = renderHeader();

  const tableFooter = `Total : ${selectionOption === "Leaves" ? leaves.length : permissions.length
    } ${selectionOption}`;

  const fromDateTemplate = (data: any) => {
    if (data.fromDate) {
      const fromDate = formatDateWithTime(new Date(data?.fromDate));
      return fromDate;
    }
    return "";
  };

  const toDateTemplate = (data: any) => {
    if (data.toDate) {
      const toDate = formatDateWithTime(new Date(data?.toDate));
      return toDate;
    }
    return "";
  };

  const dateTemplate = (data: any) => {
    if (data.date) {
      const date = formatDate(new Date(data.date));
      return date;
    }
    return "";
  };

  const fromTimeTemplate = (data: any) => {
    if (data.fromTime) {
      const time = formatTime(new Date(data.fromTime));
      return time;
    }
    return "";
  };

  const toTimeTemplate = (data: any) => {
    if (data.toTime) {
      const time = formatTime(new Date(data.toTime));
      return time;
    }
    return "";
  };

  const RejectRequestButton = (request: Permission | Leave) => {
    return (
      <Button
        label={isRejecting && activeRID === request.id ? "Rejecting" : "Reject"}
        icon="pi pi-ban"
        severity="danger"
        disabled={isAccepting || isRejecting}
        onClick={() => {
          handleRequestReject(request?.id, request?.rollNo, request?.type);
        }}
      >
        &nbsp;&nbsp;
        {isRejecting && activeRID === request.id && (
          <i className="pi pi-spin pi-spinner"></i>
        )}
      </Button>
    );
  };

  const AcceptRequestButton = (request: Permission | Leave) => {
    return (
      <Button
        label={isAccepting && activeRID === request.id ? "Accepting" : "Accept"}
        icon="pi pi-verified"
        severity="success"
        disabled={isAccepting || isRejecting}
        onClick={() => {
          handleRequestAccept(request?.id, request?.rollNo, request?.type);
        }}
      >
        &nbsp;&nbsp;
        {isAccepting && activeRID === request.id && (
          <i className="pi pi-spin pi-spinner"></i>
        )}
      </Button>
    );
  };

  const handleRequestReject = (
    id: string,
    rollNo: string,
    type: "LEAVE" | "PERMISSION"
  ) => {
    const accept = () => {
      setActiveRID(id);
      setIsRejecting(true);
      if (type === "LEAVE") {
        let rejRequest = leaves.filter((request) => request.id === id)[0];
        let newLeaves = leaves.filter((request) => request.id !== id);
        rejRequest = {
          ...rejRequest,
          status: "REJECTED",
          rejected: {
            time: new Date(),
            name: incharge?.name,
            eid: incharge?.eid,
          },
          isActive: false,
        };
        AcceptORRejectRequest(id, rejRequest).then((data) => {
          setIsRejecting(false);

          if (data?.updated) {
            setLeaves(newLeaves);
            let myLog: LOG = {
              date: new Date(),
              userId: incharge?.eid,
              username: incharge?.name as string,
              action: `Rejected ${rejRequest.rollNo} Leave`,
            };
            createLog(myLog);

            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "success",
                sticky: true,
                summary: `${rollNo} ${type} is Rejected`,
                detail: data?.message,
              });
            }
          } else {
            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "error",
                sticky: true,
                summary: `Failed to reject ${rollNo} ${type}`,
                detail: data?.message,
              });
            }
          }
        });
      } else if (type === "PERMISSION") {
        let rejRequest = permissions.filter((request) => request.id === id)[0];
        let newPermissions = permissions.filter((request) => request.id !== id);
        rejRequest = {
          ...rejRequest,
          status: "REJECTED",
          rejected: {
            time: new Date(),
            name: incharge.name,
            eid: incharge.eid,
          },
          isActive: false,
        };
        AcceptORRejectRequest(id, rejRequest).then((data) => {
          setIsRejecting(false);

          if (data?.updated) {
            setPermissions(newPermissions);

            let myLog: LOG = {
              date: new Date(),
              userId: incharge.eid,
              username: incharge.name as string,
              action: `Rejected ${rejRequest.rollNo} Permission`,
            };
            createLog(myLog);
            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "success",
                sticky: true,
                summary: `${rollNo} ${type} is Rejected`,
                detail: data?.message,
              });
            }
          } else {
            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "error",
                sticky: true,
                summary: `Failed to reject ${rollNo} ${type}`,
                detail: data?.message,
              });
            }
          }
        });
      }
    };
    const reject = () => { };

    confirmDialog({
      message: `Do you want to Reject \`${rollNo}\` ${type} ?`,
      header: "Reject Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
      id: "inchargependingrequestdialog",
    });
  };

  const handleRequestAccept = (id: string, rollNo: string, type: any) => {
    const accept = () => {
      setActiveRID(id);
      setIsAccepting(true);
      if (type === "LEAVE") {
        let accRequest = leaves.filter((request) => request.id === id)[0];
        let newLeaves = leaves.filter((request) => request.id !== id);
        accRequest = {
          ...accRequest,
          status: "ACCEPTED",
          accepted: {
            time: new Date(),
            name: incharge.name,
            eid: incharge.eid,
          },

          isActive: true,
        };
        AcceptORRejectRequest(id, accRequest).then((data) => {
          setIsAccepting(false);
          if (data?.updated) {
            setLeaves(newLeaves);
            let myLog: LOG = {
              date: new Date(),
              userId: incharge.eid,
              username: incharge.name as string,
              action: `Accepted ${accRequest.rollNo} Leave`,
            };
            createLog(myLog);

            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "success",
                sticky: true,
                summary: `${rollNo} ${type} is Accepted`,
                detail: data?.message,
              });
            }
          } else {
            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "error",
                sticky: true,
                summary: `Failed to Accept ${rollNo} ${type}`,
                detail: data?.message,
              });
            }
          }
        });
      } else if (type === "PERMISSION") {
        let accRequest = permissions.filter((request) => request.id === id)[0];
        let newPermissions = permissions.filter((request) => request.id !== id);
        accRequest = {
          ...accRequest,
          status: "ACCEPTED",
          accepted: {
            time: new Date(),
            name: incharge.name,
            eid: incharge.eid,
          },

          isActive: true,
        };

        AcceptORRejectRequest(id, accRequest).then((data) => {
          setIsAccepting(false);

          if (data?.updated) {
            setPermissions(newPermissions);
            let myLog: LOG = {
              date: new Date(),
              userId: incharge.eid,
              username: incharge.name as string,
              action: `Accepted ${accRequest.rollNo} Permission`,
            };
            createLog(myLog);

            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "success",
                sticky: true,
                summary: `${rollNo} ${type} is Accepted`,
                detail: data?.message,
              });
            }
          } else {
            if (pendingRequestToast?.current) {
              pendingRequestToast?.current.show({
                severity: "error",
                sticky: true,
                summary: `Failed to Accept ${rollNo} ${type}`,
                detail: data?.message,
              });
            }
          }
        });
      }
    };
    const reject = () => { };

    confirmDialog({
      message: `Do you want to Accept \`${rollNo}\` ${type} ?`,
      header: "Accept Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
      id: "inchargependingrequestdialog",
    });
  };

  const submittedTime = (data: any) => {
    if (data.submitted) {
      const date = data?.submitted?.time;
      const formatDate = data ? formatDateWithTime(new Date(date)) : "";
      return formatDate;
    }
    return "";
  };

  const imageBodyTemplate = (request: any) => {
    let image = imageURLS.find((image) => image.username === request.rollNo);
    return (
      <img
        src={
          image?.imagePath
            ? image?.imagePath
            : "/images/Avatar.jpg"
        }
        className="w-6rem h-6rem shadow-2 border-round"
        alt="profile-image"
      />
    );
  };

  return (
    <>
      <ConfirmDialog id="inchargependingrequestdialog" />
      <Toast ref={pendingRequestToast} position="center" />

      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Pending Requests" className="special-font">
          <div className="card flex justify-content-center">
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="inc-pend-req-permissions"
                  name="Permissions"
                  value="Permissions"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Permissions"}
                />
                <label
                  htmlFor="inc-pend-req-permissions"
                  className="ml-2 special-font"
                >
                  Permissions
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="inc-pend-req-leaves"
                  name="Leaves"
                  value="Leaves"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Leaves"}
                />
                <label
                  htmlFor="inc-pend-req-leaves"
                  className="ml-2 special-font"
                >
                  Leaves
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card title={
          selectionOption === "Leaves"
            ? `Leaves : ${leaves.length}`
            : `Permissions : ${permissions.length}`
        } className="mt-2 special-font">
          {selectionOption === "Leaves" ? (
            <DataTable
              value={leaves}
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              selectionMode={"single"}
              tableStyle={{ minWidth: "50rem" }}
              sortField="submitted"
              sortOrder={-1}
            >
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
                sortable
              ></Column>
              <Column
                className="font-bold"
                header="Profile Image"
                body={imageBodyTemplate}
              ></Column>
              <Column
                field="rollNo"
                className="font-bold"
                header="Roll Number"
                sortable
              ></Column>
              <Column field="name" header="Name"></Column>

              <Column
                header="Start Date"
                field="fromDate"
                style={{ minWidth: "120px" }}
                body={fromDateTemplate}
              ></Column>
              <Column
                header="End Date"
                field="toDate"
                style={{ minWidth: "120px" }}
                body={toDateTemplate}
              ></Column>
              <Column field="reason" header="Reason"></Column>
              <Column field="phoneNo" header="Phone No"></Column>
              <Column field="parentPhoneNo" header="Parent PhoneNo"></Column>
              <Column body={AcceptRequestButton}></Column>
              <Column body={RejectRequestButton}></Column>
            </DataTable>
          ) : (
            <DataTable
              value={permissions}
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              selectionMode={"single"}
              tableStyle={{ minWidth: "50rem" }}
              sortField="submitted"
              sortOrder={-1}
            >
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
                sortable
              ></Column>
              <Column
                className="font-bold"
                header="Profile Image"
                body={imageBodyTemplate}
              ></Column>
              <Column
                field="rollNo"
                className="font-bold"
                header="Roll Number"
                sortable
              ></Column>
              <Column field="name" header="Name"></Column>

              <Column
                header="Date"
                field="date"
                style={{ minWidth: "120px" }}
                body={dateTemplate}
              ></Column>
              <Column
                header="From Time"
                field="fromTime"
                style={{ minWidth: "120px" }}
                body={fromTimeTemplate}
              ></Column>
              <Column
                header="To Time"
                field="toTime"
                style={{ minWidth: "120px" }}
                body={toTimeTemplate}
              ></Column>
              <Column field="reason" header="Reason"></Column>
              <Column field="phoneNo" header="Phone No"></Column>
              <Column field="parentPhoneNo" header="Parent PhoneNo"></Column>
              <Column body={AcceptRequestButton}></Column>
              <Column body={RejectRequestButton}></Column>
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}

export default InchargePendingRequest;
