import { useInput, Box, useFocus } from "ink";
import { HttpRequest } from "../../types/http-request.js";
import { RequestDetail } from "../request-detail/index.js";
import { normaliseRequest } from "../../core/normalise-request.js";

interface RequestLineProps {
  request: HttpRequest;
  onTriggerEdit?: () => void;
  onTriggerDelete?: () => void;
  onShowTriggerDialog?: (request: HttpRequest) => void;
  immediateTrigger?: boolean;
}

export const RequestLine = ({
  request: rawRequest,
  onTriggerEdit,
  onTriggerDelete,
  onShowTriggerDialog,
}: RequestLineProps) => {
  const { isFocused } = useFocus();
  const request = normaliseRequest(rawRequest);

  useInput(async (char) => {
    if (char === "d" && isFocused) {
      onTriggerDelete?.();
    }
    if (char === "e" && isFocused) {
      onTriggerEdit?.();
    }

    if (char === "t" && isFocused) {
      onShowTriggerDialog?.(rawRequest);
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      paddingX={1}
      borderColor={isFocused ? "blue" : "grey"}
    >
      <RequestDetail request={request} />
    </Box>
  );
};
