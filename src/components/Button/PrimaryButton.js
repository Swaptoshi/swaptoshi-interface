import React from "react";
import "./Button.css";

export default function PrimaryButton(props) {
  let className = "primary-button-container ";
  if (props.className) className += props.className;

  return (
    <button {...props} className={className}>
      <div className="primary-button-content">{props.children}</div>
    </button>
  );
}
