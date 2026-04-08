import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

// Static Imports (Auth Wrappers)
import InchargeProtectedRoutes from "../utils/InchargeProtectedRoutes";
import AdminProtectedRoutes from "../utils/AdminProtectedRoutes";
import FacultyProtectedRoutes from "../utils/FacultyProtectedRoutes";

// Lazy Load Pages & Components
const Login = lazy(() => import("../components/Login"));
const InchargeForgotPassword = lazy(() => import("../components/InchargeForgotPassword"));
const Developers = lazy(() => import("../components/Developers"));

// incharge components
const InchargeHome = lazy(() => import("../components/incharge/InchargeHome"));
const InchargeDashboard = lazy(() => import("../components/incharge/InchargeDashboard"));
const InchargeProfile = lazy(() => import("../components/incharge/InchargeProfile"));
const InchargeViewStudent = lazy(() => import("../components/incharge/InchargeViewStudent"));
const InchargeStudentList = lazy(() => import("../components/incharge/InchargeStudentList"));
const InchargePendingRequest = lazy(() => import("../components/incharge/InchargePendingRequest"));
const InchargeActiveRequest = lazy(() => import("../components/incharge/InchargeActiveRequest"));
const InchargeArrivedRequest = lazy(() => import("../components/incharge/InchargeArrivedRequest"));
const InchargeHistory = lazy(() => import("../components/incharge/InchargeHistory"));
const InchargeList = lazy(() => import("../components/incharge/InchargeList"));
const InchargeAttendance = lazy(() => import("../components/incharge/InchargeAttendance"));
const InchargeAcceptedHistory = lazy(() => import("../components/incharge/InchargeAcceptedHistory"));
const InchargeComplaintBox = lazy(() => import("../components/incharge/InchargeComplaintBox"));
const InchargeAnnouncements = lazy(() => import("../components/incharge/InchargeAnnouncements"));

// admin components
const AdminHome = lazy(() => import("../components/admin/AdminHome"));
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const AdminProfile = lazy(() => import("../components/admin/AdminProfile"));
const AdminAddIncharge = lazy(() => import("../components/admin/AdminAddIncharge"));
const AdminInchargeList = lazy(() => import("../components/admin/AdminInchargeList"));
const AdminAddStudent = lazy(() => import("../components/admin/AdminAddStudent"));
const AdminViewStudent = lazy(() => import("../components/admin/AdminViewStudent"));
const AdminStudentList = lazy(() => import("../components/admin/AdminStudentList"));
const AdminPendingRequests = lazy(() => import("../components/admin/AdminPendingRequests"));
const AdminActiveRequests = lazy(() => import("../components/admin/AdminActiveRequests"));
const AdminArrivedRequests = lazy(() => import("../components/admin/AdminArrivedRequests"));
const AdminAcceptedHistory = lazy(() => import("../components/admin/AdminAcceptedHistory"));
const AdminLogs = lazy(() => import("../components/admin/AdminLogs"));
const SubHomeAdmin = lazy(() => import("../components/admin/SubHomeAdmin"));
const SubHomeStudent = lazy(() => import("../components/admin/SubHomeStudent"));
const SubHomeIncharge = lazy(() => import("../components/admin/SubHomeIncharge"));
const AdminAddAdmin = lazy(() => import("../components/admin/AdminAddAdmin"));
const AdminAdminList = lazy(() => import("../components/admin/AdminAdminList"));
const AdminHistory = lazy(() => import("../components/admin/AdminHistory"));
const AdminFaculty = lazy(() => import("../components/admin/AdminFaculty"));
const AdminForgotPassword = lazy(() => import("../components/AdminForgotPassword"));
const AdminHolidayMessage = lazy(() => import("../components/admin/AdminHolidayMessage"));
const AdminMarquee = lazy(() => import("../components/admin/AdminMarquee"));
const AdminStudentRoomNo = lazy(() => import("../components/admin/AdminStudentRoomNo"));
const AdminSchemas = lazy(() => import("../components/admin/AdminSchemas"));
const AdminComplaintBox = lazy(() => import("../components/admin/AdminComplaintBox"));
const AttendanceDashboard = lazy(() => import("../components/admin/AttendanceDashboard"));
const AdminAnnouncements = lazy(() => import("../components/admin/AdminAnnouncements"));
const AdminFeesReminder = lazy(() => import("../components/admin/AdminFeesReminder"));

// faculty components
const FacultyHome = lazy(() => import("../components/faculty/FacultyHome"));
const FacultyInchargeList = lazy(() => import("../components/faculty/FacultyInchargeList"));
const FacultyStudentList = lazy(() => import("../components/faculty/FacultyStudentList"));
const FacultyComplaintBox = lazy(() => import("../components/faculty/FacultyComplaintBox"));
const FacultyAnnouncements = lazy(() => import("../components/faculty/FacultyAnnouncements"));
const FacultyAttendance = lazy(() => import("../components/faculty/FacultyAttendance"));

const PageNotFound = lazy(() => import("../components/PageNotFound"));

const AppRoutes = () => (
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
      <Route path="/developers" element={<Developers />} />
      <Route path="/inchargefpassword" element={<InchargeForgotPassword />} />
      <Route path="/adminfpassword" element={<AdminForgotPassword />} />

      {/* incharge routes start */}
      <Route element={<InchargeProtectedRoutes />}>
        <Route path="/incharge/:eid" element={<InchargeHome />}>
          <Route index element={<InchargeDashboard />} />
          <Route path="profile" element={<InchargeProfile />} />
          <Route path="dashboard" element={<InchargeDashboard />} />
          <Route path="history" element={<InchargeHistory />} />
          <Route path="inchargelist" element={<InchargeList />} />
          <Route path="viewstudent" element={<InchargeViewStudent />} />
          <Route path="studentlist" element={<InchargeStudentList />} />
          <Route path="pendingreq" element={<InchargePendingRequest />} />
          <Route path="activereq" element={<InchargeActiveRequest />} />
          <Route path="arrivedreq" element={<InchargeArrivedRequest />} />
          <Route path="acceptedhistory" element={<InchargeAcceptedHistory />} />
          <Route path="complaint" element={<InchargeComplaintBox />} />
          <Route path="attendance" element={<InchargeAttendance />} />
          <Route path="announcement" element={<InchargeAnnouncements />} />
        </Route>
      </Route>

      {/* admin routes starts */}
      <Route element={<AdminProtectedRoutes />}>
        <Route path="/admin/:eid" element={<AdminHome />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route path="admin" element={<SubHomeAdmin />}>
            <Route index element={<AdminAddAdmin />} />
            <Route path="addadmin" element={<AdminAddAdmin />} />
            <Route path="adminlist" element={<AdminAdminList />} />
          </Route>

          <Route path="incharge" element={<SubHomeIncharge />}>
            <Route index element={<AdminAddIncharge />} />
            <Route path="addincharge" element={<AdminAddIncharge />} />
            <Route path="inchargelist" element={<AdminInchargeList />} />
          </Route>

          <Route path="student" element={<SubHomeStudent />}>
            <Route index element={<AdminAddStudent />} />
            <Route path="addstudent" element={<AdminAddStudent />} />
            <Route path="viewstudent" element={<AdminViewStudent />} />
            <Route path="studentlist" element={<AdminStudentList />} />
            <Route path="studenthistory" element={<InchargeHistory />} />
            <Route path="roomno" element={<AdminStudentRoomNo />} />
          </Route>

          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="pendingrequests" element={<AdminPendingRequests />} />
          <Route path="activerequests" element={<AdminActiveRequests />} />

          <Route path="history" element={<AdminHistory />}>
            <Route index element={<AdminArrivedRequests />} />
            <Route path="arrivedrequests" element={<AdminArrivedRequests />} />
            <Route path="acceptedhistory" element={<AdminAcceptedHistory />} />
          </Route>

          <Route path="logs" element={<AdminLogs />} />
          <Route path="holidaymessage" element={<AdminHolidayMessage />} />
          <Route path="marquee" element={<AdminMarquee />} />
          <Route path="schema" element={<AdminSchemas />} />
          <Route path="complaint" element={<AdminComplaintBox />} />
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="announcement" element={<AdminAnnouncements />} />
          <Route path="feesreminder" element={<AdminFeesReminder />} />
        </Route>
      </Route>

      {/* faculty routes starts */}
      <Route element={<FacultyProtectedRoutes />}>
        <Route path="/faculty" element={<FacultyHome />}>
          <Route index element={<InchargeViewStudent />} />
          <Route path="viewstudent" element={<InchargeViewStudent />} />
          <Route path="studentlist" element={<FacultyStudentList />} />
          <Route path="arrivedrequests" element={<AdminArrivedRequests />} />
          <Route path="acceptedhistory" element={<AdminAcceptedHistory />} />
          <Route path="history" element={<InchargeHistory />} />
          <Route path="inchargelist" element={<FacultyInchargeList />} />
          <Route path="complaint" element={<FacultyComplaintBox />} />
          <Route path="announcement" element={<FacultyAnnouncements />} />
          <Route path="attendance" element={<FacultyAttendance />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
