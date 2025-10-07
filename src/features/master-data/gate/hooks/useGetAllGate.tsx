import { axiosInstanceAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllGate({
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
    queryKey: ["gate", keyword, page, limit],
    queryFn: async () => {
      const response = await axiosInstanceAPI.request({
        method: "GET",
        url: "/api/gerbangs",
        params: {
          filter: {
            limit: limit,
            offset: offset,
          },
          NamaGerbang: keyword,
        },
      });

      return response;
    },
  });
}
