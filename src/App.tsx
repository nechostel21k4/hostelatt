import "./App.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import { Suspense, lazy } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

// Static Imports (Providers, Utils, UI Libs)
import StudentProtectedRoutes from "./utils/StudentProtectedRoutes";
import { StudentAuthProvider } from "./utils/StudentAuth";
import InchargeAuthProvider from "./utils/InchargeAuth";
import InchargeProtectedRoutes from "./utils/InchargeProtectedRoutes";
import AdminProtectedRoutes from "./utils/AdminProtectedRoutes";
import AdminAuthProvider from "./utils/AdminAuth";
import FacultyProtectedRoutes from "./utils/FacultyProtectedRoutes";
import { FacultyAuthProvider } from "./utils/FacultyAuth";
import { Button } from "primereact/button";

// Lazy Load Pages & Components
const Login = lazy(() => import("./components/Login"));
const StudentRegister = lazy(() => import("./components/StudentRegister"));
const StudentForgotPassword = lazy(() => import("./components/StudentForgotPassword"));
const InchargeForgotPassword = lazy(() => import("./components/InchargeForgotPassword"));

// student components
const StudentHome = lazy(() => import("./components/student/StudentHome"));
const StudentDashboard = lazy(() => import("./components/student/StudentDashboard"));
const StudentProfile = lazy(() => import("./components/student/StudentProfile"));
const StudentLeave = lazy(() => import("./components/student/StudentLeave"));
const StudentIncharge = lazy(() => import("./components/student/StudentIncharge"));
const StudentHistory = lazy(() => import("./components/student/StudentHistory"));
const StudentRoomies = lazy(() => import("./components/student/StudentRoomies"));
const StudentComplaintBox = lazy(() => import("./components/student/StudentComplaintBox"));
const StudentAnnouncements = lazy(() => import("./components/student/StudentAnnouncements"));

// incharge components
const InchargeHome = lazy(() => import("./components/incharge/InchargeHome"));
const InchargeDashboard = lazy(() => import("./components/incharge/InchargeDashboard"));
const InchargeProfile = lazy(() => import("./components/incharge/InchargeProfile"));
const InchargeViewStudent = lazy(() => import("./components/incharge/InchargeViewStudent"));
const InchargeStudentList = lazy(() => import("./components/incharge/InchargeStudentList"));
const InchargePendingRequest = lazy(() => import("./components/incharge/InchargePendingRequest"));
const InchargeActiveRequest = lazy(() => import("./components/incharge/InchargeActiveRequest"));
const InchargeArrivedRequest = lazy(() => import("./components/incharge/InchargeArrivedRequest"));
const InchargeHistory = lazy(() => import("./components/incharge/InchargeHistory"));
const InchargeList = lazy(() => import("./components/incharge/InchargeList"));
const InchargeAttendance = lazy(() => import("./components/incharge/InchargeAttendance"));
const InchargeAcceptedHistory = lazy(() => import("./components/incharge/InchargeAcceptedHistory"));
const InchargeComplaintBox = lazy(() => import("./components/incharge/InchargeComplaintBox"));
const InchargeAnnouncements = lazy(() => import("./components/incharge/InchargeAnnouncements"));

// admin components
const AdminHome = lazy(() => import("./components/admin/AdminHome"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("./components/admin/AdminProfile"));
const AdminAddIncharge = lazy(() => import("./components/admin/AdminAddIncharge"));
const AdminInchargeList = lazy(() => import("./components/admin/AdminInchargeList"));
const AdminAddStudent = lazy(() => import("./components/admin/AdminAddStudent"));
const AdminViewStudent = lazy(() => import("./components/admin/AdminViewStudent"));
const AdminStudentList = lazy(() => import("./components/admin/AdminStudentList"));
const AdminPendingRequests = lazy(() => import("./components/admin/AdminPendingRequests"));
const AdminActiveRequests = lazy(() => import("./components/admin/AdminActiveRequests"));
const AdminArrivedRequests = lazy(() => import("./components/admin/AdminArrivedRequests"));
const AdminAcceptedHistory = lazy(() => import("./components/admin/AdminAcceptedHistory"));
const AdminLogs = lazy(() => import("./components/admin/AdminLogs"));
const SubHomeAdmin = lazy(() => import("./components/admin/SubHomeAdmin"));
const SubHomeStudent = lazy(() => import("./components/admin/SubHomeStudent"));
const SubHomeIncharge = lazy(() => import("./components/admin/SubHomeIncharge"));
const AdminAddAdmin = lazy(() => import("./components/admin/AdminAddAdmin"));
const AdminAdminList = lazy(() => import("./components/admin/AdminAdminList"));
const AdminHistory = lazy(() => import("./components/admin/AdminHistory"));
const AdminFaculty = lazy(() => import("./components/admin/AdminFaculty"));
const AdminForgotPassword = lazy(() => import("./components/AdminForgotPassword"));
const AdminHolidayMessage = lazy(() => import("./components/admin/AdminHolidayMessage"));
const AdminMarquee = lazy(() => import("./components/admin/AdminMarquee"));
const AdminStudentRoomNo = lazy(() => import("./components/admin/AdminStudentRoomNo"));
const AdminSchemas = lazy(() => import("./components/admin/AdminSchemas"));
const AdminComplaintBox = lazy(() => import("./components/admin/AdminComplaintBox"));
const AttendanceDashboard = lazy(() => import("./components/admin/AttendanceDashboard"));
const AdminAnnouncements = lazy(() => import("./components/admin/AdminAnnouncements"));

// faculty components
const FacultyHome = lazy(() => import("./components/faculty/FacultyHome"));
const FacultyInchargeList = lazy(() => import("./components/faculty/FacultyInchargeList"));
const FacultyStudentList = lazy(() => import("./components/faculty/FacultyStudentList"));
const FacultyComplaintBox = lazy(() => import("./components/faculty/FacultyComplaintBox"));
const FacultyAnnouncements = lazy(() => import("./components/faculty/FacultyAnnouncements"));
const FacultyAttendance = lazy(() => import("./components/faculty/FacultyAttendance"));

// Other
const StudentLogin = lazy(() => import("./components/StudentLogin"));
const DeveloperCard = lazy(() => import("./components/DeveloperCard"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));

function App() {
  return (
    <>
      <StudentAuthProvider>
        <InchargeAuthProvider>
          <AdminAuthProvider>
            <FacultyAuthProvider>
              <BrowserRouter>
                <Suspense
                  fallback={
                    <div className="flex justify-content-center align-items-center h-screen">
                      <ProgressSpinner />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/admins" replace />} />
                    <Route path="/admins" element={<Login />} />
                    <Route
                      path="/studentregister"
                      element={<StudentRegister />}
                    ></Route>
                    <Route
                      path="/studentfpassword"
                      element={<StudentForgotPassword />}
                    ></Route>
                    <Route
                      path="/inchargefpassword"
                      element={<InchargeForgotPassword />}
                    ></Route>

                    <Route
                      path="/adminfpassword"
                      element={<AdminForgotPassword />}
                    ></Route>

                    <Route
                      path="/developers"
                      element={<DeveloperCard />}
                    ></Route>

                    {/* student routes start */}
                    <Route element={<StudentProtectedRoutes />}>
                      <Route path="/student/:rollNo" element={<StudentHome />}>
                        <Route index element={<StudentDashboard />}></Route>
                        <Route path="profile" element={<StudentProfile />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="leave" element={<StudentLeave />} />
                        <Route path="history" element={<StudentHistory />} />
                        <Route path="incharge" element={<StudentIncharge />} />
                        <Route path="roomies" element={<StudentRoomies />} />
                        <Route path="complaint" element={<StudentComplaintBox />} />
                        <Route path="announcement" element={<StudentAnnouncements />} />
                      </Route>
                    </Route>
                    {/* student routes end */}

                    {/* incharge routes start */}
                    <Route element={<InchargeProtectedRoutes />}>
                      <Route path="/incharge/:eid" element={<InchargeHome />}>
                        <Route index element={<InchargeDashboard />} />
                        <Route path="profile" element={<InchargeProfile />} />
                        <Route path="dashboard" element={<InchargeDashboard />} />
                        <Route path="history" element={<InchargeHistory />} />
                        <Route path="inchargelist" element={<InchargeList />} />
                        <Route
                          path="viewstudent"
                          element={<InchargeViewStudent />}
                        />
                        <Route
                          path="studentlist"
                          element={<InchargeStudentList />}
                        />
                        <Route
                          path="pendingreq"
                          element={<InchargePendingRequest />}
                        />
                        <Route
                          path="activereq"
                          element={<InchargeActiveRequest />}
                        />
                        <Route
                          path="arrivedreq"
                          element={<InchargeArrivedRequest />}
                        />
                        <Route
                          path="acceptedhistory"
                          element={<InchargeAcceptedHistory />}
                        />
                        <Route
                          path="complaint"
                          element={<InchargeComplaintBox />}
                        />
                        <Route
                          path="attendance"
                          element={<InchargeAttendance />}
                        />
                        <Route
                          path="announcement"
                          element={<InchargeAnnouncements />}
                        />
                      </Route>
                    </Route>
                    {/* incharge routes end */}

                    {/* admin routes starts */}
                    <Route element={<AdminProtectedRoutes />}>
                      <Route path="/admin/:eid" element={<AdminHome />}>
                        <Route index element={<AdminDashboard />}></Route>

                        <Route
                          path="dashboard"
                          element={<AdminDashboard />}
                        ></Route>
                        <Route path="profile" element={<AdminProfile />}></Route>

                        <Route path="admin" element={<SubHomeAdmin />}>
                          <Route index element={<AdminAddAdmin />}></Route>
                          <Route
                            path="addadmin"
                            element={<AdminAddAdmin />}
                          ></Route>
                          <Route
                            path="adminlist"
                            element={<AdminAdminList />}
                          ></Route>
                        </Route>

                        <Route path="incharge" element={<SubHomeIncharge />}>
                          <Route index element={<AdminAddIncharge />}></Route>
                          <Route
                            path="addincharge"
                            element={<AdminAddIncharge />}
                          ></Route>
                          <Route
                            path="inchargelist"
                            element={<AdminInchargeList />}
                          ></Route>
                        </Route>

                        <Route path="student" element={<SubHomeStudent />}>
                          <Route index element={<AdminAddStudent />}></Route>
                          <Route
                            path="addstudent"
                            element={<AdminAddStudent />}
                          ></Route>
                          <Route
                            path="viewstudent"
                            element={<AdminViewStudent />}
                          ></Route>
                          <Route
                            path="studentlist"
                            element={<AdminStudentList />}
                          ></Route>
                          <Route
                            path="studenthistory"
                            element={<InchargeHistory />}
                          ></Route>
                          <Route
                            path="roomno"
                            element={<AdminStudentRoomNo />}
                          ></Route>
                        </Route>

                        <Route path="faculty" element={<AdminFaculty />}></Route>

                        <Route
                          path="pendingrequests"
                          element={<AdminPendingRequests />}
                        ></Route>
                        <Route
                          path="activerequests"
                          element={<AdminActiveRequests />}
                        ></Route>

                        <Route path="history" element={<AdminHistory />}>
                          <Route index element={<AdminArrivedRequests />}></Route>
                          <Route
                            path="arrivedrequests"
                            element={<AdminArrivedRequests />}
                          ></Route>
                          <Route
                            path="acceptedhistory"
                            element={<AdminAcceptedHistory />}
                          ></Route>
                        </Route>

                        <Route path="logs" element={<AdminLogs />} />
                        <Route
                          path="holidaymessage"
                          element={<AdminHolidayMessage />}
                        />
                        <Route
                          path="marquee"
                          element={<AdminMarquee />}
                        />
                        <Route
                          path="schema"
                          element={<AdminSchemas />}
                        />
                        <Route
                          path="complaint"
                          element={<AdminComplaintBox />}
                        />
                        <Route
                          path="attendance"
                          element={<AttendanceDashboard />}
                        />
                        <Route
                          path="announcement"
                          element={<AdminAnnouncements />}
                        />
                      </Route>
                    </Route>
                    {/* admin routes ends */}

                    {/* faculty routes starts */}
                    <Route element={<FacultyProtectedRoutes />}>
                      <Route path="/faculty" element={<FacultyHome />}>
                        <Route index element={<InchargeViewStudent />} />
                        <Route
                          path="viewstudent"
                          element={<InchargeViewStudent />}
                        />
                        <Route
                          path="studentlist"
                          element={<FacultyStudentList />}
                        />
                        <Route
                          path="arrivedrequests"
                          element={<AdminArrivedRequests />}
                        />
                        <Route
                          path="acceptedhistory"
                          element={<AdminAcceptedHistory />}
                        />
                        <Route path="history" element={<InchargeHistory />} />
                        <Route
                          path="inchargelist"
                          element={<FacultyInchargeList />}
                        />
                        <Route
                          path="complaint"
                          element={<FacultyComplaintBox />}
                        />
                        <Route
                          path="announcement"
                          element={<FacultyAnnouncements />}
                        />
                        <Route
                          path="attendance"
                          element={<FacultyAttendance />}
                        />
                      </Route>
                    </Route>

                    <Route path="*" element={<PageNotFound />}></Route>

                    {/* faculty routes ends */}
                  </Routes>
                </Suspense>

                <Link to="/developers">
                  <Button
                    raised
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      backgroundColor: "dodgerblue",
                      color: "white",
                      borderRadius: "15px",
                    }}
                  >
                    Developers ?
                  </Button>
                </Link>
              </BrowserRouter>
            </FacultyAuthProvider>
          </AdminAuthProvider>
        </InchargeAuthProvider>
      </StudentAuthProvider>
    </>
  );
}

export default App;
