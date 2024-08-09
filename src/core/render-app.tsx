export const renderApp = async () => {
  const { render } = await import("ink");
  const { AppWindow } = await import("../components/app-window/app-window.js");
  render(<AppWindow />);
};
