import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { EditUserSchema } from "@/features/master-data/user/components/modal-edit-user";

export default function useMutateEditUser() {
  return useMutation({
    mutationFn: async (dataForm: EditUserSchema & { id: string }) => {
      const response = await axiosInstanceAPI.request({
        method: "PATCH",
        url: "/users" + `/${dataForm.id}`,
        data: {
          ...dataForm,
        },
      });
      return response;
    },
  });
}
