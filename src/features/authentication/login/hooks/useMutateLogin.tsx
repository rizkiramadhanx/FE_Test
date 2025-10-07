import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export type typeDataLogin = {
  username: string;
  password: string;
};

export type typeDataLoginResponse = {
  status: boolean;
  message: string;
  code: number;
  is_logged_in: number;
  token: string;
};

export default function useMutateLogin() {
  return useMutation<typeDataLoginResponse, Error, typeDataLogin>({
    mutationFn: async (dataForm: typeDataLogin) => {
      const response = await axiosInstanceAPI.request<typeDataLoginResponse>({
        method: "POST",
        url: "/api/auth/login",
        data: dataForm,
      });
      return response.data;
    },
  });
}
