import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import { z } from "zod";
import useMutateEditGate from "@/features/master-data/gate/hooks/useMutateEditGate";
import { useEffect } from "react";

const schema = z.object({
  IdCabang: z.number().min(1, { message: "ID Ruas harus diisi" }),
  NamaGerbang: z
    .string()
    .min(3, { message: "Nama Gerbang minimal 3 karakter" }),
  NamaCabang: z.string().min(3, { message: "Nama Ruas minimal 3 karakter" }),
});

export type EditGateSchema = z.infer<typeof schema>;

export default function ModalEditGate({
  open,
  onClose,
  onSuccess,
  defaultValue,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue: EditGateSchema & { id: number };
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<EditGateSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    reset(defaultValue);
  }, [defaultValue]);

  const { mutate } = useMutateEditGate();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (dataForm: EditGateSchema) => {
    mutate(
      {
        ...dataForm,
        id: defaultValue.id,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "Berhasil",
            message: "Berhasil mengubah gerbang",
            color: "green",
          });

          reset();
          handleFormClose();
          onSuccess();
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Gagal mengubah gerbang",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Modal
      opened={open}
      onClose={handleFormClose}
      title="Ubah Gerbang"
      size="lg"
      centered
      withCloseButton
      closeButtonProps={{ icon: <MdOutlineClose /> }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={10}>
          <Controller
            name="IdCabang"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="ID Ruas"
                placeholder="Masukkan ID Ruas"
                size="sm"
                error={errors.IdCabang?.message}
                hideControls
              />
            )}
          />
          <TextInput
            label="Nama Gerbang"
            placeholder="Masukkan Nama Gerbang"
            size="sm"
            error={errors.NamaGerbang?.message}
            {...register("NamaGerbang")}
          />
          <TextInput
            label="Nama Ruas"
            placeholder="Masukkan Nama Ruas"
            size="sm"
            error={errors.NamaCabang?.message}
            {...register("NamaCabang")}
          />
        </Stack>

        <Group justify="end" mt="lg">
          <Button variant="outline" color="gray" onClick={handleFormClose}>
            Batal
          </Button>
          <Button type="submit" color="primary" disabled={!isValid}>
            Simpan
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
