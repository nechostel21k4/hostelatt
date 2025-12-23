import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { AuthenticateStudentLogin } from "../services/LoginService";
import { useStudentAuth } from "../utils/StudentAuth";
import { isTokenExpired } from "./interfaces/Token";

export interface CustomStudentJwtPayload {
  rollNo: string;
  id: string;
}

function StudentLogin() {
  const [stuUsername, setStuUsername] = useState<string>("");
  const [stuPassword, setStuPassword] = useState<string>("");

  const [showStuLoading, setShowStuLoading] = useState<boolean>(false);

  const { studentLogin, studentLogout } = useStudentAuth();

  const loginToast = useRef<Toast>(null);

  const Navigate = useNavigate();



  useEffect(() => {
    const studentExist = localStorage.getItem("studentExist");
    const studentToken = localStorage.getItem("studentToken");
    const isTokenValid = !isTokenExpired(studentToken as string);

    if (studentExist && studentToken && isTokenValid) {
      const decoded = jwtDecode<CustomStudentJwtPayload>(
        localStorage.getItem("studentToken") as string
      );
      const rollNo = decoded.rollNo;
      Navigate(`student/${rollNo}`, { replace: true });
    } else {
      studentLogout()
    }
  }, [Navigate]);

  const handleStudentSigninForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowStuLoading(true);

    AuthenticateStudentLogin(stuUsername, stuPassword)
      .then((data) => {
        setShowStuLoading(false);
        const { success, token } = data;
        if (success) {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "success",
              summary: "Login Successful !",
              detail: "Welcome, User",
            });
          }

          studentLogin(token);
          Navigate(`/student/${stuUsername}`, { replace: true });
        } else {
          if (loginToast.current) {
            loginToast.current.show({
              severity: "warn",
              summary: "Invalid Credentials",
              detail: "Check Username or Password",
            });
          }
          studentLogout();
        }
      })
      .catch((err) => {
        console.log("there is error", err);
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
        <img src="/images/Nec.png" alt="Nec logo" className="mr-4 h-4rem" />
        <img
          src="/images/logo nec 2.png"
          alt="Nec logo"
          className="mr-4 h-4rem hidden sm:block"
        />
      </div>

      <div className="flex align-items-center justify-content-center m-5">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-5">
          <div className="text-center mb-5">
            <div className="text-900 text-2xl font-medium mb-2 special-font">
              Student Sign in
            </div>
            <span className="text-600 font-medium line-height-2">
              Don't have an account ?
            </span>
            <Link
              className="font-medium no-underline ml-2 text-blue-500  cursor-pointer mt-2"
              to="/studentregister"
            >
              Register
            </Link>
          </div>
          <div>
            <form onSubmit={handleStudentSigninForm}>
              <label
                htmlFor="stu-username"
                className="block text-900 font-medium mb-1"
              >
                Username
              </label>

              <div className="p-inputgroup flex-1 mb-2">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText
                  id="stu-username"
                  value={stuUsername}
                  onChange={(e) => {
                    setStuUsername(e.target.value.toUpperCase());
                  }}
                  placeholder="Username"
                  required
                />
              </div>

              <label
                htmlFor="stu-password"
                className="block text-900 font-medium mb-1"
              >
                Password
              </label>
              <div className="p-inputgroup flex-1 mb-3">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <InputText
                  id="stu-password"
                  type="password"
                  placeholder="Password"
                  value={stuPassword}
                  onChange={(e) => {
                    setStuPassword(e.target.value);
                  }}
                  required
                />
                <span
                  className="p-inputgroup-addon"
                  onClick={() => {
                    const ele = document.getElementById(
                      "stu-password"
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
                label={`${showStuLoading ? `Signing` : "Sign in"}`}
                disabled={showStuLoading}
                type="submit"
                className="w-full"
              >
                {showStuLoading && <i className="pi pi-spin pi-spinner"></i>}
              </Button>
            </form>
          </div>
          <div className="flex align-items-center justify-content-end">
            <Link
              className="font-medium no-underline ml-2 text-blue-500  cursor-pointer mt-2"
              to="/studentfpassword"
            >
              Forgot your password ?
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0">
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default StudentLogin;
