import { Card } from "primereact/card";
import  { useEffect, useState } from "react";
import InchargeCard from "../student/InchargeCard";
import { Admin } from "../interfaces/Admin";
import { getAllAdmins } from "../../services/AdminService";

function AdminList() {

  const [admins,setAdmins] = useState<Admin[]>([]);

  useEffect(()=>{
      getAllAdmins().then((data)=>{
        setAdmins(data);
      }).catch((err)=>{
        console.log("something wrong",err)
      })
  },[])
  
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
        <Card title="Admin List" className="pt-2 pb-2 special-font">
          <div className="grid">
            
            {admins && admins.map((admin)=>{return (
            <div key={admin.eid} className="col-12">
            <InchargeCard  incharge={admin} showId={false}/>
            </div>
            )
            
            })}
            </div>
        </Card>
      </div>
    </>
  );
}

export default AdminList;
