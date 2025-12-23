import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/material";

export default function BarChartt(props: any) {
  const { nec, nit, nips } = props;

  let labels = nec
    ? [`NEC (${nec.total})`, `NIT (${nit.total})`, `NIPS (${nips.total})`]
    : [];

  let finalData: any = [];

  if (nec) {
    let Iyear = [nec.Iyear, nit.Iyear, nips.Iyear];
    let IIyear = [nec.IIyear, nit.IIyear, nips.IIyear];
    let IIIyear = [nec.IIIyear, nit.IIIyear, nips.IIIyear];
    let IVyear = [nec.IVyear, nit.IVyear, nips.IVyear];
    let Vyear = [null, null, nips.Vyear];
    let VIyear = [null, null, nips.VIyear];

    finalData = [
      { data: Iyear, label: "I Year" },
      { data: IIyear, label: "II Year" },
      { data: IIIyear, label: "III Year" },
      { data: IVyear, label: "IV Year" },
      { data: Vyear, label: "V Year" },
      { data: VIyear, label: "VI Year" },
    ];
  }

  return (
    <Box sx={{ height: 300, width: "100%" }}>
      <BarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={finalData}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 0,
          }}}
      />
    </Box>
  );
}
