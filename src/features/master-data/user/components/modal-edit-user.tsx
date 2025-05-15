import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import { z } from "zod";
import useMutateEditUser from "@/features/master-data/user/hooks/useMutateEditUser";
import { useEffect } from "react";

const schema = z.object({
  firstName: z
    .string()
    .min(4, { message: "Nama minimal 4 karakter" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Hanya huruf dan angka yang diperbolehkan",
    }),
  lastName: z
    .string()
    .min(4, { message: "Nama minimal 4 karakter" })
    .regex(/^[a-zA-Z0-9 ]+$/, {
      message: "Hanya huruf dan angka yang diperbolehkan",
    }),
  username: z.string().min(6, { message: "Username minimal 6 karakter" }),
});

export type EditUserSchema = z.infer<typeof schema>;

export default function ModalEditUser({
  open,
  onClose,
  onSuccess,
  defaultValue,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultValue: EditUserSchema & { id: string };
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditUserSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    reset(defaultValue);
  }, [defaultValue]);

  const { mutate } = useMutateEditUser();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (dataForm: EditUserSchema) => {
    mutate(
      {
        ...dataForm,
        id: defaultValue.id,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Successfully edit user",
            color: "green",
          });

          reset();
          handleFormClose();
          onSuccess();
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to edit user",
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
      title="Edit User"
      size="lg"
      centered
      withCloseButton
      closeButtonProps={{ icon: <MdOutlineClose /> }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={10}>
          <TextInput
            label="First Name"
            placeholder="Insert First Name"
            size="sm"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Insert Last Name"
            size="sm"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <TextInput
            label="Username"
            placeholder="Insert Username"
            size="sm"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
        </Stack>

        <Group justify="end" mt="lg">
          <Button variant="outline" color="gray" onClick={handleFormClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={!isValid}>
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
