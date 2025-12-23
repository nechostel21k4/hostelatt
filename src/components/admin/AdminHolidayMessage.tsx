import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Admin } from "../interfaces/Admin";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from "primereact/dropdown";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  createLog,
  getAdmin,
  GetAllHolidayMsgs,
  SendHolidayMessage,
} from "../../services/AdminService";
import { AdminContext } from "./AdminHome";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { formatDate, formatDateWithTime } from "../interfaces/Date";
import axios from "axios";
import { LOG } from "../interfaces/Log";
import { jwtDecode } from "jwt-decode";
import { CustomAdminJwtPayload } from "../Login";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

interface HolidayMessage {
  year: string;
  college: string;
  fromDate: Nullable<Date>;
  toDate: Nullable<Date>;
  occasion: string;
  message: string;
}

function AdminHolidayMessage() {
  const [holidayMessage, setHolidayMessage] = useState<HolidayMessage>({
    year: "",
    college: "",
    fromDate: null,
    toDate: null,
    occasion: "",
    message: "",
  });

  const [allHolidayMsgs, setAllHolidayMsgs] = useState<[]>([]);

  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [admin, setAdmin] = useState<Admin>(useContext(AdminContext));

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const decoded = jwtDecode<CustomAdminJwtPayload>(adminToken as string);

    getAdmin(decoded?.eid as string)
      .then((data) => {
        setAdmin(data);
      })
      .catch((err) => {
        console.log(err);
      });
    GetAllHolidayMsgs()
      .then((data) => {
        setAllHolidayMsgs(data.messages ? data.messages : []);
      })
      .catch((err) => {
        console.log("Error : while fetching all holiday msgs", err);
      });
  }, []);

  const handleHolidayMessageForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Transliterate expected format: ["SUCCESS", [["word", ["choice1", ...]]]]
    const occasionTEL = await axios.get(
      `https://inputtools.google.com/request?text=${encodeURIComponent(holidayMessage.occasion)}&itc=te-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`
    );
    let teluguOccasionName = holidayMessage.occasion;
    if (
      occasionTEL.data[0] === 'SUCCESS' &&
      occasionTEL.data[1] &&
      occasionTEL.data[1][0] &&
      occasionTEL.data[1][0][1] &&
      occasionTEL.data[1][0][1].length > 0
    ) {
      teluguOccasionName = occasionTEL.data[1][0][1][0];
    }

    const accept = () => {
      setIsSendingMessage(true);

      const messageToadd = `ప్రియమైన తల్లిదండ్రులకు, మీ పిల్లలు చదువుకుంటున్న ${JSON.parse(JSON.stringify(holidayMessage.college)).code === "ALL"
          ? "NEC/NIT/NIPS"
          : JSON.parse(JSON.stringify(holidayMessage.college)).code
        } కళాశాలలో ${teluguOccasionName} సందర్భంగా ${formatDate(
          holidayMessage.fromDate as Date
        )} నుండి ${formatDate(
          holidayMessage.toDate as Date
        )} వరకు సెలవులు ప్రకటించబడినట్లు తెలియజేస్తున్నాము. NEC హాస్టల్స్ - GEDNEC`;
      SendHolidayMessage({
        sendBy: admin.name,
        college: JSON.parse(JSON.stringify(holidayMessage.college)).code,
        year: JSON.parse(JSON.stringify(holidayMessage.year)).code,
        fromDate: formatDate(holidayMessage.fromDate as Date),
        toDate: formatDate(holidayMessage.toDate as Date),
        occasion: holidayMessage.occasion,
        message: messageToadd,
      })
        .then((data) => {
          setIsSendingMessage(false);
          if (data?.success) {
            GetAllHolidayMsgs()
              .then((data) => {
                setAllHolidayMsgs(data.messages ? data.messages : []);
              })
              .catch((err) => {
                console.log("Error : while fetching all holiday msgs", err);
              });
            let myLog: LOG = {
              date: new Date(),
              userId: admin.eid,
              username: admin.name as string,
              action: `Holiday Message : ${messageFORlog}`,
            };
            createLog(myLog);

            if (holidayToast?.current) {
              holidayToast?.current.show({
                severity: "success",
                summary: `Success !`,
                detail: `Total ${data.totalMessagesSent} messages sended`,
              });
            }
          } else {
            if (holidayToast?.current) {
              holidayToast?.current.show({
                severity: "error",
                summary: `Failure !`,
                detail: `Failed to send messages`,
              });
            }
          }
          // setHolidayMessage({
          //   year: "",
          //   college: "",
          //   fromDate: null,
          //   toDate: null,
          //   occasion: "",
          // });
        })
        .catch((err) => {
          console.log("Error : while sending holiday messages ", err);
        });
    };
    const reject = () => { };

    const messageFORlog = `ప్రియమైన తల్లిదండ్రులకు, మీ పిల్లలు చదువుకుంటున్న ${holidayMessage.college === "ALL"
        ? "NEC/NIT/NIPS"
        : JSON.parse(JSON.stringify(holidayMessage.college)).code
      } కళాశాలలో ${teluguOccasionName} సందర్భంగా ${formatDate(
        holidayMessage.fromDate as Date
      )} నుండి ${formatDate(
        holidayMessage.toDate as Date
      )} వరకు సెలవులు ప్రకటించబడినట్లు తెలియజేస్తున్నాము. NEC హాస్టల్స్ - GEDNEC`;

    const message = (
      <p>
        ప్రియమైన తల్లిదండ్రులకు, మీ పిల్లలు చదువుకుంటున్న{" "}
        <span
          style={{
            color: "blue",
            fontWeight: "bold",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          {JSON.parse(JSON.stringify(holidayMessage.college)).code === "ALL"
            ? "NEC/NIT/NIPS"
            : JSON.parse(JSON.stringify(holidayMessage.college)).code}
        </span>{" "}
        కళాశాలలో{" "}
        <span
          style={{
            color: "blue",
            fontWeight: "bold",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          {teluguOccasionName}
        </span>{" "}
        సందర్భంగా{" "}
        <span
          style={{
            color: "blue",
            fontWeight: "bold",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          {formatDate(holidayMessage.fromDate as Date)}
        </span>{" "}
        నుండి{" "}
        <span
          style={{
            color: "blue",
            fontWeight: "bold",
            fontStyle: "italic",
            textDecoration: "underline",
          }}
        >
          {formatDate(holidayMessage.toDate as Date)}
        </span>{" "}
        వరకు సెలవులు ప్రకటించబడినట్లు తెలియజేస్తున్నాము. NEC హాస్టల్స్ - GEDNEC
      </p>
    );

    confirmDialog({
      message: message,
      header: "Preview Holiday Message",
      icon: "pi pi-eye",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
      id: "adminholidaymessagedialog",
    });
  };

  const colleges = [
    { name: "ALL", code: "ALL" },
    { name: "NEC", code: "NEC" },
    { name: "NIT", code: "NIT" },
    { name: "NIPS", code: "NIPS" },
  ];
  const years = [
    { name: "ALL", code: "ALL" },
    { name: "I Year", code: "1" },
    { name: "II Year", code: "2" },
    { name: "III Year", code: "3" },
    { name: "IV Year", code: "4" },
    { name: "V Year", code: "5" },
    { name: "VI Year", code: "6" },
  ];

  const validateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      holidayMessage.college !== "" &&
      holidayMessage.year !== "" &&
      holidayMessage.fromDate !== null &&
      holidayMessage.toDate !== null &&
      holidayMessage.occasion !== ""
    ) {
      setIsFormValid(true);
    }
  }, [holidayMessage]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const holidayToast = useRef<Toast>(null);

  const sendToTemplate = (data: any) => {
    return (
      <>
        <p>
          <b>College : </b>
          {data?.college}
        </p>
        <p>
          <b>Year : </b>
          {data?.Year}
        </p>
      </>
    );
  };

  const sendDateTemplate = (data: any) => {
    return formatDateWithTime(new Date(data?.submittedTime));
  };

  const messageTemplate = (data: any) => {
    return data?.message;
  };

  return (
    <>
      <div
        className="p-2 w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Toast ref={holidayToast} position="top-center"></Toast>

        <Card title="Send Holiday Message" className="special-font">
          <form action="" className="grid" onSubmit={handleHolidayMessageForm}>
            <div className="col-12 md:col-6 mt-3">
              <div className="w-12 md:w-8">
                <FloatLabel>
                  <Dropdown
                    inputId="ad-hm-college"
                    value={holidayMessage.college}
                    onChange={(e) =>
                      setHolidayMessage({ ...holidayMessage, college: e.value })
                    }
                    options={colleges}
                    optionLabel="name"
                    className="w-full"
                  />
                  <label htmlFor="ad-hm-college">College</label>
                </FloatLabel>
              </div>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <div className="w-12 md:w-8">
                <FloatLabel>
                  <Dropdown
                    inputId="ad-hm-year"
                    value={holidayMessage.year}
                    onChange={(e) =>
                      setHolidayMessage({ ...holidayMessage, year: e.value })
                    }
                    options={years}
                    optionLabel="name"
                    className="w-full"
                  />
                  <label htmlFor="ad-hm-year">Year</label>
                </FloatLabel>
              </div>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <Calendar
                  required
                  inputId="ad-hm-fromDate"
                  value={holidayMessage.fromDate}
                  onChange={(e) =>
                    setHolidayMessage({ ...holidayMessage, fromDate: e.value })
                  }
                  className="w-12 md:w-8"
                  showButtonBar
                  dateFormat="dd/mm/yy"
                />
                <label htmlFor="ad-hm-fromDate">From Date</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <Calendar
                  required
                  inputId="ad-hm-toDate"
                  value={holidayMessage.toDate}
                  onChange={(e) =>
                    setHolidayMessage({ ...holidayMessage, toDate: e.value })
                  }
                  className="w-12 md:w-8"
                  showButtonBar
                  dateFormat="dd/mm/yy"
                  minDate={holidayMessage.fromDate as Date}
                />
                <label htmlFor="ad-hm-toDate">To Date</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-hm-occasion"
                  className="w-12 md:w-8"
                  style={{ height: "50px" }}
                  value={holidayMessage.occasion}
                  onChange={(e) =>
                    setHolidayMessage({
                      ...holidayMessage,
                      occasion: e.target.value,
                    })
                  }
                />
                <label htmlFor="ad-hm-occasion">Occasion</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 mt-3 flex justify-content-start">
              <Button type="submit" disabled={!isFormValid || isSendingMessage}>
                {isSendingMessage && <i className="pi pi-send"></i>}
                &nbsp;&nbsp;
                {isSendingMessage ? "Sending" : "Send Message"}
                &nbsp;&nbsp;
                {isSendingMessage && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </div>
          </form>
        </Card>
        <Divider align="center">
          <Tag severity="success" value="Previous Messages"></Tag>
        </Divider>

        <div className="card">
          <DataTable value={allHolidayMsgs}>
            <Column
              header="Send Date"
              body={sendDateTemplate}
              style={{ minWidth: "120px" }}
            ></Column>
            <Column header="Send By" style={{ minWidth: "120px" }} field="sendBy"></Column>
            <Column
              header="Send To"
              style={{ minWidth: "150px" }}
              body={sendToTemplate}
            ></Column>
            <Column
              header="Message"
              body={messageTemplate}
            ></Column>
            <Column
              header="Received Count"
              align={"center"}
              field="msgCount"
            ></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
}

export default AdminHolidayMessage;
