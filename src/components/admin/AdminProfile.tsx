import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AdminContext } from "./AdminHome";
import InchargeCard from "../student/InchargeCard";
import { Button } from "primereact/button";
import { Admin } from "../interfaces/Admin";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import {
  createLog,
  deleteAdmin,
  getAdmin,
  updateAdmin,
} from "../../services/AdminService";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { LOG } from "../interfaces/Log";
import { useAdminAuth } from "../../utils/AdminAuth";
import { jwtDecode } from "jwt-decode";
import { CustomAdminJwtPayload } from "../Login";

function AdminProfile() {
  const [adminOldData, setAdminOldData] = useState<Admin | null>(
    useContext(AdminContext)
  );
  const [admin, setAdmin] = useState<Admin | null>(useContext(AdminContext));

  const { adminLogout } = useAdminAuth();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const mytoast = useRef<Toast>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const decoded = jwtDecode<CustomAdminJwtPayload>(adminToken as string);

    getAdmin(decoded?.eid as string)
      .then((data) => {
        setAdminOldData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setAdmin(adminOldData as Admin);
  }, [adminOldData]);

  const ValidateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      admin?.name !== "" &&
      /^[0-9]{10}$/.test(admin?.phoneNo as string) &&
      admin?.eid !== "" &&
      admin?.designation !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [admin]);

  useEffect(() => {
    ValidateForm();
  }, [admin, ValidateForm]);

  const handleAdminUpdate = () => {
    const accept = () => {
      setIsUpdating(true);
      if (admin) {
        updateAdmin(admin)
          .then((data) => {
            setIsUpdating(false);
            const { updated } = data;

            if (updated) {
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Updated Admin ${admin.eid}`,
              };
              createLog(myLog);
              setAdminOldData(admin);
              setEnableEdit(false);
              if (mytoast.current) {
                mytoast.current.show({
                  severity: "success",
                  summary: "Updated Successfully !",
                  detail: "Admin data has been updated",
                });
              }
            } else {
              if (mytoast.current) {
                mytoast.current.show({
                  severity: "warn",
                  summary: "Update Failed !",
                  detail: "Failed to update Admin data.Try Again",
                });
              }
            }
          })
          .catch((err) => {
            console.log("something went wrong", err);
          });
      }
    };
    const reject = () => {};

    confirmDialog({
      message: "Do you want to Update this record?",
      header: "Update Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      accept,
      reject,
    });
  };

  const handleAdminDelete = () => {
    const accept = () => {
      setIsDeleting(true);
      deleteAdmin(admin?.eid as string).then((data) => {
        setIsDeleting(false);
        if (data?.deleted) {
          let myLog: LOG = {
            date: new Date(),
            userId: admin?.eid as string,
            username: admin?.name as string,
            action: `Deleted Admin ${admin?.eid}`,
          };
          createLog(myLog).then(() => {
            if (mytoast.current) {
              mytoast.current.show({
                severity: "warn",
                summary: "Deleted Successfully !",
                detail: `${admin?.eid} has been deleted successfully`,
              });
            }
            setTimeout(() => {
              adminLogout();
            }, 2000);
          });
        } else {
          if (mytoast.current) {
            mytoast.current.show({
              severity: "warn",
              summary: "Delete Failed !",
              detail: "Failed to delete Admin.Try Again",
            });
          }
        }
      });
    };
    const reject = () => {};

    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  return (
    <>
      <Toast ref={mytoast} position="center"></Toast>
      <div className="surface-0">
        <div className="flex align-items-start justify-content-between">
          <div className="font-medium text-3xl text-900 m-3">
            <i className="pi pi-id-card font-medium text-3xl text-900 special-font"></i>
            &nbsp;&nbsp;<p className="special-font inline">My Profile</p>
          </div>

          <Button
            className="m-3"
            icon={enableEdit ? "pi pi-times" : "pi pi-pen-to-square"}
            severity={enableEdit ? "warning" : "info"}
            label={enableEdit ? "Cancel" : "Edit"}
            onClick={() => {
              setAdmin(adminOldData);
              setEnableEdit((prevValue) => !prevValue);
            }}
          ></Button>
        </div>
        {enableEdit ? (
          <form action="" className="grid mt-6 p-2">
            <div className="col-12 md:col-6 lg:col-4  mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-adm-eid"
                  type="text"
                  className="w-12 "
                  value={admin?.eid}
                  required
                  disabled
                />
                <label htmlFor="ad-vw-adm-eid">EID</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-adm-name"
                  type="text"
                  className="w-12 "
                  value={admin?.name}
                  onChange={(e) => {
                    setAdmin({
                      ...admin,
                      name: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="ad-vw-adm-name">Name</label>
              </FloatLabel>
            </div>
            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-adm-phoneno"
                  type="text"
                  className="w-12 "
                  value={admin?.phoneNo}
                  onChange={(e) => {
                    setAdmin({
                      ...admin,
                      phoneNo: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="ad-vw-adm-phoneno">Phone Number</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(admin?.phoneNo as string) &&
                admin?.phoneNo !== "" && (
                  <small id="phoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-adm-designation"
                  type="text"
                  className="w-12"
                  value={admin?.designation}
                  onChange={(e) => {
                    setAdmin({
                      ...admin,
                      designation: e.target.value,
                    } as Admin);
                  }}
                  required
                />
                <label htmlFor="ad-vw-inc-designation">Designation</label>
              </FloatLabel>
            </div>

            <div className="col-12 mt-3 flex justify-content-around">
              <Button
                type="button"
                onClick={handleAdminUpdate}
                disabled={!isFormValid || isUpdating}
                severity="success"
                icon={!isUpdating && "pi pi-save"}
              >
                {isUpdating && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isUpdating ? "Updating" : "Update"}
              </Button>

              <Button
                type="button"
                severity="danger"
                icon={!isDeleting && "pi pi-trash"}
                onClick={handleAdminDelete}
              >
                {isDeleting && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isDeleting ? "Deleting" : "Delete"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="">
            <InchargeCard incharge={adminOldData} showId={true} />
          </div>
        )}
      </div>
    </>
  );
}

export default AdminProfile;
