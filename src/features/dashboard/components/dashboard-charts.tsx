import {
  typeBankTraffic,
  typeDataDashboard,
  typeGateTraffic,
  typeRuasData,
  typeShiftData,
} from "@/features/dashboard/type";
import { BarChart, DonutChart } from "@mantine/charts";
import { Card, Grid, Group, Paper, Text, Title } from "@mantine/core";
import { useMemo } from "react";

interface DashboardChartsProps {
  data: typeDataDashboard[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  // Process data for Bank Traffic Bar Chart
  const bankTrafficData: typeBankTraffic[] = useMemo(() => {
    const bankTotals: { [key: string]: number } = {
      BCA: 0,
      BRI: 0,
      BNI: 0,
      DKI: 0,
      Mandiri: 0,
      Mega: 0,
      Flo: 0,
    };

    data.forEach((item) => {
      bankTotals.BCA += item.eBca || 0;
      bankTotals.BRI += item.eBri || 0;
      bankTotals.BNI += item.eBni || 0;
      bankTotals.DKI += item.eDKI || 0;
      bankTotals.Mandiri += item.eMandiri || 0;
      bankTotals.Mega += item.eMega || 0;
      bankTotals.Flo += item.eFlo || 0;
    });

    return Object.entries(bankTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data]);

  // Process data for Shift Distribution Donut Chart
  const shiftData: typeShiftData[] = useMemo(() => {
    const shiftTotals: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 };

    data.forEach((item) => {
      const total =
        (item.Tunai || 0) +
        (item.eMandiri || 0) +
        (item.eBri || 0) +
        (item.eBni || 0) +
        (item.eBca || 0) +
        (item.eNobu || 0) +
        (item.eDKI || 0) +
        (item.eMega || 0) +
        (item.eFlo || 0);
      shiftTotals[item.Shift] += total;
    });

    const colors = ["#8884d8", "#82ca9d", "#ffc658"];
    return Object.entries(shiftTotals).map(([shift, value], index) => ({
      name: `Shift ${shift}`,
      value,
      color: colors[index],
    }));
  }, [data]);

  // Process data for Gate Traffic Bar Chart
  const gateTrafficData: typeGateTraffic[] = useMemo(() => {
    const gateTotals: { [key: number]: number } = {};

    data.forEach((item) => {
      if (!gateTotals[item.IdGerbang]) {
        gateTotals[item.IdGerbang] = 0;
      }
      const total =
        (item.Tunai || 0) +
        (item.eMandiri || 0) +
        (item.eBri || 0) +
        (item.eBni || 0) +
        (item.eBca || 0) +
        (item.eNobu || 0) +
        (item.eDKI || 0) +
        (item.eMega || 0) +
        (item.eFlo || 0);
      gateTotals[item.IdGerbang] += total;
    });

    return Object.entries(gateTotals)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([gerbang, value]) => ({
        name: `Gerbang ${gerbang}`,
        value,
      }));
  }, [data]);

  // Process data for Ruas Distribution Donut Chart
  const ruasData: typeRuasData[] = useMemo(() => {
    const ruasTotals: { [key: number]: number } = {};

    data.forEach((item) => {
      if (!ruasTotals[item.IdCabang]) {
        ruasTotals[item.IdCabang] = 0;
      }
      const total =
        (item.Tunai || 0) +
        (item.eMandiri || 0) +
        (item.eBri || 0) +
        (item.eBni || 0) +
        (item.eBca || 0) +
        (item.eNobu || 0) +
        (item.eDKI || 0) +
        (item.eMega || 0) +
        (item.eFlo || 0);
      ruasTotals[item.IdCabang] += total;
    });

    const colors = ["#8884d8", "#82ca9d", "#ffc658"];
    return Object.entries(ruasTotals)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([ruas, value], index) => ({
        name: `Ruas ${ruas}`,
        value,
        color: colors[index % colors.length],
      }));
  }, [data]);

  return (
    <Grid>
      {/* First Row */}
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Jumlah Lalin
          </Title>
          <BarChart
            h={300}
            data={bankTrafficData}
            dataKey="name"
            series={[{ name: "value", color: "gray.6" }]}
            tickLine="xy"
            gridAxis="xy"
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Total Lalin
          </Title>
          <DonutChart
            h={300}
            data={shiftData}
            withTooltip
            tooltipDataSource="segment"
          />
        </Card>
      </Grid.Col>

      {/* Second Row */}
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Jumlah Lalin
          </Title>
          <BarChart
            h={300}
            data={gateTrafficData}
            dataKey="name"
            series={[{ name: "value", color: "gray.6" }]}
            tickLine="xy"
            gridAxis="xy"
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Total Lalin
          </Title>
          <DonutChart
            h={300}
            data={ruasData}
            withTooltip
            tooltipDataSource="segment"
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
}
