import React, { useContext, useEffect, useState } from "react";
import RoomieCard from "./RoomieCard";
import { StudentContext } from "./StudentHome";
import { getAllIncharges, getMyRoomies } from "../../services/StudentService";
import { Card } from "primereact/card";

interface Roomie {
  rollNo: string;
  name: string;
  college: string;
  year: number;
  branch: string;
  currentStatus: string;
  imageURL: string;
}

function StudentRoomies() {
  const [roomies, setRoomies] = useState<Roomie[]>([]);
  const { student } = useContext(StudentContext);

  useEffect(() => {
    if (student?.roomNo) {
      getMyRoomies(student?.hostelId, student?.roomNo)
        .then((data) => {
          let hostlers = data.hostlers;
          let images = data.images;

          hostlers = hostlers.map((student: any) => {
            let image = images.find(
              (img: any) => img.username === student.rollNo
            );
            return {
              ...student,
              imageURL: image
                ? image.imagePath
                : "/images/Avatar.jpg",
            };
          });
          setRoomies(hostlers);
        })
        .catch((err) => {
          console.log("something wrong", err);
        });
    } else {
      setRoomies([]);
    }
  }, [student]);

  return (
    <>
      <Card
        title="My Roomies"
        className="special-font"
        style={{ backgroundColor: "aliceblue" }}
      >
        {student?.roomNo
          ? roomies
            ? roomies.map((roomie) => (
              <div key={roomie.rollNo} className="m-2">
                <RoomieCard roomie={roomie} />
              </div>
            ))
            : "No data found"
          : "OOPS! You don't have room number please update"}
      </Card>
    </>
  );
}

export default StudentRoomies;
