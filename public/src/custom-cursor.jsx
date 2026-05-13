// NAFE — Custom Cursor Component
// Renders a dot and a lagging ring for a premium gaming feel.

function CustomCursor() {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = React.useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onHover = (e) => {
      const target = e.target;
      const isClickable = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest(".nafe-hero__matchCard") ||
        target.closest(".nafe-news__card") ||
        target.closest(".nafe-clip-card") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA";
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onHover);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onHover);
    };
  }, []);

  // Lagging ring effect
  React.useEffect(() => {
    let frame;
    const updateRing = () => {
      setRingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15
      }));
      frame = requestAnimationFrame(updateRing);
    };
    frame = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(frame);
  }, [pos]);

  // Don't show on touch devices
  const [isTouch, setIsTouch] = React.useState(false);
  React.useEffect(() => {
    if ('ontouchstart' in window) setIsTouch(true);
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div 
        className={`nafe-cursor ${isHovering ? 'is-hovering' : ''}`}
        style={{ left: pos.x, top: pos.y }}
      />
      <div 
        className={`nafe-cursor-ring ${isHovering ? 'is-hovering' : ''}`}
        style={{ left: ringPos.x, top: ringPos.y }}
      />
    </>
  );
}

window.CustomCursor = CustomCursor;
