import "./App.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import StudentRegister from "./components/StudentRegister";
import StudentForgotPassword from "./components/StudentForgotPassword";
import InchargeForgotPassword from "./components/InchargeForgotPassword";

// student components
import StudentHome from "./components/student/StudentHome";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentProfile from "./components/student/StudentProfile";
import StudentLeave from "./components/student/StudentLeave";
import StudentIncharge from "./components/student/StudentIncharge";
import StudentHistory from "./components/student/StudentHistory";

import StudentProtectedRoutes from "./utils/StudentProtectedRoutes";
import { StudentAuthProvider } from "./utils/StudentAuth";

// incharge components
import InchargeHome from "./components/incharge/InchargeHome";
import InchargeDashboard from "./components/incharge/InchargeDashboard";
import InchargeProfile from "./components/incharge/InchargeProfile";
import InchargeViewStudent from "./components/incharge/InchargeViewStudent";
import InchargeStudentList from "./components/incharge/InchargeStudentList";
import InchargePendingRequest from "./components/incharge/InchargePendingRequest";
import InchargeActiveRequest from "./components/incharge/InchargeActiveRequest";
import InchargeArrivedRequest from "./components/incharge/InchargeArrivedRequest";
import InchargeHistory from "./components/incharge/InchargeHistory";
import InchargeList from "./components/incharge/InchargeList";

import InchargeAuthProvider from "./utils/InchargeAuth";
import InchargeProtectedRoutes from "./utils/InchargeProtectedRoutes";

// admin components
import AdminHome from "./components/admin/AdminHome";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import AdminAddIncharge from "./components/admin/AdminAddIncharge";
import AdminInchargeList from "./components/admin/AdminInchargeList";
import AdminAddStudent from "./components/admin/AdminAddStudent";
import AdminViewStudent from "./components/admin/AdminViewStudent";
import AdminStudentList from "./components/admin/AdminStudentList";
import AdminPendingRequests from "./components/admin/AdminPendingRequests";
import AdminActiveRequests from "./components/admin/AdminActiveRequests";
import AdminArrivedRequests from "./components/admin/AdminArrivedRequests";

import AdminProtectedRoutes from "./utils/AdminProtectedRoutes";
import AdminAuthProvider from "./utils/AdminAuth";
import AdminAcceptedHistory from "./components/admin/AdminAcceptedHistory";
import InchargeAcceptedHistory from "./components/incharge/InchargeAcceptedHistory";
import AdminLogs from "./components/admin/AdminLogs";
import FacultyHome from "./components/faculty/FacultyHome";
import FacultyInchargeList from "./components/faculty/FacultyInchargeList";
import FacultyProtectedRoutes from "./utils/FacultyProtectedRoutes";
import StudentLogin from "./components/StudentLogin";
import { FacultyAuthProvider } from "./utils/FacultyAuth";
import SubHomeAdmin from "./components/admin/SubHomeAdmin";
import SubHomeStudent from "./components/admin/SubHomeStudent";
import SubHomeIncharge from "./components/admin/SubHomeIncharge";
import AdminAddAdmin from "./components/admin/AdminAddAdmin";
import AdminAdminList from "./components/admin/AdminAdminList";
import AdminHistory from "./components/admin/AdminHistory";
import AdminFaculty from "./components/admin/AdminFaculty";
import FacultyStudentList from "./components/faculty/FacultyStudentList";
import AdminForgotPassword from "./components/AdminForgotPassword";
import AdminHolidayMessage from "./components/admin/AdminHolidayMessage";
import { Button } from "primereact/button";
import DeveloperCard from "./components/DeveloperCard";
import PageNotFound from "./components/PageNotFound";
import AdminStudentRoomNo from "./components/admin/AdminStudentRoomNo";
import StudentRoomies from "./components/student/StudentRoomies";
import AdminSchemas from "./components/admin/AdminSchemas";
import StudentComplaintBox from "./components/student/StudentComplaintBox";
import AdminComplaintBox from "./components/admin/AdminComplaintBox";
import InchargeComplaintBox from "./components/incharge/InchargeComplaintBox";
import FacultyComplaintBox from "./components/faculty/FacultyComplaintBox";
import AttendanceDashboard from "./components/admin/AttendanceDashboard";

function App() {
  return (
    <>
      <StudentAuthProvider>
        <InchargeAuthProvider>
          <AdminAuthProvider>
            <FacultyAuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<StudentLogin />} />
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
                    </Route>
                  </Route>

                  <Route path="*" element={<PageNotFound />}></Route>

                  {/* faculty routes ends */}
                </Routes>

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
