"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const ScrollableBody = (props: React.PropsWithChildren) => {
  return (
    <OverlayScrollbarsComponent
      element="body"
      options={{
        scrollbars: {
          autoHide: "leave",
        },
      }}
      className="antialiased"
    >
      {props.children}
    </OverlayScrollbarsComponent>
  );
};

export default ScrollableBody;
