import { Card } from "primereact/card";
import React, { useContext, useEffect, useState } from "react";
import {
  getTodayAcceptedHostelStats,
  getTotalHostelStats,
  getTodayArrivedHostelStats,
  getCollegeYearWiseData,
} from "../../services/InchargeService";
import { InchargeContext } from "./InchargeHome";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import TodayRequestsView from "./TodayRequestsView";
import { Leave, Permission } from "../interfaces/Request";
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

function InchargeDashboard() {
  const incharge = useContext(InchargeContext);

  const [totalHostelStats, setTotalHostelStats] = useState<TotalCount | null>(
    null
  );

  const [pieChartData, setPieChartData] = useState<PieChartData[] | null>(null);

  const [todayAcceptedHostelStats, settodayAcceptedHostelStats] =
    useState<TodayStats | null>(null);
  const [todayArrivedHostelStats, settodayArrivedHostelStats] =
    useState<TodayStats | null>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [activePermissionList, setActivePermissionList] = useState<
    Permission[]
  >([]);
  const [activeLeaveList, setActiveLeaveList] = useState<Leave[]>([]);

  const [title, setTitle] = useState<string>("");

  const [NECTotalData, setNECTotalData] = useState<NEC | null>(null);
  const [NITTotalData, setNITTotalData] = useState<NIT | null>(null);
  const [NIPSTotalData, setNIPSTotalData] = useState<NIPS | null>(null);

  useEffect(() => {
    if (incharge) {
      getTotalHostelStats(incharge?.hostelId)
        .then((data) => {
          setTotalHostelStats({
            hostel: data.hostel,
            permissions: data.permission,
            leaves: data.leave,
            total: data.total,
          });
          setPieChartData([
            { label: "Hostel", value: data.hostel },
            { label: "Leave", value: data.leave },
            { label: "Permission", value: data.permission },
          ]);
        })
        .catch((err) => {
          console.log("something went wrong", err);
        });
      getTodayAcceptedHostelStats(incharge?.hostelId).then((data) => {
        settodayAcceptedHostelStats({
          leaves: data.leave,
          permissions: data.permission,
          total: data.total,
          leavesList: data.leaveArray,
          permissionsList: data.permissionArray,
        });
      });
      getTodayArrivedHostelStats(incharge?.hostelId).then((data) => {
        settodayArrivedHostelStats({
          leaves: data.leave,
          permissions: data.permission,
          total: data.total,
          leavesList: data.leaveArray,
          permissionsList: data.permissionArray,
        });
      });

      getCollegeYearWiseData(incharge?.hostelId)
        .then((data) => {
          const { NEC, NIT, NIPS } = data;
          if (NEC) {
            setNECTotalData({
              Iyear: NEC.IYear,
              IIyear: NEC.IIYear,
              IIIyear: NEC.IIIYear,
              IVyear: NEC.IVYear,
              total: NEC.IYear + NEC.IIYear + NEC.IIIYear + NEC.IVYear,
            });
          } else {
            setNECTotalData({
              Iyear: 0,
              IIyear: 0,
              IIIyear: 0,
              IVyear: 0,
              total: 0,
            });
          }
          if (NIT) {
            setNITTotalData({
              Iyear: NIT?.IYear,
              IIyear: NIT?.IIYear,
              IIIyear: NIT.IIIYear,
              IVyear: NIT.IVYear,
              total: NIT.IYear + NIT.IIYear + NIT.IIIYear + NIT.IVYear,
            });
          } else {
            setNITTotalData({
              Iyear: 0,
              IIyear: 0,
              IIIyear: 0,
              IVyear: 0,
              total: 0,
            });
          }
          if (NIPS) {
            setNIPSTotalData({
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
            setNIPSTotalData({
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
    }
  }, [incharge]);

  const todayAcceptedCardHeader = () => {
    return <h4 className="text-center">Today Accepted Requests</h4>;
  };

  const todayAcceptedCardFooter = () => {
    return (
      <>
        <Button
          link
          label="view details"
          onClick={() => {
            setTitle(`Today Accepted Requests (${incharge.hostelId})`);
            setActiveLeaveList(todayAcceptedHostelStats?.leavesList as Leave[]);
            setActivePermissionList(
              todayAcceptedHostelStats?.permissionsList as Permission[]
            );
            setShowDialog(true);
          }}
        ></Button>
      </>
    );
  };

  const todayArrivedCardHeader = () => {
    return <h4 className="text-center">Today Arrived Students</h4>;
  };

  const todayArrivedCardFooter = () => {
    return (
      <>
        <Button
          link
          label="view details"
          onClick={() => {
            setTitle(`Today Arrived Requests ${incharge.hostelId}`);
            setActiveLeaveList(todayArrivedHostelStats?.leavesList as Leave[]);
            setActivePermissionList(
              todayArrivedHostelStats?.permissionsList as Permission[]
            );
            setShowDialog(true);
          }}
        ></Button>
      </>
    );
  };

  const studentCardHeader = () => {
    return <h4 className="text-center">Students</h4>;
  };

  const collegeDataHeader = () => {
    return <h4 className="text-center">College & Year wise data</h4>;
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
          className="p-card grid mt-1 p-0"
          style={{
            backgroundColor:
              incharge?.hostelId === "GH1" ? "whitesmoke" : "aliceblue",
          }}
        >
          <div className="col-12 flex align-items-center justify-content-center">
            <Chip
              label={
                incharge?.hostelId === "BH1"
                  ? "Boys Hostel (BH1)"
                  : incharge?.hostelId === "GH1"
                    ? "Girls Hostel (GH1)"
                    : ""
              }
              className="bg-primary mt-2"
              icon="pi pi-circle-fill"
            />
          </div>
          <div className="col-12 lg:col-6">
            <Card header={studentCardHeader} className="h-full" style={{ minHeight: '460px' }}>
              <PieChartt data={pieChartData} total={totalHostelStats?.total} />
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card header={collegeDataHeader} className="h-full" style={{ minHeight: '460px' }}>
              <BarChartt
                data={[
                  {
                    name: '1st Year',
                    NEC: NECTotalData?.Iyear || 0,
                    NIT: NITTotalData?.Iyear || 0,
                    NIPS: NIPSTotalData?.Iyear || 0
                  },
                  {
                    name: '2nd Year',
                    NEC: NECTotalData?.IIyear || 0,
                    NIT: NITTotalData?.IIyear || 0,
                    NIPS: NIPSTotalData?.IIyear || 0
                  },
                  {
                    name: '3rd Year',
                    NEC: NECTotalData?.IIIyear || 0,
                    NIT: NITTotalData?.IIIyear || 0,
                    NIPS: NIPSTotalData?.IIIyear || 0
                  },
                  {
                    name: '4th Year',
                    NEC: NECTotalData?.IVyear || 0,
                    NIT: NITTotalData?.IVyear || 0,
                    NIPS: NIPSTotalData?.IVyear || 0
                  },
                  {
                    name: '5th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: NIPSTotalData?.Vyear || 0
                  },
                  {
                    name: '6th Year',
                    NEC: 0,
                    NIT: 0,
                    NIPS: NIPSTotalData?.VIyear || 0
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
              footer={todayAcceptedCardFooter}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-primary">
                    {todayAcceptedHostelStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-primary">
                    {todayAcceptedHostelStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {todayAcceptedHostelStats?.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-6">
            <Card
              header={todayArrivedCardHeader}
              footer={todayArrivedCardFooter}
              className="h-full shadow-4 border-round-xl"
              style={{ minHeight: '460px' }}
            >
              <div className="flex flex-column gap-3 mt-2">
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Permissions</span>
                  <span className="text-2xl font-bold text-green-500">
                    {todayArrivedHostelStats?.permissions}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-ground border-round-lg">
                  <span className="text-lg font-medium text-700">Leaves</span>
                  <span className="text-2xl font-bold text-green-500">
                    {todayArrivedHostelStats?.leaves}
                  </span>
                </div>
                <div className="flex justify-content-between align-items-center p-3 surface-card border-1 surface-border border-round-lg">
                  <span className="text-xl font-bold text-900">Total</span>
                  <span className="text-3xl font-bold text-900">
                    {todayArrivedHostelStats?.total}
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

export default InchargeDashboard;
