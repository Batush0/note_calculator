import React from "react";

export type PersonData = {
  no: number;
  name: string;
  score: number;
  selected?: boolean;
};

type Props = {
  data: PersonData;
  onChange: (checked: boolean) => void;
};

const Person = ({ data, onChange }: Props) => {
  return (
    <div className="section" key={data.no}>
      <input
        type="checkbox"
        checked={data.selected}
        onChange={(event) => onChange(event.target.checked)}
      />
      <p id="no">{Number(data.no) || ""}</p>
      <p id="name">{String(data.name)}</p>
      <p id="score">{Number(data.score)}</p>
    </div>
  );
};

export default Person;
