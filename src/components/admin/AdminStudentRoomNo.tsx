import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Student } from "../interfaces/Student";
import { Card } from "primereact/card";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { GetStudentsByRoomNo } from "../../services/AdminService";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

function AdminStudentRoomNo() {
  const [hostelId, setHostelId] = useState<{ name: string; code: string }>();
  const [roomNo, setRoomNo] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const hostelIds = [
    { name: "BH1", code: "BH1" },
    { name: "GH1", code: "GH1" },
  ];

  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [imageURLS, setImageURLS] = useState<
    { username: string; imagePath: string }[]
  >([]);

  useEffect(() => {
    setIsFormValid(false);
    if (hostelId && roomNo) {
      setIsFormValid(true);
    }
  }, [hostelId, roomNo]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    GetStudentsByRoomNo(hostelId?.code as string, roomNo)
      .then((data) => {
        setStudentsList(data?.hostlers)
        setImageURLS(data?.images)
        setIsSearching(false);
      })
      .catch((err) => {
        console.log("Error : while fetching students data by room no", err);
      });
  };

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
      <div
        className="w-full p-2"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Room No" className="special-font">
          <form action="" className="mt-2 grid" onSubmit={handleFormSubmit}>
            <div className="col-12 sm:col-4">
              <FloatLabel>
                <Dropdown
                  value={hostelId}
                  onChange={(e: DropdownChangeEvent) => setHostelId(e.value)}
                  options={hostelIds}
                  optionLabel="name"
                  placeholder="Hostel ID"
                  className="w-full md:w-14rem"
                  inputId="ad-roomno-hostelid"
                  required
                />
                <label htmlFor="ad-roomno-hostelid">Hostel ID</label>
              </FloatLabel>
            </div>
            <div className="col-12 sm:col-4">
              <FloatLabel>
                <InputText
                  id="ad-roomNo-stu-roomNo"
                  type="number"
                  className="col-12"
                  value={roomNo}
                  onChange={(e) => {
                    setRoomNo(e.target.value.trim());
                  }}
                  required
                />
                <label htmlFor="ad-roomNo-stu-roomNo">Room No</label>
              </FloatLabel>
            </div>
            <div className="col-12 sm:col-4">
              <Button
                type="submit"
                disabled={!isFormValid}
                icon={isSearching ? "pi pi-spin pi-spinner" : "pi pi-search"}
                label={isSearching ? "Searching" : "Search"}
              ></Button>
            </div>
          </form>
        </Card>
        <Card className="mt-2">
          <DataTable
            value={studentsList}

            selectionMode={"single"}
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

export default AdminStudentRoomNo;
