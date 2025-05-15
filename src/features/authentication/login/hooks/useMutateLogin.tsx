import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export type typeDataLogin = {
  username: string;
  password: string;
};
export default function useMutateLogin() {
  return useMutation({
    mutationFn: async (dataForm: typeDataLogin) => {
      const response = await axiosInstanceAPI.request({
        method: "POST",
        url: "/user/login",
        data: dataForm,
      });
      return response;
    },
  });
}
