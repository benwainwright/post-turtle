import { Box, Text } from "ink";
import { App } from "../app/app.js";

export const AppWindow = () => {
  return (
    <Box flexDirection="column">
      <Box justifyContent="center">
        <Text bold>Post Turtle</Text>
      </Box>
      <Box
        borderStyle="double"
        flexDirection="column"
        paddingX={3}
        paddingY={1}
      >
        <App />
      </Box>
    </Box>
  );
};
