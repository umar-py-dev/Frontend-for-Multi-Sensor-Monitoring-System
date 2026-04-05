import { useNavigate } from "react-router-dom"

const GoToCard = (props) => {

    const navigate = useNavigate()

    return(
        <>
        <div className="rounded-2xl bg-blue-200 min-w-full w-auto flex items-center justify-between p-3 whitespace-nowrap">

            <h1 className="text-2xl font-bold ">{props.heading}</h1>
            <button onClick={() => navigate(props.to)} className="p-2 rounded bg-blue-500 text-xl font-bold  hover:cursor-pointer hover:bg-blue-700">See &#8663;</button>

        </div>
        
        </>
    )
}

export default GoToCard