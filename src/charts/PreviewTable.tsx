import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { formatDate } from "../components/interfaces/Date";

const PreviewTable = ({ previewTableData }: { previewTableData: any[] }) => {
  const fromDateTemplate = (data: any) => {
    if (data.dob) {
      const fromDate = formatDate(new Date(data?.dob));
      return fromDate;
    }
    return "";
  };
  return (
    <DataTable
      value={previewTableData}
      stripedRows
      scrollable
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column
        field="rollNo"
        header="Roll Number"
        frozen
        className="font-bold"
      ></Column>
      <Column field="name" header="Name"></Column>
      <Column field="roomNo" header="Room No"></Column>
      <Column field="gender" header="Gender"></Column>
      <Column field="college" header="College"></Column>
      <Column field="year" header="Year"></Column>
      <Column field="branch" header="Branch"></Column>
      <Column field="phoneNo" header="Phone No"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="parentName" header="Parent Name"></Column>
      <Column field="parentPhoneNo" header="Parent PhoneNo"></Column>
    </DataTable>
  );
};

export default PreviewTable;
