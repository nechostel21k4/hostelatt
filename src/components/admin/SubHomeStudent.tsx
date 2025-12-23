import { NavLink, Outlet } from "react-router-dom";

function SubHomeStudent() {
  return (
    <>
      <div
        className="w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <ul className="p-card list-none grid  m-0 p-0">
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 bg-primary" style={{border:"1px solid white"}} >
            <NavLink
              to="addstudent"
              className={({ isActive }) => {
                let result = ` text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-user-plus"></i>&nbsp;&nbsp;
              <span className="">Add Student</span>
            </NavLink>
          </li>
         
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 bg-primary" style={{border:"1px solid white"}}>
            <NavLink
              to="viewstudent"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-pen-to-square mr-2"></i>
              <span className="">View Student</span>
            </NavLink>
          </li>
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 bg-primary" style={{border:"1px solid white"}}>
            <NavLink
              to="studentlist"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-list mr-2"></i>
              <span className="">Student List</span>
            </NavLink>
          </li>
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 bg-primary" style={{border:"1px solid white"}}>
            <NavLink
              to="studenthistory"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-history mr-2"></i>
              <span className="">Student History</span>
            </NavLink>
          </li>
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 bg-primary" style={{border:"1px solid white"}}>
            <NavLink
              to="roomno"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-shop mr-2"></i>
              <span className="">Room No</span>
            </NavLink>
          </li>
          
        </ul>

        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}

export default SubHomeStudent;
