import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const data = [
  { value: 150, label: "Hostel" },
  { value: 30, label: "Leave" },
  { value: 40, label: "Permission" },
];

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 16,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartt(props: any) {
  const { data, total } = props;
  let pieData = data?data:[]

  return (
    <Box sx={{ height: 250, width: 400 }}>
      <PieChart
        margin={{ right: 100, top: 0 }}
        slotProps={{
          legend: {
            direction: "column",
            position: { vertical: "top", horizontal: "right" },
            padding: 5,
          },
        }}
        series={[
          {
            data:pieData,
            innerRadius: 50,
            arcLabel: "value",
            paddingAngle: 5,
            highlightScope: { highlight: "item", fade: "global" },
          },
        ]}
      >
        <PieCenterLabel>Total {total} </PieCenterLabel>
      </PieChart>
    </Box>
  );
}
