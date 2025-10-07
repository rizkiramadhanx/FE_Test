import { Button, Group, Modal, Stack, Text, Box } from "@mantine/core";
import { MdOutlineClose } from "react-icons/md";
import { typeDataGate } from "@/features/master-data/gate/type";

export default function ModalDetailGate({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: typeDataGate | null;
}) {
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Detail Gerbang"
      size="lg"
      centered
      withCloseButton
      closeButtonProps={{ icon: <MdOutlineClose /> }}
    >
      <Stack gap={15}>
        <Box>
          <Text size="sm" fw={600} c="dimmed" mb={5}>
            ID
          </Text>
          <Text size="md">{data?.id || "-"}</Text>
        </Box>

        <Box>
          <Text size="sm" fw={600} c="dimmed" mb={5}>
            ID Ruas
          </Text>
          <Text size="md">{data?.IdCabang || "-"}</Text>
        </Box>

        <Box>
          <Text size="sm" fw={600} c="dimmed" mb={5}>
            Nama Ruas
          </Text>
          <Text size="md">{data?.NamaCabang || "-"}</Text>
        </Box>

        <Box>
          <Text size="sm" fw={600} c="dimmed" mb={5}>
            Nama Gerbang
          </Text>
          <Text size="md">{data?.NamaGerbang || "-"}</Text>
        </Box>
      </Stack>

      <Group justify="end" mt="xl">
        <Button variant="outline" color="gray" onClick={onClose}>
          Tutup
        </Button>
      </Group>
    </Modal>
  );
}
