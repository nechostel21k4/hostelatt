import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { AdminInchargeRegisteration } from "../../services/RegisterService";
import { Incharge } from "../interfaces/Incharge";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";

function AdminAddIncharge() {
  const [newIncharge, setNewIncharge] = useState<Incharge>({
    eid: "",
    hostelId: "label",
    designation: "",
    name: "",
    phoneNo: "",
  });
  const admin = useContext(AdminContext);

  const [password, setPassword] = useState<string>("");
  const [CPassword, setCPassword] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const adminInchargeToast = useRef<Toast>(null);

  const ValidateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      newIncharge?.hostelId !== "label" &&
      newIncharge?.name !== "" &&
      /^[0-9]{10}$/.test(newIncharge?.phoneNo as string) &&
      newIncharge?.eid !== "" &&
      password !== "" &&
      CPassword === password &&
      newIncharge?.designation !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newIncharge, password, CPassword]);

  useEffect(() => {
    ValidateForm();
  }, [newIncharge, password, CPassword, ValidateForm]);

  const handleAdminInchargeRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsRegistering(true);
    AdminInchargeRegisteration(newIncharge as Incharge, password)
      .then((data) => {
        setIsRegistering(false);
        const { success } = data;
        if (success) {
          let myLog: LOG = {
            date: new Date(),
            userId: admin.eid,
            username: admin.name as string,
            action: `Added New Incharge ${newIncharge.eid}`,
          };
          createLog(myLog);

          if (adminInchargeToast.current) {
            adminInchargeToast.current.show({
              severity: "success",
              summary: "Registered Successfully !",
              detail: "New Incharge has been added",
            });
          }
          setNewIncharge({
            eid: "",
            hostelId: "label",
            designation: "",
            name: "",
            phoneNo: "",
          });
          setPassword("");
          setCPassword("");
        } else {
          if (adminInchargeToast.current) {
            adminInchargeToast.current.show({
              severity: "error",
              summary: "Register Failed",
              detail: "Incharge already exist",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div
        className="p-2 w-10"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
      <Toast ref={adminInchargeToast} position="center"></Toast>

        <Card title="Incharge Registration" className="special-font">
          <form
            action=""
            className="grid"
            onSubmit={handleAdminInchargeRegister}
          >
            <div className="col-12 md:col-6 mt-3">
              <div className="custom-select-container w-full">
                <select
                  className="custom-select"
                  value={newIncharge?.hostelId}
                  id="ad-add-inc-hostelId"
                  onChange={(e) => {
                    setNewIncharge({
                      ...newIncharge,
                      hostelId: e.target.value.toUpperCase(),
                    } as Incharge);
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

            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <InputText
                  id="inc-name"
                  type="text"
                  className="w-full"
                  value={newIncharge?.name}
                  onChange={(e) => {
                    setNewIncharge({
                      ...newIncharge,
                      name: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="inc-name">Name</label>
              </FloatLabel>
            </div>
            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <InputText
                  id="inc-phoneno"
                  type="text"
                  className="w-full"
                  value={newIncharge?.phoneNo}
                  onChange={(e) => {
                    setNewIncharge({
                      ...newIncharge,
                      phoneNo: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="inc-phoneno">Phone Number</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(newIncharge?.phoneNo as string) &&
                newIncharge?.phoneNo !== "" && (
                  <small id="phoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6  mt-3">
              <FloatLabel>
                <InputText
                  id="inc-username"
                  type="text"
                  className="w-full"
                  value={newIncharge?.eid}
                  onChange={(e) => {
                    setNewIncharge({
                      ...newIncharge,
                      eid: e.target.value.toUpperCase(),
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="inc-username">EID</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6  mt-3">
              <FloatLabel>
                <InputText
                  id="inc-designation"
                  type="text"
                  className="w-full"
                  value={newIncharge?.designation}
                  onChange={(e) => {
                    setNewIncharge({
                      ...newIncharge,
                      designation: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="inc-designation">Designation</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <div className="p-inputgroup flex-1 w-12 ">
                <FloatLabel>
                  <InputText
                    id="inc-password"
                    type="password"
                    className="w-full"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="inc-password">Password</label>
                </FloatLabel>
                <span
                  className="p-inputgroup-addon"
                  onClick={() => {
                    const ele = document.getElementById(
                      "inc-password"
                    ) as HTMLInputElement | null;
                    if (ele) {
                      if (ele.type === "text") {
                        ele.type = "password";
                      } else if (ele.type === "password") {
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
                    id="inc-cpassword"
                    type="password"
                    className="w-full"
                    value={CPassword}
                    onChange={(e) => {
                      setCPassword(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="inc-cpassword">Confirm Password</label>
                </FloatLabel>
                <span
                  className="p-inputgroup-addon"
                  onClick={() => {
                    const ele = document.getElementById(
                      "inc-cpassword"
                    ) as HTMLInputElement | null;
                    if (ele) {
                      if (ele.type === "text") {
                        ele.type = "password";
                      } else if (ele.type === "password") {
                        ele.type = "text";
                      }
                    }
                  }}
                >
                  <i className="pi pi-eye cursor-pointer"></i>
                </span>
              </div>
              {!(password === CPassword) && (
                <small id="password-help" className="text-red-500">
                  Passwords are not same
                </small>
              )}
            </div>

            <div className="col-12 mt-3 flex justify-content-start">
              <Button type="submit" disabled={!isFormValid || isRegistering}>
                {isRegistering && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isRegistering ? "Registering" : "Register"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AdminAddIncharge;
