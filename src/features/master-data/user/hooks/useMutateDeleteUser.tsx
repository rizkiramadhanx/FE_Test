import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export default function useMutateDeleteUser() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstanceAPI.request({
        method: "DELETE",
        url: "/users/" + id,
      });
      return response;
    },
  });
}
