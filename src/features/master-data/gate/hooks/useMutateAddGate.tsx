import { AddGateSchema } from "@/features/master-data/gate/components/modal-add-gate";
import { axiosInstanceAPI } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

export default function useMutateAddGate() {
  const generateId = Math.floor(100000 + Math.random() * 900000);
  return useMutation({
    mutationFn: async (dataForm: AddGateSchema) => {
      const response = await axiosInstanceAPI.request({
        method: "POST",
        url: "/api/gerbangs",
        data: {
          ...dataForm,
          id: generateId,
        },
      });
      return response;
    },
  });
}
