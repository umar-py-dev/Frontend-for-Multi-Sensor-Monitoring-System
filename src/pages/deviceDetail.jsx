import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingService } from "../services/loadingService";
import { ErrorService } from "../services/errorService";
import { getDeviceDetails, getDeviceSensors, getSensorData, getSensorDetails, getDeviceAlerts } from "../services/api";

import Card from "../components/card";
import Graph from "../components/graph";
import BackButton from "../components/backButton";




const DeviceDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const handleLoading = LoadingService()
    const handleError = ErrorService()

    const [device, setDevice] = useState(null)
    const [deviceAlerts, setDeviceAlerts] = useState(null)
    const [sensors, setSensors] = useState([])
    const [sensorDetails, setSensorDetails] = useState(null)
    const [pageLoading, setPageLoading] = useState(true)

    const [selectedSensor, setSelectedSensor] = useState(null)
    const [graphData, setGraphData] = useState([])
    const [graphLoading, setGraphLoading] = useState(true)

    const fetchDevice = async () => {

        try {
            const device_data = await getDeviceDetails(id)
            setDevice(device_data[0])

            const sensors_data = await getDeviceSensors(id)
            setSensors(sensors_data)

            const fDevAlerts = await getDeviceAlerts(id)
            console.log(fDevAlerts)
            setDeviceAlerts(fDevAlerts)

            if (sensors_data.length > 0) {
                try {
                    setSelectedSensor(sensors_data[0].id)
                } catch (error) {
                    console.log(error)
                }
            }

        } catch (error) {
            setDevice('err')
            setSensors('err')
            console.log("ERROR: " + error)

        } finally { setPageLoading(false) }
    }

    useEffect(() => {
        fetchDevice()

    }, [id, navigate])





    const devType = (pageLoading || !device) ? handleLoading : (device === 'err' ? handleError : device.device_type_id)
    const devName = (pageLoading || !device) ? handleLoading : (device === 'err' ? handleError : device.name)
    const devLocation = (pageLoading || !device) ? handleLoading : (device === 'err' ? handleError : device.location)
    const devStatus = (pageLoading || !device) ? handleLoading : (device === 'err' ? handleError : device.status)
    const devAlerts = (pageLoading || !device) ? handleLoading : (device === 'err' ? handleError : deviceAlerts.critical_last7days)
    const totalSensors = (pageLoading || !sensors) ? handleLoading : (sensors === 'err' ? handleError : sensors.length)


    const fetchGraphData = async (showLoading = true) => {
        if (showLoading) setGraphLoading(true)
        try {
            //                                 device id , sensor id
            const fGraphData = await getSensorData(id, selectedSensor)
            if (fGraphData && fGraphData.results) {
                setGraphData(fGraphData.results)
            }
            else {
                setGraphData([])
            }

            //sensor details to get the maxthreshold and min threshold
            const fSensorDetails = await getSensorDetails(id, selectedSensor)
            console.log("fetcched Sensor detailsf: ", fSensorDetails)
            if (fSensorDetails) {
                setSensorDetails(fSensorDetails[0])
            } else {
                setSensorDetails([])
            }

        } catch (error) {
            setGraphData('err')
            setSensorDetails('err')
            console.log(error)

        } finally {
            if (showLoading) setGraphLoading(false)
        }
    }

    useEffect(() => {
        // return if we have both device id and selected sensor already; 
        if (!id || !selectedSensor) return
        fetchGraphData(true)

        const intervalId = setInterval(() => {
            fetchGraphData(false);
        }, 2000);
        return () => clearInterval(intervalId);

    }, [id, selectedSensor])





    return (
        <>
            <title>Device Details</title>
            <div className="m-5">
                <BackButton to='/Dashboard'></BackButton>

                <div className="mt-4 ml-2 mr-2 flex items-center whitespace-nowrap">
                    <h1 className="font-extrabold text-3xl underline">{devName}</h1>
                    <span>
                        <p className={`font-bold border rounded-2xl p-1 ml-10  ${devStatus == "active" ? "border-green-700 bg-green-300 text-green-700" : "border-red-700 bg-red-300 text-red-700"}`}>{devStatus == "active" ? "• Active" : "• Inactive"}</p>
                    </span>
                </div>


                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card name='device id' num={id + ': ' + devType} color='green' />
                    <Card name='total sensors' num={totalSensors} color='green' />
                    <Card name='Location' num={devLocation} color='green' />                  
                    <Card name="Critical Alerts (7 Days)" num={devAlerts} color={devAlerts == 0 ? 'green' : 'red'} />               

                </div>


                {/* Chart SECTION :::::::::;; */}

                <div className="mt-5 ">
                    <div className="border-b flex items-center">
                        <h2 className="text-2xl font-bold text-gray-800 pb-2.5">Sensors Analytics</h2>
                        <select name="sensors_dropdown"
                            onChange={(e) => setSelectedSensor(e.target.value)}
                            className="ml-10 rounded font-bold capitalize bg-green-200 p-1.5"
                        >
                            {sensors !== 'err' && sensors && sensors.length > 0 ? (
                                sensors.map((sens) => (
                                    <option key={sens.id} value={sens.id} >
                                        {sens.id}: {sens.sensor_type}
                                    </option>
                                ))
                            ) : (

                                <option disabled>No sensors found</option>
                            )
                            }
                        </select>

                    </div>


                    {graphLoading ? (
                        // if Loading
                        <div>{handleLoading}</div>

                    ) : graphData === 'err' ? (
                        // Check for Error 
                        <div className=" flex flex-col items-center">
                            <span>Error loading graph data</span>

                        </div>
                    ) : (
                        //  render the Graph
                        <Graph
                            data={graphData}
                            XAxis={"created_at"}
                            YAxis={"value"}
                            maxRefrence={sensorDetails ? sensorDetails.threshold_max_value : null}
                            minRefrence={sensorDetails ? sensorDetails.threshold_min_value : null}
                        />
                    )
                    }


                </div>


                {/* Sensors list::::::::: */}
                <h1 className="mt-5 text-xl font-bold text-gray-800 mb-4 border-b pb-2">Sensors List</h1>

                <div className="mt-5 overflow-x-auto ">

                    {(!pageLoading && sensors && sensors !== 'err' && sensors.length > 0) ? (
                        <table className="min-w-full w-auto scroll-auto bg-white whitespace-nowrap border-b">

                            <thead className=" bg-blue-200 ">
                                <tr>
                                    <th className="px-3 py-3 text-left font-bold text-sm">ID</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Type</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Status</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Timeout</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Threshold</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Unit</th>
                                    <th className="px-3 py-3 text-left font-bold text-sm">Created</th>



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
                                                <span className="bg-red-100 text-red-700 text-sm font-bold p-2 rounded-xl">• Inactive</span>
                                            )}</td>
                                            <td className="py-3 px-4 ">{(sensor.active_timeout / 60).toFixed(1)} mins</td>

                                            <td className="py-3 px-4 ">{`${Math.trunc(sensor.threshold_min_value)} - ${Math.trunc(sensor.threshold_max_value)} `}</td>
                                            <td className="py-3 px-4 ">{sensor.unit}</td>
                                            <td className="py-3 px-4">{new Date(sensor.created_at).toLocaleDateString()}</td>

                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>

                    ) : (
                        <div className="flex justify-center p-5">
                            {pageLoading ? handleLoading : "Error"}
                        </div>
                    )

                    }


                </div>

            </div>

        </>
    )
}

export default DeviceDetails