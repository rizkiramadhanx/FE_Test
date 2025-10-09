import { axiosInstanceAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetDashboardData({ date }: { date?: string }) {
  return useQuery({
    queryKey: ["dashboard-data", date],
    queryFn: async () => {
      const response = await axiosInstanceAPI.request({
        method: "GET",
        url: "/api/lalins", // Using same endpoint as report daily
        params: {
          filter: {
            limit: 999999,
            offset: 0,
          },
          // Remove date filter for now to test with all data
          // date: date,
        },
      });

      return response;
    },
    enabled: true, // Always enabled for testing
  });
}
