import { useContext, useEffect, useRef } from "react";
import ReqCard from "./ReqCard";
import { Card } from "primereact/card";
import { StudentContext } from "./StudentHome";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const { student } = useContext(StudentContext);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.current?.show({
        severity: "success",
        summary: "Login Successful !",
        detail: "Welcome, User",
        life: 3000,
      });
      // Clear state so toast doesn't show on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Toast ref={toast} position="top-right" />
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
