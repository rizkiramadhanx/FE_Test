import { AddUserSchema } from "@/features/master-data/user/components/modal-add-user";
import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export default function useMutateAddUser() {
  return useMutation({
    mutationFn: async (dataForm: AddUserSchema) => {
      const response = await axiosInstanceAPI.request({
        method: "POST",
        url: "/users/add",
        data: dataForm,
      });
      return response;
    },
  });
}
