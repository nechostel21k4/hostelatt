import React, { useCallback, useEffect, useState } from "react";
import { Student } from "../interfaces/Student";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import ReqCard from "../student/ReqCard";
import { getStudent } from "../../services/StudentService";
import { formatDate } from "../interfaces/Date";

function InchargeViewStudent() {
  const [student, setStudent] = useState<Student | null>(null);

  const [stuRollNumber, setStuRollNumber] = useState<string>("");

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchFormValid, setIsSearchFormValid] = useState<boolean>(false);

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);

    getStudent(stuRollNumber)
      .then((data) => {
        setIsSearching(false);
        if(data.isExist){
          setStudent(data.hosteler);
        }else{
          setStudent(null)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateSearchForm = useCallback(() => {
    setIsSearchFormValid(false);
    const isRollValid = /^[a-zA-Z0-9]{10}$/.test(stuRollNumber);
    if (isRollValid) {
      setIsSearchFormValid(true);
    }
  }, [stuRollNumber]);

  useEffect(() => {
    validateSearchForm();
  }, [stuRollNumber,validateSearchForm]);

  return (
    <>
      <div
        className=" w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Search Student" className="special-font">
          <form onSubmit={handleSearchFormSubmit} className="grid">
            <div className="col-12 sm:col-6 mt-3 ">
              <FloatLabel>
                <InputText
                  id="inc-view-rollno"
                  type="text"
                  className="w-full"
                  value={stuRollNumber}
                  onChange={(e) => {
                    setStuRollNumber(e.target.value.toUpperCase());
                  }}
                  required
                />
                <label htmlFor="inc-view-rollno">Roll Number</label>
              </FloatLabel>
            </div>
            <div className="col-12 sm:col-6 mt-3">
              <Button
                type="submit"
                label={isSearching ? "Searching" : "Search"}
                disabled={!isSearchFormValid || isSearching}
                className="w-full sm:w-auto text-center"
              >
                &nbsp;&nbsp;
                {isSearching && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>
        </Card>
        {student !== null ? (
          <Card>
            <div className="surface-0">
              <div className="flex align-items-start justify-content-between">
                <div className="font-medium text-3xl text-900 mb-3">
                  <i className="pi pi-user font-medium text-3xl text-900"></i>
                  &nbsp;&nbsp;<span className="special-font">Student Profile</span>
                </div>
                <div className="status">
                  <Chip
                    className={`${
                      student?.currentStatus === "HOSTEL"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    } text-white-alpha-90`}
                    icon={"pi pi-circle-fill"}
                    label={student?.currentStatus}
                  ></Chip>
                </div>
              </div>

              <ul className="list-none p-0 m-0" style={{wordWrap:"break-word"}}>
                <li className="grid py-3 px-2 border-top-1 border-300">
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">Name</div>
                    <div className="text-900 w-6">{student?.name}</div>
                  </div>
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">Roll Number</div>
                    <div className="text-900 w-6">{student?.rollNo}</div>
                  </div>
                </li>

                <li className="grid py-3 px-2 border-top-1 border-300">
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">Hostel ID</div>
                    <div className="text-900 w-6">{student?.hostelId}</div>
                  </div>
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">
                      Room No
                    </div>
                    <div className="text-900 w-6">
                      {student?.roomNo}
                    </div>
                  </div>
                  
                </li>

                <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">College</div>
                    <div className="text-900 w-6 ">{student?.college}</div>
                  </div>
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 w-6 font-medium">Year</div>
                    <div className="text-900 w-6">{student?.year}</div>
                  </div>
                  
                </li>

                <li className="grid py-3 px-2 border-top-1 border-300">
                <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">Branch</div>
                    <div className="text-900 w-6">{student?.branch}</div>
                  </div>
                  <div className="flex mt-1 mb-1  w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 w-6 font-medium">Gender</div>
                    <div className="text-900 w-6">{student?.gender}</div>
                  </div>
                  
                </li>

                <li className="grid py-3 px-2 border-top-1 border-300">
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 w-6 font-medium">Phone No</div>
                    <div className="text-900 w-6">{student?.phoneNo}</div>
                  </div>
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">Email</div>
                    <div className="text-900 w-6">{student?.email}</div>
                  </div>
                </li>

                <li className="grid py-3 px-2 border-top-1 border-300">
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 w-6 font-medium">Parent Name</div>
                    <div className="text-900 w-6">{student?.parentName}</div>
                  </div>
                  <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                    <div className="text-500 font-medium w-6">
                      Parent PhoneNo
                    </div>
                    <div className="text-900 w-6">{student?.parentPhoneNo}</div>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        ) : (
          <Card>No Data Found</Card>
        )}

        {student !== null && student?.lastRequest !== null && (
          <Card title="Last Request">
            <ReqCard request={student?.lastRequest} />
          </Card>
        )}
      </div>
    </>
  );
}

export default InchargeViewStudent;
