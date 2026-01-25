import styles from "../styles/home.module.css";
import { createContext, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  // useParams,
} from "react-router-dom";
import { Incharge } from "../interfaces/Incharge";
import { getIncharge } from "../../services/InchargeService";
import { useInchargeAuth } from "../../utils/InchargeAuth";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../interfaces/Token";
import { CustomInchargeJwtPayload } from "../Login";
import SessionExpCard from "../SessionExpCard";

export const InchargeContext = createContext<any>(null);
export const InchargeProvider = InchargeContext.Provider;
export const InchargeConsumer = InchargeContext.Consumer;

function InchargeHome() {
  const [visible, setVisible] = useState(false);

  // const params = useParams();

  const [incharge, setIncharge] = useState<Incharge>();

  const { inchargeLogout } = useInchargeAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    const inchargeToken = localStorage.getItem("inchargeToken");
    const isTokenValid = !isTokenExpired(inchargeToken as string);

    if (isTokenValid) {
      const decoded = jwtDecode<CustomInchargeJwtPayload>(
        inchargeToken as string
      );
      getIncharge(decoded?.eid as string)
        .then((data) => {
          setIncharge(data);
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
    const inchargeToken = localStorage.getItem("inchargeToken");
    if (isTokenExpired(inchargeToken as string)) {
      setIsSessionExpired(true);
    } else {
      setIsSessionExpired(false);
    }
  }, [navigate, location]);

  useEffect(() => {
    if (isSessionExpired) {
      setTimeout(() => {
        inchargeLogout();
      }, 4000);
    }
  }, [isSessionExpired, inchargeLogout]);

  const handleLogout = () => {
    let result = window.confirm("Are you sure you want to Logout?");
    if (result) {
      inchargeLogout();
    }
  };

  return (
    <>
      {isSessionExpired && <SessionExpCard />}
      <InchargeProvider value={incharge}>
        <div className={styles.container}>
          <div
            className={`${styles.header} p-card flex p-1 align-items-center justify-content-between`}
          >
            <h1 className="text-primary m-0 ml-3 font-bold text-2xl">NEC HOSTEL PORTAL</h1>

            <Button
              icon="pi pi-bars"
              label="Menu"
              severity="info"
              className="lg:hidden"
              onClick={() => setVisible(true)}
              raised
              aria-label="User"
            />


          </div>
          <div className={styles.body}>
            <ConfirmDialog />
            <div
              className={`${styles.content} flex flex-row align-items-start`}
            >
              <div
                className={`${styles.sidenavbar}  hidden lg:block bg-primary`}
              >
                <div className="overflow-y-auto">
                  <ul className="list-none p-3 m-0">
                    <li>
                      <NavLink
                        to="dashboard"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-box mr-2"></i>
                        <span className="font-medium"> Dashboard</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="profile"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-user mr-2"></i>
                        <span className="font-medium"> My Profile</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="viewstudent"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-address-book mr-2"></i>
                        <span className="font-medium"> View Student</span>
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
                        }}
                      >
                        <i className="pi pi-list mr-2"></i>
                        <span className="font-medium">Student List</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="pendingreq"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-clock mr-2"></i>
                        <span className="font-medium">Pending Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="activereq"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-verified mr-2"></i>
                        <span className="font-medium">Active Requests</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="arrivedreq"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
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
                        }}
                      >
                        <i className="pi pi-check mr-2"></i>
                        <span className="font-medium">Accepted History</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="history"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-history mr-2"></i>
                        <span className="font-medium">Student History</span>
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
                        }}
                      >
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
                        }}
                      >
                        <i className="pi pi-envelope mr-2"></i>
                        <span className="font-medium">Complaint Box</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="attendance"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-calendar-times mr-2"></i>
                        <span className="font-medium">Attendance</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="announcement"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-megaphone mr-2"></i>
                        <span className="font-medium">Announcements</span>
                      </NavLink>
                    </li>
                    <li>
                      <div
                        className="p-ripple flex align-items-center hover:text-primary cursor-pointer p-3 border-round text-white hover:surface-100 transition-duration-150 transition-colors w-full"
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
                    visible={visible}
                    modal={false}
                    onHide={() => setVisible(false)}
                    className="lg:hidden w-14rem bg-primary"
                  >
                    <div className="overflow-y-auto">
                      <ul className="list-none p-3 m-0">
                        <li>
                          <NavLink
                            to="dashboard"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-box mr-2"></i>
                            <span className="font-medium"> Dashboard</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="profile"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-user mr-2"></i>
                            <span className="font-medium"> My Profile</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="viewstudent"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-address-book mr-2"></i>
                            <span className="font-medium"> View Student</span>
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
                            }}
                          >
                            <i className="pi pi-list mr-2"></i>
                            <span className="font-medium">Student List</span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="pendingreq"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-clock mr-2"></i>
                            <span className="font-medium">
                              Pending Requests
                            </span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="activereq"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-verified mr-2"></i>
                            <span className="font-medium">Active Requests</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="arrivedreq"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-list-check mr-2"></i>
                            <span className="font-medium">
                              Arrived Students
                            </span>
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
                            }}
                          >
                            <i className="pi pi-check mr-2"></i>
                            <span className="font-medium">
                              Accepted History
                            </span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="history"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-history mr-2"></i>
                            <span className="font-medium">Student History</span>
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
                            }}
                          >
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
                            }}
                          >
                            <i className="pi pi-envelope mr-2"></i>
                            <span className="font-medium">Complaint Box</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="attendance"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-calendar-times mr-2"></i>
                            <span className="font-medium">Attendance</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="announcement"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-megaphone mr-2"></i>
                            <span className="font-medium">Announcements</span>
                          </NavLink>
                        </li>
                        <li>
                          <div
                            className="p-ripple flex align-items-center hover:text-primary cursor-pointer p-3 border-round text-white hover:surface-100 transition-duration-150 transition-colors w-full"
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
      </InchargeProvider >
    </>
  );
}

export default InchargeHome;
