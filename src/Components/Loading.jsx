import { InfinitySpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div>
      <InfinitySpin
        height="200"
        width="200"
        radius="9"
        color="#3b82f6"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </div>
  );
};

export default Loading;