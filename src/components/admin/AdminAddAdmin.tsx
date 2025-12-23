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
import { AdminRegisteration } from "../../services/RegisterService";
import { createLog } from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";
import { Admin } from "../interfaces/Admin";

function AdminAddAdmin() {
  const [newAdmin, setNewAdmin] = useState<Admin>({
    eid: "",
    designation: "",
    name: "",
    phoneNo: "",
  });
  const admin = useContext(AdminContext);

  const [password, setPassword] = useState<string>("");
  const [CPassword, setCPassword] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const adminToast = useRef<Toast>(null);

  const ValidateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      newAdmin?.name !== "" &&
      /^[0-9]{10}$/.test(newAdmin?.phoneNo as string) &&
      newAdmin?.eid !== "" &&
      password !== "" &&
      CPassword === password &&
      newAdmin?.designation !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [newAdmin, password, CPassword]);

  useEffect(() => {
    ValidateForm();
  }, [newAdmin, password, CPassword, ValidateForm]);

  const handleAdminRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsRegistering(true);
    AdminRegisteration(newAdmin as Admin, password)
      .then((data) => {
        setIsRegistering(false);
        const { success } = data;
        console.log(data)
        if (success) {
          let myLog: LOG = {
            date: new Date(),
            userId: admin.eid,
            username: admin.name as string,
            action: `Added New Admin ${newAdmin.eid}`,
          };
          createLog(myLog);

          if (adminToast.current) {
            adminToast.current.show({
              severity: "success",
              summary: "Registered Successfully !",
              detail: "New Admin has been added",
            });
          }
          setNewAdmin({
            eid: "",
            designation: "",
            name: "",
            phoneNo: "",
          });
          setPassword("");
          setCPassword("");
        } else {
          if (adminToast.current) {
            adminToast.current.show({
              severity: "error",
              summary: "Register Failed",
              detail: "Admin already exist",
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
      <Toast ref={adminToast} position="center"></Toast>

        <Card title="Admin Registration" className="special-font">
          <form
            action=""
            className="grid"
            onSubmit={handleAdminRegister}
          >

            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <InputText
                  id="adm-name"
                  type="text"
                  className="w-full"
                  value={newAdmin?.name}
                  onChange={(e) => {
                    setNewAdmin({
                      ...newAdmin,
                      name: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="adm-name">Name</label>
              </FloatLabel>
            </div>
            <div className="col-12 md:col-6 mt-3">
              <FloatLabel>
                <InputText
                  id="adm-phoneno"
                  type="text"
                  className="w-full"
                  value={newAdmin?.phoneNo}
                  onChange={(e) => {
                    setNewAdmin({
                      ...newAdmin,
                      phoneNo: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="adm-phoneno">Phone Number</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(newAdmin?.phoneNo as string) &&
                newAdmin?.phoneNo !== "" && (
                  <small id="phoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6  mt-3">
              <FloatLabel>
                <InputText
                  id="adm-username"
                  type="text"
                  className="w-full"
                  value={newAdmin?.eid}
                  onChange={(e) => {
                    setNewAdmin({
                      ...newAdmin,
                      eid: e.target.value.toUpperCase(),
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="adm-username">EID</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6  mt-3">
              <FloatLabel>
                <InputText
                  id="adm-designation"
                  type="text"
                  className="w-full"
                  value={newAdmin?.designation}
                  onChange={(e) => {
                    setNewAdmin({
                      ...newAdmin,
                      designation: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="adm-designation">Designation</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 mt-3">
              <div className="p-inputgroup flex-1 w-12 ">
                <FloatLabel>
                  <InputText
                    id="adm-password"
                    type="password"
                    className="w-full"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="adm-password">Password</label>
                </FloatLabel>
                <span
                  className="p-inputgroup-addon"
                  onClick={() => {
                    const ele = document.getElementById(
                      "adm-password"
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
                    id="adm-cpassword"
                    type="password"
                    className="w-full"
                    value={CPassword}
                    onChange={(e) => {
                      setCPassword(e.target.value);
                    }}
                    required
                  />
                  <label htmlFor="adm-cpassword">Confirm Password</label>
                </FloatLabel>
                <span
                  className="p-inputgroup-addon"
                  onClick={() => {
                    const ele = document.getElementById(
                      "adm-cpassword"
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

export default AdminAddAdmin;
