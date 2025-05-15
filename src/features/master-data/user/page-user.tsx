import ModalDeleteConfirmation from "@/components/moleculs/modal/modal-delete-confirmation";
import ModalAddUser from "@/features/master-data/user/components/modal-add-user";
import ModalEditUser, {
  EditUserSchema,
} from "@/features/master-data/user/components/modal-edit-user";
import useGetAllUser from "@/features/master-data/user/hooks/useGetAllUser";
import useMutateDeleteUser from "@/features/master-data/user/hooks/useMutateDeleteUser";
import { typeDataUser } from "@/features/master-data/user/type";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Input,
  Pagination,
  Table,
  Text,
} from "@mantine/core";
import { notifications, Notifications } from "@mantine/notifications";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";
export default function PageUser() {
  const navigate = useNavigate();
  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const onSuccessAddUser = () => {
    setOpen(false);
    refetch();

    notifications.show({
      title: "Success",
      message: "Successfully add user",
      color: "green",
    });
  };

  const [inputSearch, setInputSearch] = useState("");

  const [filter, setFilter] = useState({
    keyword: "",
    page: 1, // 0-based page index untuk MUI pagination
    limit: 25, // Jumlah data per halaman
    status: "all",
  });
  const {
    data: dataUser,
    isLoading: isLoadingUser,
    refetch,
    isSuccess: isSuccessUser,
  } = useGetAllUser(filter);

  const debouncedSearch = useDebounceCallback((val: string) => {
    setFilter((prev) => ({
      ...prev,
      keyword: val,
      page: 1, // Reset ke halaman pertama jika keyword berubah
    }));
  }, 500);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const { mutate, isPending: isPendingDelete } = useMutateDeleteUser();
  const handleDeleteUser = () => {
    // Ganti dengan ID user yang ingin diDelete
    mutate(idDelete, {
      onSuccess: () => {
        setModalDeleteOpen(false);

        refetch(); // Refetch data setelah berhasil mengDelete
        setIdDelete(""); // Reset ID setelah pengDeletean

        Notifications.show({
          title: "Success",
          message: "Successfully delete user",
          color: "green",
        });
      },
      onError: () => {
        setModalDeleteOpen(false);
        Notifications.show({
          title: "Error",
          message: "Failed to delete user",
          color: "red",
        });
      },
    });
  };

  // modal edit
  const [openEdit, setOpenEdit] = useState(false);
  const [activeEditUser, setActiveEditUser] = useState<
    EditUserSchema & { id: string }
  >({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const handleOpenEdit = (user: EditUserSchema & { id: string }) => {
    setActiveEditUser(user);
    setOpenEdit(true);
  };
  const onSuccessEditUser = () => {
    setOpenEdit(false);
    refetch();
  };

  return (
    <Box px={20} py={10}>
      <Group mb="md">
        <Button
          variant="filled"
          color="primary"
          size="xs"
          onClick={() => navigate(-1)}
        >
          <TiArrowBack />
        </Button>
        <Text fw={600}>Master Data User</Text>
      </Group>
      <Flex
        display={"flex"}
        direction={{ base: "column", md: "row" }}
        gap={10}
        mt={10}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Button
          w={{ base: "100%", md: "auto" }}
          onClick={() => handleOpen()}
          sx={{ marginTop: 1 }}
          color="primary"
          size="sm"
        >
          Add User
        </Button>
        <Input
          size="sm"
          leftSection={<CiSearch size={18} />}
          onChange={(e) => {
            const val = e.target.value;
            setInputSearch(val); // ✅ real-time update biar bisa diketik
            debouncedSearch(val); // ✅ debounce untuk update filter
          }}
          placeholder="Search Name..."
          value={inputSearch}
          w={{ base: "100%", md: "auto" }}
        />
      </Flex>
      <Table.ScrollContainer
        mt={20}
        minWidth={200}
        maxHeight={"calc(100vh - 300px)"}
      >
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isSuccessUser &&
              dataUser.data.users.length > 0 &&
              dataUser.data.users.map((user: typeDataUser) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.firstName}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>{user.company.title}</Table.Td>
                  <Table.Td>
                    <Badge color="primary">{user.role}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Box sx={{ display: "flex", gap: 5 }}>
                      <Button
                        color="blue"
                        onClick={() =>
                          handleOpenEdit({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username,
                          })
                        }
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setModalDeleteOpen(true);
                          setIdDelete(user.id); // Set ID user yang akan diDelete
                        }}
                        size="sm"
                        color="red"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ))}
            {isSuccessUser && dataUser.data.users.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" height={50}>
                  Tidak ada data ditemukan
                </Table.Td>
              </Table.Tr>
            )}
            {isLoadingUser && (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" height={50}>
                  Loading...
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Flex mt={20} justify="end" px={20}>
        {isSuccessUser && (
          <Pagination
            color="primary"
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                page: e,
              }));
            }}
            value={filter.page}
            total={Math.ceil(dataUser?.data?.total / filter.limit)}
          />
        )}
      </Flex>

      <ModalAddUser
        open={open}
        onSuccess={onSuccessAddUser}
        onClose={() => setOpen(false)}
      />

      <ModalEditUser
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={onSuccessEditUser}
        defaultValue={activeEditUser}
      />

      <ModalDeleteConfirmation
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onSubmit={() => handleDeleteUser()}
        label="Are you sure want to delete this user ?"
        isDeleting={isPendingDelete}
        isSubmitDisabled={false}
      />
    </Box>
  );
}
