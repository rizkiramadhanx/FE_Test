import useMutateAddUser from "@/features/master-data/user/hooks/useMutateAddUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import { z } from "zod";

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

export type AddUserSchema = z.infer<typeof schema>;

export default function ModalAddUser({
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
    formState: { errors, isValid },
  } = useForm<AddUserSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutate } = useMutateAddUser();

  const handleFormClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (dataForm: AddUserSchema) => {
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
            message: "Failed to add user",
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
      title="Add User"
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
