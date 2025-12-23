import { Card } from "primereact/card";
import { Chip } from "primereact/chip";
import { Image } from "primereact/image";

function RoomieCard(props: any) {
  const { roomie } = props;
  return (
    <>
      <div className="card flex justify-content-center w-full">
        <Card className="w-full special-font">
          <div className="grid justify-content-center">
            <div className="col-12 sm:col-4">
              <div className="card flex justify-content-center">
                <Image
                  src={
                    roomie.imageURL
                      ? roomie.imageURL
                      : "/images/Avatar.jpg"
                  }
                  alt="student-image"
                  width="120"
                  height="120"
                />
              </div>
            </div>
            <div className="col-12 sm:col-8">
              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6 special-font">
                  Name
                </div>
                <div className="text-900 font-bold w-6 special-font">
                  {roomie?.name || ""}
                </div>
              </div>

              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">
                  College
                </div>
                <div className="text-900 font-bold w-6">
                  {roomie?.college || ""}
                </div>
              </div>
              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">Branch</div>
                <div className="text-900 font-bold w-6">
                  {roomie?.branch || ""}
                </div>
              </div>

              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">Year</div>
                <div className="text-900 font-bold w-6">
                  {roomie?.year || ""}
                </div>
              </div>

              <div className="flex align-items-center  justify-content-start mt-2">
                <div className="text-500 font-bold font-medium w-6">Status</div>
                <div className="text-900 font-bold w-6">
                  <Chip
                    className={`${roomie?.currentStatus === "HOSTEL"
                        ? "bg-green-500"
                        : "bg-orange-500"
                      } text-white-alpha-90`}
                    icon={"pi pi-map-marker"}
                    label={roomie?.currentStatus}
                  ></Chip>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default RoomieCard;
