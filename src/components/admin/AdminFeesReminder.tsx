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
import { SelectButton } from "primereact/selectbutton";

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
  college: any;
  year: any;
  feeAmountNonAC: string;
  feeAmountAC: string;
  templateType: string;
  customYearText: string;
}

function AdminFeesReminder() {
  const [feesMessage, setFeesMessage] = useState<FeesReminderMessage>({
    college: "",
    year: "",
    feeAmountNonAC: "",
    feeAmountAC: "",
    templateType: "DEFAULT",
    customYearText: "",
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
        .then((data) => {
          if (data && data.name) {
            setAdmin(data);
          } else {
            // Fallback: use eid from JWT as name if admin record not found
            setAdmin((prev) => ({ ...prev, name: decoded?.eid as string, eid: decoded?.eid as string }));
          }
        })
        .catch((err) => {
          console.log(err);
          const decoded2 = jwtDecode<CustomAdminJwtPayload>(adminToken);
          setAdmin((prev) => ({ ...prev, name: decoded2?.eid as string, eid: decoded2?.eid as string }));
        });
    }

    GetAllFeesReminders()
      .then((data) => {
        setAllFeeReminders(data.messages ? data.messages : []);
      })
      .catch((err) => {
        console.log("Error fetching fee reminders:", err);
      });
  }, []);

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

  const templateTypes = [
    { name: "Mention Fee Amount", code: "DEFAULT" },
    { name: "Same as Last Year", code: "SAME_AS_LAST_YEAR" },
  ];

  const validateForm = useCallback(() => {
    const isBaseValid = 
      feesMessage.college?.code !== undefined &&
      feesMessage.college?.code !== "" &&
      feesMessage.year?.code !== undefined &&
      feesMessage.year?.code !== "" &&
      feesMessage.customYearText.trim() !== "";

    if (feesMessage.templateType === "SAME_AS_LAST_YEAR") {
      setIsFormValid(isBaseValid);
    } else {
      setIsFormValid(
        isBaseValid &&
        feesMessage.feeAmountNonAC.trim() !== "" &&
        feesMessage.feeAmountAC.trim() !== ""
      );
    }
  }, [feesMessage]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleFeesReminderForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accept = () => {
      if (!feesMessage.year?.code) return;
      setIsSendingMessage(true);
      
      let messageToLog = "";
      if (feesMessage.templateType === "SAME_AS_LAST_YEAR") {
        messageToLog = `ప్రియమైన తల్లిదండ్రులకు, మీ అబ్బాయి/అమ్మాయి చదువుకుంటున్న హాస్టల్ ఫీజు వచ్చే విద్యాసంవత్సరానికి ${feesMessage.customYearText}కి కూడా గత సంవత్సరం నిర్ణయించిన విధంగానే కొనసాగించబడుతాయని తెలియజేస్తున్నాము. NEC హాస్టల్స్ - GEDNEC`;
      } else {
        messageToLog = `ప్రియమైన తల్లిదండ్రులకు, మీ అబ్బాయి/అమ్మాయి చదువుకుంటున్న హాస్టల్ యొక్క ${feesMessage.customYearText} సంవత్సరం ఫీజు NON-AC: ${feesMessage.feeAmountNonAC}, AC: ${feesMessage.feeAmountAC} గా నిర్ణయించబడినది. NEC హాస్టల్స్ - GEDNEC`;
      }
  
      SendFeesReminder({
        sendBy: admin.name,
        college: feesMessage.college.code,
        year: feesMessage.year.code,
        feeAmountNonAC: feesMessage.feeAmountNonAC,
        feeAmountAC: feesMessage.feeAmountAC,
        message: messageToLog,
        templateType: feesMessage.templateType,
        customYearText: feesMessage.customYearText,
      })
        .then((data) => {
          setIsSendingMessage(false);
          if (data?.success) {
            GetAllFeesReminders().then((data) => setAllFeeReminders(data.messages || []));
            
            let myLog: LOG = {
              date: new Date(),
              userId: admin.eid,
              username: admin.name as string,
              action: `Fees Reminder Sent: ${feesMessage.college.name} - ${feesMessage.year.name} - ${feesMessage.templateType === "SAME_AS_LAST_YEAR" ? "Same as Last Year" : `NonAC:${feesMessage.feeAmountNonAC}, AC:${feesMessage.feeAmountAC}`}`,
            };
            createLog(myLog);

            feesToast.current?.show({
              severity: "success",
              summary: "Success",
              detail: data.message || `Total ${data.totalMessagesSent} messages sent`,
            });
          } else {
            feesToast.current?.show({
              severity: "error",
              summary: "Failure",
              detail: data.message || "Failed to send messages",
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
          ప్రియమైన తల్లిదండ్రులకు, <span style={{ color: "green", fontWeight: "bold" }}>మీ అబ్బాయి</span> చదువుకుంటున్న హాస్టల్ ఫీజు వచ్చే విద్యాసంవత్సరానికి{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>{feesMessage.customYearText}</span>{" "}
          {feesMessage.templateType === "SAME_AS_LAST_YEAR" ? (
            <span style={{ color: "red", fontWeight: "bold" }}>కూడా గత సంవత్సరం నిర్ణయించిన విధంగానే కొనసాగించబడుతాయని తెలియజేస్తున్నాము</span>
          ) : (
            <>
              సంవత్సరానికి సంబంధించిన ఫీజు NON-AC: <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountNonAC}</span>, AC:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountAC}</span> గా నిర్ణయించబడినది
            </>
          )}
          . NEC హాస్టల్స్ - GEDNEC
        </p>
        <Divider />
        <p className="mb-2"><b>Example (Female Student):</b></p>
        <p className="p-2 bg-gray-100 border-round">
          ప్రియమైన తల్లిదండ్రులకు, <span style={{ color: "green", fontWeight: "bold" }}>మీ అమ్మాయి</span> చదువుకుంటున్న హాస్టల్ ఫీజు వచ్చే విద్యాసంవత్సరానికి{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>{feesMessage.customYearText}</span>{" "}
          {feesMessage.templateType === "SAME_AS_LAST_YEAR" ? (
            <span style={{ color: "red", fontWeight: "bold" }}>కూడా గత సంవత్సరం నిర్ణయించిన విధంగానే కొనసాగించబడుతాయని తెలియజేస్తున్నాము</span>
          ) : (
            <>
              సంవత్సరానికి సంబంధించిన ఫీజు NON-AC: <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountNonAC}</span>, AC:{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>{feesMessage.feeAmountAC}</span> గా నిర్ణయించబడినది
            </>
          )}
          . NEC హాస్టల్స్ - GEDNEC
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
      <p><b>College:</b> {data?.college || "ALL"}</p>
      <p><b>Year:</b> {data?.year}</p>
      <p><b>Type:</b> {data?.templateType === "SAME_AS_LAST_YEAR" ? "Same as Last Year" : "Default"}</p>
    </>
  );

  const amountBodyTemplate = (data: any) => {
    if (data.templateType === "SAME_AS_LAST_YEAR") return <Tag severity="info" value="Same as Last Year" />;
    return `NON-AC: ${data.feeAmountNonAC}, AC: ${data.feeAmountAC}`;
  };

  return (
    <div className="p-2 md:p-4" style={{ maxWidth: "1200px", margin: "auto" }}>
      <Toast ref={feesToast} position="top-center" />

      <Card title="Hostel Fees Reminder (Cost Notice)" className="special-font shadow-2 border-round">
        <form className="grid row-gap-2 mt-2" onSubmit={handleFeesReminderForm}>
          {/* Message Template First */}
          <div className="col-12">
            <label className="block mb-2 font-bold" style={{ fontSize: "0.9rem", color: "#666" }}>Select Message Template</label>
            <SelectButton
              value={feesMessage.templateType}
              onChange={(e) => setFeesMessage({ ...feesMessage, templateType: e.value })}
              options={templateTypes}
              optionLabel="name"
              optionValue="code"
              unselectable={false}
            />
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <FloatLabel>
              <Dropdown
                inputId="fees-college"
                value={feesMessage.college}
                onChange={(e) => setFeesMessage({ ...feesMessage, college: e.value })}
                options={colleges}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="fees-college">College</label>
            </FloatLabel>
          </div>

          <div className="col-12 md:col-6 lg:col-3">
            <FloatLabel>
              <Dropdown
                inputId="fees-year"
                value={feesMessage.year}
                onChange={(e) => setFeesMessage({ ...feesMessage, year: e.value, customYearText: e.value.name })}
                options={years}
                optionLabel="name"
                className="w-full"
              />
              <label htmlFor="fees-year">Year Filter</label>
            </FloatLabel>
          </div>

          {feesMessage.templateType === "SAME_AS_LAST_YEAR" && (
            <div className="col-12 md:col-6 lg:col-3">
              <FloatLabel>
                <InputText
                  id="fees-custom-year"
                  value={feesMessage.customYearText}
                  onChange={(e) => setFeesMessage({ ...feesMessage, customYearText: e.target.value })}
                  className="w-full"
                  placeholder="e.g. 2022-26"
                />
                <label htmlFor="fees-custom-year">Batch / Year Text (for SMS)</label>
              </FloatLabel>
            </div>
          )}

          {feesMessage.templateType === "DEFAULT" && (
            <>
              <div className="col-12 md:col-6 lg:col-3">
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

              <div className="col-12 md:col-6 lg:col-3">
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
            </>
          )}

          <div className="col-12 mt-4 flex justify-content-start">
            <Button type="submit" label={isSendingMessage ? "Sending..." : "Send Message"} icon={isSendingMessage ? "pi pi-spin pi-spinner" : "pi pi-send"} disabled={!isFormValid || isSendingMessage} className="w-full md:w-auto" />
          </div>
        </form>
      </Card>

      <Divider align="center">
        <Tag severity="success" value="Previous Reminders" />
      </Divider>

      <div className="card shadow-1 border-round surface-card overflow-hidden">
        <DataTable 
          value={allFeeReminders} 
          paginator 
          rows={5}
          responsiveLayout="stack"
          breakpoint="960px"
          className="text-sm"
        >
          <Column header="Send Date" body={(data) => formatDateWithTime(new Date(data.submittedTime))} style={{ minWidth: "120px" }} />
          <Column header="Send By" field="sendBy" style={{ minWidth: "100px" }} />
          <Column header="Details" body={sendToTemplate} style={{ minWidth: "150px" }} />
          <Column header="Amount" body={amountBodyTemplate} style={{ minWidth: "200px" }} />
          <Column header="Message" field="message" className="hidden lg:table-cell" />
          <Column header="Count" field="msgCount" align="center" style={{ minWidth: "80px" }} />
        </DataTable>
      </div>
    </div>
  );
}

export default AdminFeesReminder;
