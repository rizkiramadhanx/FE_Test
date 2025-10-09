import day from "@/libs/dayjs";
import { Button, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import DashboardCharts from "./components/dashboard-charts";
import { typeDataDashboard } from "./type";
import useGetAllReportDaily from "../report/daily/hooks/useGetAllReportDaily";

// Function to filter data by date
const filterDataByDate = (data: typeDataDashboard[], selectedDate: string) => {
  if (!selectedDate) return data;

  const targetDate = day(selectedDate).format("YYYY-MM-DD");

  return data.filter((item) => {
    const itemDate = day(item.Tanggal).format("YYYY-MM-DD");
    return itemDate === targetDate;
  });
};

export default function PageDashboard() {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    day("01-11-2023").format("DD-MM-YYYY")
  );

  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isSuccess: isSuccessDashboard,
  } = useGetAllReportDaily({
    keyword: "",
    page: 1,
    limit: 999999,
  });

  // Process data for dashboard
  const processedData: typeDataDashboard[] =
    dashboardData?.data?.data?.rows?.rows || [];

  // Filter data by selected date
  const filteredData = filterDataByDate(processedData, selectedDate || "");

  const handleFilter = () => {
    // Data will automatically refetch due to queryKey dependency on selectedDate
  };

  return (
    <Paper p={20} radius="md">
      {/* Header */}
      <Group mb="xl">
        <Title order={2}>Dashboard</Title>
      </Group>

      {/* Filter Section */}
      <Flex gap="md" mb="xl" align="center">
        <DatePickerInput
          placeholder="Pick date"
          valueFormat="DD-MM-YYYY"
          value={selectedDate}
          onChange={setSelectedDate}
          w={200}
        />
        <Button onClick={handleFilter} variant="filled">
          Filter
        </Button>
        <Button variant="outline" onClick={() => setSelectedDate(null)}>
          Reset
        </Button>
      </Flex>

      {/* Charts */}
      {isLoadingDashboard && (
        <Text ta="center" py={50}>
          Loading dashboard data...
        </Text>
      )}

      {isSuccessDashboard && filteredData.length === 0 && (
        <Text ta="center" py={50} c="dimmed">
          No data found for the selected date
        </Text>
      )}

      {isSuccessDashboard && filteredData.length > 0 && (
        <>
          <Text size="sm" c="dimmed" mb="md">
            Showing data for:{" "}
            {selectedDate
              ? day(selectedDate).format("DD MMMM YYYY")
              : "All dates"}
            ({filteredData.length} records)
          </Text>
          <DashboardCharts data={filteredData} />
        </>
      )}
    </Paper>
  );
}
