import React from "react";

function CustomDropdown({
  selectedOption,
  toggleDropdown,
  isOpen,
  optionsLabel,
  handleOptionClick,
}) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        toggleDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, ref, toggleDropdown]);

  return (
    <div className="custom-dropdown" ref={ref}>
      <div className="selected-option hover-shadow" onClick={toggleDropdown}>
        <img src={selectedOption.imgSrc} alt={selectedOption.value} />
        <div style={{ width: "8px" }} />
        <span className="hide-1024">{selectedOption.label}</span>
        <span className="dropdown">
          <i className="nav-dropdown ri-arrow-down-s-line"></i>
        </span>
      </div>
      {isOpen && (
        <ul className="options">
          {optionsLabel.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              <div className="options-name">
                <img src={option.imgSrc} alt={option.label} />
                <span>{option.label}</span>
              </div>
              <div>
                {selectedOption.value === option.value && (
                  <i className="tick-icon ri-check-line"></i>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropdown;
