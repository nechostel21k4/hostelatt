import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAllStudents } from "../../services/InchargeService";
import { Student } from "../interfaces/Student";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import {
  createLog,
  DeleteMultipleStudents,
  UpdateMultipleStudents,
} from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";
import { Dialog } from "primereact/dialog";
import DownloadExcel from "../../charts/DownloadExcel";

function AdminStudentList() {
  const [hostelId, setHostelId] = useState<string>("label");

  const [college, setCollege] = useState<string>("label");
  const [year, setYear] = useState<string>("label");
  const [branch, setBranch] = useState<string>("label");

  const [isListSearching, setIsListSearching] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [selectedStudents, setSelectedStudents] = useState<Student[] | []>([]);

  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const mytoast = useRef<Toast>(null);

  const [currentYear, setCurrentYear] = useState<string>("ALL");
  const [newYear, setNewYear] = useState<string>("");

  const admin = useContext(AdminContext);

  const [imageURLS, setImageURLS] = useState<
    { username: string; imagePath: string }[]
  >([]);

  useEffect(() => {
    if (currentYear !== "ALL") {
      setNewYear((Number(currentYear) + 1).toString());
    } else {
      setNewYear("ALL");
    }
  }, [currentYear]);

  const validateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      hostelId !== "label" &&
      college !== "label" &&
      year !== "label" &&
      branch !== "label"
    ) {
      setIsFormValid(true);
    }
  }, [hostelId, college, year, branch]);

  useEffect(() => {
    validateForm();
  }, [hostelId, college, year, branch, validateForm]);

  const handleBulkUpdate = () => {
    const accept = () => {
      if (selectedStudents.length > 0) {
        setIsUpdating(true);
        const selectedRollNo = new Set(
          selectedStudents.map((ele) => ele.rollNo)
        );
        const result1 = studentsList.filter(
          (item) => !selectedRollNo.has(item.rollNo)
        );
        const result2 = studentsList.filter((item) =>
          selectedRollNo.has(item.rollNo)
        );
        const result3 = result2.map((item) => {
          return { ...item, year: newYear };
        });

        UpdateMultipleStudents(Array.from(selectedRollNo), newYear).then(
          (data) => {
            setIsUpdating(false);
            const { isUpdated, message } = data;

            if (isUpdated) {
              setStudentsList([...result1, ...result3]);
              setSelectedStudents([]);
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: ` ${selectedRollNo.size} students are updated from ${currentYear} year to ${newYear} in ${branch} branch of ${college} college`,
              };
              createLog(myLog);

              if (mytoast.current) {
                mytoast.current.show({
                  severity: "success",
                  summary: "Updated Successfully !",
                  detail: message,
                });
              }
            } else {
              if (mytoast.current) {
                mytoast.current.show({
                  severity: "error",
                  summary: "Update Failed !",
                  detail: "Failed to update.Try Again",
                });
              }
            }
          }
        );
      }
    };
    const reject = () => { };

    confirmDialog({
      message: `Do you really want to update year from ${currentYear} to ${newYear} of ${selectedStudents.length} selected students.`,
      header: "Update Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
    });
  };

  const handleBulkDelete = () => {
    const accept = () => {
      setIsDeleting(true);
      const selectStudentRollNo = new Set(
        selectedStudents.map((item) => item.rollNo)
      );
      const result1 = studentsList.filter(
        (item) => !selectStudentRollNo.has(item.rollNo)
      );

      DeleteMultipleStudents(Array.from(selectStudentRollNo)).then((data) => {
        setIsDeleting(false);
        const { isDeleted, message } = data;
        if (isDeleted) {
          setStudentsList(result1);
          setSelectedStudents([]);
          let myLog: LOG = {
            date: new Date(),
            userId: admin.eid,
            username: admin.name as string,
            action: `${selectStudentRollNo.size} Students are deleted from ${currentYear} year ${branch} branch in ${college} college (${message})`,
          };
          createLog(myLog);
          if (mytoast.current) {
            mytoast.current.show({
              severity: "success",
              summary: "Deleted Successfully !",
              detail: `${selectStudentRollNo.size} Students are deleted from ${currentYear} year ${branch} branch in ${college} college`,
            });
          }
        } else {
          if (mytoast.current) {
            mytoast.current.show({
              severity: "error",
              summary: "Delete Failed !",
              detail: `Failed to delete.Try again`,
            });
          }
        }
      });
    };

    const reject = () => { };

    confirmDialog({
      message: `Do you want to delete ${selectedStudents.length} selected students from ${college} college in ${currentYear} year`,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const tableFooter = () => {
    return (
      <>
        <div className="grid">
          <div className="item-1 col-6 sm:col-3 flex align-items-center">
            <p className="w-full">
              Total : {studentsList ? studentsList.length : 0} Students.
            </p>
          </div>

          {enableEdit && (
            <div className="item-2 col-6 sm:col-3 flex align-items-center">
              <Button
                type="button"
                severity="danger"
                icon={!isDeleting && "pi pi-trash"}
                onClick={handleBulkDelete}
                disabled={isDeleting || !(selectedStudents.length > 0)}
              >
                {isDeleting && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isDeleting ? "Deleting" : "Delete"}&nbsp;&nbsp;
              </Button>
            </div>
          )}

          {enableEdit && (
            <div className="item-3 flex-column col-12 sm:col-6">
              <div className="head w-full p-0 w-0">
                <Button
                  className="w-full"
                  disabled
                  label="Change Year"
                  severity="secondary"
                  text
                  raised
                ></Button>
              </div>
              <div className="grid mt-2">
                <Button
                  disabled
                  className="col-2"
                  label="From"
                  text
                  raised
                  severity="secondary"
                ></Button>
                <Button
                  disabled
                  className="col-2"
                  label={currentYear}
                  text
                  raised
                ></Button>
                <Button
                  disabled
                  className="col-2"
                  label="To"
                  text
                  raised
                  severity="secondary"
                ></Button>
                <select
                  value={newYear}
                  style={{ height: "38px" }}
                  className=" col-2 p-card text-primary text-center border-none outline-none"
                  onChange={(e) => {
                    setNewYear(e.target.value);
                  }}
                  disabled={
                    !(selectedStudents.length > 0) || currentYear === "ALL"
                  }
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
                <Button
                  type="button"
                  onClick={handleBulkUpdate}
                  disabled={
                    isUpdating ||
                    currentYear === "ALL" ||
                    !(selectedStudents.length > 0)
                  }
                  label={isUpdating ? "Updating" : "Update"}
                  severity="success"
                  className="col-4 text-center"
                >
                  {isUpdating && <i className="pi pi-spin pi-spinner"></i>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const handleListStudentForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsListSearching(true);
    getAllStudents({
      hostelId: hostelId,
      college: college,
      year: year,
      branch: branch,
    })
      .then((data) => {
        setIsListSearching(false);
        setStudentsList(data?.hostlers);
        setImageURLS(data?.images);
        setCurrentYear(year);
        setSelectedStudents([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between p-0 m-0">
        <Button
          type="button"
          // icon={enableEdit ? "pi pi-times" : "pi pi-pen-to-square"}
          label={enableEdit ? "Cancel" : "Edit"}
          outlined
          onClick={() => {
            if (enableEdit) {
              setSelectedStudents([]);
            }
            setEnableEdit((prevvalue) => !prevvalue);
          }}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            id="ad-stu-list-filter"
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
  const StudentListHeader = (
    <h2 className="m-0 pt-3 pl-3 special-font">Students List</h2>
  );

  const [dwnldDialogVisible, setdwnldDialogVisible] = useState<boolean>(false);

  const paginatorRight = (
    <Button
      type="button"
      onClick={() => setdwnldDialogVisible(true)}
      icon="pi pi-download"
      text
    />
  );

  const imageBodyTemplate = (student: any) => {
    let image = imageURLS.find((image) => image.username === student.rollNo);
    return (
      <img
        src={image?.imagePath ? image?.imagePath : "/images/Avatar.jpg"}
        className="w-6rem h-6rem shadow-2 border-round"
      />
    );
  };

  return (
    <>
      <Dialog
        header={`${college}-clg__${year}-yr__${branch}-dept__${hostelId.toUpperCase() === "ALL"
            ? "Boys-Girls"
            : hostelId.toUpperCase() === "BH1"
              ? "Boys"
              : hostelId.toUpperCase() === "GH1"
                ? "Girls"
                : ""
          }.xlsx`}
        visible={dwnldDialogVisible}
        onHide={() => {
          if (!dwnldDialogVisible) return;
          setdwnldDialogVisible(false);
        }}
        className="w-10 md:w-8 lg:w-6 special-font"
      >
        <DownloadExcel
          selectedStudents={selectedStudents}
          filename={`${college}-clg__${year}-yr__${branch}-dept__${hostelId.toUpperCase() === "ALL"
              ? "Boys-Girls"
              : hostelId.toUpperCase() === "BH1"
                ? "Boys"
                : hostelId.toUpperCase() === "GH1"
                  ? "Girls"
                  : ""
            }`}
        />
      </Dialog>

      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card header={StudentListHeader}>
          <form onSubmit={handleListStudentForm} className="grid">
            <div className="col-12 sm:col-6  md:col-3 mt-3">
              <div className="custom-select-container w-12">
                <select
                  className="custom-select"
                  id="ad-stu-list-hostelId"
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

            <div className="col-12 sm:col-6  md:col-3 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-stu-list-college"
                  value={college}
                  onChange={(e) => {
                    setCollege(e.target.value);
                  }}
                >
                  <option value="label" disabled>
                    Select College
                  </option>
                  <option value="ALL">All</option>
                  <option value="NEC">NEC</option>
                  <option value="NIPS">NIPS</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>
            </div>

            <div className="col-12 sm:col-6  md:col-3 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-stu-list-year"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                  }}
                >
                  <option value="label" disabled>
                    Select Year
                  </option>
                  <option value="ALL">All</option>
                  <option value="1">I Year</option>
                  <option value="2">II Year</option>
                  <option value="3">III Year</option>
                  <option value="4">IV Year</option>
                  <option value="5">V Year</option>
                  <option value="6">VI Year</option>
                </select>
              </div>
            </div>

            <div className="col-12 sm:col-6  md:col-3 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-stu-list-branch"
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                  }}
                >
                  <option value="label" disabled>
                    Select Branch
                  </option>
                  <option value="ALL">All</option>
                  <option value="AI&ML">AI & ML</option>
                  <option value="BPHARMACY">B Pharmacy</option>
                  <option value="CAI">CAI</option>
                  <option value="CE">CIVIL</option>
                  <option value="CS">CS (Cyber Security)</option>
                  <option value="CSE">CSE</option>
                  <option value="CSE-AI">CSE-AI</option>
                  <option value="CSM(AI&ML)">CSM(AI&ML)</option>
                  <option value="DS">DS (Data Science)</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="IT">IT</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="ME">MECH</option>
                  <option value="PHARMD">Pharm D</option>
                </select>
              </div>
            </div>

            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <Button type="submit" disabled={!isFormValid || isListSearching}>
                {isListSearching && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isListSearching ? "Searching" : "Search"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-2">
          <Toast ref={mytoast} position="bottom-center"></Toast>

          <DataTable
            value={studentsList}
            stripedRows
            header={tableHeader}
            removableSort
            globalFilter={globalFilterValue}
            scrollable
            footer={tableFooter}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
            selectionMode={"checkbox"}
            selection={selectedStudents}
            onSelectionChange={(e) => setSelectedStudents(e.value)}
            paginatorRight={paginatorRight}
          >
            <Column
              selectionMode="multiple"
              frozen
              headerStyle={{ width: "3rem" }}
            ></Column>

            <Column
              field="roomNo"
              header="Room No"
              sortable
              className="font-bold"
            ></Column>
            <Column
              header="Profile Image"
              body={imageBodyTemplate}
              className="font-bold"
            ></Column>

            <Column
              field="rollNo"
              header="Roll Number"
              sortable
              className="font-bold"
            ></Column>
            <Column field="name" header="Name"></Column>
            <Column field="college" header="College"></Column>
            <Column field="year" header="Year"></Column>
            <Column field="branch" header="Branch"></Column>
            <Column field="phoneNo" header="Phone No"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="parentName" header="Parent Name"></Column>
            <Column field="parentPhoneNo" header="Parent PhoneNo"></Column>
            <Column field="currentStatus" header="Status"></Column>
          </DataTable>
        </Card>
      </div>
    </>
  );
}

export default AdminStudentList;
