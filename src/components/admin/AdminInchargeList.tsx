import { Button } from "primereact/button";
import { Card } from "primereact/card";

import React, { useRef, useState } from "react";
import { Incharge } from "../interfaces/Incharge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getAllIncharges } from "../../services/StudentService";
import { Dialog } from "primereact/dialog";
import AdminViewIncharge from "./AdminViewIncharge";
import { Toast } from "primereact/toast";

function AdminInchargeList() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hostelId, setHostelId] = useState<string>("label");

  const [incharges, setIncharges] = useState<Incharge[]>([]);
  const mytoast = useRef<Toast>(null);

  const [selectedIncharge, setSelectedIncharge] = useState<Incharge | null>(
    null
  );
  const [showInchargeCard, setShowInchrgeCard] = useState<boolean>(false);

  const handleIncSearchForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);

    getAllIncharges(hostelId)
      .then((data) => {
        setIsSearching(false);
        setIncharges(data.incharges);
      })
      .catch((err) => {
        console.log("something wrong", err);
      });
  };

  const requestIDTemplate = (incharge: Incharge) => {
    return (
      <Button
        link
        label={incharge.eid}
        onClick={() => {
          setShowInchrgeCard(true);
          setSelectedIncharge(incharge);
        }}
      />
    );
  };

  const closeDialogAfterDelete = (incEID: string) => {
    setShowInchrgeCard(false);

    let newInchargeList = incharges.filter(
      (incharge) => incharge.eid !== incEID
    );
    setIncharges(newInchargeList);
    if (mytoast.current) {
      mytoast.current.show({
        severity: "error",
        summary: "Incharge Deleted Successfully !",
        detail: `${incEID} incharge has been removed.`,
      });
    }
  };

  const UpdateInchargeAfterClose = (newIncharge: Incharge) => {
    let newInchargeList = incharges.filter(
      (incharge) => incharge.eid !== newIncharge.eid
    );

    newInchargeList = [...newInchargeList, newIncharge];

    setIncharges(newInchargeList);
  };

  return (
    <>
      <Toast ref={mytoast} position="center"></Toast>

      <Dialog
        header="Incharge Details"
        visible={showInchargeCard}
        position="top"
        style={{ width: "50vw" }}
        onHide={() => {
          setShowInchrgeCard(false);
          setSelectedIncharge(null);
        }}
        className="w-11 lg:w-8 special-font"
      >
        <AdminViewIncharge
          incharge={selectedIncharge}
          closeDialog={closeDialogAfterDelete}
          updateIncharges={UpdateInchargeAfterClose}
        />
      </Dialog>

      <div
        className="p-2 w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Incharge List" className="special-font">
          <form onSubmit={handleIncSearchForm} className="grid">
            <div className="col-12 sm:col-6 mt-3">
              <div className="custom-select-container w-12">
                <select
                  className="custom-select"
                  id="ad-inc-list-hostelId"
                  value={hostelId}
                  onChange={(e) => {
                    setHostelId(e.target.value);
                  }}
                >
                  <option value="label" disabled>
                    Hostel ID
                  </option>
                  <option value="all">All</option>
                  <option value="BH1">BH1</option>
                  <option value="GH1">GH1</option>
                </select>
              </div>
            </div>

            <div className="col-12 sm:col-6 mt-3 ">
              <Button
                type="submit"
                label={isSearching ? "Searching" : "Search"}
                className="w-full sm:w-auto text-center"
                disabled={isSearching}
              >
                &nbsp;&nbsp;
                {isSearching && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>
        </Card>
        {incharges && (
          <Card className="mt-2">
            <DataTable
              value={incharges}
              stripedRows
              // header={tableHeader}
              removableSort
              // globalFilter={globalFilterValue}
              scrollable
              // footer={tableFooter}
              // paginator
              rows={20}
              // rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              selectionMode={"single"}
            >
              <Column
                field="eid"
                header="Employee ID"
                sortable
                className="font-bold"
                body={requestIDTemplate}
              ></Column>

              <Column field="hostelId" header="Hostel ID" sortable></Column>
              <Column field="name" header="Name"></Column>
              <Column field="phoneNo" header="Phone No"></Column>
              <Column field="designation" header="Designation"></Column>
            </DataTable>
          </Card>
        )}
      </div>
    </>
  );
}

export default AdminInchargeList;
