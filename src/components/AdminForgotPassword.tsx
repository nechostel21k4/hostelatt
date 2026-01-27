import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

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
    <div className="min-h-screen surface-ground flex flex-column">
      <Toast ref={FPassToast} />

      {/* Top Header */}
      <div
        className="w-full p-3 flex align-items-center justify-content-center shadow-2"
        style={{ backgroundColor: "#3FA2F6" }}
      >
        <h1 className="text-white m-0 font-bold text-3xl">NEC HOSTEL PORTAL</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex align-items-center justify-content-center p-4">
        <div className="surface-card p-4 shadow-4 border-round w-full md:w-8 lg:w-5 xl:w-4">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">Forgot Password</div>
            <span className="text-600 font-medium line-height-3">Reset your admin access</span>
          </div>

          {/* Step 1: EID Input */}
          {!isAdminExist && !isOTPcorrect && (
            <form onSubmit={handleAdminForgotPassFormSubmit} className="flex flex-column gap-3">
              <div className="flex flex-column gap-2">
                <label htmlFor="eid" className="block text-900 font-medium">Username</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-white border-right-0">
                    <i className="pi pi-user text-gray-600" />
                  </span>
                  <InputText
                    id="eid"
                    value={EID}
                    onChange={(e) => setEID(e.target.value)}
                    placeholder="Enter Username"
                    className="border-left-0 focus:border-left-1"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  label="Back"
                  type="button"
                  outlined
                  className="w-full mt-2 text-blue-500 border-blue-500"
                  onClick={() => Navigate(-1)}
                />
                <Button
                  label="Next"
                  type="submit"
                  className="w-full mt-2"
                  style={{ backgroundColor: "#3FA2F6", borderColor: "#3FA2F6" }}
                  loading={isValidating}
                />
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {isAdminExist && !isOTPcorrect && (
            <form onSubmit={handleOTPSubmit} className="flex flex-column gap-3">
              <div className="text-center mb-3">
                <p className="text-700 m-0">
                  OTP sent to mobile ending with <span className="font-bold">{phoneNo}</span>
                </p>
              </div>

              <div className="flex flex-column gap-2 align-items-center">
                <label htmlFor="otp" className="block text-900 font-medium self-start w-full">Enter OTP</label>
                <InputOtp
                  value={otpToken}
                  onChange={(e) => setOtpTokens(e.value)}
                  length={4}
                  style={{ gap: '0.5rem' }}
                />
              </div>

              <div className="flex justify-content-between align-items-center mt-2">
                <Button
                  label={resendOTPTime > 0 ? `Resend in ${resendOTPTime}s` : "Resend OTP"}
                  link
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendOTPTime > 0}
                  className="p-0 text-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  label="Back"
                  icon="pi pi-arrow-left"
                  outlined
                  type="button"
                  className="w-full mt-2 text-blue-500 border-blue-500"
                  onClick={() => setIsAdminExist(false)}
                />
                <Button
                  label="Verify"
                  type="submit"
                  className="w-full mt-2"
                  style={{ backgroundColor: "#3FA2F6", borderColor: "#3FA2F6" }}
                  loading={isOTPsubmitting}
                />
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {isOTPcorrect && (
            <form onSubmit={handleNewPasswordForm} className="flex flex-column gap-3">
              <div className="flex flex-column gap-2">
                <label htmlFor="newPass" className="block text-900 font-medium">New Password</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-white border-right-0">
                    <i className="pi pi-lock text-gray-600" />
                  </span>
                  <InputText
                    id="newPass"
                    type={passwordVisible ? "text" : "password"}
                    value={incNewPassword}
                    onChange={(e) => setIncNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="border-left-0 border-right-0"
                    required
                  />
                  <span
                    className="p-inputgroup-addon bg-white cursor-pointer border-left-0"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <i className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'} text-gray-600`} />
                  </span>
                </div>
              </div>

              <div className="flex flex-column gap-2">
                <label htmlFor="confirmPass" className="block text-900 font-medium">Confirm Password</label>
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-white border-right-0">
                    <i className="pi pi-lock text-gray-600" />
                  </span>
                  <InputText
                    id="confirmPass"
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={incNewCPassword}
                    onChange={(e) => setIncNewCPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="border-left-0 border-right-0"
                    required
                  />
                  <span
                    className="p-inputgroup-addon bg-white cursor-pointer border-left-0"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    <i className={`pi ${confirmPasswordVisible ? 'pi-eye-slash' : 'pi-eye'} text-gray-600`} />
                  </span>
                </div>
              </div>

              <Button
                label="Reset Password"
                type="submit"
                className="w-full mt-2"
                style={{ backgroundColor: "#3FA2F6", borderColor: "#3FA2F6" }}
                loading={isUpdatingNewPass}
              />
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
