import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FloatLabel } from "primereact/floatlabel";
import { Nullable } from "primereact/ts-helpers";
import React, { useContext, useRef, useState } from "react";
import { formatDate, formatDateWithTime } from "../interfaces/Date";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { LOG } from "../interfaces/Log";
import { createLog, deleteLogs, getLogs } from "../../services/AdminService";
import { Divider } from "primereact/divider";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { AdminContext } from "./AdminHome";
import * as XLSX from "xlsx";


function AdminLogs() {
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [logs, setLogs] = useState<LOG[] | null>(null);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const logToast = useRef<Toast>(null);

  const admin = useContext(AdminContext);

  const handleLogsFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    getLogs(date as Date)
      .then((data) => {
        setIsSearching(false);
        data.sort((a: any,b:any)=>new Date(b.date).getTime()-new Date(a.date).getTime())
        setLogs(data);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-download"
          outlined
          onClick={() => {
            exportExcel()
          }}
          disabled={logs?(logs.length>0?false:true):true}
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

  const tableFooter = <strong>Total : {logs?.length} logs</strong>;

  const dateTemplate = (data: any) => {
    const date = data?.date;
    const formatDate = data ? formatDateWithTime(new Date(date)) : "";
    return formatDate;
  };

  const displayPastDate = () => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setMonth(currentDate.getMonth() - 6);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = daysOfWeek[pastDate.getDay()];
    const monthName = monthsOfYear[pastDate.getMonth()];
    const date = pastDate.getDate();
    const year = pastDate.getFullYear();

    return `${dayName}, ${monthName} ${date}, ${year}`;
  };

  const handleDeleteLogs = () => {
    const accept = () => {
      setIsDeleting(true);

      deleteLogs()
        .then((data) => {
          const { isDeleted, message } = data;

          if (isDeleted) {
            let myLog: LOG = {
              date: new Date(),
              userId: admin.eid,
              username: admin.name as string,
              action: `${message} before ${displayPastDate()}`,
            };
            createLog(myLog);

            if (logToast.current) {
              logToast?.current.show({
                severity: "success",
                summary: `Deleted Successfully`,
                detail: `${message} before ${displayPastDate()}`,
              });
            }
          }else{
            if (logToast.current) {
              logToast?.current.show({
                severity: "error",
                summary: `Delete Failed !`,
                detail: `Failed to delete logs`,
              });
            }

          }
        })
        .catch((err) => {
          console.log("something went wrong", err);
        });

      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);
    };

    const reject = () => {};

    confirmDialog({
      message: `Do you want to Delete logs before ${displayPastDate()} ?`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
      id: "inchargependingrequestdialog",
    });
  };

  const exportExcel = () => {
   const worksheet = XLSX.utils.json_to_sheet(logs as LOG[]);
   
         const workbook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
   
         XLSX.writeFile(workbook, `NEC_HOSTEL_LOGS_(${formatDate(date as Date)}).xlsx`);
};



  return (
    <>
      <Toast ref={logToast} position="center" />
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Trace Logs" className="special-font">
          <form onSubmit={handleLogsFormSubmit} className="grid">
            <div className="col-12 sm:col-6  mt-3">
              <FloatLabel>
                <Calendar
                  required
                  inputId="inc-arr-req-fromDate"
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  className="w-12"
                  showButtonBar
                  hourFormat="12"
                  dateFormat="dd/mm/yy"
                />
                <label htmlFor="inc-arr-req-fromDate">Enter Date</label>
              </FloatLabel>
            </div>

            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <Button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto text-center"
                label={isSearching ? "Searching" : "Search"}
              >
                &nbsp;&nbsp;
                {isSearching && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>

          {logs && (
            <>
              <DataTable
                value={logs}
                stripedRows
                className="mt-2"
                header={tableHeader}
                footer={tableFooter}
                selectionMode="single"
                globalFilter={globalFilterValue}
                removableSort
              >
                <Column
                  header="Logged Time"
                  field="date"
                  body={dateTemplate}
                  style={{ minWidth: "120px" }}
                  sortable
                ></Column>

                <Column field="userId" header="User ID" sortable></Column>
                <Column field="username" header="Username"></Column>
                <Column
                  field="action"
                  header="Action"
                ></Column>
              </DataTable>
            </>
          )}
        </Card>

        <Divider align="center">
          <span className="p-tag">OR</span>
        </Divider>

        <Card title={"Delete Logs"} className="special-font">
          <ul>
            <li>NEC Hostel Portal maintains last 6 months log data</li>
            <li>
              Click following Button to delete logs before date{" "}
              <strong>{displayPastDate()}</strong>
            </li>
          </ul>
          <Button
            label={isDeleting ? "Deleting" : "Delete"}
            icon={isDeleting ? "pi pi-spin pi-spinner" : "pi pi-trash"}
            severity="danger"
            onClick={handleDeleteLogs}
          ></Button>
        </Card>
      </div>
    </>
  );
}

export default AdminLogs;
