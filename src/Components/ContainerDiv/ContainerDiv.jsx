// ContainerDiv.jsx
const ContainerDiv = ({ children }) => {
  return (
    <div className="flex justify-center items-center relative min-h-screen p-5 bg-green-100 sm:p-10 font-inter">
      {children}
    </div>
  );
};

export default ContainerDiv;