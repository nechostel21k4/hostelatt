import styles from "../styles/home.module.css";
import { NavLink, Outlet } from "react-router-dom";

function SubHomeAdmin() {
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
       <ul className="p-card list-none grid bg-primary m-0 p-0">
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 ">
            <NavLink
              to="addadmin"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-user-plus mr-2"></i>
              <span className="">Add Admin</span>
            </NavLink>
          </li>
          <li className="col-6 sm:col-4 md:col-3 p-0 m-0 ">
            <NavLink
              to="adminlist"
              className={({ isActive }) => {
                let result = `p-ripple text-white no-underline flex  align-items-center justify-content-center  cursor-pointer p-3 border-round text-700 hover:surface-700 transition-duration-150 transition-colors w-full ${
                  isActive ? "surface-700 " : ""
                }`;
                return result;
              }}
            >
              <i className="pi pi-list mr-2"></i>
              <span className="">Admin List</span>
            </NavLink>
          </li>
        </ul>

          <Outlet></Outlet>
      </div>
    </>
  );
}

export default SubHomeAdmin;
