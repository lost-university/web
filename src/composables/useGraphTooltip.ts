import { ref } from "vue";

export function useTooltip() {
  const tooltip = ref({
    visible: false,
    x: 20,
    y: 20,
    edgeId: "",
  });

  let cleanupMoveListener: (() => void) | null = null;

  function showTooltip(event: MouseEvent | TouchEvent, wrapperEl: HTMLElement, edgeId: string) {
    const target = event.target as Element;
    const badgeRect =
      target.tagName === "rect" && target.getAttribute("rx") ? target : target.closest("rect[rx]");

    if (!badgeRect) return;

    const badgeBox = (badgeRect as SVGGraphicsElement).getBoundingClientRect();
    const wrapperBox = wrapperEl.getBoundingClientRect();

    tooltip.value.x = badgeBox.left + badgeBox.width / 2 - wrapperBox.left;
    tooltip.value.y = badgeBox.top + badgeBox.height / 2 - wrapperBox.top;
    tooltip.value.visible = true;
    tooltip.value.edgeId = edgeId;

    const onMove = () => {
      hideTooltip();
      wrapperEl.removeEventListener("mousemove", onMove);
      wrapperEl.removeEventListener("touchmove", onMove);
      cleanupMoveListener = null;
    };
    wrapperEl.addEventListener("mousemove", onMove, { once: true });
    wrapperEl.addEventListener("touchmove", onMove, { once: true });

    cleanupMoveListener = () => {
      wrapperEl.removeEventListener("mousemove", onMove);
      wrapperEl.removeEventListener("touchmove", onMove);
      cleanupMoveListener = null;
    };
  }

  function hideTooltip() {
    tooltip.value.visible = false;

    if (cleanupMoveListener) {
      cleanupMoveListener();
    }
  }

  return {
    tooltip,
    showTooltip,
    hideTooltip,
  };
}
