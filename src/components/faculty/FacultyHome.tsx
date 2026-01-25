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
          style={{ backgroundColor: '#1976D2' }}
        >
          <h1 className="text-white m-0 ml-3 font-bold text-2xl">NEC HOSTEL PORTAL</h1>

          <Button
            icon="pi pi-bars"
            label="Menu"
            severity="info"
            className="lg:hidden"
            onClick={() => setSidenavVisible(true)}
            raised
            aria-label="User"
          />


        </div>
        <div className={styles.body}>
          <div
            className={`${styles.content} flex flex-row align-items-start`}
          >
            <div
              className={`${styles.sidenavbar} hidden lg:block`}
              style={{ backgroundColor: '#1976D2' }}
            >
              <div className="overflow-y-auto">
                <ul className="list-none p-3 m-0">
                  <li>
                    <NavLink
                      to="viewstudent"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-user-edit mr-2"></i>
                      <span className="font-medium">View Student</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="studentlist"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
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
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-list-check mr-2"></i>
                      <span className="font-medium">Arrived Students</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="acceptedhistory"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-check mr-2"></i>
                      <span className="font-medium">Accepted History</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="inchargelist"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-users mr-2"></i>
                      <span className="font-medium">Incharge List</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="complaint"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-envelope mr-2"></i>
                      <span className="font-medium">Complaint Box</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="announcement"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-megaphone mr-2"></i>
                      <span className="font-medium">Announcements</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="attendance"
                      className={({ isActive }) =>
                        `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                        }`
                      }
                      style={({ isActive }) => isActive ? {} : {}}                    >
                      <i className="pi pi-calendar-plus mr-2"></i>
                      <span className="font-medium">Attendance</span>
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
                  className="lg:hidden w-14rem"
                  style={{ backgroundColor: '#1976D2' }}
                >
                  <div className="overflow-y-auto">
                    <ul className="list-none p-3 m-0">

                      <li>
                        <NavLink
                          to="viewstudent"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }                    >
                          <i className="pi pi-user-edit mr-2"></i>
                          <span className="font-medium">View Student</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="studentlist"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
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
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-list-check mr-2"></i>
                          <span className="font-medium">Arrived Students</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="acceptedhistory"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-check mr-2"></i>
                          <span className="font-medium">Accepted History</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="inchargelist"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Incharge List</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="complaint"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-envelope mr-2"></i>
                          <span className="font-medium">Complaint Box</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="announcement"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-megaphone mr-2"></i>
                          <span className="font-medium">Announcements</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="attendance"
                          className={({ isActive }) =>
                            `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                            }`
                          }
                          style={({ isActive }) => isActive ? {} : {}}                    >
                          <i className="pi pi-calendar-plus mr-2"></i>
                          <span className="font-medium">Attendance</span>
                        </NavLink>
                      </li>
                      <li>
                        <div
                          className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-white hover:bg-white-alpha-20 transition-duration-150 transition-colors w-full"
                          onClick={handleLogout}
                        >
                          <i className="pi pi-power-off mr-2"></i>
                          <span className="font-medium">Logout</span>
                        </div>
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
