import styles from "../styles/home.module.css";
import React, { createContext, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { useAdminAuth } from "../../utils/AdminAuth";
import { Admin } from "../interfaces/Admin";
import { getAdmin } from "../../services/AdminService";
import { isTokenExpired } from "../interfaces/Token";
import { jwtDecode } from "jwt-decode";
import { CustomAdminJwtPayload } from "../Login";
import SessionExpCard from "../SessionExpCard";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

export const AdminContext = createContext<any>(null);
export const AdminProvider = AdminContext.Provider;
export const AdminConsumer = AdminContext.Consumer;

function AdminHome() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);

  const [admin, setAdmin] = useState<Admin>();
  const { adminLogout } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const isTokenValid = !isTokenExpired(adminToken as string);

    if (isTokenValid) {
      const decoded = jwtDecode<CustomAdminJwtPayload>(adminToken as string);

      getAdmin(decoded?.eid as string)
        .then((data) => {
          setAdmin(data);
        })
        .catch((err) => {
          console.log(err);
        });
      setIsSessionExpired(false);
    } else {
      setIsSessionExpired(true);
    }
  }, []);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (isTokenExpired(adminToken as string)) {
      setIsSessionExpired(true);
    } else {
      setIsSessionExpired(false);
    }
  }, [navigate, location]);

  useEffect(() => {
    if (isSessionExpired) {
      setTimeout(() => {
        adminLogout();
      }, 4000);
    }
  }, [isSessionExpired, adminLogout]);

  const handleLogout = () => {
    const reject = () => { };
    const accept = () => {
      adminLogout();
    };

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
      {isSessionExpired && <SessionExpCard />}
      <AdminProvider value={admin}>
        <div className={styles.container}>
          <div
            className={`${styles.header} p-card flex p-1 align-items-center justify-content-between`}
            style={{ backgroundColor: '#1976D2' }}
          >
            <h1 className="text-white m-0 ml-3 font-bold text-2xl">NEC HOSTEL PORTAL</h1>
            <ConfirmDialog className="md:w-6" />

            <Button
              icon="pi pi-bars"
              label="Menu"
              severity="info"
              className="lg:hidden"
              onClick={() => setMenuVisible(true)}
              raised
              aria-label="User"
            />


          </div>

          <div className={styles.body}>
            <Dialog
              visible={cameraVisible}
              style={{ width: "50vw" }}
              onHide={() => {
                setCameraVisible(false);
              }}
              className="w-auto"
            ></Dialog>

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
                        to="dashboard"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-box mr-2"></i>
                        <span className="font-medium">Dashboard</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="attendance"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-check-circle mr-2"></i>
                        <span className="font-medium">Attendance</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="marquee"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}                    >
                        <i className="pi pi-align-center mr-2"></i>
                        <span className="font-medium">Marquee Settings</span>
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
                        to="complaint"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-comments mr-2"></i>
                        <span className="font-medium">Complaint Box</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="profile"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-id-card mr-2"></i>
                        <span className="font-medium">My Profile</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="admin"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-users mr-2"></i>
                        <span className="font-medium">Admin</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="incharge"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-users mr-2"></i>
                        <span className="font-medium">Incharge</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="student"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-graduation-cap mr-2"></i>
                        <span className="font-medium">Student</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="faculty"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-user mr-2"></i>
                        <span className="font-medium">Faculty</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="pendingrequests"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-clock mr-2"></i>
                        <span className="font-medium">Pending Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="activerequests"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-verified mr-2"></i>
                        <span className="font-medium">Active Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="history"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-history mr-2"></i>
                        <span className="font-medium">History</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="logs"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-address-book mr-2"></i>
                        <span className="font-medium">Logs</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="holidaymessage"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-send mr-2"></i>
                        <span className="font-medium">Holiday Message</span>
                      </NavLink>
                    </li>


                    <li>
                      <NavLink
                        to="schema"
                        className={({ isActive }) =>
                          `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                          }`
                        }
                        style={({ isActive }) => isActive ? {} : {}}
                      >
                        <i className="pi pi-table mr-2"></i>
                        <span className="font-medium">Schema</span>
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
              </div>
              <div className={`${styles.middleContent} relative`}>
                <div className="card flex justify-content-center lg:hidden">
                  <Sidebar
                    visible={menuVisible}
                    modal={false}
                    onHide={() => setMenuVisible(false)}
                    className="lg:hidden w-14rem"
                    style={{ backgroundColor: '#1976D2' }}
                  >
                    <div className="overflow-y-auto">
                      <ul className="list-none p-3 m-0">
                        <li>
                          <NavLink
                            to="dashboard"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                          >
                            <i className="pi pi-box mr-2"></i>
                            <span className="font-medium">Dashboard</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="attendance"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                          >
                            <i className="pi pi-check-circle mr-2"></i>
                            <span className="font-medium">Attendance</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="marquee"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}                    >
                            <i className="pi pi-align-center mr-2"></i>
                            <span className="font-medium">Marquee Settings</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="announcement"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-megaphone mr-2"></i>
                            <span className="font-medium">Announcements</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="complaint"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-comments mr-2"></i>
                            <span className="font-medium">Complaint Box</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="profile"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-id-card mr-2"></i>
                            <span className="font-medium">My Profile</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="admin"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-users mr-2"></i>
                            <span className="font-medium">Admin</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="incharge"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-users mr-2"></i>
                            <span className="font-medium">Incharge</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="student"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-graduation-cap mr-2"></i>
                            <span className="font-medium">Student</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="faculty"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-user mr-2"></i>
                            <span className="font-medium">Faculty</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="pendingrequests"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-clock mr-2"></i>
                            <span className="font-medium">
                              Pending Requests
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="activerequests"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-verified mr-2"></i>
                            <span className="font-medium">Active Requests</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="history"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-history mr-2"></i>
                            <span className="font-medium">History</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="logs"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-address-book mr-2"></i>
                            <span className="font-medium">Logs</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="holidaymessage"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-send mr-2"></i>
                            <span className="font-medium">Holiday Message</span>
                          </NavLink>
                        </li>


                        <li>
                          <NavLink
                            to="schema"
                            className={({ isActive }) =>
                              `p-ripple no-underline flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full ${isActive ? "bg-white-alpha-30 font-bold text-white" : "text-white hover:bg-white-alpha-20"
                              }`
                            }
                            style={({ isActive }) => isActive ? {} : {}}
                          >
                            <i className="pi pi-table mr-2"></i>
                            <span className="font-medium">Schema</span>
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
        </div>
      </AdminProvider >
    </>
  );
}

export default AdminHome;
