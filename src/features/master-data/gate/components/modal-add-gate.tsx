import useMutateAddGate from "@/features/master-data/gate/hooks/useMutateAddGate";
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

const schema = z.object({
  IdCabang: z.number().min(1, { message: "ID Ruas harus diisi" }),
  NamaGerbang: z
    .string()
    .min(3, { message: "Nama Gerbang minimal 3 karakter" }),
  NamaCabang: z.string().min(3, { message: "Nama Ruas minimal 3 karakter" }),
});

export type AddGateSchema = z.infer<typeof schema>;

export default function ModalAddGate({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<AddGateSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutate } = useMutateAddGate();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (dataForm: AddGateSchema) => {
    mutate(
      {
        ...dataForm,
      },
      {
        onSuccess: () => {
          reset();
          handleFormClose();
          onSuccess();
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Gagal menambah gerbang",
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
      title="Tambah Gerbang"
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
