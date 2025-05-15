import { axiosInstanceAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllUser({
  keyword,
  page = 1,
  limit = 20,
}: {
  keyword?: string;
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["user", keyword, page, limit],
    queryFn: async () => {
      const response = await axiosInstanceAPI.request({
        method: "GET",
        url: "/users",
        params: {
          limit: limit,
          keyword,
          skip: limit * page,
        },
      });

      return response;
    },
  });
}
