import React, { useContext } from "react";
import InchargeCard from "../student/InchargeCard";
import { Card } from "primereact/card";
import { InchargeContext } from "./InchargeHome";


function InchargeProfile() {

  const incharge = useContext(InchargeContext);

  return (
    <>
      <div className="surface-0">
        <div className="flex align-items-start justify-content-between">
          <div className="font-medium text-3xl text-900 m-3">
            <i className="pi pi-user font-medium text-3xl text-900 special-font"></i>
            &nbsp;&nbsp;My Profile
          </div>
        </div>
        <InchargeCard incharge={incharge} showId={true} />
      </div>
    </>
  );
}

export default InchargeProfile;
