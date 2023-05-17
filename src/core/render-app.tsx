export const renderApp = async () => {
  const { render } = await import("ink");
  const { App } = await import("../components/app/index.js");
  render(<App />);
};
