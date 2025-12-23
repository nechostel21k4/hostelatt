import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import { Permission, Leave } from "../interfaces/Request";
import {
  formatDate,
  formatDateWithTime,
  formatTime,
  getDateAfterDays,
  getDateBeforeDays,
} from "../interfaces/Date";
import { AcceptedHistory } from "../../services/InchargeService";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

function AdminAcceptedHistory() {
  const [selectionOption, setSelectionOption] = useState<string>("Permissions");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const [timePeriod, setTimePeriod] = useState<string>("label");

  const [fromDate, setFromDate] = useState<Nullable<Date>>(null);
  const [toDate, setToDate] = useState<Nullable<Date>>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const tableFooter = `Total : ${
    selectionOption === "Leaves" ? leaves.length : permissions.length
  } ${selectionOption}`;

  const handleListStudentForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    let starttDate;
    let enddDate;
    if (timePeriod === "last24hrs") {
      starttDate = getDateBeforeDays(new Date(), 1);
      enddDate = new Date();
    } else if (timePeriod === "last3days") {
      starttDate = getDateBeforeDays(new Date(), 2);
      enddDate = getDateBeforeDays(new Date(), 0);
    } else if (timePeriod === "lastweek") {
      starttDate = getDateBeforeDays(new Date(), 6);
      enddDate = getDateBeforeDays(new Date(), 0);
    } else if (timePeriod === "custom") {
      starttDate = fromDate;
      enddDate = getDateAfterDays(toDate as Date, 1);
    }

    AcceptedHistory("all", starttDate as Date, enddDate as Date)
      .then((data) => {
        setIsSearching(false);
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
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          outlined
          onClick={() => {
            setGlobalFilterValue("");
          }}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            id="ad-arr-req-filter"
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

  return (
    <>
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Accepted Requests" className="special-font">
          <form onSubmit={handleListStudentForm} className="grid">
            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-arr-req-timestamp"
                  value={timePeriod}
                  onChange={(e) => {
                    setTimePeriod(e.target.value);
                  }}
                >
                  <option value="label" disabled>
                    Select Time
                  </option>
                  <option value="last24hrs">Last 24 hours</option>
                  <option value="last3days">Last 3 days</option>
                  <option value="lastweek">Last Week</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            {timePeriod === "custom" && (
              <>
                <div className="col-12 sm:col-6  mt-3">
                  <FloatLabel>
                    <Calendar
                      required
                      inputId="inc-arr-req-fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.value)}
                      className="w-12 md:w-8"
                      showButtonBar
                      hourFormat="12"
                      dateFormat="dd/mm/yy"
                    />
                    <label htmlFor="inc-arr-req-fromDate">From Date</label>
                  </FloatLabel>
                </div>
                <div className="col-12  sm:col-6 mt-3">
                  <FloatLabel>
                    <Calendar
                      required
                      inputId="inc-arr-req-toDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.value)}
                      className="w-12 md:w-8"
                      showButtonBar
                      hourFormat="12"
                      dateFormat="dd/mm/yy"
                    />
                    <label htmlFor="inc-arr-req-toDate">To Date</label>
                  </FloatLabel>
                </div>
              </>
            )}

            <div className="col-12 sm:col-6 mt-3">
              <Button
                type="submit"
                label={isSearching ? "Searching" : "Search"}
                disabled={isSearching}
                className="w-full sm:w-auto text-center"
              >
                &nbsp;&nbsp;
                {isSearching && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>

          <div className="card flex justify-content-center mt-5">
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

        <Card title={selectionOption} className="mt-2 special-font" >
          {selectionOption === "Leaves" ? (
            <DataTable
              value={leaves}
              stripedRows
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              scrollable
              footer={tableFooter}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single"
            >
              <Column
                field="rollNo"
                className="font-bold"
                header="Roll Number"
                sortable
                frozen
              ></Column>
              <Column
                field="hostelId"
                className="font-bold"
                header="Hostel ID"
                sortable
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
              <Column field="name" header="Submitted Name"></Column>
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
              ></Column>

              <Column
                field="accepted"
                header="Accepted Name"
                body={acceptedName}
              ></Column>
              <Column
                header="Accepted Time"
                field="accepted"
                body={acceptedTime}
                style={{ minWidth: "120px" }}
              ></Column>

              <Column
                field="arrived"
                header="Arrived Name"
                body={arrivedName}
              ></Column>
              <Column
                header="Arrived Time"
                field="arrived"
                body={arrivedTime}
                style={{ minWidth: "120px" }}
              ></Column>
            </DataTable>
          ) : (
            <DataTable
              value={permissions}
              stripedRows
              header={tableHeader}
              removableSort
              globalFilter={globalFilterValue}
              scrollable
              footer={tableFooter}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              selectionMode="single"
            >
              <Column
                field="rollNo"
                className="font-bold"
                header="Roll Number"
                sortable
                frozen
              ></Column>
              <Column
                field="hostelId"
                className="font-bold"
                header="Hostel ID"
                sortable
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
              <Column field="name" header="Submitted Name"></Column>
              <Column
                field="submitted"
                header="Submitted Time"
                body={submittedTime}
                style={{ minWidth: "120px" }}
              ></Column>

              <Column
                field="accepted"
                header="Accepted Name"
                body={acceptedName}
              ></Column>
              <Column
                header="Accepted Time"
                field="accepted"
                body={acceptedTime}
                style={{ minWidth: "120px" }}
              ></Column>

              <Column
                field="arrived"
                header="Arrived Name"
                body={arrivedName}
              ></Column>
              <Column
                header="Arrived Time"
                field="arrived"
                body={arrivedTime}
                style={{ minWidth: "120px" }}
              ></Column>
            </DataTable>
          )}
        </Card>
      </div>
    </>
  );
}

export default AdminAcceptedHistory;
