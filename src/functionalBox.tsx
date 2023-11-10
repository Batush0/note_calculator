import React from "react";

type Props = {
  Icon: string;
  onClick: () => void;
};

const FunctionalBox = ({ Icon, onClick }: Props) => {
  return (
    <div
      className="functional_box-wrapper"
      onClick={() => onClick()}
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <img src={Icon} />
    </div>
  );
};

export default FunctionalBox;
