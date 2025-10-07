import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { EditGateSchema } from "@/features/master-data/gate/components/modal-edit-gate";

export default function useMutateEditGate() {
  return useMutation({
    mutationFn: async (dataForm: EditGateSchema & { id: number }) => {
      const response = await axiosInstanceAPI.request({
        method: "PUT",
        url: "/api/gerbangs",
        data: {
          ...dataForm,
          id: dataForm.id,
        },
      });
      return response;
    },
  });
}
