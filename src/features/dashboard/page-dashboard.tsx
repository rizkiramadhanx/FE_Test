import DashboardCharts from "@/features/dashboard/components/dashboard-charts";
import useGetDashboardData from "@/features/dashboard/hooks/useGetDashboardData";
import { typeDataDashboard } from "@/features/dashboard/type";
import day from "@/libs/dayjs";
import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

export default function PageDashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(day().format("YYYY-MM-DD"));

  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isSuccess: isSuccessDashboard,
  } = useGetDashboardData({ date: selectedDate });

  const handleFilter = () => {
    // Data will automatically refetch due to queryKey dependency on selectedDate
  };

  return <Box px={20} py={10}></Box>;
}
