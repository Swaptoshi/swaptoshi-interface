import React from "react";
import { tokenToColorHex } from "../../utils/Color/tokenToColor";

export default function TokenAvatar({ size, style, src, tokenId }) {
  const [loaded, setIsLoaded] = React.useState(false);

  const onLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      style={{
        borderRadius: size,
        height: size,
        width: size,
        overflow: "hidden",
        ...style,
      }}
    >
      <img
        alt={"logo"}
        src={src}
        style={{
          height: "100%",
          width: "100%",
          display: loaded ? undefined : "none",
        }}
        onLoad={onLoad}
      />
      {!loaded && (
        <div
          style={{
            backgroundColor: `#${tokenToColorHex(tokenId)}`,
            height: "100%",
            width: "100%",
          }}
        />
      )}
    </div>
  );
}
