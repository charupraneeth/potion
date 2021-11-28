function Title() {
  return (
    <div
      className="todos-title editable"
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      contentEditable="true"
      suppressContentEditableWarning={true}
    >
      This is Title
    </div>
  );
}

export default Title;
