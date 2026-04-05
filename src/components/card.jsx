import React from "react";

const colorMap = {
  blue: "border-blue-400 bg-blue-100",
  green: " border-green-400 bg-green-100",
  orange: " border-orange-400 bg-orange-100",
  red: "border-red-400 bg-red-100",
  yellow: "border-yellow-400 bg-yellow-100"
};


const Card = ({name, num, color}) => {

    return(
        <>
        
        <div className={`border  ${colorMap[color]} border-solid rounded-xl shadow-md p-3 m-1 text-left min-w-max w-auto inline-block`}>
            
            <h2 className={`font-bold text-xl rounded-2xl text-${color}-700 uppercase`}>{(name)}</h2>
            <p className="pl-2 text-3xl font-extrabold">{num}</p>
            



        </div>
        </>
    )

}

export default Card