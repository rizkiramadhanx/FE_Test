import { axiosInstanceAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type typeResponse = {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: {
        id: number;
        IdCabang: number;
        IdGerbang: number;
        Tanggal: string;
        Shift: number;
        IdGardu: number;
        Golongan: number;
        IdAsalGerbang: number;
        Tunai: number;
        DinasOpr: number;
        DinasMitra: number;
        DinasKary: number;
        eMandiri: number;
        eBri: number;
        eBni: number;
        eBca: number;
        eNobu: number;
        eDKI: number;
        eMega: number;
        eFlo: number;
      }[];
    };
  };
};

export default function useGetAllReportDaily({
  keyword,
  page = 1,
  limit = 20,
}: {
  keyword?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<AxiosResponse<typeResponse, any>>({
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
