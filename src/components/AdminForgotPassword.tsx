import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UpdateADMINNewPassword,
  VerifyADMINFPassMail,
  VerifyADMINOTP,
} from "../services/LoginService";
import { createLog } from "../services/AdminService";
import { LOG } from "./interfaces/Log";

function AdminForgotPassword() {
  const FPassToast = useRef<Toast>(null);
  const Navigate = useNavigate();

  const [EID, setEID] = useState<string>("");
  const [isEIDValid, setIsEIDValid] = useState<boolean>(false);

  const [isAdminExist, setIsAdminExist] = useState<boolean | null>(null);
  const [isValidating, setisValidating] = useState<boolean>(false);

  const [otpToken, setOtpTokens] = useState<any>();

  const [disableResendOTP, setDisableResendOTP] = useState<boolean>(false);

  const [isOTPvalid, setIsOTPvalid] = useState<boolean>(false);
  const [isOTPcorrect, setIsOTPcorrect] = useState<boolean>(false);
  const [isOTPsubmitting, setIsOTPsubmitting] = useState<boolean>(false);

  const [incNewPassword, setIncNewPassword] = useState<string>("");
  const [incNewCPassword, setIncNewCPassword] = useState<string>("");
  const [isPasswordsSame, setIsPasswordsSame] = useState<boolean>(true);
  const [isUpdatingNewPass, setIsUpdatingNewPass] = useState<boolean>(false);

  const [phoneNo, setPhoneNo] = useState<string>("");

  const [resendOTPTime, setResendOTPTime] = useState<number>(0);

  useEffect(() => {
    if (resendOTPTime > 0) {
      setDisableResendOTP(true);
      const interval = setInterval(() => {
        setResendOTPTime((prevValue) => prevValue - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDisableResendOTP(false);
    }
  }, [resendOTPTime]);

  useEffect(() => {
    if (otpToken) {
      if (otpToken.toString().length === 4) {
        setIsOTPvalid(true);
      } else {
        setIsOTPvalid(false);
      }
    }
  }, [otpToken]);

  useEffect(() => {
    setIsPasswordsSame(false);
    if (incNewPassword === incNewCPassword) {
      setIsPasswordsSame(true);
    }
  }, [incNewPassword, incNewCPassword]);

  const handleAdminForgotPassFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setisValidating(true);
    setIsAdminExist(null);

    VerifyADMINFPassMail(EID).then((data) => {
      setisValidating(false);
      const { isExist, phoneNo } = data;
      const maskedPhoneNo = phoneNo
        ? phoneNo.slice(0, 2) + "*****" + phoneNo.slice(7, 10)
        : "";
      setPhoneNo(maskedPhoneNo);

      if (isExist) {
        setIsAdminExist(true);
        if (FPassToast.current) {
          FPassToast.current.show({
            severity: "success",
            summary: "OTP Send Successfully !",
            detail: "OTP has been send to your registered phone number",
          });
        }
        setResendOTPTime(90);
      } else {
        setIsAdminExist(false);
        if (FPassToast.current) {
          FPassToast.current.show({
            severity: "warn",
            summary: "Invalid Incharge",
            detail: `Incharge with EID ${EID} doesn't exist`,
          });
        }
      }
    });
  };

  const handleOTPSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOTPcorrect(false);
    setIsOTPsubmitting(true);

    VerifyADMINOTP(EID, otpToken.toString())
      .then((data) => {
        const { isOTPValid } = data;

        setIsOTPsubmitting(false);
        if (isOTPValid) {
          setIsOTPcorrect(true);
          if (FPassToast.current) {
            FPassToast.current.show({
              severity: "success",
              summary: "Valid OTP",
              detail: "Set your new password !",
            });
          }
        } else {
          setIsOTPcorrect(false);
          if (FPassToast.current) {
            FPassToast.current.show({
              severity: "error",
              summary: "Invalid OTP",
              detail: "Try Again",
            });
          }
        }
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  };

  const handleResendOTP = () => {
    setDisableResendOTP(true);

    VerifyADMINFPassMail(EID)
      .then((data) => {
        if (FPassToast.current) {
          FPassToast.current.show({
            severity: "success",
            summary: "OTP Resend Successfully !",
            detail: "You can resend OTP again after 01:30 minutes",
          });
        }
        setResendOTPTime(90);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNewPasswordForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingNewPass(true);

    UpdateADMINNewPassword(EID, incNewPassword)
      .then((data) => {
        setIsUpdatingNewPass(false);
        const { isUpdated } = data;
        if (isUpdated) {
          let myLog: LOG = {
            date: new Date(),
            userId: EID,
            username: EID,
            action: `New Password Updated`,
          };
          createLog(myLog);

          if (FPassToast.current) {
            FPassToast.current.show({
              severity: "success",
              summary: "Password Reset Successfully !",
              detail: "Your password has been updated successfully !",
            });
            setTimeout(() => {
              Navigate("/admins", { replace: true });
            }, 2000);
          }
        } else {
          if (FPassToast.current) {
            FPassToast.current.show({
              severity: "warn",
              summary: "Something went wrong !",
              detail: "Failed to update new password.Try again after sometime",
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
      <Toast ref={FPassToast} position="top-center" />
      <Dialog
        header="Admin Forgot Password"
        visible={true}
        style={{ width: "50vw" }}
        onHide={() => {
          Navigate("/admins", { replace: true });
        }}
        className="w-11 lg:w-5 special-font"
      >
        <Card className="mt-1 w-full">
          <form onSubmit={handleAdminForgotPassFormSubmit}>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <InputText
                placeholder="EID"
                id="inc-fpass-eid"
                value={EID}
                onChange={(e) => {
                  setIsEIDValid(false);
                  let eid = e.target.value;
                  setEID(eid);
                  if (/^[0-9]{7}$/.test(eid)) {
                    setIsEIDValid(true);
                  } else {
                    setIsEIDValid(false);
                  }
                }}
                className="text-center font-bold"
                disabled={isAdminExist ? true : false}
              />
              {isAdminExist == null ? (
                <Button
                  className={`${isAdminExist}`}
                  disabled={!isEIDValid || isValidating}
                  type="submit"
                >
                  {isValidating && <i className="pi pi-spin pi-spinner"></i>}
                  &nbsp;&nbsp;{`${isValidating ? "Validating" : "Validate"}`}
                </Button>
              ) : (
                <Button
                  severity={isAdminExist ? "success" : "danger"}
                  type="submit"
                  disabled={isAdminExist}
                >
                  {isAdminExist ? (
                    <i className="pi pi-verified"></i>
                  ) : (
                    <i className="pi pi-ban"></i>
                  )}
                  &nbsp;&nbsp;{isAdminExist ? `Valid ` : `Invalid`}
                </Button>
              )}
            </div>
          </form>

          {isAdminExist && !isOTPcorrect && (
            <div className="mt-4">
              <form onSubmit={handleOTPSubmit}>
                <div className="card flex justify-content-center">
                  <div className="flex flex-column align-items-center w-full">
                    <p className="text-color-secondary block mb-5">
                      Please enter the code sent to your registered phone no{" "}
                      {phoneNo}
                    </p>
                    <div className="card flex justify-content-center">
                      <InputOtp
                        value={otpToken}
                        onChange={(e) => setOtpTokens(e.value)}
                        required
                        integerOnly
                        length={4}
                      />
                    </div>
                    <div className="flex justify-content-between mt-5 align-self-stretch">
                      <Button
                        type="button"
                        label="Resend Code"
                        disabled={disableResendOTP}
                        link
                        className="p-0"
                        onClick={handleResendOTP}
                      >
                        &nbsp;&nbsp;
                        {resendOTPTime > 0 &&
                          `0${Math.floor(resendOTPTime / 60)} : ${(
                            resendOTPTime % 60
                          )
                            .toString()
                            .padStart(2, "0")} sec`}
                      </Button>
                      <Button
                        type="submit"
                        disabled={!isOTPvalid || isOTPsubmitting}
                      >
                        {isOTPsubmitting && (
                          <i className="pi pi-spin pi-spinner"></i>
                        )}
                        &nbsp;&nbsp;
                        {isOTPsubmitting ? "Submitting" : "Submit Code"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {isAdminExist && isOTPcorrect && (
            <div className="mt-4">
              <form onSubmit={handleNewPasswordForm}>
                <label
                  htmlFor="fpass-inc-new-password"
                  className="block text-900 font-medium mb-1"
                >
                  New Password
                </label>
                <div className="p-inputgroup flex-1 mb-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                  </span>
                  <InputText
                    id="fpass-inc-new-password"
                    name="fpass-inc-new-password"
                    type="password"
                    placeholder="Password"
                    value={incNewPassword}
                    onChange={(e) => {
                      setIncNewPassword(e.target.value);
                    }}
                    required
                  />
                  <span
                    className="p-inputgroup-addon"
                    onClick={() => {
                      const ele = document.getElementById(
                        "fpass-inc-new-password"
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

                <label
                  htmlFor="fpass-inc-new-cpassword"
                  className="block text-900 font-medium mb-1"
                >
                  Confirm New Password
                </label>
                <div className="p-inputgroup flex-1 mb-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                  </span>
                  <InputText
                    id="fpass-inc-new-cpassword"
                    name="fpass-inc-new-cpassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={incNewCPassword}
                    onChange={(e) => {
                      setIncNewCPassword(e.target.value);
                    }}
                    required
                  />
                  <span
                    className="p-inputgroup-addon"
                    onClick={() => {
                      const ele = document.getElementById(
                        "fpass-inc-new-cpassword"
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
                {!isPasswordsSame && (
                  <p className="text-center text-red-400">
                    Passwords are not same
                  </p>
                )}
                <Button
                  type="submit"
                  label={`${isUpdatingNewPass ? "Updating" : "Update"}`}
                  disabled={
                    (isPasswordsSame && incNewPassword ? false : true) ||
                    (isUpdatingNewPass ? true : false)
                  }
                  className="w-full text-center"
                >
                  {isUpdatingNewPass && (
                    <i className="pi pi-spin pi-spinner"></i>
                  )}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </Dialog>
    </>
  );
}

export default AdminForgotPassword;
