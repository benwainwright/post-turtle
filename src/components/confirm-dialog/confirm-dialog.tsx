import { Box, Text } from "ink";
import { Button } from "../button/index.js";

interface ConfirmDialogProps {
  onOk: () => void;
  onCancel: () => void;
  message: string;
}

export const ConfirmDialog = ({
  onOk,
  onCancel,
  message,
}: ConfirmDialogProps) => {
  return (
    <>
      <Box
        borderStyle="single"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        borderColor="grey"
      >
        <Text>{message}</Text>
      </Box>

      <Box justifyContent="center" gap={2}>
        <Button label="Confirm" onEnter={onOk} />
        <Button label="Cancel" onEnter={onCancel} />
      </Box>
    </>
  );
};
