import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

import {
  AuthenticateAdminLogin,
  AuthenticateFacultyLogin,
  AuthenticateInchargeLogin,
} from "../services/LoginService";
import { useInchargeAuth } from "../utils/InchargeAuth";
import { useAdminAuth } from "../utils/AdminAuth";
import { useFacultyAuth } from "../utils/FacultyAuth";
import { isTokenExpired } from "./interfaces/Token";

export interface CustomInchargeJwtPayload {
  eid: string;
  id: string;
}

export interface CustomAdminJwtPayload {
  eid: string;
  id: string;
}

function Login() {
  const [facUsername, setFacUsername] = useState<string>("");
  const [facPassword, setFacPassword] = useState<string>("");
  const [incUsername, setIncUsername] = useState<string>("");
  const [incPassword, setIncPassword] = useState<string>("");
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");

  const [showFacLoading, setShowFacLoading] = useState<boolean>(false);
  const [showIncLoading, setShowIncLoading] = useState<boolean>(false);
  const [showAdminLoading, setShowAdminLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const { facultyLogin, facultyLogout } = useFacultyAuth();
  const { inchargeLogin, inchargeLogout } = useInchargeAuth();
  const { adminLogin, adminLogout } = useAdminAuth();

  const loginToast = useRef<Toast>(null);
  const Navigate = useNavigate();

  useEffect(() => {
    // Reset password visibility when changing tabs
    setPasswordVisible(false);
  }, [activeIndex]);

  useEffect(() => {
    const facultyExist = localStorage.getItem("facultyExist");
    const facultyToken = localStorage.getItem("facultyToken");
    const isFacultyTokenValid = !isTokenExpired(facultyToken as string);

    const inchargeExist = localStorage.getItem("inchargeExist");
    const inchargeToken = localStorage.getItem("inchargeToken");
    const isInchargeTokenValid = !isTokenExpired(inchargeToken as string);

    const adminExist = localStorage.getItem("adminExist");
    const adminToken = localStorage.getItem("adminToken");
    const isAdminTokenValid = !isTokenExpired(adminToken as string);

    if (facultyExist && facultyToken) {
      if (isFacultyTokenValid) {
        Navigate(`/faculty`, { replace: true });
      } else {
        facultyLogout();
      }
    } else if (inchargeExist && inchargeToken) {
      if (isInchargeTokenValid) {
        const decoded = jwtDecode<CustomInchargeJwtPayload>(inchargeToken);
        const eid = decoded.eid;
        Navigate(`/incharge/${eid}`, { replace: true });
      } else {
        inchargeLogout();
      }
    } else if (adminExist && adminToken) {
      if (isAdminTokenValid) {
        const decoded = jwtDecode<CustomAdminJwtPayload>(
          localStorage.getItem("adminToken") as string
        );
        const eid = decoded.eid;
        Navigate(`/admin/${eid}`, { replace: true });
      } else {
        adminLogout();
      }
    }
  }, [Navigate, adminLogout, facultyLogout, inchargeLogout]);

  const handleFacultySigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowFacLoading(true);

    AuthenticateFacultyLogin(facUsername, facPassword)
      .then((data) => {
        setShowFacLoading(false);
        const { success, token } = data;
        if (success) {
          loginToast.current?.show({
            severity: "success",
            summary: "Login Successful",
            detail: "Welcome Back",
            life: 3000
          });
          facultyLogin(token);
          Navigate(`/faculty`, { replace: true });
        } else {
          loginToast.current?.show({
            severity: "warn",
            summary: "Login Failed",
            detail: "Invalid Username or Password",
            life: 3000
          });
          facultyLogout();
        }
      })
      .catch((err) => {
        setShowFacLoading(false);
        console.log("something went wrong", err);
      });
  };

  const handleInchargeSigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowIncLoading(true);

    AuthenticateInchargeLogin(incUsername, incPassword)
      .then((data) => {
        setShowIncLoading(false);
        const { success, token } = data;
        if (success) {
          loginToast.current?.show({
            severity: "success",
            summary: "Login Successful",
            detail: "Welcome Back",
            life: 3000
          });
          inchargeLogin(token);
          Navigate(`/incharge/${incUsername}`, { replace: true });
        } else {
          loginToast.current?.show({
            severity: "warn",
            summary: "Login Failed",
            detail: "Invalid Username or Password",
            life: 3000
          });
          inchargeLogout();
        }
      })
      .catch((err) => {
        setShowIncLoading(false);
        console.log("There is some error", err);
      });
  };

  const handleAdminSigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAdminLoading(true);

    AuthenticateAdminLogin(adminUsername, adminPassword)
      .then((data) => {
        setShowAdminLoading(false);
        const { success, token } = data;
        if (success) {
          loginToast.current?.show({
            severity: "success",
            summary: "Login Successful",
            detail: "Welcome Back",
            life: 3000
          });
          adminLogin(token);
          Navigate(`/admin/${adminUsername}`, { replace: true });
        } else {
          loginToast.current?.show({
            severity: "warn",
            summary: "Login Failed",
            detail: "Invalid Username or Password",
            life: 3000
          });
          adminLogout();
        }
      })
      .catch((err) => {
        setShowAdminLoading(false);
        console.log("There is some error", err);
      });
  };

  return (
    <div className="login-container">
      <Toast ref={loginToast} />

      {/* Background Glow Effect */}
      <div
        style={{
          position: "fixed",
          bottom: "-15vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "40vh",
          background: "rgba(59, 130, 246, 0.5)",
          filter: "blur(100px)",
          borderRadius: "50% 50% 0 0",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Top Header */}
      <div className="login-header">
        <h1 className="login-title">NEC HOSTEL PORTAL</h1>
      </div>

      {/* Main Content Area */}
      <div className="login-content">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-sub-title">Admin Portal</div>
            <span className="login-description">Sign in to continue</span>
          </div>

          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="w-full custom-tabs"
            renderActiveOnly={false}
          >
            <TabPanel header="Faculty">
              <form onSubmit={handleFacultySigninForm} className="flex flex-column gap-3 mt-3">
                <div className="flex flex-column gap-2">
                  <label htmlFor="fid" className="block font-medium">Username</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user" />
                    </span>
                    <InputText
                      id="fid"
                      value={facUsername}
                      onChange={(e) => setFacUsername(e.target.value)}
                      placeholder="Enter Username"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-column gap-2">
                  <label htmlFor="fpass" className="block font-medium">Password</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock" />
                    </span>
                    <InputText
                      id="fpass"
                      type={passwordVisible ? "text" : "password"}
                      value={facPassword}
                      onChange={(e) => setFacPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                    />
                    <span
                      className="p-inputgroup-addon cursor-pointer"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      <i className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'}`} />
                    </span>
                  </div>
                </div>

                <div className="flex align-items-center justify-content-end">
                  <span
                    className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-200"
                    onClick={() => Navigate("/admin-forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>

                <Button
                  label="Sign In"
                  className="w-full mt-2"
                  loading={showFacLoading}
                />
              </form>
            </TabPanel>

            <TabPanel header="Incharge">
              <form onSubmit={handleInchargeSigninForm} className="flex flex-column gap-3 mt-3">
                <div className="flex flex-column gap-2">
                  <label htmlFor="inid" className="block font-medium">Username</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user" />
                    </span>
                    <InputText
                      id="inid"
                      value={incUsername}
                      onChange={(e) => setIncUsername(e.target.value)}
                      placeholder="Enter Username"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-column gap-2">
                  <label htmlFor="inpass" className="block font-medium">Password</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock" />
                    </span>
                    <InputText
                      id="inpass"
                      type={passwordVisible ? "text" : "password"}
                      value={incPassword}
                      onChange={(e) => setIncPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                    />
                    <span
                      className="p-inputgroup-addon cursor-pointer"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      <i className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'}`} />
                    </span>
                  </div>
                </div>

                <div className="flex align-items-center justify-content-end">
                  <span
                    className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-200"
                    onClick={() => Navigate("/admin-forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>

                <Button
                  label="Sign In"
                  className="w-full mt-2"
                  loading={showIncLoading}
                />
              </form>
            </TabPanel>

            <TabPanel header="Admin">
              <form onSubmit={handleAdminSigninForm} className="flex flex-column gap-3 mt-3">
                <div className="flex flex-column gap-2">
                  <label htmlFor="aid" className="block font-medium">Username</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user" />
                    </span>
                    <InputText
                      id="aid"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter Username"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-column gap-2">
                  <label htmlFor="apass" className="block font-medium">Password</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock" />
                    </span>
                    <InputText
                      id="apass"
                      type={passwordVisible ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                    />
                    <span
                      className="p-inputgroup-addon cursor-pointer"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      <i className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'}`} />
                    </span>
                  </div>
                </div>

                <div className="flex align-items-center justify-content-end">
                  <span
                    className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer transition-colors transition-duration-200"
                    onClick={() => Navigate("/admin-forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>

                <Button
                  label="Sign In"
                  className="w-full mt-2"
                  loading={showAdminLoading}
                />
              </form>
            </TabPanel>
          </TabView>
        </div>
        <button onClick={() => Navigate("/developers")} className="developers-btn">
          <i className="pi pi-code"></i>
          <span>Developers</span>
        </button>
      </div>
    </div>
  );
}

export default Login;

