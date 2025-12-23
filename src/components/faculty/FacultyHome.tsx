import styles from "../styles/home.module.css";
import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { NavLink, Outlet } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { useFacultyAuth } from "../../utils/FacultyAuth";


function FacultyHome() {
  const { facultyLogout } = useFacultyAuth();
  const [sidenavVisible, setSidenavVisible] = useState(false);


  const handleLogout = () => {

    const accept = () => { facultyLogout(); };
    const reject = () => { };

    confirmDialog({
      message: `Are you sure you want to Logout?`,
      header: "Logout Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  return (
    <>
      <ConfirmDialog />

      <div className={styles.container}>
        <div
          className={`${styles.header} p-card flex p-1 align-items-center justify-content-between `}
        >
          <img
            src="/images/logo-no-background.png"
            alt="Nec logo"
            className="ml-3 mr-3 h-full hidden sm:block"
          />
          <img
            src="/images/Nec.png"
            alt="Nec logo"
            className="ml-3 mr-3 h-full"
          />

          <Button
            icon="pi pi-bars"
            label="Menu"
            severity="info"
            className="lg:hidden"
            onClick={() => setSidenavVisible(true)}
            raised
            aria-label="User"
          />

          <Button
            icon="pi pi-power-off"
            rounded
            raised
            label="Logout"
            onClick={handleLogout}
          />
        </div>
        <div className={styles.body}>
          <div
            className={`${styles.content} flex flex-row align-items-start`}
          >
            <div
              className={`${styles.sidenavbar} hidden lg:block bg-primary`}
            >
              <div className="overflow-y-auto">
                <ul className="list-none p-3 m-0">
                  <li>
                    <NavLink
                      to="viewstudent"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-user-edit mr-2"></i>
                      <span className="font-medium">View Student</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="studentlist"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-list mr-2"></i>
                      <span className="font-medium">Student List</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="history"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive ? 'text-primary surface-100 text-primary' : 'text-white'}`;
                        return result
                      }
                      }                      >
                      <i className="pi pi-history mr-2"></i>
                      <span className="font-medium">Student History</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="arrivedrequests"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-list-check mr-2"></i>
                      <span className="font-medium">Arrived Students</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="acceptedhistory"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-check mr-2"></i>
                      <span className="font-medium">Accepted History</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="inchargelist"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-users mr-2"></i>
                      <span className="font-medium">Incharge List</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="complaint"
                      className={({ isActive }) => {
                        let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                          ? "text-primary surface-100 text-primary"
                          : "text-white"
                          }`;
                        return result;
                      }}                    >
                      <i className="pi pi-envelope mr-2"></i>
                      <span className="font-medium">Complaint Box</span>
                    </NavLink>
                  </li>

                </ul>
              </div>
            </div>
            <div className={`${styles.middleContent} relative`}>
              <div className="card flex justify-content-center lg:hidden">
                <Sidebar
                  visible={sidenavVisible}
                  modal={false}
                  onHide={() => setSidenavVisible(false)}
                  className="lg:hidden w-14rem bg-primary"
                >
                  <div className="overflow-y-auto">
                    <ul className="list-none p-3 m-0">

                      <li>
                        <NavLink
                          to="viewstudent"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                              ? "text-primary surface-100 text-primary"
                              : "text-white"
                              }`;
                            return result;
                          }}                    >
                          <i className="pi pi-user-edit mr-2"></i>
                          <span className="font-medium">View Student</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="studentlist"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                              ? "text-primary surface-100 text-primary"
                              : "text-white"
                              }`;
                            return result;
                          }}                    >
                          <i className="pi pi-list mr-2"></i>
                          <span className="font-medium">Student List</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="history"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive ? 'text-primary surface-100 text-primary' : 'text-white'}`;
                            return result
                          }
                          }                      >
                          <i className="pi pi-history mr-2"></i>
                          <span className="font-medium">Student History</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="arrivedrequests"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                              ? "text-primary surface-100 text-primary"
                              : "text-white"
                              }`;
                            return result;
                          }}                    >
                          <i className="pi pi-list-check mr-2"></i>
                          <span className="font-medium">Arrived Students</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="acceptedhistory"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                              ? "text-primary surface-100 text-primary"
                              : "text-white"
                              }`;
                            return result;
                          }}                    >
                          <i className="pi pi-check mr-2"></i>
                          <span className="font-medium">Accepted History</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="inchargelist"
                          className={({ isActive }) => {
                            let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                              ? "text-primary surface-100 text-primary"
                              : "text-white"
                              }`;
                            return result;
                          }}                    >
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Incharge List</span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </Sidebar>
              </div>
              <div className={styles.outletStyle}>
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default FacultyHome;
