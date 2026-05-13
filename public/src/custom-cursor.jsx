// NAFE — Custom Cursor Component
// Renders a simple dot for a premium gaming feel.

function CustomCursor() {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
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
        target.closest(".nafe-hero__tweetCard") ||
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

  // Don't show on touch devices
  const [isTouch, setIsTouch] = React.useState(false);
  React.useEffect(() => {
    if ('ontouchstart' in window) setIsTouch(true);
  }, []);

  if (isTouch) return null;

  return (
    <div 
      className={`nafe-cursor ${isHovering ? 'is-hovering' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

window.CustomCursor = CustomCursor;
