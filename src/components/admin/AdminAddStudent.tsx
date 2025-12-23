import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { AdminStudentRegisteration } from "../../services/RegisterService";
import { Student } from "../interfaces/Student";
import AdminStudentBulkDataUpload from "./AdminStudentBulkDataUpload";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";

function AdminAddStudent() {
  const [newStudent, setNewStudent] = useState<Student>({
    hostelId: "label",
    rollNo: "",
    name: "",
    college: "label",
    branch: "label",
    year: 0,
    gender: "",
    roomNo: "",
    phoneNo: "",
    email: "",
    parentPhoneNo: "",
    parentName: "",
    currentStatus: "HOSTEL",
    requestCount: 0,
    lastRequest: null,
  });

  const admin = useContext(AdminContext);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const ValidateForm = useCallback(() => {
    setIsFormValid(false);
    const isRollValid = /^[a-zA-Z0-9]{10}$/.test(newStudent.rollNo);
    const isHostelIdValid = newStudent.hostelId !== "label";
    const isFullNameValid = newStudent.name !== "";
    const isYearValid = newStudent.year !== 0;
    const isBranchValid = newStudent.branch !== "label";
    const isCollegeValid = newStudent.college !== "label";
    const isGenderValid = newStudent.gender !== "";
    const isPhonenoValid = /^[0-9]{10}$/.test(newStudent.phoneNo);
    const isFatherNameValid = newStudent.parentName !== "";
    const isFatherMobileValid = /^[0-9]{10}$/.test(newStudent.parentPhoneNo);

    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newStudent.email);

    const isformValid =
      isRollValid &&
      isHostelIdValid &&
      isFullNameValid &&
      isYearValid &&
      isBranchValid &&
      isGenderValid &&
      isPhonenoValid &&
      isFatherNameValid &&
      isFatherMobileValid &&
      isEmailValid &&
      isCollegeValid;

    if (isformValid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newStudent]);

  useEffect(() => {
    ValidateForm();
  }, [newStudent, ValidateForm]);

  const adminStudentToast = useRef<Toast>(null);

  const handleAdminStudentRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsRegistering(true);

    AdminStudentRegisteration(newStudent)
      .then((data) => {
        setIsRegistering(false);
        if (data && data.success) {
          if (admin && admin.eid) {
            let myLog: LOG = {
              date: new Date(),
              userId: admin.eid,
              username: admin.name as string,
              action: `Added new student ${newStudent.rollNo}`,
            };
            createLog(myLog);
          }

          if (adminStudentToast.current) {
            adminStudentToast.current.show({
              severity: "success",
              summary: "Registered Successfully !",
              detail: "New Student has been added",
            });
          }
          setNewStudent({
            hostelId: "label",
            rollNo: "",
            name: "",
            college: "label",
            branch: "label",
            year: 0,
            gender: "",
            roomNo: "",
            phoneNo: "",
            email: "",
            parentPhoneNo: "",
            parentName: "",
            currentStatus: "HOSTEL",
            requestCount: 0,
            lastRequest: null,
          });
        } else {
          const msg = data?.message || "Student registeration failed";
          if (adminStudentToast.current) {
            adminStudentToast.current.show({
              severity: "error",
              summary: "Register Failed",
              detail: msg,
            });
          }
        }
      })
      .catch((err: any) => {
        setIsRegistering(false);
        console.log("Registration error:", err);
        const errorMsg = err.response?.data?.message || err.message || "An error occurred during registration. Please check inputs or try again.";
        if (adminStudentToast.current) {
          adminStudentToast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorMsg
          });
        }
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

        <Card title="Add Student" className="special-font">
          <Toast ref={adminStudentToast} position="center"></Toast>

          <form
            action=""
            className="grid"
            onSubmit={handleAdminStudentRegister}
          >
            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-rollno"
                  type="text"
                  className="w-12"
                  value={newStudent.rollNo}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      rollNo: e.target.value.toUpperCase(),
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-rollno">Roll No</label>
              </FloatLabel>
            </div>


            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-fullname"
                  type="text"
                  className="w-12"
                  value={newStudent.name}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      name: e.target.value,
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-fullname">Full Name</label>
              </FloatLabel>
            </div>
            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <div className="custom-select-container w-12">
                <select
                  className="custom-select"
                  id="ad-add-stu-hostelId"
                  value={newStudent?.hostelId}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      hostelId: e.target.value.toUpperCase(),
                    } as Student);
                  }}
                >
                  <option value="label" disabled>
                    Hostel ID
                  </option>
                  <option value="BH1">BH1</option>
                  <option value="GH1">GH1</option>
                </select>
              </div>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-roomNo"
                  type="number"
                  className="w-12"
                  value={newStudent.roomNo}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      roomNo: e.target.value.trim(),
                    } as Student);
                  }}
                />
                <label htmlFor="ad-add-stu-roomNo">Room No</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 lg:col-8 mt-3 flex">
              <h4 className="mr-3">Gender</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ad-add-stu-male"
                    name="gender"
                    value="male"
                    onChange={(e: RadioButtonChangeEvent) =>
                      setNewStudent({
                        ...newStudent,
                        gender: e.value.toUpperCase(),
                      } as Student)
                    }
                    checked={newStudent.gender.toUpperCase() === "MALE"}
                  />
                  <label htmlFor="ad-add-stu-male" className="ml-2">
                    Male
                  </label>
                </div>
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ad-add-stu-female"
                    name="gender"
                    value="female"
                    onChange={(e: RadioButtonChangeEvent) =>
                      setNewStudent({
                        ...newStudent,
                        gender: e.value.toUpperCase(),
                      } as Student)
                    }
                    checked={newStudent.gender.toUpperCase() === "FEMALE"}
                  />
                  <label htmlFor="ad-add-stu-female" className="ml-2">
                    Female
                  </label>
                </div>
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ad-add-stu-other"
                    name="gender"
                    value="other"
                    onChange={(e: RadioButtonChangeEvent) =>
                      setNewStudent({
                        ...newStudent,
                        gender: e.value.toUpperCase(),
                      } as Student)
                    }
                    checked={newStudent.gender.toUpperCase() === "OTHER"}
                  />
                  <label htmlFor="ad-add-stu-other" className="ml-2">
                    Other
                  </label>
                </div>
              </div>
            </div>




            <div className="col-12 md:col-6 lg:col-4 mt-3">

              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-add-stu-college"
                  value={newStudent.college}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      college: e.target.value,
                    } as Student);
                  }}
                >
                  <option value="label" disabled>
                    Select College
                  </option>
                  <option value="NEC">NEC</option>
                  <option value="NIPS">NIPS</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-add-stu-year"
                  value={newStudent.year}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      year: Number(e.target.value),
                    } as Student);
                  }}
                >
                  <option value="0" disabled>
                    Select Year
                  </option>
                  <option value="1">I Year</option>
                  <option value="2">II Year</option>
                  <option value="3">III Year</option>
                  <option value="4">IV Year</option>
                  <option value="5">V Year</option>
                  <option value="6">VI Year</option>
                </select>
              </div>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  id="ad-add-stu-branch"
                  value={newStudent.branch}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      branch: e.target.value,
                    } as Student);
                  }}
                >
                  <option value="label" disabled>
                    Select Branch
                  </option>
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
            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-phoneno"
                  type="text"
                  className="w-12"
                  value={newStudent.phoneNo}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      phoneNo: e.target.value,
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-phoneno">Phone No</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(newStudent.phoneNo) &&
                newStudent.phoneNo !== "" && (
                  <small id="phoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-email"
                  type="text"
                  className="w-12"
                  value={newStudent.email}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      email: e.target.value,
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-rollno">Email</label>
              </FloatLabel>
              {!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                newStudent.email
              ) &&
                newStudent.email !== "" && (
                  <small id="email-help" className="text-red-500">
                    Invalid Email Format
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-fathername"
                  type="text"
                  className="w-12"
                  value={newStudent.parentName}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      parentName: e.target.value,
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-fathername">Parent Name</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-add-stu-fathermobile"
                  type="text"
                  className="w-12"
                  value={newStudent.parentPhoneNo}
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      parentPhoneNo: e.target.value,
                    } as Student);
                  }}
                  required
                />
                <label htmlFor="ad-add-stu-fathermobile">Parent Phone No</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(newStudent.parentPhoneNo) &&
                newStudent.parentPhoneNo !== "" && (
                  <small id="fphoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>
            <div className="col-12 md:col-6 lg:col-4 mt-3 flex justify-content-start">
              <Button type="submit" disabled={!isFormValid || isRegistering}>
                {isRegistering && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isRegistering ? "Registering" : "Register"}
              </Button>
            </div>
          </form>
        </Card>

        <Divider align="center">
          <span className="p-tag">OR</span>
        </Divider>

        <Card title="Import Data (.xls / .xlsx)" className="special-font">

          <AdminStudentBulkDataUpload />
        </Card>
      </div>
    </>
  );
}

export default AdminAddStudent;
