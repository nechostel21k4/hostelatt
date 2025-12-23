import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Incharge } from "../interfaces/Incharge";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import InchargeCard from "../student/InchargeCard";
import {
  createLog,
  deleteIncharge,
  updateIncharge,
} from "../../services/AdminService";
import { LOG } from "../interfaces/Log";
import { AdminContext } from "./AdminHome";

function AdminViewIncharge(props: any) {
  const [incharge, setIncharge] = useState<Incharge>(
    props.incharge as Incharge
  );
  const [inchargeOldData, setInchargeOldData] = useState<Incharge>(
    props.incharge as Incharge
  );

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [enableEdit, setEnableEdit] = useState<boolean>(false);

  const admin = useContext(AdminContext);

  const mytoast = useRef<Toast>(null);

  const { closeDialog, updateIncharges } = props;

  const ValidateForm = useCallback(() => {
    setIsFormValid(false);
    if (
      incharge?.hostelId !== "label" &&
      incharge?.name !== "" &&
      /^[0-9]{10}$/.test(incharge?.phoneNo as string) &&
      incharge?.eid !== "" &&
      incharge?.designation !== ""
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [incharge]);

  useEffect(() => {
    ValidateForm();
  }, [incharge, ValidateForm]);

  const handleInchargeUpdate = () => {
    const accept = () => {
      setIsUpdating(true);
      if (incharge) {
        updateIncharge(incharge)
          .then((data) => {
            setIsUpdating(false);
            if (data.updated) {
              let myLog: LOG = {
                date: new Date(),
                userId: admin.eid,
                username: admin.name as string,
                action: `Updated Incharge ${incharge.eid}`,
              };
              createLog(myLog);
              setInchargeOldData(incharge);
              updateIncharges(incharge);
              setEnableEdit(false);
              if (mytoast.current) {
                mytoast.current.show({
                  severity: "success",
                  summary: "Updated Successfully !",
                  detail: "Incharge data has been updated",
                });
              }
            } else {
              if (mytoast.current) {
                mytoast.current.show({
                  severity: "error",
                  summary: "Update Failed !",
                  detail: "Failed to update incharge data.Try Again",
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

  const handleInchargeDelete = () => {
    const accept = () => {
      setIsDeleting(true);
      let deleteEID = incharge.eid;
      deleteIncharge(incharge.eid).then((data) => {
        setIsDeleting(false);
        if (data.deleted) {
          let myLog: LOG = {
            date: new Date(),
            userId: admin.eid,
            username: admin.name as string,
            action: `Deleted Incharge ${incharge.eid}`,
          };
          createLog(myLog);
          closeDialog(deleteEID);
        } else {
          if (mytoast.current) {
            mytoast.current.show({
              severity: "warn",
              summary: "Delete Failed !",
              detail: "Failed to delete Incharge.Try Again",
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
      <div>
        <div className="flex align-items-center justify-content-end">
          <Button
            className="m-2"
            icon={enableEdit ? "pi pi-times" : "pi pi-pen-to-square"}
            severity={enableEdit ? "warning" : "info"}
            label={enableEdit ? "Cancel" : "Edit"}
            onClick={() => {
              if (!enableEdit) {
                setIncharge(inchargeOldData);
              }
              setEnableEdit((prevValue) => !prevValue);
            }}
          ></Button>
        </div>
        {/* } */}
        {enableEdit ? (
          <form action="" className="grid mt-6">
            <div className="col-12 md:col-6 lg:col-4  mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-inc-eid"
                  type="text"
                  className="w-12 "
                  value={incharge?.eid}
                  required
                  disabled
                />
                <label htmlFor="ad-vw-inc-eid">EID</label>
              </FloatLabel>
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <div className="custom-select-container w-12">
                <select
                  className="custom-select"
                  value={incharge?.hostelId}
                  id="ad-view-inc-hostelId"
                  onChange={(e) => {
                    setIncharge({
                      ...incharge,
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

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-inc-name"
                  type="text"
                  className="w-12 "
                  value={incharge?.name}
                  onChange={(e) => {
                    setIncharge({
                      ...incharge,
                      name: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="ad-vw-inc-name">Name</label>
              </FloatLabel>
            </div>
            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-inc-phoneno"
                  type="text"
                  className="w-12 "
                  value={incharge?.phoneNo}
                  onChange={(e) => {
                    setIncharge({
                      ...incharge,
                      phoneNo: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="ad-vw-inc-phoneno">Phone Number</label>
              </FloatLabel>
              {!/^[0-9]{10}$/.test(incharge?.phoneNo as string) &&
                incharge?.phoneNo !== "" && (
                  <small id="phoneno-help" className="text-red-500">
                    Phone number must be 10 digits
                  </small>
                )}
            </div>

            <div className="col-12 md:col-6 lg:col-4 mt-3">
              <FloatLabel>
                <InputText
                  id="ad-vw-inc-designation"
                  type="text"
                  className="w-12"
                  value={incharge?.designation}
                  onChange={(e) => {
                    setIncharge({
                      ...incharge,
                      designation: e.target.value,
                    } as Incharge);
                  }}
                  required
                />
                <label htmlFor="ad-vw-inc-designation">Designation</label>
              </FloatLabel>
            </div>

            <div className="col-12 mt-3 flex justify-content-around">
              <Button
                type="button"
                onClick={handleInchargeUpdate}
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
                onClick={handleInchargeDelete}
              >
                {isDeleting && <i className="pi pi-spin pi-spinner"></i>}
                &nbsp;&nbsp;
                {isDeleting ? "Deleting" : "Delete"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="">
            <InchargeCard incharge={inchargeOldData} showId={true} />
          </div>
        )}
      </div>
    </>
  );
}

export default AdminViewIncharge;
