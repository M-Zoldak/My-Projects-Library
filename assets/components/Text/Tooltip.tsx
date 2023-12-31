import { PropsWithChildren } from "react";
import { Tooltip, Whisper } from "rsuite";

export function HoverTooltip({
  children,
  text,
  wrapper,
}: PropsWithChildren<{ text: string; wrapper?: "div" | "p" | "span" }>) {
  return (
    <Whisper
      placement="auto"
      controlId="control-id-hover"
      trigger="hover"
      speaker={<Tooltip>{text}</Tooltip>}
      delay={500}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
        {children}
      </div>
    </Whisper>
  );
}
