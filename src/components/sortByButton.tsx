import React, { useState } from "react";
import "../styles/styles.css";
//sort button for comment section using a union type to restrict only to newest or top
interface SortByButtonProps {
  onChange: (criteria: "newest" | "top") => void;
}

const SortByButton: React.FC<SortByButtonProps> = ({ onChange }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="dropdown">
      <button onClick={() => setShowOptions(!showOptions)} className="dropbtn">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "8px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z"></path>
            </svg>
          </div>
          Sort By
        </div>
      </button>
      {showOptions && (
        <div className="dropdown-content">
          <div onClick={() => onChange("top")}>Top Comments</div>
          <div onClick={() => onChange("newest")}>Newest</div>
        </div>
      )}
    </div>
  );
};

export default SortByButton;
