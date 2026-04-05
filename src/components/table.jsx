const Table = (props) => {
    return (
        <>
            <table className="min-w-full w-auto scroll-auto bg-white whitespace-nowrap border-b">

                <thead className=" bg-blue-200 ">
                    <tr>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col1}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col2}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col3}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col4}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col5}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col6}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col7}</th>
                        <th className="px-3 py-3 text-left font-bold text-sm">{props.col8}</th>



                    </tr>
                </thead>


                <tbody className="divide-y divide-black">
                    {sensors.map((sensor) => {
                        return (
                            <tr key={sensor.id} className="hover:bg-gray-100">
                                <td className="py-3 px-4 ">{sensor.id}</td>
                                <td className="py-3 px-4 font-medium capitalize">{sensor.sensor_type}</td>
                                <td className="py-3 px-4 ">{sensor.status == 'active' ? (
                                    <span className="bg-green-100 text-green-700 text-sm font-bold p-2 rounded-xl ">• Active</span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 text-sm font-bold p-2 rounded-xl">• Inctive</span>
                                )}</td>

                                <td className="py-3 px-4 ">{`${Math.trunc(sensor.threshold_min_value)} - ${Math.trunc(sensor.threshold_max_value)} `}</td>
                                <td className="py-3 px-4 ">{sensor.unit}</td>
                                <td className="py-3 px-4">{new Date(sensor.created_at).toLocaleDateString()}</td>

                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </>
    )
}

export default Table