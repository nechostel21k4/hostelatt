import React from "react";
import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";
import { Chip } from "primereact/chip";
import { formatDateWithTime, formatDate, formatTime } from "../interfaces/Date";

interface ReqCardProps {
  request: any;
}

function ReqCard({ request }: ReqCardProps) {
  if (!request) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-500 text-white-alpha-90";
      case "REJECTED": return "bg-red-500 text-white-alpha-90";
      case "ARRIVED": return "bg-blue-500 text-white-alpha-90";
      case "SUBMITTED": return "bg-yellow-500 text-white-alpha-90";
      case "CANCELLED01":
      case "CANCELLED02": return "bg-orange-500 text-white-alpha-90";
      default: return "bg-gray-500 text-white-alpha-90";
    }
  };

  const events = [];

  if (request.submitted) {
    events.push({
      status: "Submitted",
      date: formatDateWithTime(new Date(request.submitted.time)),
      by: request.submitted.name,
      icon: "pi pi-send",
      color: "#6366f1",
    });
  }
  if (request.accepted) {
    events.push({
      status: "Accepted",
      date: formatDateWithTime(new Date(request.accepted.time)),
      by: request.accepted.name,
      icon: "pi pi-check",
      color: "#22c55e",
    });
  }
  if (request.rejected) {
    events.push({
      status: "Rejected",
      date: formatDateWithTime(new Date(request.rejected.time)),
      by: request.rejected.name,
      icon: "pi pi-times",
      color: "#ef4444",
    });
  }
  if (request.cancelled01) {
    events.push({
      status: "Cancelled (Student)",
      date: formatDateWithTime(new Date(request.cancelled01.time)),
      by: request.cancelled01.name,
      icon: "pi pi-ban",
      color: "#f97316",
    });
  }
  if (request.cancelled02) {
    events.push({
      status: "Cancelled (Staff)",
      date: formatDateWithTime(new Date(request.cancelled02.time)),
      by: request.cancelled02.name,
      icon: "pi pi-ban",
      color: "#f97316",
    });
  }
  if (request.arrived) {
    events.push({
      status: "Arrived",
      date: formatDateWithTime(new Date(request.arrived.time)),
      by: request.arrived.name,
      icon: "pi pi-sign-in",
      color: "#3b82f6",
    });
  }

  const customizedMarker = (item: any) => (
    <span
      className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1"
      style={{ backgroundColor: item.color }}
    >
      <i className={`${item.icon} text-white text-sm`}></i>
    </span>
  );

  const customizedContent = (item: any) => (
    <Card className="mb-2">
      <p className="font-semibold m-0">{item.status}</p>
      <small className="text-500">{item.date}</small>
      <p className="m-0 text-600">By: {item.by}</p>
    </Card>
  );

  return (
    <div>
      <Card className="special-font mb-3">
        <div className="flex justify-content-between align-items-center mb-3">
          <span className="font-bold text-lg">{request.type}</span>
          <Chip className={getStatusClass(request.status)} label={request.status} />
        </div>
        <ul className="list-none p-0 m-0">
          <li className="grid py-2 px-2 border-top-1 border-300">
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Name</div>
              <div className="text-900 w-6">{request.name}</div>
            </div>
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Roll No</div>
              <div className="text-900 w-6">{request.rollNo}</div>
            </div>
          </li>
          <li className="grid py-2 px-2 border-top-1 border-300">
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Hostel ID</div>
              <div className="text-900 w-6">{request.hostelId}</div>
            </div>
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Reason</div>
              <div className="text-900 w-6">{request.reason}</div>
            </div>
          </li>
          {request.type === "LEAVE" && (
            <li className="grid py-2 px-2 border-top-1 border-300">
              <div className="flex w-12 md:w-6 align-items-center">
                <div className="text-500 font-medium w-6">From Date</div>
                <div className="text-900 w-6">
                  {request.fromDate ? formatDateWithTime(new Date(request.fromDate)) : "—"}
                </div>
              </div>
              <div className="flex w-12 md:w-6 align-items-center">
                <div className="text-500 font-medium w-6">To Date</div>
                <div className="text-900 w-6">
                  {request.toDate ? formatDateWithTime(new Date(request.toDate)) : "—"}
                </div>
              </div>
            </li>
          )}
          {request.type === "PERMISSION" && (
            <li className="grid py-2 px-2 border-top-1 border-300">
              <div className="flex w-12 md:w-6 align-items-center">
                <div className="text-500 font-medium w-6">Date</div>
                <div className="text-900 w-6">
                  {request.date ? formatDate(new Date(request.date)) : "—"}
                </div>
              </div>
              <div className="flex w-12 md:w-6 align-items-center">
                <div className="text-500 font-medium w-6">Time</div>
                <div className="text-900 w-6">
                  {request.fromTime ? formatTime(new Date(request.fromTime)) : "—"}
                  {" - "}
                  {request.toTime ? formatTime(new Date(request.toTime)) : "—"}
                </div>
              </div>
            </li>
          )}
          <li className="grid py-2 px-2 border-top-1 border-300">
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Phone No</div>
              <div className="text-900 w-6">
                <a href={`tel:${request.phoneNo}`} className="no-underline text-900 hover:underline">
                  {request.phoneNo}
                </a>
              </div>
            </div>
            <div className="flex w-12 md:w-6 align-items-center">
              <div className="text-500 font-medium w-6">Parent Phone</div>
              <div className="text-900 w-6">
                <a href={`tel:${request.parentPhoneNo}`} className="no-underline text-900 hover:underline">
                  {request.parentPhoneNo}
                </a>
              </div>
            </div>
          </li>
        </ul>
      </Card>

      <Card title="Timeline" className="special-font">
        <Timeline
          value={events}
          align="alternate"
          className="customized-timeline"
          marker={customizedMarker}
          content={customizedContent}
        />
      </Card>
    </div>
  );
}

export default ReqCard;
