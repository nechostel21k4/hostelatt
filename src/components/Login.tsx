import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  const { facultyLogin, facultyLogout } = useFacultyAuth();
  const { inchargeLogin, inchargeLogout } = useInchargeAuth();
  const { adminLogin, adminLogout } = useAdminAuth();

  const loginToast = useRef<Toast>(null);

  const Navigate = useNavigate();

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
  }, [Navigate]);

  const handleFacultySigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowFacLoading(true);

    AuthenticateFacultyLogin(facUsername, facPassword)
      .then((data) => {
        setShowFacLoading(false);
        const { success, token } = data;
        if (success) {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "success",
              summary: "Login Successful !",
              detail: "Welcome, User",
            });
          }
          facultyLogin(token);
          Navigate(`/faculty`, { replace: true });
        } else {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "warn",
              summary: "Invalid Credentials",
              detail: "Check Username or Password",
            });
          }
          facultyLogout();
        }
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  };

  const handleInchargeSigninForm = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setShowIncLoading(true);

    AuthenticateInchargeLogin(incUsername, incPassword)
      .then((data) => {
        setShowIncLoading(false);

        const { success, token } = data;
        if (success) {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "success",
              summary: "Login Successful !",
              detail: "Welcome, User",
            });
          }
          inchargeLogin(token);
          Navigate(`/incharge/${incUsername}`, { replace: true });
        } else {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "warn",
              summary: "Invalid Credentials",
              detail: "Check Username or Password",
            });
          }
          inchargeLogout();
        }
      })
      .catch((err) => {
        console.log("there is some error", err);
      });
  };

  const handleAdminSigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAdminLoading(true);
    // incharge
    AuthenticateAdminLogin(adminUsername, adminPassword)
      .then((data) => {
        setShowAdminLoading(false);

        const { success, token } = data;
        if (success) {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "success",
              summary: "Login Successful !",
              detail: "Welcome, User",
            });
          }
          adminLogin(token);
          Navigate(`/admin/${adminUsername}`, { replace: true });
        } else {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "warn",
              summary: "Invalid Credentials",
              detail: "Check Username or Password",
            });
          }
          adminLogout();
        }
      })
      .catch((err) => {
        console.log("there is some error", err);
      });
  };

  return (
    <>
      <Toast ref={loginToast} position="top-center" />
      <div
        className="w-full p-1 flex align-items-center justify-content-between"
        style={{ backgroundColor: "#3FA2F6" }}
      >
        <img
          src="/images/logo-no-background1.png"
          alt="Nec logo"
          className="ml-4 h-3rem"
        />
        <img
          src="/images/Nec.png"
          alt="Nec logo"
          className="mr-4 h-4rem"
        />
        <img
          src="/images/logo nec 2.png"
          alt="Nec logo"
          className="mr-4 h-4rem hidden sm:block"
        />
      </div>
      <div className="flex align-items-center justify-content-center mt-3">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-5">
          <TabView>
            <TabPanel header="Faculty">
              <div className="text-center mb-5">
                <div className="text-900 text-2xl font-medium mb-2 special-font">
                  Faculty Sign in
                </div>
              </div>
              <div>
                <form onSubmit={handleFacultySigninForm}>
                  <label
                    htmlFor="fac-username"
                    className="block text-900 font-medium mb-1"
                  >
                    Username
                  </label>

                  <div className="p-inputgroup flex-1 mb-2">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="fac-username"
                      value={facUsername}
                      onChange={(e) => {
                        setFacUsername(e.target.value);
                      }}
                      placeholder="Username"
                      required
                    />
                  </div>

                  <label
                    htmlFor="fac-password"
                    className="block text-900 font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="p-inputgroup flex-1 mb-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="fac-password"
                      type="password"
                      placeholder="Password"
                      value={facPassword}
                      onChange={(e) => {
                        setFacPassword(e.target.value);
                      }}
                      required
                    />
                    <span
                      className="p-inputgroup-addon"
                      onClick={() => {
                        const ele = document.getElementById(
                          "fac-password"
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
                  <Button
                    label={`${showFacLoading ? `Signing` : "Sign in"}`}
                    disabled={showFacLoading}
                    type="submit"
                    className="w-full"
                  >
                    {showFacLoading && (
                      <i className="pi pi-spin pi-spinner"></i>
                    )}
                  </Button>
                </form>
              </div>
            </TabPanel>

            <TabPanel header="Incharge">
              <div className="text-center mb-5">
                <div className="text-900 text-2xl font-medium mb-2 special-font">
                  Incharge Sign in
                </div>
              </div>
              <div>
                <form onSubmit={handleInchargeSigninForm}>
                  <label
                    htmlFor="inc-username"
                    className="block text-900 font-medium mb-1"
                  >
                    Username
                  </label>
                  <div className="p-inputgroup flex-1 mb-2">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="inc-username"
                      value={incUsername}
                      onChange={(e) => {
                        setIncUsername(e.target.value);
                      }}
                      placeholder="Username"
                      required
                    />
                  </div>

                  <label
                    htmlFor="inc-password"
                    className="block text-900 font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="p-inputgroup flex-1 mb-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="inc-password"
                      type="password"
                      placeholder="Password"
                      value={incPassword}
                      onChange={(e) => {
                        setIncPassword(e.target.value);
                      }}
                      required
                    />
                    <span
                      className="p-inputgroup-addon"
                      onClick={() => {
                        const ele = document.getElementById(
                          "inc-password"
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
                  <Button
                    label={`${showIncLoading ? `Signing` : "Sign in"}`}
                    disabled={showIncLoading}
                    type="submit"
                    className="w-full"
                  >
                    {showIncLoading && (
                      <i className="pi pi-spin pi-spinner"></i>
                    )}
                  </Button>
                </form>
              </div>
              <div className="flex align-items-center justify-content-end">
                <Link
                  className="font-medium no-underline ml-2 text-blue-500  cursor-pointer mt-2"
                  to="/inchargefpassword"
                >
                  Forgot your password ?
                </Link>
              </div>
            </TabPanel>

            <TabPanel header="Admin">
              <div className="text-center mb-5">
                <div className="text-900 text-2xl font-medium mb-2 special-font">
                  Admin Sign in
                </div>
              </div>
              <div>
                <form onSubmit={handleAdminSigninForm}>
                  <label
                    htmlFor="admin-username"
                    className="block text-900 font-medium mb-1"
                  >
                    Username
                  </label>
                  <div className="p-inputgroup flex-1 mb-2">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="admin-username"
                      value={adminUsername}
                      onChange={(e) => {
                        setAdminUsername(e.target.value);
                      }}
                      placeholder="Username"
                      required
                    />
                  </div>

                  <label
                    htmlFor="admin-password"
                    className="block text-900 font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="p-inputgroup flex-1 mb-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="admin-password"
                      type="password"
                      placeholder="Password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                      }}
                      required
                    />
                    <span
                      className="p-inputgroup-addon"
                      onClick={() => {
                        const ele = document.getElementById(
                          "admin-password"
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
                  <Button
                    label={`${showAdminLoading ? `Signing` : "Sign in"}`}
                    disabled={showAdminLoading}
                    type="submit"
                    className="w-full"
                  >
                    {showAdminLoading && (
                      <i className="pi pi-spin pi-spinner"></i>
                    )}
                  </Button>
                </form>
              </div>
              <div className="flex align-items-center justify-content-end">
                <Link
                  className="font-medium no-underline ml-2 text-blue-500  cursor-pointer mt-2"
                  to="/adminfpassword"
                >
                  Forgot your password ?
                </Link>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div className="absolute top-0 left-0">
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default Login;
