import { useNavigate } from "react-router-dom"



const BackButton = (props) => {
    
    const navigate = useNavigate()

    return(
    <button
        onClick={() => navigate(props.to)} className="text-blue-800 underline font-bold hover:cursor-pointer">
        &larr; GO BACK
    </button>

    )

}

export default BackButton