import { Card } from "primereact/card";
import { useContext, useEffect, useRef, useState } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Leave, Permission } from "../interfaces/Request";
import { formatDate, formatDateWithTime, formatTime } from "../interfaces/Date";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  ArriveRequest,
  getActiveRequests,
} from "../../services/InchargeService";
import { AdminContext } from "./AdminHome";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { CancelRequest } from "../../services/StudentService";

import { Nullable } from "primereact/ts-helpers";

function AdminActiveRequests() {
  const admin = useContext(AdminContext);

  const [selectionOption, setSelectionOption] = useState<
    "Permissions" | "Leaves"
  >("Permissions");

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const activeRequestToast = useRef<Toast>(null);

  const [isArriving, setIsArriving] = useState<boolean>(false);

  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const [activeRID, setActiveRID] = useState<string>("");

  // const [arrivedTime, setArrivedTime] = useState<Nullable<Date>>(new Date());

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [imageURLS, setImageURLS] = useState<
    { username: string; imagePath: string }[]
  >([]);

  useEffect(() => {
    if (admin) {
      getActiveRequests("all")
        .then((data) => {
          let leaves: any = [];
          let permissions: any = [];

          data?.acceptedRequests.forEach((request: any) => {
            if (request.type === "LEAVE") {
              leaves = [...leaves, request];
            } else if (request.type === "PERMISSION") {
              permissions = [...permissions, request];
            }
          });
          setLeaves(leaves);
          setPermissions(permissions);
          setImageURLS(data?.images);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [admin]);

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
            getActiveRequests("all")
              .then((data) => {
                let leaves: any = [];
                let permissions: any = [];

                data?.acceptedRequests.forEach((request: any) => {
                  if (request.type === "LEAVE") {
                    leaves = [...leaves, request];
                  } else if (request.type === "PERMISSION") {
                    permissions = [...permissions, request];
                  }
                });
                setLeaves(leaves);
                setPermissions(permissions);
                setImageURLS(data?.images);
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
            id="ad-act-req-filter"
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

  const ArrivedButton = (request: Permission | Leave) => {
    return (
      <Button
        label={isArriving && activeRID === request.id ? "Arriving" : "Arrived"}
        icon="pi pi-sign-in"
        severity="info"
        disabled={isCancelling || isArriving}
        onClick={() => {
          handleRequestArrive(request?.id, request?.rollNo, request?.type);
        }}
      >
        &nbsp;&nbsp;
        {isArriving && activeRID === request.id && (
          <i className="pi pi-spin pi-spinner"></i>
        )}
      </Button>
    );
  };

  const CancelButton = (request: Permission | Leave) => {
    return (
      <Button
        label={
          isCancelling && activeRID === request.id ? "Cancelling" : "Cancel"
        }
        icon={
          isCancelling && activeRID === request.id
            ? "pi pi-spin pi-spinner"
            : "pi pi-times-circle"
        }
        disabled={isCancelling || isArriving}
        severity="warning"
        onClick={() => {
          handleRequestCancel(request?.id, request?.rollNo, request?.type);
        }}
      ></Button>
    );
  };

  const handleRequestCancel = (id: string, rollNo: string, type: string) => {
    const accept = () => {
      setActiveRID(id);
      setIsCancelling(true);
      if (type === "LEAVE") {
        let cancelRequest = leaves.filter((request) => request.id === id)[0];
        let newLeaves = leaves.filter((request) => request.id !== id);
        cancelRequest = {
          ...cancelRequest,
          status: "CANCELLED02",
          isActive: false,
          cancelled02: {
            time: new Date(),
            name: admin.name,
            rollNo: admin.eid,
          },
        };

        CancelRequest(id, cancelRequest)
          .then((data) => {
            setIsCancelling(false);
            if (data?.updated) {
              setLeaves(newLeaves);
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Cancelled ${cancelRequest.rollNo} Accepted Leave`,
              };
              createLog(myLog);

              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `Cancelled ${cancelRequest.rollNo} Accepted Leave`,
                  detail: data?.message,
                });
              }
            } else {
              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `Failed to Cancel ${rollNo} Accepted ${type}`,
                  detail: data?.message,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (type === "PERMISSION") {
        let cancelRequest = permissions.filter(
          (request) => request.id === id
        )[0];
        let newPermissions = permissions.filter((request) => request.id !== id);
        cancelRequest = {
          ...cancelRequest,
          status: "CANCELLED02",
          isActive: false,
          cancelled02: {
            time: new Date(),
            name: admin.name,
            rollNo: admin.eid,
          },
        };

        CancelRequest(id, cancelRequest)
          .then((data) => {
            setIsCancelling(false);
            if (data?.updated) {
              setPermissions(newPermissions);
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Cancelled ${cancelRequest.rollNo} Accepted Permission`,
              };
              createLog(myLog);

              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `Cancelled ${cancelRequest.rollNo} Accepted Permission`,
                  detail: data?.message,
                });
              }
            } else {
              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `Failed to Cancel ${rollNo} Accepted ${type}`,
                  detail: data?.message,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const reject = () => { };

    confirmDialog({
      message: `Do you want to cancel \`${rollNo}\` Accepted  ${type} ?`,
      header: "Cancel Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
    });
  };

  const handleRequestArrive = (id: string, rollNo: string, type: string) => {
    const accept = () => {
      setActiveRID(id);
      setIsArriving(true);
      if (type === "LEAVE") {
        let arrRequest = leaves.filter((request) => request.id === id)[0];
        let newLeaves = leaves.filter((request) => request.id !== id);
        arrRequest = {
          ...arrRequest,
          status: "ARRIVED",
          isActive: false,
          arrived: {
            time: new Date(),
            name: admin.name,
            eid: admin.eid,
          },
        };

        ArriveRequest(id, arrRequest)
          .then((data) => {
            setIsArriving(false);
            if (data?.updated) {
              setLeaves(newLeaves);
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Arrived ${arrRequest.rollNo} from Leave`,
              };
              createLog(myLog);

              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,

                  summary: `${rollNo} is Arrived from ${type}`,
                  detail: data?.message,
                });
              }
            } else {
              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,

                  summary: `Failed to update Arrival of ${rollNo} ${type}`,
                  detail: data?.message,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (type === "PERMISSION") {
        let arrRequest = permissions.filter((request) => request.id === id)[0];
        let newPermissions = permissions.filter((request) => request.id !== id);

        arrRequest = {
          ...arrRequest,
          status: "ARRIVED",
          isActive: false,
          arrived: {
            time: new Date(),
            name: admin.name,
            eid: admin.eid,
          },
        };

        ArriveRequest(id, arrRequest)
          .then((data) => {
            setIsArriving(false);
            if (data?.updated) {
              setPermissions(newPermissions);
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Arrived ${arrRequest.rollNo} from Permission`,
              };
              createLog(myLog);

              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `${rollNo} is Arrived from ${type}`,
                  detail: data?.message,
                });
              }
            } else {
              if (activeRequestToast?.current) {
                activeRequestToast?.current.show({
                  severity: "info",
                  sticky: true,
                  summary: `Failed to update Arrival of ${rollNo} ${type}`,
                  detail: data?.message,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const reject = () => { };

    confirmDialog({
      message: `Is \`${rollNo}\` Arrived from ${type} ?`,
      header: "Arrived Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
    });
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
      />
    );
  };

  return (
    <>
      <Toast ref={activeRequestToast} position="center" />

      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Active Requests" className="special-font">
          <div className="card flex justify-content-center">
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="inc-act-req-permissions"
                  name="Permissions"
                  value="Permissions"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Permissions"}
                />
                <label htmlFor="inc-act-req-permissions" className="ml-2">
                  Permissions
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="inc-Act-req-leaves"
                  name="Leaves"
                  value="Leaves"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Leaves"}
                />
                <label htmlFor="inc-Act-req-leaves" className="ml-2">
                  Leaves
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={
            selectionOption === "Leaves"
              ? `Leaves : ${leaves.length}`
              : `Permissions : ${permissions.length}`
          }
          className="mt-2 special-font"
        >
          {selectionOption === "Leaves" ? (
            <DataTable
              value={leaves}
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              selectionMode={"single"}
              stripedRows
              tableStyle={{ minWidth: "50rem" }}
            >
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
              <Column
                field="hostelId"
                className="font-bold"
                header="Hostel ID"
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
              <Column body={CancelButton}></Column>
              <Column body={ArrivedButton}></Column>
            </DataTable>
          ) : (
            <DataTable
              value={permissions}
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              selectionMode={"single"}
              tableStyle={{ minWidth: "50rem" }}
              stripedRows
            >
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
              <Column
                field="hostelId"
                className="font-bold"
                header="Hostel Id"
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
              <Column body={CancelButton}></Column>
              <Column body={ArrivedButton}></Column>
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}

export default AdminActiveRequests;
