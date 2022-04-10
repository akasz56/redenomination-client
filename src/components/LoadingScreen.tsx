import ReactLoading from "react-loading";

export default function LoadingScreen(props: any) {
  return (
    <ReactLoading
      type="spin"
      color="#000"
      height={"5em"}
      width={"5em"}
      {...props}
    />
  );
}
