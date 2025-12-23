import { Card } from "primereact/card";
import React, { useContext, useEffect, useState } from "react";
import InchargeCard from "../student/InchargeCard";
import { Incharge } from "../interfaces/Incharge";
import { getAllIncharges } from "../../services/StudentService";
import { InchargeContext } from "./InchargeHome";

function InchargeList() {

  const incharge = useContext(InchargeContext);

  const [incharges,setIncharges] = useState<Incharge[]>([]);

  useEffect(()=>{
    if(incharge){
      getAllIncharges(incharge?.hostelId).then((data)=>{
        setIncharges(data.incharges);
      }).catch((err)=>{
        console.log("something wrong",err)
      })
    }
  },[incharge])
  
  return (
    <>
      <div
        className="p-2 w-12"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <Card title="Hostel Incharges" className="pt-2 pb-2 special-font">
          <div className="grid">
            
            {incharges.map((incharge)=>{return (
            <div key={incharge.eid} className="col-12">
            <InchargeCard  incharge={incharge} showId={false}/>
            </div>
            )
            
            })}
            </div>
        </Card>
      </div>
    </>
  );
}

export default InchargeList;
