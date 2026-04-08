import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import React, { useState } from "react";

function TodayRequestsView(props: any) {
  const { permissions, leaves } = props;
  const [selectionOption, setSelectionOption] = useState<string>("Permissions");

  const tableFooter = `Total : ${
    selectionOption === "Leaves" ? leaves.length : permissions.length
  } ${selectionOption}`;

  const renderHeader = () => {
    return (
      <div className="flex justify-content-center">

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
    );
  };

  const tableHeader = renderHeader();
  return (
    <>
      <DataTable
        value={selectionOption === "Leaves" ? leaves : permissions}
        stripedRows
        header={tableHeader}
        footer={tableFooter}
        selectionMode="single"
      >
        <Column
          field="rollNo"
          className="font-bold"
          header="Roll Number"
        ></Column>
        <Column field="name" className="font-bold" header="Name"></Column>
        <Column field="id" className="font-bold" header="Request ID"></Column>

      </DataTable>
    </>
  );
}

export default TodayRequestsView;
