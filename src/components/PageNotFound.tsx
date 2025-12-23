import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { transform } from "typescript";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "aliceblue",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          className="flex flex-column align-items-center"
        >
          <img
            src="/images/aa.gif"
            height={"300px"}
            width={"300px"}
            alt="404 logo"
            style={{ boxShadow: "20px 20px 20px #ddd" }}
          ></img>
          <h1 style={{ fontFamily: "sans-serif" }}>OOPS! <i>Page not found</i></h1>

          <Button text raised onClick={() => { navigate(-1) }}><i className="pi pi-angle-double-left"></i> &nbsp;Go Back</Button>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
