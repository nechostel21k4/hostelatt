import { Card } from "primereact/card";
import React, { useContext, useEffect, useState } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { Permission, Leave } from "../interfaces/Request";
import { formatDate, formatDateWithTime, formatTime } from "../interfaces/Date";

import { StudentContext } from "./StudentHome";
import { getStudentAllRequests } from "../../services/StudentService";
import { Dialog } from "primereact/dialog";
import ReqCard from "./ReqCard";

function History() {
  const { student, updateStudent } = useContext(StudentContext);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [selectionOption, setSelectionOption] = useState<string>("Permissions");

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const tableFooter = `Total : ${
    selectionOption === "Leaves" ? leaves.length : permissions.length
  } ${selectionOption}`;

  const [showRequestCard, setShowRequestCard] = useState<boolean>(false);

  const [selectedRequest, setSelectedRequest] = useState<
    Permission | Leave | null
  >(null);

  useEffect(() => {
    getStudentAllRequests(student?.rollNo)
      .then((data) => {
        let leaves: any = [];
        let permissions: any = [];

        data.forEach((request: any) => {
          if (request.type === "LEAVE") {
            leaves = [...leaves, request];
          } else if (request.type === "PERMISSION") {
            permissions = [...permissions, request];
          }
        });
        setLeaves(leaves);
        setPermissions(permissions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [student]);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label=""
          outlined
          onClick={() => {
            setGlobalFilterValue("");
          }}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={(e) => {
              setGlobalFilterValue(e.target.value);
            }}
            placeholder="Search"
            name="stu-hist-globalsearch"
          />
        </IconField>
      </div>
    );
  };
  const tableHeader = renderHeader();

  const submittedTime = (data: any) => {
    if (data.submitted) {
      const date = data?.submitted?.time;
      const formatDate = data ? formatDateWithTime(new Date(date)) : "";
      return formatDate;
    }
    return "";
  };

  const acceptedTime = (data: any) => {
    if (data.accepted) {
      const date = data?.accepted?.time;
      const formatDate = data ? formatDateWithTime(new Date(date)) : "";
      return formatDate;
    }
    return "";
  };

  const rejectedTime = (data: any) => {
    if (data.rejected) {
      const date = data?.rejected?.time;
      const formatDate = data ? formatDateWithTime(new Date(date)) : "";
      return formatDate;
    }
    return "";
  };

  const arrivedTime = (data: any) => {
    if (data.arrived) {
      const date = data?.arrived?.time;
      const formatDate = data ? formatDateWithTime(new Date(date)) : "";
      return formatDate;
    }
    return "";
  };

  const acceptedName = (data: any) => {
    if (data.accepted) {
      const name = data?.accepted?.name;
      return name;
    }
    return "";
  };

  const rejectedName = (data: any) => {
    if (data.rejected) {
      const name = data?.rejected?.name;
      return name;
    }
    return "";
  };

  const arrivedName = (data: any) => {
    if (data.arrived) {
      const name = data?.arrived?.name;
      return name;
    }
    return "";
  };

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

  const requestIDTemplate = (request: Permission | Leave) => {
    return (
      <Button
        link
        label={request.id}
        onClick={() => {
          setShowRequestCard(true);
          setSelectedRequest(request);
        }}
      />
    );
  };

  return (
    <>
      <div
        className="p-1 w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Dialog
          header="Request Details"
          visible={showRequestCard}
          position="top"
          style={{ overflow: "scroll", height: "100%" }}
          onHide={() => {
            setShowRequestCard(false);
            setSelectedRequest(null);
          }}
          className="w-11 lg:w-8 special-font"
        >
          <ReqCard request={selectedRequest} />
        </Dialog>
        <Card title="Request History">
          <div className="card flex justify-content-center">
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="not-app-permissions"
                  name="Permissions"
                  value="Permissions"
                  onChange={(e: RadioButtonChangeEvent) => {
                    setSelectionOption(e.value);
                  }}
                  checked={selectionOption === "Permissions"}
                />
                <label htmlFor="not-app-permissions" className="ml-2">
                  Permissions
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="not-app-leaves"
                  name="Leaves"
                  value="Leaves"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Leaves"}
                />
                <label htmlFor="not-app-leaves" className="ml-2">
                  Leaves
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title={`${selectionOption} : ${
            selectionOption === "Leaves" ? leaves.length : permissions.length
          }`}
          className="mt-2 special-font"
        >
          {selectionOption === "Leaves" ? (
            <DataTable
              value={leaves}
              stripedRows
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single"
            >
              <Column
                field="id"
                className="font-bold"
                header="Request Id"
                body={requestIDTemplate}
                sortable
              ></Column>
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
              ></Column>
              <Column
                header="From Date"
                field="fromDate"
                style={{ minWidth: "120px" }}
                body={fromDateTemplate}
              ></Column>
              <Column
                header="To Date"
                field="toDate"
                style={{ minWidth: "120px" }}
                body={toDateTemplate}
              ></Column>
              <Column field="reason" header="Reason"></Column>
              
            </DataTable>
          ) : (
            <DataTable
              value={permissions}
              stripedRows
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              scrollable
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single"
            >
              
              <Column
                field="id"
                className="font-bold"
                header="Request Id"
                body={requestIDTemplate}
                sortable
              ></Column>
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
              ></Column>
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
              
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}

export default History;
