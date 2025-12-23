import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Messages } from "primereact/messages";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { Nullable } from "primereact/ts-helpers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Student } from "../interfaces/Student";
import { StudentContext } from "./StudentHome";
import { Permission, Leave } from "../interfaces/Request";
import { Link } from "react-router-dom";
import { createRequestandUpdateStudent } from "../../services/StudentService";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { mergeDateTime } from "../interfaces/Date";

function StudentLeave() {
  const [selectionOption, setSelectionOption] = useState<string>("Permission");

  //permission
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [fromTime, setFromTime] = useState<Nullable<Date>>(null);
  const [toTime, setToTime] = useState<Nullable<Date>>(null);

  //leave
  const [fromDate, setFromDate] = useState<Nullable<Date>>(null);
  const [toDate, setToDate] = useState<Nullable<Date>>(null);

  const [reason, setReason] = useState<string>("");

  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const PermissionLeaveToast = useRef<Toast>(null);
  const msgs = useRef<Messages>(null);

  const { student, updateStudent } = useContext(StudentContext);

  const ValidateForm = () => {
    setIsFormValid(false);

    const isDateValid = date !== null && date && date.toString() !== "";
    const isFromDateValid =
      fromDate !== null && fromDate && fromDate.toString() !== "";
    const isToDateValid = toDate !== null && toDate && toDate.toString() !== "";
    const isFromTimeValid =
      fromTime !== null && fromTime && fromTime.toString() !== "";
    const isToTimeValid = toTime !== null && toTime && toTime.toString() !== "";
    const isReasonValid = reason !== "";

    if (selectionOption === "Leave") {
      if (
        isFromDateValid &&
        isToDateValid &&
        isReasonValid &&
        fromDate < toDate
      ) {
        setIsFormValid(true);
      }
    } else if (selectionOption === "Permission") {
      if (
        isDateValid &&
        isFromTimeValid &&
        isToTimeValid &&
        isReasonValid &&
        fromTime < toTime
      ) {
        setIsFormValid(true);
      }
    }
  };

  useEffect(() => {
    ValidateForm();
  }, [date, fromDate, fromTime, toDate, toTime, reason]);

  useEffect(() => {
    if (date && fromTime) {
      setFromTime(mergeDateTime(date as Date, fromTime as Date));
    }
    if (date && toTime) {
      setToTime(mergeDateTime(date as Date, toTime as Date));
    }
  }, [date]);

  useEffect(() => {
    msgs.current?.clear();
    msgs.current?.show({
      id: "1",
      icon: "pi pi-send",
      sticky: true,
      severity: "info",
      summary: "Request Info",
      content: (
        <>
          <div className="ml-2">
            Your Request has been submitted successfully.
            <Link
              to={`/student/${student.rollNo}/dashboard`}
              className="no-underline cursor-pointer p-3 w-full"
            >
              <span className="font-medium">View Details</span>
            </Link>
          </div>
        </>
      ),
      closable: false,
    });
  }, [student]);

  const createRequest = () => {
    let request: Permission | Leave | null = null;

    if (selectionOption === "Leave") {
      request = {
        id:
          `${student?.hostelId}${student?.rollNo}L` +
          (student?.requestCount + 1).toString().padStart(3, "0"),
        type: "LEAVE",
        status: "SUBMITTED",
        submitted: {
          time: new Date(),
          name: student?.name,
          rollNo: student?.rollNo,
        },
        cancelled01: null,
        accepted: null,
        rejected: null,
        cancelled02: null,
        arrived: null,
        name: student?.name,
        rollNo: student?.rollNo,
        hostelId: student?.hostelId,
        phoneNo: student?.phoneNo,
        parentPhoneNo: student?.parentPhoneNo,
        reason: reason,
        fromDate: fromDate as Date,
        toDate: toDate as Date,
        isActive: true,
      };
    } else if (selectionOption === "Permission") {
      request = {
        id:
          `${student?.hostelId}${student?.rollNo}P` +
          (student?.requestCount + 1).toString().padStart(3, "0"),
        type: "PERMISSION",
        status: "SUBMITTED",
        submitted: {
          time: new Date(),
          name: student?.name,
          rollNo: student?.rollNo,
        },
        cancelled01: null,
        accepted: null,
        rejected: null,
        cancelled02: null,
        arrived: null,
        name: student?.name,
        rollNo: student?.rollNo,
        hostelId: student?.hostelId,
        phoneNo: student?.phoneNo,
        parentPhoneNo: student?.parentPhoneNo,
        reason: reason,
        date: date as Date,
        fromTime: fromTime as Date,
        toTime: toTime as Date,
        isActive: true,
      };
    }
    return request;
  };

  const handleLeavePermissionForm = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsApplying(true);
    let request = createRequest();
    let newStudentData: Student = {
      ...student,
      lastRequest: request,
      currentStatus: "HOSTEL",
      requestCount: student?.requestCount + 1,
    };

    createRequestandUpdateStudent(newStudentData, request)
      .then((data) => {
        setIsApplying(false);
        if (data?.success) {
          updateStudent(data?.newData);
          if (selectionOption === "Leave") {
            let myLog: LOG = {
              date: new Date(),
              userId: student.rollNo,
              username: student.name as string,
              action: "Applied Leave",
            };
            createLog(myLog);
            if (PermissionLeaveToast.current) {
              PermissionLeaveToast.current.show({
                severity: "success",
                summary: "Your Leave has been Submitted successfully !",
                detail: "Wait for Incharge Acceptance",
              });
            }
          } else if (selectionOption === "Permission") {
            let myLog: LOG = {
              date: new Date(),
              userId: student.rollNo,
              username: student.name as string,
              action: "Applied Permission",
            };
            createLog(myLog);
            if (PermissionLeaveToast.current) {
              PermissionLeaveToast.current.show({
                severity: "success",
                summary: "Your Permission has been Submitted successfully !",
                detail: "Wait for Incharge Acceptance",
              });
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toast ref={PermissionLeaveToast} position="center"></Toast>
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Apply Leave / Permission" className="special-font">
          <div className="card flex justify-content-center">
            <div className="flex flex-wrap gap-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="stu-pl-permission"
                  name="Permission"
                  value="Permission"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Permission"}
                />
                <label htmlFor="stu-pl-permission" className="ml-2">
                  Permission
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="stu-pl-leave"
                  name="Leave"
                  value="Leave"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setSelectionOption(e.value)
                  }
                  checked={selectionOption === "Leave"}
                />
                <label htmlFor="stu-pl-leave" className="ml-2">
                  Leave
                </label>
              </div>
            </div>
          </div>
        </Card>

        {!student?.lastRequest?.isActive ? (
          <Card title={selectionOption} className="mt-2 special-font">
            <form
              action=""
              className="grid"
              onSubmit={handleLeavePermissionForm}
              name="LPForm"
            >
              <div className="col-12 md:col-6  mt-3">
                <FloatLabel>
                  <InputText
                    id="stu-pl-name"
                    type="text"
                    className="w-12 md:w-8"
                    value={student?.name || ""}
                    required
                    disabled
                  />
                  <label htmlFor="stu-pl-name">
                    Name{" "}
                    <span style={{ color: "red", fontSize: "14px" }}>*</span>{" "}
                  </label>
                </FloatLabel>
              </div>

              <div className="col-12 md:col-6  mt-3">
                <FloatLabel>
                  <InputText
                    id="stu-pl-rollno"
                    type="text"
                    className="w-12 md:w-8"
                    value={student?.rollNo || ""}
                    required
                    disabled
                  />
                  <label htmlFor="stu-pl-rollno">
                    Roll Number{" "}
                    <span style={{ color: "red", fontSize: "14px" }}>*</span>{" "}
                  </label>
                </FloatLabel>
              </div>

              <div className="col-12 md:col-6  mt-3">
                <FloatLabel>
                  <InputText
                    id="stu-pl-hostelid"
                    type="text"
                    className="w-12 md:w-8"
                    value={student?.hostelId || ""}
                    required
                    disabled
                  />
                  <label htmlFor="stu-pl-hostelid">
                    Hostel id{" "}
                    <span style={{ color: "red", fontSize: "14px" }}>*</span>{" "}
                  </label>
                </FloatLabel>
              </div>

              {selectionOption === "Permission" && (
                <>
                  <div className="col-12 md:col-6  mt-3">
                    <FloatLabel>
                      <Calendar
                        required
                        inputId="stu-pl-date"
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        className="w-12 md:w-8"
                        showButtonBar
                        dateFormat="dd/mm/yy"
                        minDate={new Date()}
                      />
                      <label htmlFor="stu-pl-date">
                        Date{" "}
                        <span style={{ color: "red", fontSize: "14px" }}>
                          *
                        </span>{" "}
                      </label>
                    </FloatLabel>
                  </div>

                  <div className="col-12 md:col-6  mt-3">
                    <FloatLabel>
                      <Calendar
                        timeOnly
                        hourFormat="12"
                        stepMinute={15}
                        required
                        inputId="stu-pl-fromTime"
                        value={fromTime}
                        onChange={(e) => {
                          if (e.value) {
                            setFromTime(
                              mergeDateTime(
                                date ? (date as Date) : new Date(),
                                e.value as Date
                              )
                            );
                          } else {
                            setFromTime(null);
                          }
                        }}
                        className="w-12 md:w-8"
                      />
                      <label htmlFor="stu-pl-fromTime">
                        From Time{" "}
                        <span style={{ color: "red", fontSize: "14px" }}>
                          *
                        </span>{" "}
                      </label>
                    </FloatLabel>
                    {selectionOption === "Permission" &&
                      date &&
                      fromTime &&
                      fromTime.getTime() < Date.now() && (
                        <span className="special-font" style={{ color: "red" }}>
                          From Time must greater than current time
                        </span>
                      )}
                  </div>
                  <div className="col-12 md:col-6  mt-3">
                    <FloatLabel>
                      <Calendar
                        timeOnly
                        hourFormat="12"
                        stepMinute={15}
                        required
                        inputId="stu-pl-toTime"
                        value={toTime}
                        onChange={(e) => {
                          if (e.value) {
                            setToTime(
                              mergeDateTime(
                                date ? (date as Date) : new Date(),
                                e.value as Date
                              )
                            );
                          } else {
                            setToTime(null);
                          }
                        }}
                        className="w-12 md:w-8"
                      />
                      <label htmlFor="stu-pl-toTime">
                        To Time{" "}
                        <span style={{ color: "red", fontSize: "14px" }}>
                          *
                        </span>{" "}
                      </label>
                    </FloatLabel>
                    {selectionOption === "Permission" &&
                      fromTime &&
                      toTime &&
                      fromTime.getTime() >= toTime.getTime() && (
                        <span className="special-font" style={{ color: "red" }}>
                          To_Time must greater than From_Time
                        </span>
                      )}
                  </div>

                </>
              )}

              {selectionOption === "Leave" && (
                <>
                  <div className="col-12 md:col-6  mt-3">
                    <FloatLabel>
                      <Calendar
                        required
                        inputId="stu-pl-fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.value)}
                        className="w-12 md:w-8"
                        showButtonBar
                        showTime
                        hourFormat="12"
                        dateFormat="dd/mm/yy"
                        minDate={new Date()}
                        stepMinute={15}
                      />
                      <label htmlFor="stu-pl-fromDate">
                        From Date{" "}
                        <span style={{ color: "red", fontSize: "14px" }}>
                          *
                        </span>{" "}
                      </label>
                    </FloatLabel>
                  </div>

                  <div className="col-12 md:col-6  mt-3">
                    <FloatLabel>
                      <Calendar
                        required
                        inputId="stu-pl-toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.value)}
                        className="w-12 md:w-8"
                        showButtonBar
                        showTime
                        hourFormat="12"
                        dateFormat="dd/mm/yy"
                        minDate={fromDate ? (() => {
                          const temp = new Date(fromDate);
                          temp.setDate(temp.getDate() + 1);
                          temp.setHours(0)
                          return temp;
                        })() : undefined}
                        stepMinute={15}
                      />
                      <label htmlFor="stu-pl-toDate">
                        To Date{" "}
                        <span style={{ color: "red", fontSize: "14px" }}>
                          *
                        </span>{" "}
                      </label>
                    </FloatLabel>
                    {selectionOption === "Leave" &&
                      fromDate &&
                      toDate &&
                      new Date(fromDate.toDateString()).getTime() >= new Date(toDate.toDateString()).getTime() && (
                        <span className="special-font" style={{ color: "red" }}>
                          To_Date must greater than From_Date
                        </span>
                      )}
                  </div>
                </>
              )}

              <div className="col-12 md:col-6  mt-3">
                <FloatLabel>
                  <InputTextarea
                    className="w-12 md:w-8"
                    id="stu-pl-reason"
                    autoResize
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    required
                  />
                  <label htmlFor="stu-pl-reason">
                    Reason{" "}
                    <span style={{ color: "red", fontSize: "14px" }}>*</span>{" "}
                  </label>
                </FloatLabel>
              </div>

              <div className="col-12 md:col-6 lg:col-4 mt-3 flex justify-content-start">
                <Button
                  type="submit"
                  style={{ height: "50px" }}
                  disabled={
                    !isFormValid ||
                    isApplying ||
                    ((selectionOption === "Permission" &&
                      fromTime &&
                      toTime &&
                      fromTime.getTime() >= toTime.getTime()) as boolean) ||
                    ((selectionOption === "Permission" &&
                      date &&
                      fromTime &&
                      fromTime.getTime() < Date.now()) as boolean) ||
                    ((selectionOption === "Leave" &&
                      fromDate &&
                      toDate &&
                      new Date(fromDate.toDateString()).getTime() >= new Date(toDate.toDateString()).getTime()) as boolean)
                  }
                >
                  {isApplying && <i className="pi pi-spin pi-spinner"></i>}
                  &nbsp;&nbsp;
                  {isApplying
                    ? `Applying ${selectionOption}`
                    : `Apply ${selectionOption}`}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Messages ref={msgs} />
        )}
      </div>
    </>
  );
}

export default StudentLeave;
