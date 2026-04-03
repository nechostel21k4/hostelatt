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
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  createLog,
  getAdmin,
  GetAllFeesReminders,
  SendFeesReminder,
} from "../../services/AdminService";
import { AdminContext } from "./AdminHome";
import { confirmDialog } from "primereact/confirmdialog";
import { formatDateWithTime } from "../interfaces/Date";
import { LOG } from "../interfaces/Log";
import { jwtDecode } from "jwt-decode";
import { CustomAdminJwtPayload } from "../Login";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

interface FeesReminderMessage {
  year: any;
  feeAmountNonAC: string;
  feeAmountAC: string;
}

function AdminFeesReminder() {
  const [feesMessage, setFeesMessage] = useState<FeesReminderMessage>({
    year: "",
    feeAmountNonAC: "",
    feeAmountAC: "",
  });

  const [allFeeReminders, setAllFeeReminders] = useState<[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [admin, setAdmin] = useState<Admin>(useContext(AdminContext));

  const feesToast = useRef<Toast>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const decoded = jwtDecode<CustomAdminJwtPayload>(adminToken);
      getAdmin(decoded?.eid as string)
        .then((data) => setAdmin(data))
        .catch((err) => console.log(err));
    }

    GetAllFeesReminders()
      .then((data) => {
        setAllFeeReminders(data.messages ? data.messages : []);
      })
      .catch((err) => {
        console.log("Error fetching fee reminders:", err);
      });
  }, []);

  // Removed colleges array

  const years = [
    { name: "ALL", code: "ALL" },
    { name: "I Year", code: "1" },
    { name: "II Year", code: "2" },
    { name: "III Year", code: "3" },
    { name: "IV Year", code: "4" },
    { name: "V Year", code: "5" },
    { name: "VI Year", code: "6" },
  ];

  // Removed semesters array

  const validateForm = useCallback(() => {
    setIsFormValid(
      feesMessage.year !== "" &&
      feesMessage.feeAmountNonAC.trim() !== "" &&
      feesMessage.feeAmountAC.trim() !== ""
    );
  }, [feesMessage]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleFeesReminderForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accept = () => {
      setIsSendingMessage(true);
      const messageToLog = `ప్రియమైన తల్లిదండ్రులకు, మీ అబ్బాయి/అమ్మాయి చదువుకుంటున్న హాస్టల్ యొక్క ${feesMessage.year.name} సంవత్సరానికి సంబంధించిన ఫీజు NON-AC: ${feesMessage.feeAmountNonAC}, AC: ${feesMessage.feeAmountAC} గా నిర్ణయించబడినది. NEC హాస్టల్స్ - GEDNEC`;
  
      SendFeesReminder({
        sendBy: admin.name,
        college: "ALL",
        year: feesMessage.year.code,
        feeAmountNonAC: feesMessage.feeAmountNonAC,
        feeAmountAC: feesMessage.feeAmountAC,
        message: messageToLog,
      })
        .then((data) => {
          setIsSendingMessage(false);
          if (data?.success) {
            GetAllFeesReminders().then((data) => setAllFeeReminders(data.messages || []));
            
            let myLog: LOG = {
              date: new Date(),
              userId: admin.eid,
              username: admin.name as string,
              action: `Fees Reminder Sent: ${feesMessage.year.name} - NonAC:${feesMessage.feeAmountNonAC}, AC:${feesMessage.feeAmountAC}`,
            };
            createLog(myLog);

            feesToast.current?.show({
              severity: "success",
              summary: "Success",
              detail: `Total ${data.totalMessagesSent} messages sent`,
            });
          } else {
            feesToast.current?.show({
              severity: "error",
              summary: "Failure",
              detail: "Failed to send messages",
            });
          }
        })
        .catch((err) => {
          setIsSendingMessage(false);
          console.log("Error sending fee reminders:", err);
        });
    };

    const previewMessage = (
      <div className="text-sm">
        <p className="mb-2"><b>Example (Male Student):</b></p>
        <p className="p-2 bg-gray-100 border-round">
          ప్రియమైన తల్లిదండ్రులకు, <span style={{ color: "green", fontWeight: "bold" }}>మీ అబ్బాయి</span> చదువుకుంటున్న హాస్టల్ యొక్క{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>{feesMessage.year.name}</span>{" "}
          సంవత్సరానికి సంబంధించిన ఫీజు NON-AC:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountNonAC}</span>, AC:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountAC}</span>{" "}
          గా నిర్ణయించబడినది. NEC హాస్టల్స్ - GEDNEC
        </p>
        <Divider />
        <p className="mb-2"><b>Example (Female Student):</b></p>
        <p className="p-2 bg-gray-100 border-round">
          ప్రియమైన తల్లిదండ్రులకు, <span style={{ color: "green", fontWeight: "bold" }}>మీ అమ్మాయి</span> చదువుకుంటున్న హాస్టల్ యొక్క{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>{feesMessage.year.name}</span>{" "}
          సంవత్సరానికి సంబంధించిన ఫీజు NON-AC:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountNonAC}</span>, AC:{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountAC}</span>{" "}
          గా నిర్ణయించబడినది. NEC హాస్టల్స్ - GEDNEC
        </p>
      </div>
    );

    confirmDialog({
      message: previewMessage,
      header: "Preview Fee Cost Notice",
      icon: "pi pi-eye",
      acceptClassName: "p-button-success",
      accept,
    });
  };

  const sendToTemplate = (data: any) => (
    <>
      <p><b>Year:</b> {data?.year}</p>
    </>
  );

  return (
    <div className="p-2 w-full" style={{ position: "absolute", left: "50%", transform: "translatex(-50%)" }}>
      <Toast ref={feesToast} position="top-center" />

      <Card title="Hostel Fees Reminder (Cost Notice)" className="special-font">
        <form className="grid" onSubmit={handleFeesReminderForm}>
          {/* Removed College Dropdown as per 'dont mention collage' request */}

          <div className="col-12 md:col-4 mt-3">
            <FloatLabel>
              <Dropdown
                inputId="fees-year"
                value={feesMessage.year}
                onChange={(e) => setFeesMessage({ ...feesMessage, year: e.value })}
                options={years}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="fees-year">Year</label>
            </FloatLabel>
          </div>

          <div className="col-12 md:col-4 mt-3">
            <FloatLabel>
              <InputText
                id="fees-amount-nonac"
                value={feesMessage.feeAmountNonAC}
                onChange={(e) => setFeesMessage({ ...feesMessage, feeAmountNonAC: e.target.value })}
                className="w-full"
                placeholder="e.g. 75000/-"
              />
              <label htmlFor="fees-amount-nonac">Fee Amount (NON-AC)</label>
            </FloatLabel>
          </div>

          <div className="col-12 md:col-4 mt-3">
            <FloatLabel>
              <InputText
                id="fees-amount-ac"
                value={feesMessage.feeAmountAC}
                onChange={(e) => setFeesMessage({ ...feesMessage, feeAmountAC: e.target.value })}
                className="w-full"
                placeholder="e.g. 95000/-"
              />
              <label htmlFor="fees-amount-ac">Fee Amount (AC)</label>
            </FloatLabel>
          </div>

          <div className="col-12 mt-4 flex justify-content-start">
            <Button type="submit" label={isSendingMessage ? "Sending..." : "Send Message"} icon={isSendingMessage ? "pi pi-spin pi-spinner" : "pi pi-send"} disabled={!isFormValid || isSendingMessage} />
          </div>
        </form>
      </Card>

      <Divider align="center">
        <Tag severity="success" value="Previous Reminders" />
      </Divider>

      <div className="card">
        <DataTable value={allFeeReminders} paginator rows={5}>
          <Column header="Send Date" body={(data) => formatDateWithTime(new Date(data.submittedTime))} style={{ minWidth: "120px" }} />
          <Column header="Send By" field="sendBy" style={{ minWidth: "100px" }} />
          <Column header="Details" body={sendToTemplate} style={{ minWidth: "150px" }} />
          <Column header="Amount" body={(data) => `NON-AC: ${data.feeAmountNonAC}, AC: ${data.feeAmountAC}`} style={{ minWidth: "200px" }} />
          <Column header="Message" field="message" />
          <Column header="Count" field="msgCount" align="center" style={{ minWidth: "80px" }} />
        </DataTable>
      </div>
    </div>
  );
}

export default AdminFeesReminder;
