import React, { useReducer, useState } from "react";
import "./App.css";
// import Greeting from "./greeting";
import InputFunction, { InputType } from "./inputFunction";
import FunctionalBox from "./functionalBox";
import Person, { PersonData } from "./person";

import add_icon from "./assets/plus-icon.svg";
import reset_icon from "./assets/reset-icon.svg";
import delete_icon from "./assets/delete-list-icon.svg";
import excel_icon from "./assets/excel-icon.svg";
import txt_icon from "./assets/txt-icon.svg";
import trash_icon from "./assets/trash-icon.svg";
import pen_icon from "./assets/pen-icon.svg";
import math_operations_logo from "./assets/math-operations-logo.svg";

import * as XLSX from "xlsx";

type DraftType =
  | "set-name"
  | "set-no"
  | "set-main_note"
  | "set-mini_first"
  | "set-mini_second"
  | "change-discard-statue";
type DraftAction = { type: DraftType; value: any } | { type: "clear-draft" };
type Draft = {
  name?: string;
  no?: number;
  discardInfo?: boolean;
  mainNote?: number;
  miniNoteNo1?: number;
  miniNoteNo2?: number;
  calculation?: number;
};
function draftReducer(state: Draft, action: DraftAction): Draft {
  switch (action.type) {
    case "change-discard-statue":
      return { ...state, discardInfo: action.value };
    case "set-main_note":
      return {
        ...state,
        mainNote: action.value,
        calculation:
          Number(action.value) * 0.7 +
          Number(state.miniNoteNo1) * 0.15 +
          Number(state.miniNoteNo2) * 0.15,
      };
    case "set-mini_first":
      return {
        ...state,
        miniNoteNo1: action.value,
        calculation:
          Number(state.mainNote) * 0.7 +
          Number(action.value) * 0.15 +
          Number(state.miniNoteNo2) * 0.15,
      };
    case "set-mini_second":
      return {
        ...state,
        miniNoteNo2: action.value,
        calculation:
          Number(state.mainNote) * 0.7 +
          Number(state.miniNoteNo1) * 0.15 +
          Number(action.value) * 0.15,
      };
    case "set-name":
      return { ...state, name: action.value };
    case "set-no":
      return { ...state, no: Number(action.value) };
    case "clear-draft": {
      return { discardInfo: state.discardInfo };
    }
  }

  return state;
}

function App() {
  const [draft, draftDispatch] = useReducer(draftReducer, {});
  const [saves, setSaves] = useState<PersonData[]>([]);

  function handleChangeValue(type: DraftType, value: any) {
    draftDispatch({ type, value });
  }

  function handleSaveDraft() {
    if (draft.mainNote === undefined) return alert("ana not boş olmamalı");
    if (draft.miniNoteNo1 === undefined)
      return alert("mini not(1) boş olmamalı");
    if (draft.miniNoteNo2 === undefined)
      return alert("mini not(2) boş olmamalı");
    if (!draft.discardInfo && (!draft.name || !draft.no))
      return alert("kişisel bilgiler boş olmamalı");
    if (saves.filter((save) => save.no === draft.no).length > 0)
      return alert("kayıtlı numarayı tekrar ekleyemezsin");
    setSaves((prev) => {
      let { name, calculation, no } = draft;
      prev.unshift({
        name: name || "",
        score: Number(calculation?.toFixed(1)),
        no: no || NaN,
      });
      handleResetDraft();
      return prev;
    });
  }
  const handleResetDraft = () => draftDispatch({ type: "clear-draft" });

  function handleClearTable() {
    if (window.confirm("Bütün kayıtlar silinecek !") == true) {
      setSaves([]);
    }
  }
  function handleExport(as: "excel" | "txt") {
    switch (as) {
      case "excel": {
        const workbook = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
          ["İsim", "No", "Puan"],
          ...saves.map((item) => [item.name, item.no || "", item.score]),
        ]);
        XLSX.utils.book_append_sheet(workbook, ws, "Sheet 1");
        XLSX.writeFile(workbook, `${new Date().toLocaleString()} notlar.xlsx`);
      }
      case "txt": {
        const saveData = saves.map(
          (item) => `${item.no || ""} ${item.name} ${item.score}`
        );
        const saveText = saveData.join("\n");

        const blob = new Blob([saveText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "saves.txt";
        a.click();
      }
    }
  }
  function handleDeleteRow(toggle: boolean) {
    setSaves((prev) => prev.filter((save) => !save.selected));
  }
  // function handleEditRow() {}

  return (
    <div id="app">
      <img id="bg" src={require("./assets/bg-surface.png")} />
      {/* <div>greeting part</div> */}
      <nav>
        {/* <img src={math_operations_logo} /> */}
        <img src={math_operations_logo} alt="not hesaplama logo öğretmen" />
        <h1>Yeni Nesil Not Hesaplama</h1>
      </nav>
      {/* <div>ads</div> */}
      <div id="calculator-container">
        <div id="functions-container">
          <div className="function-wrapper">
            <InputFunction
              title="İsim / Soyisim"
              type={InputType.text}
              value={draft.name || ""}
              onChange={(event) =>
                handleChangeValue("set-name", event.target.value)
              }
              key={"student-name"}
            />
            <InputFunction
              title="Numara"
              type={InputType.numeric}
              value={String(draft.no)}
              onChange={(event) =>
                handleChangeValue("set-no", event.target.value)
              }
              key={"student-no"}
            />
            <div id="discard-info-wrapper">
              <input
                id="discard-info"
                type="checkbox"
                onChange={(event) =>
                  handleChangeValue(
                    "change-discard-statue",
                    event.target.checked
                  )
                }
                checked={draft.discardInfo}
              />
              <p>Kişisel bilgilerin bütünlüğünü göz ardı et.</p>
            </div>
          </div>
          <div className="function-wrapper">
            <InputFunction
              title="Ana not(70%)"
              type={InputType.numeric}
              value={String(draft.mainNote)}
              onChange={(event) => {
                let value = Number(event.target.value);
                if (value <= 100 && value >= 0)
                  handleChangeValue("set-main_note", value);
              }}
              key={"main-percentage"}
            />
            <InputFunction
              title="Mini 1(15%)"
              type={InputType.numeric}
              value={String(draft.miniNoteNo1)}
              onChange={(event) => {
                let value = Number(event.target.value);
                if (value <= 100 && value >= 0)
                  handleChangeValue("set-mini_first", value);
              }}
              key={"mini-percentage-1"}
            />
            <InputFunction
              title="Mini 2(15%)"
              type={InputType.numeric}
              value={String(draft.miniNoteNo2)}
              onChange={(event) => {
                let value = Number(event.target.value);
                if (value <= 100 && value >= 0)
                  handleChangeValue("set-mini_second", value);
              }}
              key={"mini-percentage-2"}
            />
            <div id="calculated-result-wrapper">
              <h4>Hesaplama</h4>
              <p>{Number(draft.calculation?.toFixed(1)) || "-"}</p>
            </div>
          </div>

          <div className="function-wrapper">
            <FunctionalBox
              Icon={add_icon}
              onClick={handleSaveDraft}
              key={"add"}
            />
            <FunctionalBox
              Icon={reset_icon}
              onClick={handleResetDraft}
              key={"reset"}
            />
            <div className="bracket" />
            <FunctionalBox
              Icon={delete_icon}
              onClick={handleClearTable}
              key={"delete-list"}
            />
            <div className="bracket" />
            <FunctionalBox
              Icon={excel_icon}
              onClick={() => handleExport("excel")}
              key={"export-as-excel"}
            />
            <FunctionalBox
              Icon={txt_icon}
              onClick={() => handleExport("txt")}
              key={"export-as-txt"}
            />
            <div className="bracket" />
            <FunctionalBox
              Icon={trash_icon}
              onClick={() => handleDeleteRow(true)}
              key={"delete-element"}
            />
          </div>
        </div>
        <div id="list">
          <div className="section header">
            <p id="no">Numara</p>
            <p id="name">İsim/Soyisim</p>
            <p id="score">Not</p>
          </div>
          {saves.map((_data, index) => (
            <Person
              data={_data}
              onChange={(checked) => {
                setSaves((prev) => {
                  prev[
                    prev.findIndex((save) => save.no === _data.no)
                  ].selected = checked;
                  return prev;
                });
              }}
            />
          ))}
        </div>
      </div>
      <h4 id="by-me">by Batush</h4>
    </div>
  );
}

export default App;
