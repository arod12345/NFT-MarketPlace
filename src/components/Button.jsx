const Button = ({text}) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded">
      {text}
    </button>
  );
};

export default Button;
