import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { InchargeContext } from "./InchargeHome";
import { getAllStudents } from "../../services/InchargeService";
import { Student } from "../interfaces/Student";

function InchargeStudentList() {
  const incharge = useContext(InchargeContext);

  const [college, setCollege] = useState<string>("label");
  const [year, setYear] = useState<string>("label");
  const [branch, setBranch] = useState<string>("label");

  const [isListSearching, setIsListSearching] = useState<boolean>(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [imageURLS, setImageURLS] = useState<
    { username: string; imagePath: string }[]
  >([]);

  const validateForm = useCallback(() => {
    setIsFormValid(false);
    if (college !== "label" && year !== "label" && branch !== "label") {
      setIsFormValid(true);
    }
  }, [college, year, branch]);

  useEffect(() => {
    validateForm();
  }, [college, year, branch, validateForm]);

  const tableFooter = `Total : ${studentsList ? studentsList.length : 0
    }  Students.`;

  const handleListStudentForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsListSearching(true);
    getAllStudents({
      hostelId: incharge?.hostelId,
      college: college,
      year: year,
      branch: branch,
    })
      .then((data) => {
        setIsListSearching(false);
        setStudentsList(data?.hostlers);
        setImageURLS(data?.images);
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
          label=""
          outlined
          onClick={() => {
            setGlobalFilterValue("");
          }}
        />
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            id="inc-stu-list-filter"
            value={globalFilterValue}
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

  const StudentListTitle = (
    <div className="text-center">
      <Chip
        label={
          incharge?.hostelId === "BH1"
            ? "Boys Hostel (BH1)"
            : incharge?.hostelId === "GH1"
              ? "Girls Hostel (GH1)"
              : ""
        }
        className="bg-primary mt-2"
        icon="pi pi-circle-fill"
      />
    </div>
  );

  const StudentListHeader = (
    <h2 className="m-0 pt-3 pl-3 special-font">Students List</h2>
  );

  const imageBodyTemplate = (student: any) => {
    let image = imageURLS.find((image) => image.username === student.rollNo);
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
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title={StudentListTitle} header={StudentListHeader}>
          <form onSubmit={handleListStudentForm} className="grid">
            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  id="inc-stu-list-college"
                  className="custom-select"
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

            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  id="inc-stu-list-year"
                  className="custom-select"
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

            <div className="col-12 sm:col-6 md:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="inc-stu-list-branch"
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
            selectionMode="single"
          >
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

export default InchargeStudentList;
