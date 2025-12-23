import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  createLog,
  FetchFacultyData,
  UpdateFacultyData,
} from "../../services/AdminService";
import { Toast } from "primereact/toast";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";

function AdminFaculty() {
  const [facUsername, setFacUsername] = useState<string>("");
  const [facPassword, setFacPassword] = useState<string>("");

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const mytoast = useRef<Toast>(null);

  const admin = useContext(AdminContext);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    UpdateFacultyData(facUsername, facPassword).then((data) => {
      setIsUpdating(false);
      const { success, message } = data;
      if (success) {
        let myLog: LOG = {
          date: new Date(),
          userId: admin.eid,
          username: admin.name as string,
          action: `Updated Faculty Credentials`,
        };
        createLog(myLog);

        if (mytoast.current) {
          mytoast.current.show({
            severity: "success",
            summary: "Updated Successfully !",
            detail: "Faculty data has been Updated",
          });
        }
      } else {
        if (mytoast.current) {
          mytoast.current.show({
            severity: "warn",
            summary: "Update Failed !",
            detail: "Failed to update Faculty data",
          });
        }
      }
    });
  };

  useEffect(() => {
    FetchFacultyData()
      .then((data) => {
        const { faculty } = data;
        setFacUsername(faculty.username);
        setFacPassword(faculty.password);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  }, []);

  return (
    <>
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Toast ref={mytoast} position="center"></Toast>

        <Card
          title={"Faculty Login Credentials"}
          className="flex justify-content-center align-items-center special-font"
        >
          <form onSubmit={handleFormSubmit}>
            <label
              htmlFor="faculty-username"
              className="block text-900 font-medium mb-2"
            >
              Username
            </label>

            <div className="p-inputgroup flex-1 mb-3">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="faculty-username"
                value={facUsername}
                onChange={(e) => {
                  setFacUsername(e.target.value);
                }}
                required
              />
            </div>

            <label
              htmlFor="faculty-password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <div className="p-inputgroup flex-1 mb-3">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <InputText
                id="faculty-password"
                type="password"
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
                    "faculty-password"
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
              label={`${isUpdating ? `Updating` : "Update"}`}
              disabled={isUpdating}
              type="submit"
              className="w-full"
            >
              {isUpdating && <i className="pi pi-spin pi-spinner"></i>}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AdminFaculty;
