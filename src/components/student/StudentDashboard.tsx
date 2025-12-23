import { useContext } from "react";
import ReqCard from "./ReqCard";
import { Card } from "primereact/card";
import { StudentContext } from "./StudentHome";

function StudentDashboard() {
  const { student } = useContext(StudentContext);

  return (
    <>
      <div
        className="w-12"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        {/* <p className="special-font text-center"><i className="pi pi-refresh"></i> Please refresh to get updates</p> */}
        <Card title="Last Request" className="special-font">
          {student?.lastRequest ? (
            <ReqCard request={student?.lastRequest} showCancel={true} />
            
          ) : (
            "No Data Found"
          )}
        </Card>
        
      </div>
     
    </>
  );
}

export default StudentDashboard;
