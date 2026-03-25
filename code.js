(() => {
  // src/code.js
  figma.showUI(__html__, { width: 340, height: 500 });
  function updateSelection() {
    figma.ui.postMessage({
      type: "selection-changed",
      payload: { count: figma.currentPage.selection.length }
    });
  }
  figma.on("selectionchange", () => {
    updateSelection();
  });
  setTimeout(() => {
    updateSelection();
  }, 100);
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "request-preview") {
      const selection = figma.currentPage.selection;
      if (selection.length === 0)
        return;
      const images = [];
      for (const node of selection) {
        try {
          const data = await node.exportAsync({
            format: msg.format,
            constraint: { type: "SCALE", value: msg.scale || 2 }
          });
          images.push({
            id: node.id,
            name: node.name,
            data
          });
        } catch (e) {
          console.error(e);
        }
      }
      figma.ui.postMessage({
        type: "preview-data",
        payload: { images }
      });
    }
  };
})();
