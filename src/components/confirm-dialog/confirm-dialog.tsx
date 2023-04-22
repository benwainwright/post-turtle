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
    <Box borderStyle="single" flexDirection="column">
      <Text>{message}</Text>
      <Box marginTop={1}>
        <Button label="Confirm" onEnter={onOk} />
        <Button label="Cancel" onEnter={onCancel} />
      </Box>
    </Box>
  );
};
