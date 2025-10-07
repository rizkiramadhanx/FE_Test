import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export default function useMutateDeleteGate() {
  return useMutation({
    mutationFn: async ({ id, IdCabang }: { id: number; IdCabang: number }) => {
      const response = await axiosInstanceAPI.request({
        method: "DELETE",
        url: "/api/gerbangs",
        data: {
          IdCabang,
          id,
        },
      });
      return response;
    },
  });
}
