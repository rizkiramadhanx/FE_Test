import {
  typeBankTraffic,
  typeDataDashboard,
  typeGateTraffic,
  typeRuasData,
  typeShiftData,
} from "@/features/dashboard/type";
import useGetAllGate from "@/features/master-data/gate/hooks/useGetAllGate";
import { BarChart, DonutChart } from "@mantine/charts";
import { Card, Flex, Grid, Text, Title } from "@mantine/core";
import { useMemo } from "react";

interface DashboardChartsProps {
  data: typeDataDashboard[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  // Get gate data for nama cabang
  const { data: dataGate, isSuccess: isSuccessGate } = useGetAllGate({
    keyword: "",
    page: 1,
    limit: 999999,
  });
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

    // Calculate total for percentage calculation
    const grandTotal = Object.values(shiftTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const colors = ["#8884d8", "#82ca9d", "#ffc658"];
    return Object.entries(shiftTotals).map(([shift, value], index) => {
      const percentage = grandTotal > 0 ? (value / grandTotal) * 100 : 0;
      return {
        name: `Shift ${shift}`,
        value: value, // Keep original value for chart
        percentage: Math.round(percentage), // Store percentage separately
        color: colors[index],
      };
    });
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
        name: `Gerbang ${
          dataGate?.data?.data?.rows?.rows.find(
            (item: any) => Number(item.id) === Number(gerbang)
          ).NamaGerbang
        }`,
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

    // Calculate total for percentage calculation
    const grandTotal = Object.values(ruasTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const colors = ["#8884d8", "#82ca9d", "#ffc658"];
    return Object.entries(ruasTotals)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([ruasId, value], index) => {
        const percentage = grandTotal > 0 ? (value / grandTotal) * 100 : 0;

        // Get nama cabang from gate data
        const namaCabang =
          dataGate?.data?.data?.rows?.rows?.find(
            (gate: any) => gate.IdCabang === Number(ruasId)
          )?.NamaCabang || `Cabang ${ruasId}`;

        return {
          name: namaCabang,
          value: value, // Keep original value for chart
          percentage: Math.round(percentage), // Store percentage separately
          color: colors[index % colors.length],
        };
      });
  }, [data, dataGate]);

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
            withTooltip
            tooltipAnimationDuration={400}
            tooltipProps={{
              formatter: (value) => {
                return <Text>jumlah : {value}</Text>;
              },
            }}
            data={bankTrafficData}
            dataKey="name"
            series={[
              {
                name: "value",
                color: "primary.6",
              },
            ]}
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
          <Flex justify="center" w="100%" gap={100} align={"center"}>
            <DonutChart
              h={300}
              data={shiftData}
              withTooltip
              tooltipDataSource="segment"
              tooltipProps={{
                formatter: (value, name) => [`${value}%`, name],
              }}
            />
            <Flex direction="column" gap={10}>
              <Text ta="center">Total Lalin</Text>
              <Flex direction="column" gap={10}>
                {shiftData.map((item) => (
                  <Text key={item.name}>
                    {item.name}: {item.value} - {item.percentage}%
                  </Text>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Grid.Col>

      {/* Second Row */}
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Jumlah Lalin
          </Title>
          {isSuccessGate && (
            <BarChart
              title="Jumlah Lalin"
              h={300}
              data={gateTrafficData}
              dataKey="name"
              series={[{ name: "value", color: "primary.6" }]}
              color="primary.6"
              tickLine="xy"
              gridAxis="xy"
            />
          )}
        </Card>
      </Grid.Col>

      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Total Lalin
          </Title>
          <Flex gap={100} align={"center"} justify={"center"}>
            <DonutChart
              h={300}
              data={ruasData}
              withTooltip
              tooltipDataSource="segment"
              tooltipProps={{
                formatter: (value, name) => [`${value}%`, name],
              }}
            />
            <Flex direction="column" gap={10}>
              <Text ta="center">Total Lalin</Text>
              {ruasData.map((item) => (
                <Text key={item.name}>
                  {item.name}: {item.value} - {item.percentage}%
                </Text>
              ))}
            </Flex>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
