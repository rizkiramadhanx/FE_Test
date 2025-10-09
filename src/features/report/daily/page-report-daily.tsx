import useGetAllGate from "@/features/master-data/gate/hooks/useGetAllGate";
import { typeDataGate } from "@/features/master-data/gate/type";
import useGetAllReportDaily from "@/features/report/daily/hooks/useGetAllReportDaily";
import { typeDataReportDaily } from "@/features/report/daily/type";
import day from "@/libs/dayjs";
import {
  Box,
  Button,
  Flex,
  Group,
  Input,
  Pagination,
  Table,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router";
import { DatePickerInput } from "@mantine/dates";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

export default function PageReportDaily() {
  const navigate = useNavigate();

  const [inputSearch, setInputSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const { data: dataGate } = useGetAllGate({
    keyword: "",
    page: 1,
    limit: 999999,
  });

  const [filter, setFilter] = useState({
    keyword: "",
    page: 1,
    limit: 999999,
  });

  const {
    data: dataReport,
    isLoading: isLoadingReport,
    isSuccess: isSuccessReport,
  } = useGetAllReportDaily(filter);

  // Search is now handled in frontend with searchDataByName function

  // Function to format number with thousand separator
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Payment filter options
  const paymentFilterOptions = [
    { value: "tunai", label: "Total Tunai" },
    { value: "etoll", label: "Total E-Toll" },
    { value: "flo", label: "Total Flo" },
    { value: "ktp", label: "Total KTP" },
    { value: "all", label: "Total Keseluruhan" },
    { value: "etoll-tunai-flo", label: "Total E-Toll+Tunai+Flo" },
  ];

  // Function to get payment methods for a group
  const getPaymentMethods = (dataArray: typeDataReportDaily[]) => {
    const methods: string[] = [];

    // Check if any item has KTP payment
    const hasKTP = dataArray.some(
      (item) => item.DinasKary > 0 || item.DinasMitra > 0 || item.DinasOpr > 0
    );
    if (hasKTP) methods.push("KTP");

    // Check if any item has E-Toll payment
    const hasEToll = dataArray.some(
      (item) =>
        item.eBca > 0 ||
        item.eBni > 0 ||
        item.eBri > 0 ||
        item.eDKI > 0 ||
        item.eMandiri > 0 ||
        item.eMega > 0 ||
        item.eNobu > 0
    );
    if (hasEToll) methods.push("E-Toll");

    // Check if any item has Flo payment
    const hasFlo = dataArray.some((item) => item.eFlo > 0);
    if (hasFlo) methods.push("Flo");

    // Check if any item has Tunai payment
    const hasTunai = dataArray.some((item) => item.Tunai > 0);
    if (hasTunai) methods.push("Tunai");

    return methods.join(" + ");
  };

  // Function to filter data by date
  const filterDataByDate = (data: typeDataReportDaily[]) => {
    if (!valueDate) return data;

    const selectedDate = day(valueDate).format("YYYY-MM-DD");

    return data.filter((item) => {
      const itemDate = day(item.Tanggal).format("YYYY-MM-DD");
      console.log(itemDate, selectedDate);
      return itemDate === selectedDate;
    });
  };

  // Function to search data by nama ruas and nama gerbang
  const searchDataByName = (data: typeDataReportDaily[]) => {
    if (!inputSearch.trim()) return data;

    const searchTerm = inputSearch.toLowerCase().trim();

    return data.filter((item) => {
      // Get nama cabang and nama gerbang from gate data
      const namaCabang =
        dataGate?.data?.data?.rows?.rows?.find(
          (gate: typeDataGate) => gate.IdCabang === item.IdCabang
        )?.NamaCabang || "";

      const namaGerbang =
        dataGate?.data?.data?.rows?.rows?.find(
          (gate: typeDataGate) =>
            gate.IdCabang === item.IdCabang && gate.id === item.IdGerbang
        )?.NamaGerbang || "";

      // Search in nama cabang and nama gerbang
      return (
        namaCabang.toLowerCase().includes(searchTerm) ||
        namaGerbang.toLowerCase().includes(searchTerm)
      );
    });
  };

  // Function to filter data by payment method
  const filterDataByPaymentMethod = (data: typeDataReportDaily[]) => {
    if (paymentFilter === "all") return data;

    return data.filter((item) => {
      const hasTunai = item.Tunai > 0;
      const hasEToll =
        item.eMandiri > 0 ||
        item.eBri > 0 ||
        item.eBni > 0 ||
        item.eBca > 0 ||
        item.eNobu > 0 ||
        item.eDKI > 0 ||
        item.eMega > 0;
      const hasFlo = item.eFlo > 0;
      const hasKTP =
        item.DinasKary > 0 || item.DinasMitra > 0 || item.DinasOpr > 0;

      switch (paymentFilter) {
        case "tunai":
          return hasTunai;
        case "etoll":
          return hasEToll;
        case "flo":
          return hasFlo;
        case "ktp":
          return hasKTP;
        case "etoll-tunai-flo":
          return hasEToll || hasTunai || hasFlo;
        default:
          return true;
      }
    });
  };

  // Function to group data by IdCabang and IdGerbang
  const groupDataByCabangAndGerbang = (data: typeDataReportDaily[]) => {
    const grouped = data.reduce((acc, item) => {
      const key = `${item.IdCabang}-${item.IdGerbang}`;

      if (!acc[key]) {
        acc[key] = {
          IdCabang: item.IdCabang,
          IdGerbang: item.IdGerbang,
          Tanggal: item.Tanggal,
          data: [],
          totals: {
            gol1: 0,
            gol2: 0,
            gol3: 0,
            gol4: 0,
            gol5: 0,
            total: 0,
          },
        };
      }

      const total =
        item.Tunai +
        item.eMandiri +
        item.eBri +
        item.eBni +
        item.eBca +
        item.eNobu +
        item.eDKI +
        item.eMega +
        item.eFlo;

      // Add to totals based on Golongan
      if (item.Golongan === 1) acc[key].totals.gol1 += total;
      if (item.Golongan === 2) acc[key].totals.gol2 += total;
      if (item.Golongan === 3) acc[key].totals.gol3 += total;
      if (item.Golongan === 4) acc[key].totals.gol4 += total;
      if (item.Golongan === 5) acc[key].totals.gol5 += total;
      acc[key].totals.total += total;

      acc[key].data.push(item);

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    // Get current filtered and grouped data
    const currentData = groupDataByCabangAndGerbang(
      searchDataByName(
        filterDataByDate(
          filterDataByPaymentMethod(dataReport?.data?.data?.rows?.rows || [])
        )
      )
    );

    // Prepare data for Excel
    const excelData: any[] = [];

    currentData.forEach((group) => {
      const namaCabang =
        dataGate?.data?.data?.rows?.rows?.find(
          (gate: typeDataGate) => gate.IdCabang === group.IdCabang
        )?.NamaCabang || `Cabang ${group.IdCabang}`;

      const namaGerbang =
        dataGate?.data?.data?.rows?.rows?.find(
          (gate: typeDataGate) =>
            gate.IdCabang === group.IdCabang && gate.id === group.IdGerbang
        )?.NamaGerbang || `Gerbang ${group.IdGerbang}`;

      // Add group header row
      excelData.push({
        "Ruas/Cabang": namaCabang,
        Gerbang: namaGerbang,
        Gardu: group.data[0]?.IdGardu || "-",
        Tanggal: group.data[0]?.Tanggal
          ? new Date(group.data[0].Tanggal).toLocaleDateString("id-ID")
          : "-",
        "Metode Pembayaran": getPaymentMethods(group.data),
        "Gol 1": formatNumber(group.totals.gol1),
        "Gol 2": formatNumber(group.totals.gol2),
        "Gol 3": formatNumber(group.totals.gol3),
        "Gol 4": formatNumber(group.totals.gol4),
        "Gol 5": formatNumber(group.totals.gol5),
        "Total Lalin": formatNumber(group.totals.total),
      });
    });

    // Calculate totals per cabang and grand totals
    const cabangTotals: { [key: number]: any } = {};
    const grandTotals = {
      gol1: 0,
      gol2: 0,
      gol3: 0,
      gol4: 0,
      gol5: 0,
      total: 0,
    };

    currentData.forEach((group) => {
      const cabangId = group.IdCabang;

      if (!cabangTotals[cabangId]) {
        cabangTotals[cabangId] = {
          IdCabang: cabangId,
          totals: {
            gol1: 0,
            gol2: 0,
            gol3: 0,
            gol4: 0,
            gol5: 0,
            total: 0,
          },
        };
      }

      cabangTotals[cabangId].totals.gol1 += group.totals.gol1;
      cabangTotals[cabangId].totals.gol2 += group.totals.gol2;
      cabangTotals[cabangId].totals.gol3 += group.totals.gol3;
      cabangTotals[cabangId].totals.gol4 += group.totals.gol4;
      cabangTotals[cabangId].totals.gol5 += group.totals.gol5;
      cabangTotals[cabangId].totals.total += group.totals.total;

      grandTotals.gol1 += group.totals.gol1;
      grandTotals.gol2 += group.totals.gol2;
      grandTotals.gol3 += group.totals.gol3;
      grandTotals.gol4 += group.totals.gol4;
      grandTotals.gol5 += group.totals.gol5;
      grandTotals.total += group.totals.total;
    });

    // Add summary rows
    Object.values(cabangTotals).forEach((cabang: any) => {
      const namaCabang =
        dataGate?.data?.data?.rows?.rows?.find(
          (gate: any) => gate.IdCabang === cabang.IdCabang
        )?.NamaCabang || `Cabang ${cabang.IdCabang}`;

      excelData.push({
        "Ruas/Cabang": `Total Lalin ${namaCabang}`,
        Gerbang: "",
        Gardu: "",
        Tanggal: "",
        "Metode Pembayaran": "",
        "Gol 1": formatNumber(cabang.totals.gol1),
        "Gol 2": formatNumber(cabang.totals.gol2),
        "Gol 3": formatNumber(cabang.totals.gol3),
        "Gol 4": formatNumber(cabang.totals.gol4),
        "Gol 5": formatNumber(cabang.totals.gol5),
        "Total Lalin": formatNumber(cabang.totals.total),
      });
    });

    // Add grand total row
    excelData.push({
      "Ruas/Cabang": "Total Lalin Keseluruhan",
      Gerbang: "",
      Gardu: "",
      Tanggal: "",
      "Metode Pembayaran": "",
      "Gol 1": formatNumber(grandTotals.gol1),
      "Gol 2": formatNumber(grandTotals.gol2),
      "Gol 3": formatNumber(grandTotals.gol3),
      "Gol 4": formatNumber(grandTotals.gol4),
      "Gol 5": formatNumber(grandTotals.gol5),
      "Total Lalin": formatNumber(grandTotals.total),
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Harian");

    // Generate filename with current date
    const fileName = `Laporan_Harian_${day().format("YYYY-MM-DD_HHmmss")}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fileName);
  };

  const [valueDate, setValueDate] = useState<string | null>(
    day("01-11-2023").format("DD-MM-YYYY")
  );

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
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Input
          size="sm"
          leftSection={<CiSearch size={18} />}
          onChange={(e) => {
            const val = e.target.value;
            setInputSearch(val);
          }}
          placeholder="Cari berdasarkan nama ruas atau gerbang..."
          value={inputSearch}
          w={{ base: "100%", md: "auto" }}
        />
        <DatePickerInput
          placeholder="Pick date"
          valueFormat="DD-MM-YYYY"
          value={valueDate}
          onChange={setValueDate}
          w={{ base: "100%", md: "auto" }}
        />
        <Button
          variant="filled"
          color="red"
          onClick={() => {
            setValueDate(null);
            setInputSearch("");
            setPaymentFilter("all");
          }}
        >
          Reset
        </Button>
        <Button
          variant="filled"
          color="green"
          leftSection={<FaFileExcel size={18} />}
          onClick={handleExportExcel}
          disabled={
            isLoadingReport ||
            !dataReport?.data?.data?.rows?.rows ||
            dataReport.data.data.rows.rows.length === 0
          }
        >
          Export Excel
        </Button>
      </Flex>
      {/* Payment Method Filter Buttons */}
      <Group mt={20} mb={20} gap="xs">
        {paymentFilterOptions.map((option) => (
          <Button
            key={option.value}
            variant={paymentFilter === option.value ? "filled" : "light"}
            size="sm"
            onClick={() => setPaymentFilter(option.value)}
            style={{
              backgroundColor:
                paymentFilter === option.value ? "#228be6" : "#f8f9fa",
              color: paymentFilter === option.value ? "white" : "#495057",
              border: "1px solid #dee2e6",
            }}
          >
            {option.label}
          </Button>
        ))}
      </Group>

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
              groupDataByCabangAndGerbang(
                searchDataByName(
                  filterDataByDate(
                    filterDataByPaymentMethod(dataReport.data.data.rows.rows)
                  )
                )
              ).map((group: any, index: number) => {
                return (
                  <Table.Tr key={`${group.IdCabang}-${group.IdGerbang}`}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>
                      {dataGate?.data?.data?.rows?.rows?.find(
                        (item: typeDataGate) => item.IdCabang === group.IdCabang
                      )?.NamaCabang || "-"}
                    </Table.Td>
                    <Table.Td>
                      {dataGate?.data?.data?.rows?.rows?.find(
                        (item: typeDataGate) =>
                          item.IdCabang === group.IdCabang &&
                          item.id === group.IdGerbang
                      )?.NamaGerbang || "-"}
                    </Table.Td>
                    <Table.Td>{group.data[0]?.IdGardu || "-"}</Table.Td>
                    <Table.Td>{day(group.Tanggal).format("dddd")}</Table.Td>
                    <Table.Td>
                      {day(group.Tanggal).format("DD-MM-YYYY")}
                    </Table.Td>
                    <Table.Td>{getPaymentMethods(group.data)}</Table.Td>
                    <Table.Td>{formatNumber(group.totals.gol1)}</Table.Td>
                    <Table.Td>{formatNumber(group.totals.gol2)}</Table.Td>
                    <Table.Td>{formatNumber(group.totals.gol3)}</Table.Td>
                    <Table.Td>{formatNumber(group.totals.gol4)}</Table.Td>
                    <Table.Td>{formatNumber(group.totals.gol5)}</Table.Td>
                    <Table.Td>
                      <Text fw={600}>{formatNumber(group.totals.total)}</Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
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

            {/* Summary Rows */}
            {isSuccessReport &&
              dataReport?.data?.data?.rows?.rows?.length > 0 && (
                <>
                  {(() => {
                    const groupedData = groupDataByCabangAndGerbang(
                      searchDataByName(
                        filterDataByDate(
                          filterDataByPaymentMethod(
                            dataReport.data.data.rows.rows
                          )
                        )
                      )
                    );

                    // Calculate totals per cabang
                    const cabangTotals: { [key: number]: any } = {};
                    const grandTotals = {
                      gol1: 0,
                      gol2: 0,
                      gol3: 0,
                      gol4: 0,
                      gol5: 0,
                      total: 0,
                    };

                    groupedData.forEach((group) => {
                      const cabangId = group.IdCabang;

                      if (!cabangTotals[cabangId]) {
                        cabangTotals[cabangId] = {
                          IdCabang: cabangId,
                          totals: {
                            gol1: 0,
                            gol2: 0,
                            gol3: 0,
                            gol4: 0,
                            gol5: 0,
                            total: 0,
                          },
                        };
                      }

                      // Add to cabang totals
                      cabangTotals[cabangId].totals.gol1 += group.totals.gol1;
                      cabangTotals[cabangId].totals.gol2 += group.totals.gol2;
                      cabangTotals[cabangId].totals.gol3 += group.totals.gol3;
                      cabangTotals[cabangId].totals.gol4 += group.totals.gol4;
                      cabangTotals[cabangId].totals.gol5 += group.totals.gol5;
                      cabangTotals[cabangId].totals.total += group.totals.total;

                      // Add to grand totals
                      grandTotals.gol1 += group.totals.gol1;
                      grandTotals.gol2 += group.totals.gol2;
                      grandTotals.gol3 += group.totals.gol3;
                      grandTotals.gol4 += group.totals.gol4;
                      grandTotals.gol5 += group.totals.gol5;
                      grandTotals.total += group.totals.total;
                    });

                    return (
                      <>
                        {/* Summary rows for each cabang */}
                        {Object.values(cabangTotals).map((cabang: any) => {
                          const namaCabang =
                            dataGate?.data?.data?.rows?.rows?.find(
                              (gate: any) => gate.IdCabang === cabang.IdCabang
                            )?.NamaCabang || `Cabang ${cabang.IdCabang}`;

                          return (
                            <Table.Tr
                              key={`cabang-${cabang.IdCabang}`}
                              bg="gray.1"
                            >
                              <Table.Td colSpan={7} fw={600}>
                                Total Lalin {namaCabang}
                              </Table.Td>
                              <Table.Td>
                                {formatNumber(cabang.totals.gol1)}
                              </Table.Td>
                              <Table.Td>
                                {formatNumber(cabang.totals.gol2)}
                              </Table.Td>
                              <Table.Td>
                                {formatNumber(cabang.totals.gol3)}
                              </Table.Td>
                              <Table.Td>
                                {formatNumber(cabang.totals.gol4)}
                              </Table.Td>
                              <Table.Td>
                                {formatNumber(cabang.totals.gol5)}
                              </Table.Td>
                              <Table.Td fw={600}>
                                {formatNumber(cabang.totals.total)}
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}

                        {/* Grand total row */}
                        <Table.Tr bg="gray.3">
                          <Table.Td colSpan={7} fw={600}>
                            Total Lalin Keseluruhan
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.gol1)}
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.gol2)}
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.gol3)}
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.gol4)}
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.gol5)}
                          </Table.Td>
                          <Table.Td fw={600}>
                            {formatNumber(grandTotals.total)}
                          </Table.Td>
                        </Table.Tr>
                      </>
                    );
                  })()}
                </>
              )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Flex mt={20} justify="flex-end" px={20}>
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
