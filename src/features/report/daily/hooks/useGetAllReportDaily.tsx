import { axiosInstanceAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllReportDaily({
  keyword,
  page = 1,
  limit = 20,
}: {
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  return useQuery({
    queryKey: ["report-daily", keyword, page, limit],
    queryFn: async () => {
      const response = await axiosInstanceAPI.request({
        method: "GET",
        url: "/api/lalins",
        params: {
          limit: limit,
          page: page,
        },
      });

      return response;
    },
  });
}
