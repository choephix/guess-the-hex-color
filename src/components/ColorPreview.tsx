type ColorPreviewProps = {
  colorCode: string;
};

export const ColorPreview = ({ colorCode }: ColorPreviewProps) => {
  return (
    <div class='color-square' style={{ backgroundColor: `#${colorCode}` }}></div>
    // <div
    //   style={{
    //     backgroundColor: color,
    //     width: "100%",
    //     height: "100%",
    //     borderRadius: "10px",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //   }}
    // >
    //   {color}
    // </div>
  );
};
