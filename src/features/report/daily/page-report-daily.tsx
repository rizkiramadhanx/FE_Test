import useGetAllReportDaily from "@/features/report/daily/hooks/useGetAllReportDaily";
import { typeDataReportDaily } from "@/features/report/daily/type";
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
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";

export default function PageReportDaily() {
  const navigate = useNavigate();

  const [inputSearch, setInputSearch] = useState("");

  const [filter, setFilter] = useState({
    keyword: "",
    page: 1,
    limit: 25,
  });

  const {
    data: dataReport,
    isLoading: isLoadingReport,
    refetch,
    isSuccess: isSuccessReport,
  } = useGetAllReportDaily(filter);

  const debouncedSearch = useDebounceCallback((val: string) => {
    setFilter((prev) => ({
      ...prev,
      keyword: val,
      page: 1,
    }));
  }, 500);

  // Function to format number with thousand separator
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <Text fw={600}>Laporan Harian Lalin</Text>
      </Group>
      <Flex
        display={"flex"}
        direction={{ base: "column", md: "row" }}
        gap={10}
        mt={10}
        sx={{ justifyContent: "flex-end", alignItems: "center" }}
      >
        <Input
          size="sm"
          leftSection={<CiSearch size={18} />}
          onChange={(e) => {
            const val = e.target.value;
            setInputSearch(val);
            debouncedSearch(val);
          }}
          placeholder="Cari..."
          value={inputSearch}
          w={{ base: "100%", md: "auto" }}
        />
      </Flex>
      <Table.ScrollContainer
        mt={20}
        minWidth={200}
        maxHeight={"calc(100vh - 300px)"}
      >
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>No</Table.Th>
              <Table.Th>Tanggal</Table.Th>
              <Table.Th>Shift</Table.Th>
              <Table.Th>Gardu</Table.Th>
              <Table.Th>Golongan</Table.Th>
              <Table.Th>Asal Gerbang</Table.Th>
              <Table.Th>Tunai</Table.Th>
              <Table.Th>e-Mandiri</Table.Th>
              <Table.Th>e-BRI</Table.Th>
              <Table.Th>e-BNI</Table.Th>
              <Table.Th>e-BCA</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isSuccessReport &&
              dataReport?.data?.data?.rows?.rows?.length > 0 &&
              dataReport.data.data.rows.rows.map(
                (report: typeDataReportDaily, index: number) => {
                  const total =
                    report.Tunai +
                    report.eMandiri +
                    report.eBri +
                    report.eBni +
                    report.eBca +
                    report.eNobu +
                    report.eDKI +
                    report.eMega +
                    report.eFlo;

                  return (
                    <Table.Tr key={report.id}>
                      <Table.Td>
                        {(filter.page - 1) * filter.limit + index + 1}
                      </Table.Td>
                      <Table.Td>{formatDate(report.Tanggal)}</Table.Td>
                      <Table.Td>{report.Shift}</Table.Td>
                      <Table.Td>{report.IdGardu}</Table.Td>
                      <Table.Td>{report.Golongan}</Table.Td>
                      <Table.Td>{report.IdAsalGerbang}</Table.Td>
                      <Table.Td>{formatNumber(report.Tunai)}</Table.Td>
                      <Table.Td>{formatNumber(report.eMandiri)}</Table.Td>
                      <Table.Td>{formatNumber(report.eBri)}</Table.Td>
                      <Table.Td>{formatNumber(report.eBni)}</Table.Td>
                      <Table.Td>{formatNumber(report.eBca)}</Table.Td>
                      <Table.Td>
                        <Text fw={600}>{formatNumber(total)}</Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                }
              )}
            {isSuccessReport &&
              (!dataReport?.data?.data?.rows?.rows ||
                dataReport.data.data.rows.rows.length === 0) && (
                <Table.Tr>
                  <Table.Td colSpan={12} align="center" height={50}>
                    Tidak ada data ditemukan
                  </Table.Td>
                </Table.Tr>
              )}
            {isLoadingReport && (
              <Table.Tr>
                <Table.Td colSpan={12} align="center" height={50}>
                  Memuat...
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Flex mt={20} justify="space-between" px={20}>
        {isSuccessReport && (
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
        {isSuccessReport && dataReport?.data?.data?.total_pages && (
          <Pagination
            color="primary"
            onChange={(e) => {
              setFilter((prev) => ({
                ...prev,
                page: e,
              }));
            }}
            value={filter.page}
            total={dataReport.data.data.total_pages}
          />
        )}
      </Flex>
    </Box>
  );
}
