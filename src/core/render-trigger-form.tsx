import { HttpRequest } from "../types/http-request.js";

export const renderTriggerForm = async (request: HttpRequest) => {
  const { render } = await import("ink");
  const { TriggerForm } = await import("../components/trigger-form/index.js");
  render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <TriggerForm request={request} nonInteractive onClose={() => {}} />
  );
};
