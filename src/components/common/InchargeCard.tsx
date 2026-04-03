import React from "react";
import { Card } from "primereact/card";

interface InchargeCardProps {
  incharge: any;
  showId?: boolean;
}

function InchargeCard({ incharge, showId = true }: InchargeCardProps) {
  if (!incharge) return null;

  return (
    <Card className="special-font">
      <ul className="list-none p-0 m-0" style={{ wordWrap: "break-word" }}>
        {showId && (
          <li className="grid py-3 px-2 border-top-1 border-300">
            <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">EID</div>
              <div className="text-900 w-6">{incharge?.eid}</div>
            </div>
          </li>
        )}
        <li className="grid py-3 px-2 border-top-1 border-300">
          <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center">
            <div className="text-500 font-medium w-6">Name</div>
            <div className="text-900 w-6">{incharge?.name}</div>
          </div>
          <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center">
            <div className="text-500 font-medium w-6">Designation</div>
            <div className="text-900 w-6">{incharge?.designation}</div>
          </div>
        </li>
        <li className="grid py-3 px-2 border-top-1 border-300">
          <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center">
            <div className="text-500 font-medium w-6">Phone No</div>
            <div className="text-900 w-6">
              <a
                href={`tel:${incharge?.phoneNo}`}
                className="no-underline text-900 hover:underline"
              >
                {incharge?.phoneNo}
              </a>
            </div>
          </div>
          {incharge?.hostelId && (
            <div className="flex mt-1 mb-1 w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Hostel ID</div>
              <div className="text-900 w-6">{incharge?.hostelId}</div>
            </div>
          )}
        </li>
      </ul>
    </Card>
  );
}

export default InchargeCard;
