const Spinner=({text})=>{
  return(
    <div className="w-[24rem] h-[24rem] text-center flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="mb-4 text-gray-600">{text}</p>
              </div>
  )
}

export default Spinner;