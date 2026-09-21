import { useRef, useLayoutEffect, useState, type CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export default function Marquee({
  text,
  className = "",
  style,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prevText = useRef(text);
  const [scrolling, setScrolling] = useState(false);
  const dur = `${Math.max(4, text.length * 0.22)}s`;

  // After every render: reset on text change, then measure for overflow
  useLayoutEffect(() => {
    if (prevText.current !== text) {
      prevText.current = text;
      setScrolling(false);
      return;
    }
    if (
      !scrolling &&
      ref.current &&
      ref.current.scrollWidth > ref.current.clientWidth + 1
    )
      setScrolling(true);
  });

  return scrolling ? (
    <div
      className={`marquee-wrap ${className}`}
      style={{ "--marquee-duration": dur, ...style } as CSSProperties}
      onClick={onClick}
    >
      <div className="marquee-inner">
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  ) : (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...style,
      }}
    >
      {text}
    </div>
  );
}
