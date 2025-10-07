import ModalDeleteConfirmation from "@/components/moleculs/modal/modal-delete-confirmation";
import ModalAddGate from "@/features/master-data/gate/components/modal-add-gate";
import ModalEditGate, {
  EditGateSchema,
} from "@/features/master-data/gate/components/modal-edit-gate";
import ModalDetailGate from "@/features/master-data/gate/components/modal-detail-gate";
import useGetAllGate from "@/features/master-data/gate/hooks/useGetAllGate";
import useMutateDeleteGate from "@/features/master-data/gate/hooks/useMutateDeleteGate";
import { typeDataGate } from "@/features/master-data/gate/type";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import {
  Box,
  Button,
  Flex,
  Group,
  Input,
  Pagination,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { notifications, Notifications } from "@mantine/notifications";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

export default function PageGate() {
  const navigate = useNavigate();
  // modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const onSuccessAddGate = () => {
    setOpen(false);
    refetch();

    notifications.show({
      title: "Berhasil",
      message: "Berhasil menambah gerbang",
      color: "green",
    });
  };

  const [inputSearch, setInputSearch] = useState("");

  const [filter, setFilter] = useState({
    keyword: "",
    page: 1,
    limit: 25,
  });
  const {
    data: dataGate,
    isLoading: isLoadingGate,
    refetch,
    isSuccess: isSuccessGate,
  } = useGetAllGate(filter);

  const debouncedSearch = useDebounceCallback((val: string) => {
    setFilter((prev) => ({
      ...prev,
      keyword: val,
      page: 1,
    }));
  }, 500);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [idDelete, setIdDelete] = useState<{ id: number; IdCabang: number }>({
    id: 0,
    IdCabang: 0,
  });

  const { mutate, isPending: isPendingDelete } = useMutateDeleteGate();
  const handleDeleteGate = () => {
    mutate(
      { id: idDelete.id, IdCabang: idDelete.IdCabang },
      {
        onSuccess: () => {
          setModalDeleteOpen(false);

          refetch();
          setIdDelete({ id: 0, IdCabang: 0 });

          Notifications.show({
            title: "Berhasil",
            message: "Berhasil menghapus gerbang",
            color: "green",
          });
        },
        onError: () => {
          setModalDeleteOpen(false);
          Notifications.show({
            title: "Error",
            message: "Gagal menghapus gerbang",
            color: "red",
          });
        },
      }
    );
  };

  // modal edit
  const [openEdit, setOpenEdit] = useState(false);
  const [activeEditGate, setActiveEditGate] = useState<
    EditGateSchema & { id: number }
  >({
    id: 0,
    IdCabang: 0,
    NamaGerbang: "",
    NamaCabang: "",
  });
  const handleOpenEdit = (gate: EditGateSchema & { id: number }) => {
    setActiveEditGate(gate);
    setOpenEdit(true);
  };
  const onSuccessEditGate = () => {
    setOpenEdit(false);
    refetch();
  };

  // modal detail
  const [openDetail, setOpenDetail] = useState(false);
  const [activeDetailGate, setActiveDetailGate] = useState<typeDataGate | null>(
    null
  );
  const handleOpenDetail = (gate: typeDataGate) => {
    setActiveDetailGate(gate);
    setOpenDetail(true);
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
        <Text fw={600}>Master Data Gerbang</Text>
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
          Tambah Gerbang
        </Button>
        <Input
          size="sm"
          leftSection={<CiSearch size={18} />}
          onChange={(e) => {
            const val = e.target.value;
            setInputSearch(val);
            debouncedSearch(val);
          }}
          placeholder="Cari Gerbang..."
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
              <Table.Th>No</Table.Th>
              <Table.Th>Ruas</Table.Th>
              <Table.Th>Gerbang</Table.Th>
              <Table.Th>Aksi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isSuccessGate &&
              dataGate?.data?.data?.rows?.rows?.length > 0 &&
              dataGate.data.data.rows.rows.map(
                (gate: typeDataGate, index: number) => (
                  <Table.Tr key={gate.id}>
                    <Table.Td>
                      {(filter.page - 1) * filter.limit + index + 1}
                    </Table.Td>
                    <Table.Td>{gate.NamaCabang}</Table.Td>
                    <Table.Td>{gate.NamaGerbang}</Table.Td>
                    <Table.Td>
                      <Box sx={{ display: "flex", gap: 5 }}>
                        <Button
                          color="green"
                          onClick={() => handleOpenDetail(gate)}
                          size="sm"
                        >
                          Detail
                        </Button>
                        <Button
                          color="blue"
                          onClick={() =>
                            handleOpenEdit({
                              id: gate.id,
                              IdCabang: gate.IdCabang,
                              NamaGerbang: gate.NamaGerbang,
                              NamaCabang: gate.NamaCabang,
                            })
                          }
                          size="sm"
                        >
                          Ubah
                        </Button>
                        <Button
                          onClick={() => {
                            setModalDeleteOpen(true);
                            setIdDelete({
                              id: gate.id,
                              IdCabang: gate.IdCabang,
                            });
                          }}
                          size="sm"
                          color="red"
                        >
                          Hapus
                        </Button>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )
              )}
            {isSuccessGate &&
              (!dataGate?.data?.data?.rows?.rows ||
                dataGate.data.data.rows.rows.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={4} align="center" height={50}>
                    Tidak ada data ditemukan
                  </Table.Td>
                </Table.Tr>
              )}
            {isLoadingGate && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center" height={50}>
                  Memuat...
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Flex mt={20} justify="end" px={20}>
        {isSuccessGate && (
          <Select
            size="sm"
            w="70px"
            value={filter.limit.toString()}
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                limit: Number(e),
              }));
            }}
            data={[
              { label: "25", value: "25" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
            ]}
          />
        )}
        {isSuccessGate && dataGate?.data?.data?.total_pages && (
          <Pagination
            color="primary"
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                page: e,
              }));
            }}
            value={filter.page}
            total={dataGate.data.data.total_pages}
          />
        )}
      </Flex>

      <ModalAddGate
        open={open}
        onSuccess={onSuccessAddGate}
        onClose={() => setOpen(false)}
      />

      <ModalEditGate
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={onSuccessEditGate}
        defaultValue={activeEditGate}
      />

      <ModalDetailGate
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        data={activeDetailGate}
      />

      <ModalDeleteConfirmation
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onSubmit={() => handleDeleteGate()}
        label="Apakah Anda yakin ingin menghapus gerbang ini?"
        isDeleting={isPendingDelete}
        isSubmitDisabled={false}
      />
    </Box>
  );
}
