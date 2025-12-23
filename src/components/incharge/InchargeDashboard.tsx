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
          <Card header={studentCardHeader} className="col-12  lg:col-8">
            <div style={{ justifySelf: "center" }}>
              <PieChartt data={pieChartData} total={totalHostelStats?.total} />
            </div>
          </Card>

          <Card
            header={todayAcceptedCardHeader}
            footer={todayAcceptedCardFooter}
            className=" col-12 sm:col-6 lg:col-4 align-self-start"
          >
            <div className="flex align-items-center  justify-content-between">
              <div className="text-500 font-bold font-medium m-1">
                Permissions
              </div>
              <div className="text-900 font-bold m-1">
                {todayAcceptedHostelStats?.permissions}
              </div>
            </div>
            <div className="flex align-items-center  justify-content-between">
              <div className="text-500 font-bold font-medium m-1">Leaves</div>
              <div className="text-900 font-bold m-1">
                {todayAcceptedHostelStats?.leaves}
              </div>
            </div>
            <div className="flex align-items-center  justify-content-between mt-1 border-top-1 border-bottom-1">
              <div className="text-500 font-bold font-medium m-1">Total</div>
              <div className="text-900 font-bold m-1">
                {todayAcceptedHostelStats?.total}
              </div>
            </div>
          </Card>

          <Card
            header={todayArrivedCardHeader}
            footer={todayArrivedCardFooter}
            className=" col-12 sm:col-6 lg:col-4 align-self-end"
          >
            <div className="flex align-items-center  justify-content-between">
              <div className="text-500 font-bold font-medium m-1">
                Permissions
              </div>
              <div className="text-900 font-bold m-1">
                {todayArrivedHostelStats?.permissions}
              </div>
            </div>
            <div className="flex align-items-center  justify-content-between">
              <div className="text-500 font-bold font-medium m-1">Leaves</div>
              <div className="text-900 font-bold m-1">
                {todayArrivedHostelStats?.leaves}
              </div>
            </div>
            <div className="flex align-items-center  justify-content-between mt-1 border-top-1 border-bottom-1">
              <div className="text-500 font-bold font-medium m-1">Total</div>
              <div className="text-900 font-bold m-1">
                {todayArrivedHostelStats?.total}
              </div>
            </div>
          </Card>

          <Card header={collegeDataHeader} className=" col-12 lg:col-8 mt-2">
            <BarChartt
              nec={NECTotalData}
              nit={NITTotalData}
              nips={NIPSTotalData}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

export default InchargeDashboard;
