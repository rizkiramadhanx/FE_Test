import useGetAllReportDaily from "@/features/report/daily/hooks/useGetAllReportDaily";
import { typeDataReportDaily } from "@/features/report/daily/type";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import day from "@/libs/dayjs";
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

  const { data: AllDataCount } = useGetAllReportDaily({
    limit: 999999,
    page: 1,
  });

  const [filter, setFilter] = useState({
    keyword: "",
    page: 1,
    limit: 25,
  });

  const {
    data: dataReport,
    isLoading: isLoadingReport,
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
    return day(dateString).format("DD MMMM YYYY");
  };

  // Function to get day name
  const getDayName = (dateString: string) => {
    return day(dateString).format("dddd");
  };

  // Function to get payment method clusters
  const getPaymentMethodClusters = (report: typeDataReportDaily) => {
    const clusters: string[] = [];

    // Check KTP cluster
    if (report.DinasKary > 0 || report.DinasMitra > 0 || report.DinasOpr > 0) {
      clusters.push("KTP");
    }

    // Check E-Toll cluster
    if (
      report.eBca > 0 ||
      report.eBni > 0 ||
      report.eBri > 0 ||
      report.eDKI > 0 ||
      report.eMandiri > 0 ||
      report.eMega > 0 ||
      report.eNobu > 0
    ) {
      clusters.push("E-Toll");
    }

    // Check Flo cluster
    if (report.eFlo > 0) {
      clusters.push("Flo");
    }

    // Check Tunai cluster
    if (report.Tunai > 0) {
      clusters.push("Tunai");
    }

    return clusters.join(" + ");
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
              <Table.Th>No.</Table.Th>
              <Table.Th>Ruas</Table.Th>
              <Table.Th>Gerbang</Table.Th>
              <Table.Th>Gardu</Table.Th>
              <Table.Th>Hari</Table.Th>
              <Table.Th>Tanggal</Table.Th>
              <Table.Th>Metode Pembayaran</Table.Th>
              <Table.Th>Gol I</Table.Th>
              <Table.Th>Gol II</Table.Th>
              <Table.Th>Gol III</Table.Th>
              <Table.Th>Gol IV</Table.Th>
              <Table.Th>Gol V</Table.Th>
              <Table.Th>Total Lalin</Table.Th>
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
                      <Table.Td>Ruas {report.IdCabang}</Table.Td>
                      <Table.Td>Gerbang {report.IdGerbang}</Table.Td>
                      <Table.Td>Gardu {report.IdGardu}</Table.Td>
                      <Table.Td>{getDayName(report.Tanggal)}</Table.Td>
                      <Table.Td>{formatDate(report.Tanggal)}</Table.Td>
                      <Table.Td>{getPaymentMethodClusters(report)}</Table.Td>
                      <Table.Td>
                        {report.Golongan === 1 ? formatNumber(total) : 0}
                      </Table.Td>
                      <Table.Td>
                        {report.Golongan === 2 ? formatNumber(total) : 0}
                      </Table.Td>
                      <Table.Td>
                        {report.Golongan === 3 ? formatNumber(total) : 0}
                      </Table.Td>
                      <Table.Td>
                        {report.Golongan === 4 ? formatNumber(total) : 0}
                      </Table.Td>
                      <Table.Td>
                        {report.Golongan === 5 ? formatNumber(total) : 0}
                      </Table.Td>
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
                  <Table.Td colSpan={13} align="center" height={50}>
                    Tidak ada data ditemukan
                  </Table.Td>
                </Table.Tr>
              )}
            {isLoadingReport && (
              <Table.Tr>
                <Table.Td colSpan={13} align="center" height={50}>
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
