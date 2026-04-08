import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column, ColumnEditorOptions } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import {
  AddandGetAllBranches,
  AddandGetAllColleges,
  AddandGetAllHostels,
  deleteBranchData,
  deleteCollegeData,
  deleteHostelData,
  getAllBranches,
  getAllColleges,
  getAllHostels,
  updateBranchData,
  updateCollegeData,
  updateHostelData,
} from "../../services/SchemaService";

interface College {
  _id: string;
  code: string;
  name: string;
}

interface Branch {
  _id: string;
  code: string;
  name: string;
}

interface Hostel {
  _id: string;
  code: string;
  name: string;
}

function AdminSchemas() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);

  const [activeID, setActiveID] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    getAllColleges().then((data) => {
      if (data?.colleges) {
        setColleges(data?.colleges);
      }
    });
  }, []);


  useEffect(() => {
    getAllBranches().then((data) => {
      if (data?.branches) {
        setBranches(data?.branches);
      }
    });
  }, []);

  useEffect(() => {
    getAllHostels().then((data) => {
      if (data?.hostels) {
        setHostels(data?.hostels);
      }
    });
  }, []);

  const onCollegeRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    let _colleges = [...colleges];
    let { newData, index } = e;

    _colleges[index] = newData as College;

    setColleges(_colleges);
  };

  const onBranchRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    let _branches = [...branches];
    let { newData, index } = e;

    _branches[index] = newData as Branch;

    setBranches(_branches);
  };

  const onHostelRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    let _hostels = [...hostels];
    let { newData, index } = e;

    _hostels[index] = newData as Hostel;

    setHostels(_hostels);
  };

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={(options.value as string).trim()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          options.editorCallback!((e.target.value as string).trim())
        }
      />
    );
  };

  const textEditorUppercase = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={(options.value as string).trim()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          options.editorCallback!(
            (e.target.value as string).trim().toUpperCase()
          )
        }
      />
    );
  };

  const handleCollegeUpdate = (data: College) => {
    const accept = () => {
      setActiveID(data._id);
      setIsUpdating(true);
      updateCollegeData(data, data._id)
        .then((data) => {
          setActiveID("");
          setIsUpdating(false);
          if (data?.success) {
            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Updated Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Update.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while updating college data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Update?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const handleCollegeDelete = (data: College) => {
    const accept = () => {
      setActiveID(data._id);
      setIsDeleting(true);
      deleteCollegeData(data._id)
        .then((result) => {
          setActiveID("");
          setIsDeleting(false);
          if (result?.success) {
            let newColleges = colleges.filter(
              (clg: College) => clg._id !== data._id
            );
            setColleges(newColleges);

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Deleted Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Delete.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while deleting college data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Delete?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const CollegeUpdateButton = (data: College) => {
    return (
      <>
        <Button
          label={isUpdating && activeID === data._id ? "Updating" : "Update"}
          icon={
            isUpdating && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-save"
          }
          severity="success"
          onClick={() => {
            handleCollegeUpdate(data);
          }}
        ></Button>
      </>
    );
  };

  const CollegeDeleteButton = (data: College) => {
    return (
      <>
        <Button
          label={isDeleting && activeID === data._id ? "Deleting" : "Delete"}
          icon={
            isDeleting && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-trash"
          }
          severity="danger"
          onClick={() => {
            handleCollegeDelete(data);
          }}
        ></Button>
      </>
    );
  };

  const handleAddCollege = () => {
    const accept = () => {
      AddandGetAllColleges()
        .then((data) => {
          if (data?.success) {
            if (data?.colleges) {
              setColleges(data?.colleges);
            }

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "New College added successfully.Please Edit",
              });

          } else {

            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to add new college. Try again",
              });

          }
        })
        .catch((err) => {
          console.log("Error : while getting all college names", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Add new College?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",

      accept,
      reject,
    });
  };



  const handleBranchUpdate = (data: Branch) => {
    const accept = () => {
      setActiveID(data._id);
      setIsUpdating(true);
      updateBranchData(data, data._id)
        .then((data) => {
          setActiveID("");
          setIsUpdating(false);
          if (data?.success) {
            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Updated Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Update.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while updating branch data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Update?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const handleBranchDelete = (data: Branch) => {
    const accept = () => {
      setActiveID(data._id);
      setIsDeleting(true);
      deleteBranchData(data._id)
        .then((result) => {
          setActiveID("");
          setIsDeleting(false);
          if (result?.success) {
            let newBranches = branches.filter(
              (branch: Branch) => branch._id !== data._id
            );
            setBranches(newBranches);

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Deleted Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Delete.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while deleting branch data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Delete?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const BranchUpdateButton = (data: Branch) => {
    return (
      <>
        <Button
          label={isUpdating && activeID === data._id ? "Updating" : "Update"}
          icon={
            isUpdating && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-save"
          }
          severity="success"
          onClick={() => {
            handleBranchUpdate(data);
          }}
        ></Button>
      </>
    );
  };

  const BranchDeleteButton = (data: Branch) => {
    return (
      <>
        <Button
          label={isDeleting && activeID === data._id ? "Deleting" : "Delete"}
          icon={
            isDeleting && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-trash"
          }
          severity="danger"
          onClick={() => {
            handleBranchDelete(data);
          }}
        ></Button>
      </>
    );
  };

  const handleAddBranch = () => {
    const accept = () => {
      AddandGetAllBranches()
        .then((data) => {
          if (data?.success) {
            if (data?.branches) {
              setBranches(data?.branches);
            }

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "New Branch added successfully.Please Edit",
              });

          } else {

            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to add new branch. Try again",
              });

          }
        })
        .catch((err) => {
          console.log("Error : while getting all branch names", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Add new Branch?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",

      accept,
      reject,
    });
  };



  const handleHostelUpdate = (data: Hostel) => {
    const accept = () => {
      setActiveID(data._id);
      setIsUpdating(true);
      updateHostelData(data, data._id)
        .then((data) => {
          setActiveID("");
          setIsUpdating(false);
          if (data?.success) {
            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Updated Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Update.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while updating hostel data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Update?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const handleHostelDelete = (data: Hostel) => {
    const accept = () => {
      setActiveID(data._id);
      setIsDeleting(true);
      deleteHostelData(data._id)
        .then((result) => {
          setActiveID("");
          setIsDeleting(false);
          if (result?.success) {
            let newHostels = hostels.filter(
              (hostel: Hostel) => hostel._id !== data._id
            );
            setHostels(newHostels);

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Deleted Successfully !",
              });
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to Delete.Try again",
              });
          }
        })
        .catch((err) => {
          console.log("Error : while deleting hostel data", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Delete?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      accept,
      reject,
    });
  };

  const HostelUpdateButton = (data: Hostel) => {
    return (
      <>
        <Button
          label={isUpdating && activeID === data._id ? "Updating" : "Update"}
          icon={
            isUpdating && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-save"
          }
          severity="success"
          onClick={() => {
            handleHostelUpdate(data);
          }}
        ></Button>
      </>
    );
  };

  const HostelDeleteButton = (data: Hostel) => {
    return (
      <>
        <Button
          label={isDeleting && activeID === data._id ? "Deleting" : "Delete"}
          icon={
            isDeleting && activeID === data._id
              ? "pi pi-spin pi-spinner"
              : "pi pi-trash"
          }
          severity="danger"
          onClick={() => {
            handleHostelDelete(data);
          }}
        ></Button>
      </>
    );
  };

  const handleAddHostel = () => {
    const accept = () => {
      AddandGetAllHostels()
        .then((data) => {
          if (data?.success) {
            if (data?.hostels) {
              setHostels(data?.hostels);
            }

            toast.current &&
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "New Hostel added successfully.Please Edit",
              });

          } else {

            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Failed to add new hostel. Try again",
              });

          }
        })
        .catch((err) => {
          console.log("Error : while getting all hostel names", err);
        });
    };

    const reject = () => { };

    confirmDialog({
      message: "Are you sure you want to Add new Hostel?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",

      accept,
      reject,
    });
  };





  return (
    <>
      <div
        className="w-full p-2"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Toast ref={toast} position="center" />
        <Card title="College Schema" className="special-font mb-3">
          <DataTable
            value={colleges}
            stripedRows
            selectionMode={"single"}
            editMode="row"
            dataKey="_id"
            onRowEditComplete={onCollegeRowEditComplete}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="code"
              header="College Code"
              editor={(options) => textEditorUppercase(options)}
            ></Column>
            <Column
              field="name"
              header="College Name"
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
            <Column body={CollegeUpdateButton}></Column>
            <Column body={CollegeDeleteButton}></Column>
          </DataTable>
          <div className="mt-3">
            <Button
              label="New"
              onClick={handleAddCollege}
              icon="pi pi-plus-circle"
            ></Button>
          </div>
        </Card>

        <Card title="Branch Schema" className="special-font ">
          <DataTable
            value={branches}
            stripedRows
            selectionMode={"single"}
            editMode="row"
            dataKey="_id"
            onRowEditComplete={onBranchRowEditComplete}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="code"
              header="Branch Code"
              editor={(options) => textEditorUppercase(options)}
            ></Column>
            <Column
              field="name"
              header="Branch Name"
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
            <Column body={BranchUpdateButton}></Column>
            <Column body={BranchDeleteButton}></Column>
          </DataTable>
          <div className="mt-3">
            <Button
              label="New"
              onClick={handleAddBranch}
              icon="pi pi-plus-circle"
            ></Button>
          </div>
        </Card>

        <Card title="Hostel Schema" className="special-font mt-3 mb-3">
          <DataTable
            value={hostels}
            stripedRows
            selectionMode={"single"}
            editMode="row"
            dataKey="_id"
            onRowEditComplete={onHostelRowEditComplete}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="code"
              header="Hostel Code"
              editor={(options) => textEditorUppercase(options)}
            ></Column>
            <Column
              field="name"
              header="Hostel Name"
              editor={(options) => textEditor(options)}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
            <Column body={HostelUpdateButton}></Column>
            <Column body={HostelDeleteButton}></Column>
          </DataTable>
          <div className="mt-3">
            <Button
              label="New"
              onClick={handleAddHostel}
              icon="pi pi-plus-circle"
            ></Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default AdminSchemas;