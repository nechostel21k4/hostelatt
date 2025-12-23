import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Student } from "../interfaces/Student";
import { getStudent } from "../../services/StudentService";
import ReqCard from "../student/ReqCard";
import { Chip } from "primereact/chip";
import {
  adminUpdateStudentProfile,
  createLog,
  deleteStudent,
} from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";
import { getProfileImage } from "../../services/ImageService";

function AdminViewStudent() {
  const [rollNumber, setRollNumber] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [studentOldData, setStudentOldData] = useState<Student | null>(null);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchFormValid, setIsSearchFormValid] = useState<boolean>(false);

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUpdateFormValid, setIsUpdateFormValid] = useState<boolean>(false);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const ViewStudentToast = useRef<Toast>(null);

  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const admin = useContext(AdminContext);

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const validateSearchForm = useCallback(() => {
    setIsSearchFormValid(false);
    const isRollValid = /^[a-zA-Z0-9]{10}$/.test(rollNumber);
    if (isRollValid) {
      setIsSearchFormValid(true);
    }
  }, [rollNumber]);

  useEffect(() => {
    validateSearchForm();
  }, [rollNumber, validateSearchForm]);

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    setEnableEdit(false);
    getStudent(rollNumber)
      .then((data) => {
        const { isExist, hosteler } = data;
        if (isExist) {
          setStudent(hosteler);
          setStudentOldData(hosteler);
        } else {
          setStudent(null);
        }
        setIsSearching(false);
      })
      .catch((err) => {
        console.log(err);
      });
    getProfileImage(rollNumber)
      .then((data) => {
        if (data?.imageExist) {
          setProfileImageUrl(data.imagePath);
        } else {
          setProfileImageUrl("/images/Avatar.jpg");
        }
      })
      .catch((err) => {
        console.log("Error : while getting profile image", err);
      });
  };

  const handleStudentUpdate = () => {
    const accept = () => {
      setIsUpdating(true);
      if (student)
        adminUpdateStudentProfile(student)
          .then((data) => {
            setIsUpdating(false);

            if (data.updated) {
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Updated Student  ${student.rollNo}`,
              };
              createLog(myLog);

              setStudentOldData(student);
              setEnableEdit(false);
              if (ViewStudentToast.current) {
                ViewStudentToast.current.show({
                  severity: "success",
                  summary: "Updated Successfully !",
                  detail: "Student data has been updated",
                });
              }
            } else {
              if (ViewStudentToast.current) {
                ViewStudentToast.current.show({
                  severity: "error",
                  summary: "Update Failed !",
                  detail: "Failed to update student profile.Try again",
                });
              }
            }
          })
          .catch((err) => {
            console.log("something went wrong", err);
          });
    };
    const reject = () => { };

    confirmDialog({
      message: "Do you want to Update this record?",
      header: "Update Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
    });
  };

  const handleStudentDelete = () => {
    const accept = () => {
      setIsDeleting(true);
      deleteStudent(rollNumber).then((data) => {
        setIsDeleting(false);
        if (data.deleted) {
          let myLog: LOG = {
            date: new Date(),
            userId: admin.eid,
            username: admin.name as string,
            action: `Deleted Student  ${rollNumber}`,
          };
          createLog(myLog);

          setRollNumber("");
          setStudent(null);
          if (ViewStudentToast.current) {
            ViewStudentToast.current.show({
              severity: "error",
              summary: "Deleted Successfully !",
              detail: "Student has been removed",
            });
          }
        } else {
          if (ViewStudentToast.current) {
            ViewStudentToast.current.show({
              severity: "warn",
              summary: "Deleted Failed !",
              detail: "Failed to delete student.Try again",
            });
          }
        }
      });
    };
    const reject = () => { };

    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const validateUpdateForm = useCallback(() => {
    setIsUpdateFormValid(false);
    const isHostelIdValid = student?.hostelId !== "label";
    const isRollValid = /^[a-zA-Z0-9]{10}$/.test(rollNumber);
    const isNameValid = student?.name !== "";
    const isCollegeValid = student?.college !== "label";
    const isYearValid = student?.year !== "label";
    const isGenderValid = student?.gender !== "";
    const isPhonenoValid = /^[0-9]{10}$/.test(student?.phoneNo as string);
    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        student?.email as string
      );
    const isParentNameValid = student?.parentName !== "";
    const isParentPhoneNoValid = /^[0-9]{10}$/.test(
      student?.parentPhoneNo as string
    );

    const isformValid =
      isRollValid &&
      isHostelIdValid &&
      isNameValid &&
      isCollegeValid &&
      isYearValid &&
      isGenderValid &&
      isPhonenoValid &&
      isParentNameValid &&
      isParentPhoneNoValid &&
      isEmailValid;

    if (isformValid) {
      setIsUpdateFormValid(true);
    } else {
      setIsUpdateFormValid(false);
    }
  }, [student]);

  useEffect(() => {
    validateUpdateForm();
  }, [student, validateUpdateForm]);

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
        <Toast ref={ViewStudentToast} position="center" />
        <Card title="Search Student" className="special-font">
          <form onSubmit={handleSearchFormSubmit} className="grid">
            <div className="col-12 sm:col-6 mt-3 ">
              <FloatLabel>
                <InputText
                  id="ad-stu-view-rollno"
                  type="text"
                  className="w-full"
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value.toUpperCase());
                  }}
                  required
                />
                <label htmlFor="ad-stu-view-rollno">Roll Number</label>
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

          {student && (
            <div className="flex align-items-center justify-content-end">
              <Button
                className="m-2"
                icon={enableEdit ? "pi pi-times" : "pi pi-pen-to-square"}
                severity={enableEdit ? "warning" : "info"}
                label={enableEdit ? "Cancel" : "Edit"}
                onClick={() => {
                  if (!enableEdit) {
                    setStudent(studentOldData);
                  }
                  setEnableEdit((prevValue) => !prevValue);
                }}
                style={{}}
              ></Button>
            </div>
          )}

          {student ? (
            enableEdit ? (
              <form action="" className="grid mt-3">
                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <FloatLabel>
                    <InputText
                      id="ad-view-stu-rollno"
                      type="text"
                      className="w-12"
                      value={student.rollNo}
                      disabled
                      required
                    />
                    <label htmlFor="ad-view-stu-rollno">Roll Number</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <div className="custom-select-container w-12">
                    <select
                      className="custom-select"
                      id="ad-view-stu-hostelId"
                      value={student?.hostelId}
                      onChange={(e) => {
                        setStudent({
                          ...student,
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
                      id="ad-view-stu-fullname"
                      type="text"
                      className="w-12"
                      value={student.name}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          name: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="ad-view-stu-fullname">Full Name</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 lg:col-8 mt-3 flex">
                  <h4 className="mr-3">Gender</h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ad-view-stu-male"
                        name="gender"
                        value="male"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setStudent({
                            ...student,
                            gender: e.value,
                          } as Student)
                        }
                        checked={student.gender.toUpperCase() === "MALE"}
                      />
                      <label htmlFor="ad-view-stu-male" className="ml-2">
                        Male
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ad-view-stu-female"
                        name="gender"
                        value="female"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setStudent({
                            ...student,
                            gender: e.value,
                          } as Student)
                        }
                        checked={student.gender.toUpperCase() === "FEMALE"}
                      />
                      <label htmlFor="ad-view-stu-female" className="ml-2">
                        Female
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <RadioButton
                        inputId="ad-view-stu-other"
                        name="gender"
                        value="other"
                        onChange={(e: RadioButtonChangeEvent) =>
                          setStudent({
                            ...student,
                            gender: e.value,
                          } as Student)
                        }
                        checked={student.gender.toUpperCase() === "OTHER"}
                      />
                      <label htmlFor="ad-view-stu-other" className="ml-2">
                        Other
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <FloatLabel>
                    <InputText
                      id="ad-view-stu-roomNo"
                      type="number"
                      className="w-12"
                      value={student.roomNo}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          roomNo: e.target.value.trim(),
                        } as Student);
                      }}
                    />
                    <label htmlFor="ad-view-stu-roomNo">Room No</label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <FloatLabel>
                    <InputText
                      id="ad-view-stu-phoneno"
                      type="text"
                      className="w-12"
                      value={student.phoneNo}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          phoneNo: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="ad-view-stu-phoneno">Phone Number</label>
                  </FloatLabel>
                  {!/^[0-9]{10}$/.test(student.phoneNo) &&
                    student.phoneNo !== "" && (
                      <small id="phoneno-help" className="text-red-500">
                        Phone number must be 10 digits
                      </small>
                    )}
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <FloatLabel>
                    <InputText
                      id="ad-view-stu-email"
                      type="text"
                      className="w-12"
                      value={student.email}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          email: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="ad-view-stu-email">EMail</label>
                  </FloatLabel>
                  {!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    student.email
                  ) &&
                    student.email !== "" && (
                      <small id="ad-view-email-help" className="text-red-500">
                        Invalid Email Format
                      </small>
                    )}
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <div className="custom-select-container w-full">
                    <select
                      className="custom-select"
                      id="ad-view-stu-college"
                      value={student.college}
                      onChange={(e) => {
                        setStudent({
                          ...student,
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
                      id="ad-view-stu-year"
                      value={student.year}
                      onChange={(e) => {
                        setStudent({
                          ...student,
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
                    </select>
                  </div>
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <div className="custom-select-container w-full">
                    <select
                      className="custom-select"
                      id="ad-view-stu-branch"
                      value={student.branch}
                      onChange={(e) => {
                        setStudent({
                          ...student,
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
                      id="ad-view-stu-fathername"
                      type="text"
                      className="w-12"
                      value={student.parentName}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          parentName: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="ad-view-stu-fathername">
                      Father's Name
                    </label>
                  </FloatLabel>
                </div>

                <div className="col-12 md:col-6 lg:col-4 mt-3">
                  <FloatLabel>
                    <InputText
                      id="ad-view-stu-fathermobile"
                      type="text"
                      className="w-12"
                      value={student.parentPhoneNo}
                      onChange={(e) => {
                        setStudent({
                          ...student,
                          parentPhoneNo: e.target.value,
                        } as Student);
                      }}
                      required
                    />
                    <label htmlFor="ad-view-stu-fathermobile">
                      Father Mobile No
                    </label>
                  </FloatLabel>
                  {!/^[0-9]{10}$/.test(student.parentPhoneNo) &&
                    student.parentPhoneNo !== "" && (
                      <small id="fphoneno-help" className="text-red-500">
                        Phone number must be 10 digits
                      </small>
                    )}
                </div>
                <div className="col-12 mt-3 flex justify-content-around">
                  <Button
                    type="button"
                    onClick={handleStudentUpdate}
                    disabled={!isUpdateFormValid || isUpdating}
                    severity="success"
                    icon={!isUpdating && "pi pi-save"}
                  >
                    {isUpdating && <i className="pi pi-spin pi-spinner"></i>}
                    &nbsp;&nbsp;
                    {isUpdating ? "Updating" : "Update"}
                  </Button>

                  <Button
                    type="button"
                    severity="danger"
                    icon={!isDeleting && "pi pi-trash"}
                    onClick={handleStudentDelete}
                  >
                    {isDeleting && <i className="pi pi-spin pi-spinner"></i>}
                    &nbsp;&nbsp;
                    {isDeleting ? "Deleting" : "Delete"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <Card className="mt-2">
                  <div className="surface-0">
                    <div className="flex mb-3 align-items-start justify-content-between">
                      <Image
                        src={profileImageUrl}
                        alt="Image"
                        width="120"
                        height="120"
                      />
                      <div className="status">
                        <Chip
                          className={`${studentOldData?.currentStatus === "HOSTEL"
                              ? "bg-green-500"
                              : "bg-orange-500"
                            } text-white-alpha-90`}
                          icon={"pi pi-circle-fill"}
                          label={studentOldData?.currentStatus}
                        ></Chip>
                      </div>
                    </div>

                    <ul
                      className="list-none p-0 m-0"
                      style={{ wordWrap: "break-word" }}
                    >
                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">Name</div>
                          <div className="text-900 w-6">
                            {studentOldData?.name}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">
                            Roll Number
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.rollNo}
                          </div>
                        </div>
                      </li>

                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">
                            Hostel ID
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.hostelId}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">
                            Room No
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.roomNo}
                          </div>
                        </div>
                      </li>

                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">
                            College
                          </div>
                          <div className="text-900 w-6 ">
                            {studentOldData?.college}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 w-6 font-medium">Year</div>
                          <div className="text-900 w-6">
                            {studentOldData?.year}
                          </div>
                        </div>
                      </li>

                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">Branch</div>
                          <div className="text-900 w-6">
                            {studentOldData?.branch}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1  w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 w-6 font-medium">Gender</div>
                          <div className="text-900 w-6">
                            {studentOldData?.gender}
                          </div>
                        </div>
                      </li>

                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 w-6 font-medium">
                            Phone No
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.phoneNo}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">Email</div>
                          <div className="text-900 w-6">
                            {studentOldData?.email}
                          </div>
                        </div>
                      </li>

                      <li className="grid py-3 px-2 border-top-1 border-300">
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 w-6 font-medium">
                            Parent Name
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.parentName}
                          </div>
                        </div>
                        <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center justify-content-start">
                          <div className="text-500 font-medium w-6">
                            Parent PhoneNo
                          </div>
                          <div className="text-900 w-6">
                            {studentOldData?.parentPhoneNo}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Card>
              </>
            )
          ) : (
            <p>No Data Found</p>
          )}
        </Card>

        {student !== null && student?.lastRequest !== null && !enableEdit && (
          <Card title="Last Request" className="special-font">
            <ReqCard request={student?.lastRequest} />
          </Card>
        )}
      </div>
    </>
  );
}

export default AdminViewStudent;
