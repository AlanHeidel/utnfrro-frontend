import "./CloseButton.css";

export function CloseButton({ isOpen, toggle }) {
  return (
    <>
      <button
        className={`close-button ${isOpen ? "open" : ""}`}
        onClick={toggle}
      >
        <span className="X"></span>
        <span className="Y"></span>
      </button>
    </>
  );
}
