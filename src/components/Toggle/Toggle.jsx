import React from 'react';
import Style from "./Toggle.module.css";

export default function Toggle({ label }) {
  return (
    <div className={Style.Toggle}>
      <div className={Style.Toggle_switch_box}>
      <input
        type='checkbox'
        className={Style.Toggle_checkbox}
        name={label}
        id={label}
      />
      <label className={Style.Toggle_label} htmlFor={label}>
        <span className={Style.Toggle_inner}></span>
        <span className={Style.Toggle_switch}></span>
      </label>
      </div>
    </div>
  );
}
