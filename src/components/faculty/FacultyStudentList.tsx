import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAllStudents } from "../../services/InchargeService";
import { Student } from "../interfaces/Student";
import {  ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";


function FacultyStudentList() {
  const [hostelId, setHostelId] = useState<string>("label");

  const [college, setCollege] = useState<string>("label");
  const [year, setYear] = useState<string>("label");
  const [branch, setBranch] = useState<string>("label");

  const [isListSearching, setIsListSearching] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const mytoast = useRef<Toast>(null);

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

  const tableFooter = () => {
    return (
      <>
        <p className="w-full">
          Total : {studentsList ? studentsList.length : 0} Students.
        </p>
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
        setStudentsList(data);
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
  const StudentListHeader = <h2 className="m-0 pt-3 pl-3">Students List</h2>;

  return (
    <>
      <ConfirmDialog />

      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card header={StudentListHeader} className="special-font">
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

             <div className="col-12 sm:col-6 mt-3">
              <Button
                type="submit"
                label={isListSearching ? "Searching" : "Search"}
                disabled={ isListSearching}
                className="w-full sm:w-auto text-center"
              >
                &nbsp;&nbsp;
                {isListSearching && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>
        </Card>

        {studentsList && (
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
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
              selectionMode={"single"}
            >
              <Column
                field="rollNo"
                header="Roll Number"
                frozen
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
        )}
      </div>
    </>
  );
}

export default FacultyStudentList;
