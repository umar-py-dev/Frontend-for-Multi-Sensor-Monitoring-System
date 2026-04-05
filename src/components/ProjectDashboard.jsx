import { useState } from "react";

function Button(){

    const [isDarkMode, setDarkmode] = useState(false)

    return(
        <button 
        onClick={() => setDarkmode(!isDarkMode)} 
        className={`font-bold text-xl p-2 transition rounded-2xl ${isDarkMode ? "bg-white text-black border-2 border-black": "bg-black text-white border border-white"}`}
        >{`${isDarkMode ? "Switch to Light": "Switch to Dark"}`}</button>
    )

}

export default Button