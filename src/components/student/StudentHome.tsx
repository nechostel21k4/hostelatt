import styles from "../styles/home.module.css";
import React, { createContext, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Student } from "../interfaces/Student";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import {
  getStudent,
  updateStudentProfile,
} from "../../services/StudentService";
import { useStudentAuth } from "../../utils/StudentAuth";
import { jwtDecode } from "jwt-decode";
import { CustomStudentJwtPayload } from "../StudentLogin";
import { isTokenExpired } from "../interfaces/Token";
import SessionExpCard from "../SessionExpCard";

export const StudentContext = createContext<any>(null);
export const StudentProvider = StudentContext.Provider;
export const StudentConsumer = StudentContext.Consumer;

function StudentHome() {
  const { studentLogin, studentLogout } = useStudentAuth();

  const params = useParams();

  const [sidenavVisible, setSidenavVisible] = useState(false);

  const [student, setStudent] = useState<Student>();

  const navigate = useNavigate();
  const location = useLocation();

  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    // in first render cycle get the student data
    const studentToken = localStorage.getItem("studentToken");
    const isTokenValid = !isTokenExpired(studentToken as string);

    if (isTokenValid) {
      const decoded = jwtDecode<CustomStudentJwtPayload>(
        studentToken as string
      );
      getStudent(decoded.rollNo as string)
        .then((data) => {
          setStudent(data.hosteler);
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
    const studentToken = localStorage.getItem("studentToken");
    if (isTokenExpired(studentToken as string)) {
      setIsSessionExpired(true);
    } else {
      setIsSessionExpired(false);
    }
  }, [navigate, location]);

  useEffect(() => {
    if (isSessionExpired) {
      setTimeout(() => {
        studentLogout();
      }, 4000);
    }
  }, [isSessionExpired]);

  const updateStudent = (student: Student) => {
    setStudent(student)
  };

  const handleLogout = () => {
    const accept = () => {
      studentLogout();
    };
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
      {isSessionExpired && <SessionExpCard />}
      <ConfirmDialog />
      <StudentProvider value={{ student, updateStudent }}>
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
                        // style={navLinkStyles}

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
                        to="leave"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-envelope mr-2"></i>
                        <span className="font-medium">
                          Apply Leave/ Permission
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
                        <span className="font-medium">History</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="incharge"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-users mr-2"></i>
                        <span className="font-medium">Incharge</span>
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
                        <i className="pi pi-comments mr-2"></i>
                        <span className="font-medium">Complaint Box</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="roomies"
                        className={({ isActive }) => {
                          let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                            ? "text-primary surface-100 text-primary"
                            : "text-white"
                            }`;
                          return result;
                        }}
                      >
                        <i className="pi pi-users mr-2"></i>
                        <span className="font-medium">Roomies</span>
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
                            to="leave"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-envelope mr-2"></i>
                            <span className="font-medium">
                              Apply Leave/ Permission
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
                            <span className="font-medium">History</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="incharge"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-users mr-2"></i>
                            <span className="font-medium">Incharge</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="roomies"
                            className={({ isActive }) => {
                              let result = `p-ripple no-underline flex  align-items-center hover:text-primary  cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full ${isActive
                                ? "text-primary surface-100 text-primary"
                                : "text-white"
                                }`;
                              return result;
                            }}
                          >
                            <i className="pi pi-users mr-2"></i>
                            <span className="font-medium">Roomies</span>
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
                            <i className="pi pi-comments mr-2"></i>
                            <span className="font-medium">Complaint Box</span>
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
        </div>
      </StudentProvider>
    </>
  );
}

export default StudentHome;
