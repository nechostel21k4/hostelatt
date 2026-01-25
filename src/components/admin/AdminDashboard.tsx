import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import {
  getTodayAcceptedHostelStats,
  getTotalHostelStats,
  getTodayArrivedHostelStats,
  getCollegeYearWiseData,
} from "../../services/InchargeService";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Leave, Permission } from "../interfaces/Request";
import { Dialog } from "primereact/dialog";
import TodayRequestsView from "../incharge/TodayRequestsView";
import PieChartt from "../../charts/PieChartt";
import BarChartt from "../../charts/BarChartt";


interface TotalCount {
  hostel: number;
  permissions: number;
  leaves: number;
  total: number;
}

interface TodayStats {
  leaves: number;
  permissions: number;
  total: number;
  leavesList: [];
  permissionsList: [];
}

interface NEC {
  Iyear: number;
  IIyear: number;
  IIIyear: number;
  IVyear: number;
  total: number;
}

interface NIT {
  Iyear: number;
  IIyear: number;
  IIIyear: number;
  IVyear: number;
  total: number;
}

interface NIPS {
  Iyear: number;
  IIyear: number;
  IIIyear: number;
  IVyear: number;
  Vyear: number;
  VIyear: number;
  total: number;
}

interface PieChartData {
  value: number;
  label: string;
}


function AdminDashboard() {
  const [BH1TotalStats, setBH1TotalStats] = useState<TotalCount | null>(null);
  const [GH1TotalStats, setGH1TotalStats] = useState<TotalCount | null>(null);

  const [BH1PieChartData, setBH1PieChartData] = useState<PieChartData[] | null>(
    null
  );
  const [GH1PieChartData, setGH1PieChartData] = useState<PieChartData[] | null>(
    null
  );

  const [BH1TodayAcceptedStats, setBH1TodayAcceptedStats] =
    useState<TodayStats | null>(null);
  const [GH1TodayAcceptedStats, setGH1TodayAcceptedStats] =
    useState<TodayStats | null>(null);

  const [BH1TodayArrivedStats, setBH1TodayArrivedStats] =
    useState<TodayStats | null>(null);
  const [GH1TodayArrivedStats, setGH1TodayArrivedStats] =
    useState<TodayStats | null>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [activePermissionList, setActivePermissionList] = useState<
    Permission[]
  >([]);
  const [activeLeaveList, setActiveLeaveList] = useState<Leave[]>([]);

  const [title, setTitle] = useState<string>("");

  const [BH1NECTotalData, setBH1NECTotalData] = useState<NEC | null>(null);
  const [BH1NITTotalData, setBH1NITTotalData] = useState<NIT | null>(null);
  const [BH1NIPSTotalData, setBH1NIPSTotalData] = useState<NIPS | null>(null);

  const [GH1NECTotalData, setGH1NECTotalData] = useState<NEC | null>(null);
  const [GH1NITTotalData, setGH1NITTotalData] = useState<NIT | null>(null);
  const [GH1NIPSTotalData, setGH1NIPSTotalData] = useState<NIPS | null>(null);

  useEffect(() => {
    getTotalHostelStats("BH1")
      .then((data) => {
        setBH1TotalStats({
          hostel: data.hostel,
          permissions: data.permission,
          leaves: data.leave,
          total: data.total,
        });
        setBH1PieChartData([
          { label: "Hostel", value: data.hostel },
          { label: "Leave", value: data.leave },
          { label: "Permission", value: data.permission },
        ]);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });

    getTotalHostelStats("GH1")
      .then((data) => {
        setGH1TotalStats({
          hostel: data.hostel,
          permissions: data.permission,
          leaves: data.leave,
          total: data.total,
        });
        setGH1PieChartData([
          { label: "Hostel", value: data.hostel },
          { label: "Leave", value: data.leave },
          { label: "Permission", value: data.permission },
        ]);
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });

    getTodayAcceptedHostelStats("BH1").then((data) => {
      setBH1TodayAcceptedStats({
        leaves: data.leave,
        permissions: data.permission,
        total: data.total,
        permissionsList: data.permissionArray,
        leavesList: data.leaveArray,
      });
    });

    getTodayAcceptedHostelStats("GH1").then((data) => {
      setGH1TodayAcceptedStats({
        leaves: data.leave,
        permissions: data.permission,
        total: data.total,
        permissionsList: data.permissionArray,
        leavesList: data.leaveArray,
      });
    });

    getTodayArrivedHostelStats("BH1").then((data) => {
      setBH1TodayArrivedStats({
        leaves: data.leave,
        permissions: data.permission,
        total: data.total,
        permissionsList: data.permissionArray,
        leavesList: data.leaveArray,
      });
    });

    getTodayArrivedHostelStats("GH1").then((data) => {
      setGH1TodayArrivedStats({
        leaves: data.leave,
        permissions: data.permission,
        total: data.total,
        permissionsList: data.permissionArray,
        leavesList: data.leaveArray,
      });
    });

    getCollegeYearWiseData("BH1")
      .then((data) => {
        const { NEC, NIT, NIPS } = data;
        if (NEC) {
          setBH1NECTotalData({
            Iyear: NEC?.IYear,
            IIyear: NEC.IIYear,
            IIIyear: NEC.IIIYear,
            IVyear: NEC.IVYear,
            total: NEC.IYear + NEC.IIYear + NEC.IIIYear + NEC.IVYear,
          });
        } else {
          setBH1NECTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            total: 0,
          });
        }
        if (NIT) {
          setBH1NITTotalData({
            Iyear: NIT?.IYear,
            IIyear: NIT?.IIYear,
            IIIyear: NIT.IIIYear,
            IVyear: NIT.IVYear,
            total: NIT.IYear + NIT.IIYear + NIT.IIIYear + NIT.IVYear,
          });
        } else {
          setBH1NITTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            total: 0,
          });
        }
        if (NIPS) {
          setBH1NIPSTotalData({
            Iyear: NIPS.IYear,
            IIyear: NIPS.IIYear,
            IIIyear: NIPS.IIIYear,
            IVyear: NIPS.IVYear,
            total:
              NIPS.IYear +
              NIPS.IIYear +
              NIPS.IIIYear +
              NIPS.IVYear +
              NIPS.VYear +
              NIPS.VIYear,
            Vyear: NIPS.VYear,
            VIyear: NIPS.VIYear,
          });
        } else {
          setBH1NIPSTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            Vyear: 0,
            VIyear: 0,
            total: 0,
          });
        }
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });

    getCollegeYearWiseData("GH1")
      .then((data) => {
        const { NEC, NIT, NIPS } = data;
        if (NEC) {
          setGH1NECTotalData({
            Iyear: NEC.IYear,
            IIyear: NEC.IIYear,
            IIIyear: NEC.IIIYear,
            IVyear: NEC.IVYear,
            total: NEC.IYear + NEC.IIYear + NEC.IIIYear + NEC.IVYear,
          });
        } else {
          setGH1NECTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            total: 0,
          });
        }
        if (NIT) {
          setGH1NITTotalData({
            Iyear: NIT?.IYear,
            IIyear: NIT?.IIYear,
            IIIyear: NIT.IIIYear,
            IVyear: NIT.IVYear,
            total: NIT.IYear + NIT.IIYear + NIT.IIIYear + NIT.IVYear,
          });
        } else {
          setGH1NITTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            total: 0,
          });
        }
        if (NIPS) {
          setGH1NIPSTotalData({
            Iyear: NIPS.IYear,
            IIyear: NIPS.IIYear,
            IIIyear: NIPS.IIIYear,
            IVyear: NIPS.IVYear,
            total:
              NIPS.IYear +
              NIPS.IIYear +
              NIPS.IIIYear +
              NIPS.IVYear +
              NIPS.VYear +
              NIPS.VIYear,
            Vyear: NIPS.VYear,
            VIyear: NIPS.VIYear,
          });
        } else {
          setGH1NIPSTotalData({
            Iyear: 0,
            IIyear: 0,
            IIIyear: 0,
            IVyear: 0,
            Vyear: 0,
            VIyear: 0,
            total: 0,
          });
        }
      })
      .catch((err) => {
        console.log("something went wrong", err);
      });
  }, []);

  const todayAcceptedCardHeader = () => {
    return <h4 className="text-center special-font">Today Accepted Requests</h4>;
  };

  const todayAcceptedCardFooter = (hostelId: string) => {
    return (
      <>
        <Button
          link
          label="view details"
          onClick={() => {
            if (hostelId === "BH1") {
              setTitle(`Today Accepted Requests (BH1)`);
              setActiveLeaveList(BH1TodayAcceptedStats?.leavesList as Leave[]);
              setActivePermissionList(
                BH1TodayAcceptedStats?.permissionsList as Permission[]
              );
            } else if (hostelId === "GH1") {
              setTitle(`Today Accepted Requests (GH1)`);
              setActiveLeaveList(GH1TodayAcceptedStats?.leavesList as Leave[]);
              setActivePermissionList(
                GH1TodayAcceptedStats?.permissionsList as Permission[]
              );
            }
            setShowDialog(true);
          }}
        ></Button>
      </>
    );
  };

  const todayArrivedCardHeader = () => {
    return <h4 className="text-center special-font">Today Arrived Students</h4>;
  };

  const todayArrivedCardFooter = (hostelId: string) => {
    return (
      <>
        <Button
          link
          label="view details"
          onClick={() => {
            if (hostelId === "BH1") {
              setTitle(`Today Arrived Students (BH1)`);
              setActiveLeaveList(BH1TodayArrivedStats?.leavesList as Leave[]);
              setActivePermissionList(
                BH1TodayArrivedStats?.permissionsList as Permission[]
              );
            } else if (hostelId === "GH1") {
              setTitle(`Today Arrived Students (GH1)`);
              setActiveLeaveList(GH1TodayArrivedStats?.leavesList as Leave[]);
              setActivePermissionList(
                GH1TodayArrivedStats?.permissionsList as Permission[]
              );
            }
            setShowDialog(true);
          }}
        ></Button>
      </>
    );
  };

  const studentCardHeader = () => {
    return <h4 className="text-center special-font">Student Statistics</h4>;
  };

  const collegeDataHeader = () => {
    return <h4 className="text-center special-font">College & Year wise data</h4>;
  };

  return (
    <>
      <Dialog
        header={title}
        visible={showDialog}
        position="top"
        style={{ width: "50vw" }}
        onHide={() => {
          setShowDialog(false);
        }}
        className="w-11 lg:w-8"
      >
        <TodayRequestsView
          permissions={activePermissionList}
          leaves={activeLeaveList}
        />
      </Dialog>
      <div
        className="p-0 w-full"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translatex(-50%)",
        }}
      >
        <div
          className="p-card grid  mt-1 p-0"
          style={{ backgroundColor: "aliceblue" }}
        >
          <div className="col-12 flex align-items-center justify-content-center">
            <Chip
              label="Boys Hostel (BH1)"
              className="bg-primary mt-2"
              icon="pi pi-circle-fill"
            />
          </div>

          <div className="col-12 lg:col-6">
            <Card header={studentCardHeader} className="h-full" style={{ minHeight: '460px' }}>
              <PieChartt data={BH1PieChartData} total={BH1TotalStats?.total} />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card header={collegeDataHeader} className="h-full" style={{ minHeight: '460px' }}>
              <BarChartt
                data={[
                  {
                    name: '1st Year',
                    NEC: BH1NECTotalData?.Iyear || 0,
                    NIT: BH1NITTotalData?.Iyear || 0,
                    NIPS: BH1NIPSTotalData?.Iyear || 0
                  },
                  {
                    name: '2nd Year',
                    NEC: BH1NECTotalData?.IIyear || 0,
                    NIT: BH1NITTotalData?.IIyear || 0,
                    NIPS: BH1NIPSTotalData?.IIyear || 0
                  },
                  {
                    name: '3rd Year',
                    NEC: BH1NECTotalData?.IIIyear || 0,
                    NIT: BH1NITTotalData?.IIIyear || 0,
                    NIPS: BH1NIPSTotalData?.IIIyear || 0
                  },
                  {
                    name: '4th Year',
                    NEC: BH1NECTotalData?.IVyear || 0,
                    NIT: BH1NITTotalData?.IVyear || 0,
                    NIPS: BH1NIPSTotalData?.IVyear || 0
                  },
                  {
                    name: '5th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: BH1NIPSTotalData?.Vyear || 0
                  },
                  {
                    name: '6th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: BH1NIPSTotalData?.VIyear || 0
                  },
                ]}
                bars={[
                  { dataKey: 'NEC', name: 'NEC', color: '#8884d8' },
                  { dataKey: 'NIT', name: 'NIT', color: '#82ca9d' },
                  { dataKey: 'NIPS', name: 'NIPS', color: '#ffc658' },
                ]}
              />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              header={todayAcceptedCardHeader}
              footer={todayAcceptedCardFooter("BH1")}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-primary">
                    {BH1TodayAcceptedStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-primary">
                    {BH1TodayAcceptedStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {BH1TodayAcceptedStats?.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              header={todayArrivedCardHeader}
              footer={todayArrivedCardFooter("BH1")}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-green-500">
                    {BH1TodayArrivedStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-green-500">
                    {BH1TodayArrivedStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {BH1TodayArrivedStats?.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="p-card grid mt-2 p-0" style={{ backgroundColor: "whitesmoke" }}>
          <div className="col-12 flex align-items-center justify-content-center">
            <Chip
              label="Girls Hostel (GH1)"
              className="bg-primary mt-2"
              icon="pi pi-circle-fill"
            />
          </div>

          <div className="col-12 lg:col-6">
            <Card header={studentCardHeader} className="h-full" style={{ minHeight: '460px' }}>
              <PieChartt data={GH1PieChartData} total={GH1TotalStats?.total} />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card header={collegeDataHeader} className="h-full" style={{ minHeight: '460px' }}>
              <BarChartt
                data={[
                  {
                    name: '1st Year',
                    NEC: GH1NECTotalData?.Iyear || 0,
                    NIT: GH1NITTotalData?.Iyear || 0,
                    NIPS: GH1NIPSTotalData?.Iyear || 0
                  },
                  {
                    name: '2nd Year',
                    NEC: GH1NECTotalData?.IIyear || 0,
                    NIT: GH1NITTotalData?.IIyear || 0,
                    NIPS: GH1NIPSTotalData?.IIyear || 0
                  },
                  {
                    name: '3rd Year',
                    NEC: GH1NECTotalData?.IIIyear || 0,
                    NIT: GH1NITTotalData?.IIIyear || 0,
                    NIPS: GH1NIPSTotalData?.IIIyear || 0
                  },
                  {
                    name: '4th Year',
                    NEC: GH1NECTotalData?.IVyear || 0,
                    NIT: GH1NITTotalData?.IVyear || 0,
                    NIPS: GH1NIPSTotalData?.IVyear || 0
                  },
                  {
                    name: '5th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: GH1NIPSTotalData?.Vyear || 0
                  },
                  {
                    name: '6th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: GH1NIPSTotalData?.VIyear || 0
                  },
                ]}
                bars={[
                  { dataKey: 'NEC', name: 'NEC', color: '#8884d8' },
                  { dataKey: 'NIT', name: 'NIT', color: '#82ca9d' },
                  { dataKey: 'NIPS', name: 'NIPS', color: '#ffc658' },
                ]}
              />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              header={todayAcceptedCardHeader}
              footer={todayAcceptedCardFooter("GH1")}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-primary">
                    {GH1TodayAcceptedStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-primary">
                    {GH1TodayAcceptedStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {GH1TodayAcceptedStats?.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              header={todayArrivedCardHeader}
              footer={todayArrivedCardFooter("GH1")}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-green-500">
                    {GH1TodayArrivedStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-green-500">
                    {GH1TodayArrivedStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {GH1TodayArrivedStats?.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
