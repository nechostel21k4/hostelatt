import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import {
  RegisterStudent,
  VerifyStudentRegister,
} from "../services/RegisterService";
import { FloatLabel } from "primereact/floatlabel";
import { Student } from "./interfaces/Student";
import { createLog } from "../services/AdminService";
import { LOG } from "./interfaces/Log";

function StudentRegister() {
  const Navigate = useNavigate();
  const [rollno, setRollno] = useState<string>("");
  const [isRollnoValid, setIsRollnoValid] = useState<boolean>(false);
  const [isValidating, setisValidating] = useState<boolean>(false);
  const [isStudentExist, setIsStudentExist] = useState<boolean | null>(null);

  const [stuPassword, setStuPassword] = useState<string>("");
  const [stuCPassword, setStuCPassword] = useState<string>("");

  const [isPasswordsSame, setIsPasswordsSame] = useState<boolean>(true);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const registerToast = useRef<Toast>(null);

  const [studentData, setStudentData] = useState<Student | null>(null);

  useEffect(() => {
    setIsPasswordsSame(false);
    if (stuPassword === stuCPassword) {
      setIsPasswordsSame(true);
    }
  }, [stuPassword, stuCPassword]);

  const handleStuRegFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setisValidating(true);
    setIsStudentExist(null);
    VerifyStudentRegister(rollno)
      .then((data) => {
        setisValidating(false);
        const { isExist, isRegistered } = data;

        if (isExist) {
          if (isRegistered) {
            if (registerToast.current) {
              registerToast.current.show({
                severity: "warn",
                summary: "Student already registered",
                detail: "Please Login or Reset Password",
              });
            }
          } else {
            setIsStudentExist(true);
            const { hosteler } = data;
            setStudentData(hosteler);
          }
        } else {
          setIsStudentExist(false);
          if (registerToast.current) {
            registerToast.current.show({
              severity: "error",
              summary: "Student Not Found",
              detail: "Student doesn't exist",
            });
          }
        }
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  };

  const handleRegisterForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRegistering(true);
    RegisterStudent(rollno, studentData as Student, stuPassword)
      .then((data) => {
        setIsRegistering(false);
        const { success } = data;
        if (success) {
          let myLog:LOG = {date:new Date(),userId:rollno,username:studentData?.name as string,action:"Registered as student"}
          createLog(myLog)
          if (registerToast.current) {
            registerToast.current.show({
              severity: "success",
              summary: "Register Successful !",
              detail: "You have successfully registered into NEC Hostel Portal",
            });
            setTimeout(() => {
              Navigate("/", { replace: true });
            }, 2000);
          }
        } else {
          if (registerToast.current) {
            registerToast.current.show({
              severity: "warn",
              summary: "Register Unsuccessful !",
              detail: "Something went wrong.Try Again or Consult Hostel Admin",
            });
            setTimeout(() => {
              Navigate("/", { replace: true });
            }, 2000);
          }
        }
      })
      .catch((err) => {
        setIsRegistering(false);
        console.log("error", err);
      });
  };

  return (
    <>
      <Toast ref={registerToast} position="top-center" />
      <Dialog
        header="Student Registration"
        visible={true}
        style={{ width: "50vw" }}
        onHide={() => {
          Navigate("/", { replace: true });
        }}
        className="w-11 lg:w-8 special-font"
      >
        <Card className="w-full mt-1">
          <form onSubmit={handleStuRegFormSubmit}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-key"></i>
              </span>
              <InputText
                placeholder="Roll Number"
                id="stu-reg-key-rollNo"
                value={rollno}
                onChange={(e) => {
                  setIsRollnoValid(false);
                  let rollno = e.target.value.toUpperCase();
                  setRollno(rollno);
                  if (/^[a-zA-Z0-9]{10}$/.test(rollno)) {
                    setIsRollnoValid(true);
                  } else {
                    setIsRollnoValid(false);
                  }
                }}
                maxLength={10}
                minLength={10}
                className="text-center font-bold text-lg"
                disabled={isStudentExist ? true : false}
              />
              {isStudentExist == null ? (
                <Button
                  className={`${isStudentExist}`}
                  disabled={!isRollnoValid || isValidating}
                  type="submit"
                >
                  {isValidating && <i className="pi pi-spin pi-spinner"></i>}
                  &nbsp;&nbsp;{`${isValidating ? "Validating" : "Validate"}`}
                </Button>
              ) : (
                <Button
                  severity={isStudentExist ? "success" : "danger"}
                  type="submit"
                  disabled={isStudentExist}
                >
                  {isStudentExist ? (
                    <i className="pi pi-verified"></i>
                  ) : (
                    <i className="pi pi-ban"></i>
                  )}
                  &nbsp;&nbsp;{isStudentExist ? `Valid ` : `Invalid`}
                </Button>
              )}
            </div>
          </form>
          {isStudentExist && (
            <div className="mt-4 ">
              <form onSubmit={handleRegisterForm} className="grid">
                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-rollno"
                      type="text"
                      className="w-12"
                      value={studentData?.rollNo}
                      disabled
                      required
                    />
                    <label htmlFor="stu-reg-rollno">Roll Number</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-hostelID"
                      type="text"
                      className="w-12"
                      value={studentData?.hostelId}
                      disabled
                      required
                    />
                    <label htmlFor="stu-reg-hostelID">Hostel ID</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-name"
                      type="text"
                      className="w-12"
                      value={studentData?.name}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          name: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="stu-reg-name">Full Name</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-gender"
                      type="text"
                      className="w-12"
                      value={studentData?.gender}
                      disabled
                      required
                    />
                    <label htmlFor="stu-reg-gender">Gender</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                  <InputText
                      id="stu-reg-roomNo"
                      type="number"
                      className="w-12"
                      value={studentData?.roomNo}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          roomNo: e.target.value.trim(),
                        } as Student);
                      }}
                    />
                    <label htmlFor="stu-reg-roomNo">Room No</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-phoneno"
                      type="text"
                      className="w-12 md:w-12"
                      value={studentData?.phoneNo}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          phoneNo: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="stu-reg-phoneno">Phone No</label>
                  </FloatLabel>
                  {!/^[0-9]{10}$/.test(studentData?.phoneNo as string) &&
                    studentData?.phoneNo !== "" && (
                      <small id="phoneno-help" className="text-red-500">
                        Phone number must be 10 digits
                      </small>
                    )}
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-email"
                      type="text"
                      className="w-12 md:w-12"
                      value={studentData?.email}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          email: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="stu-reg-rollno">Email</label>
                  </FloatLabel>
                  {!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    studentData?.email as string
                  ) &&
                    studentData?.email !== "" && (
                      <small id="email-help" className="text-red-500">
                        Invalid Email Format
                      </small>
                    )}
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <div className="custom-select-container w-full">
                    <select
                      className="custom-select w-12"
                      id="stu-reg-college"
                      value={studentData?.college}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          college: e.target.value as string,
                        } as Student);
                      }}
                      required
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

                <div className="col-12 md:col-6 mt-3">
                  <div className="custom-select-container w-full">
                    <select
                      className="custom-select w-12"
                      id="stu-reg-year"
                      value={studentData?.year.toString()}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          year: Number(e.target.value),
                        } as Student);
                      }}
                      required
                    >
                      <option value="label">Select Year</option>
                      <option value="1">I Year</option>
                      <option value="2">II Year</option>
                      <option value="3">III Year</option>
                      <option value="4">IV Year</option>
                      <option value="5">V Year</option>
                      <option value="6">VI Year</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <div className="custom-select-container w-full">
                    <select
                      className="custom-select w-12"
                      id="stu-reg-branch"
                      value={studentData?.branch}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          branch: e.target.value as string,
                        } as Student);
                      }}
                      required
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

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-parentName"
                      type="text"
                      className="w-12"
                      value={studentData?.parentName}
                      onChange={(e) => {
                        setStudentData({
                          ...studentData,
                          parentName: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="stu-reg-parentName">Parent Name</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <FloatLabel>
                    <InputText
                      id="stu-reg-parentPhone"
                      type="text"
                      className="w-12"
                      value={studentData?.parentPhoneNo}
                      disabled={studentData?.parentPhoneNo ? true : false}
                      required
                    />
                    <label htmlFor="stu-reg-parentPhone">Parent Phone No</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <div className="p-inputgroup flex-1 w-12 ">
                    <FloatLabel>
                      <InputText
                        id="stu-reg-password"
                        type="password"
                        className="w-12"
                        value={stuPassword}
                        onChange={(e) => {
                          setStuPassword(e.target.value);
                        }}
                        required
                      />
                      <label htmlFor="stu-reg-password">Password</label>
                    </FloatLabel>
                    <span
                      className="p-inputgroup-addon"
                      onClick={() => {
                        const ele = document.getElementById(
                          "stu-reg-password"
                        ) as HTMLInputElement | null;
                        if (ele) {
                          if (ele.type == "text") {
                            ele.type = "password";
                          } else if (ele.type == "password") {
                            ele.type = "text";
                          }
                        }
                      }}
                    >
                      <i className="pi pi-eye cursor-pointer"></i>
                    </span>
                  </div>
                </div>

                <div className="col-12 md:col-6 mt-3">
                  <div className="p-inputgroup flex-1 w-12">
                    <FloatLabel>
                      <InputText
                        id="stu-reg-cpassword"
                        type="password"
                        className="w-12"
                        value={stuCPassword}
                        onChange={(e) => {
                          setStuCPassword(e.target.value);
                        }}
                        required
                      />
                      <label htmlFor="stu-reg-cpassword">
                        Confirm Password
                      </label>
                    </FloatLabel>
                    <span
                      className="p-inputgroup-addon"
                      onClick={() => {
                        const ele = document.getElementById(
                          "stu-reg-cpassword"
                        ) as HTMLInputElement | null;
                        if (ele) {
                          if (ele.type == "text") {
                            ele.type = "password";
                          } else if (ele.type == "password") {
                            ele.type = "text";
                          }
                        }
                      }}
                    >
                      <i className="pi pi-eye cursor-pointer"></i>
                    </span>
                  </div>
                  {!(stuPassword === stuCPassword) && (
                    <small id="stu-reg-password-help" className="text-red-500">
                      Passwords are not same
                    </small>
                  )}
                </div>

                <Button
                  type="submit"
                  label={`${isRegistering ? "Registering" : "Register"}`}
                  disabled={
                    (isPasswordsSame && stuPassword ? false : true) ||
                    (isRegistering ? true : false)
                  }
                  className="w-full text-center mt-1"
                >
                  {isRegistering && <i className="pi pi-spin pi-spinner"></i>}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </Dialog>
    </>
  );
}

export default StudentRegister;
