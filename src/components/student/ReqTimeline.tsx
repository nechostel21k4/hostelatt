import { Card } from "primereact/card";
import React, { useEffect, useRef, useState } from "react";
import { formatDateWithTime } from "../interfaces/Date";

function ReqTimeline(props: any) {
  const { submitted, accORrejORcancel, arrivedORcancel } = props;

  const [submit, setSubmit] = useState<any>(null);
  const [accRejCancel, setAccRejCancel] = useState<any>(null);
  const [arriveCancel, setArriveCancel] = useState<any>(null);

  useEffect(() => {
    if (submitted) {
      setSubmit({
        status: "Submitted",
        time: formatDateWithTime(new Date(submitted?.time)),
        name:submitted?.name
      });
    } else {
      setSubmit(null);
    }

    if (accORrejORcancel) {
      if (accORrejORcancel?.acc !== null && accORrejORcancel?.rej === null && accORrejORcancel?.cancel === null ) {
        setAccRejCancel({
          status: "Accepted",
          name: accORrejORcancel?.acc?.name,
          time: formatDateWithTime(new Date(accORrejORcancel?.acc?.time)),
        });
      } else if (accORrejORcancel?.acc === null && accORrejORcancel?.rej !== null && accORrejORcancel?.cancel === null) {
        setAccRejCancel({
          status: "Rejected",
          name: accORrejORcancel?.rej?.name,
          time: formatDateWithTime(new Date(accORrejORcancel?.rej?.time)),
        });
      }else if(accORrejORcancel?.acc === null && accORrejORcancel?.rej === null && accORrejORcancel?.cancel !== null){
        setAccRejCancel({
          status: "Cancelled",
          name: accORrejORcancel?.cancel?.name,
          time: formatDateWithTime(new Date(accORrejORcancel?.cancel?.time)),
        });
      }
    } else {
      setAccRejCancel(null);
    }

    if (arrivedORcancel) {
      if(arrivedORcancel?.arr !== null && arrivedORcancel?.cancel === null){
        setArriveCancel({
          status: "Arrived",
          time: formatDateWithTime(new Date(arrivedORcancel?.arr?.time)),
          name: arrivedORcancel?.arr?.name,
        });
      }else if(arrivedORcancel?.arr === null && arrivedORcancel?.cancel !== null){
        setArriveCancel({
          status: "Cancelled",
          time: formatDateWithTime(new Date(arrivedORcancel?.cancel?.time)),
          name: arrivedORcancel?.cancel?.name,
        });
      }
      
    } else {
      setArriveCancel(null);
    }

    drawTimeline();
  }, [submitted, accORrejORcancel, arrivedORcancel]);

  const mycanvas = useRef(null);

  const drawTimeline = () => {
    if (mycanvas.current) {
      const canvas = mycanvas.current as HTMLCanvasElement;
      canvas.height = 200;
      canvas.width = 270;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.lineWidth = 2;
        ctx.font = "16px serif ";

        //submitted state
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(100, 40, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        // accepted or rejected state
        if (accRejCancel !== null) {
          if (accRejCancel?.status === "Accepted") {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
          } else if (accRejCancel?.status === "Rejected") {
            ctx.strokeStyle = "tomato";
            ctx.fillStyle = "red";
          }else if(accRejCancel?.status === "Cancelled"){
            ctx.strokeStyle = "orange";
            ctx.fillStyle = "orange";
          }
        } else {
          ctx.strokeStyle = "silver";
          ctx.fillStyle = "white";
        }
        ctx.beginPath();
        ctx.moveTo(100, 47);
        ctx.lineTo(100, 97);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(100, 104, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        //arrived state
        if (arriveCancel !== null) {
          if (arriveCancel?.status === "Arrived") {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
          }else if (arriveCancel?.status === "Cancelled") {
            ctx.strokeStyle = "orange";
            ctx.fillStyle = "orange";
          }
        } else {
          ctx.strokeStyle = "silver";
          ctx.fillStyle = "white";
        }

        ctx.beginPath();
        ctx.moveTo(100, 111);
        ctx.lineTo(100, 161);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(100, 168, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        //submitted state
        if (submit) {
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(submit?.status, 85, 43);
          ctx.direction = "ltr";
          ctx.fillText(submit?.time, 115, 43);
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(submit?.status, 85, 43);
          ctx.direction = "ltr";
          ctx.fillText(submit?.time, 115, 43);
        }

        //accepted or rejected state
        if (accRejCancel) {
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(accRejCancel?.status, 85, 107);
          ctx.direction = "ltr";
          ctx.fillText(accRejCancel?.time, 115, 97);
          ctx.fillText(accRejCancel?.name, 115, 117);
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(accRejCancel?.status, 85, 107);
          ctx.direction = "ltr";
          ctx.fillText(accRejCancel?.time, 115, 97);
          ctx.fillText(accRejCancel?.name, 115, 117);
        }

        // arrived state
        if (arriveCancel) {
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(arriveCancel?.status, 85, 171);
          ctx.direction = "ltr";
          ctx.fillText(arriveCancel?.time, 115, 161);
          ctx.fillText(arriveCancel?.name, 115, 181);
          ctx.fillStyle = "black";
          ctx.direction = "rtl";
          ctx.fillText(arriveCancel?.status, 85, 171);
          ctx.direction = "ltr";
          ctx.fillText(arriveCancel?.time, 115, 161);
          ctx.fillText(arriveCancel?.name, 115, 181);
        }
      }
    }
  };

  return <canvas id="mycanvas" ref={mycanvas} className=""></canvas>;
}

export default ReqTimeline;