import { useState, useEffect } from "react"
import { getDevices, getDeviceSensors } from "../services/api"

import BackButton from "../components/backButton"
import Graph from "../components/graph"
import { LoadingService } from "../services/loadingService"
import { getFilteredData, getSensorDetails } from "../services/api"



const Reports = () => {

    const [reportsData, setReportsData] = useState([])
    const [reportsLoading, setReportsLoading] = useState(false)
    const [reportsError, setReportsError] = useState(false)

    const [deviceList, setDeviceList] = useState([])
    const [deviceLoading, setDeviceLoading] = useState(true)
    const [deviceError, setDeviceError] = useState(false)

    const [sensorList, setSensorList] = useState([])
    const [sensorLoading, setSensorLoading] = useState(true)
    const [sensorError, setSensorError] = useState(false)

    const [sensorDetails, setSensorDetails] = useState([])
    const [sensorDetailsLoading, setSensorDetailsLoading] = useState(false)



    const [selectedDevice, setSelectedDevice] = useState('')
    const [selectedSensor, setSelectedSensor] = useState('')

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')


    const [showGraph, setShowGraph] = useState(false)




    const fetchReport = async () => {

        try {
            setReportsLoading(true)
            setReportsError(false)

            console.log("startdate", startDate, "endDAte", endDate, " selectedDevice", selectedDevice, "selectedSensor", selectedSensor)
            const fData = await getFilteredData(startDate, endDate, selectedDevice, selectedSensor)
            console.log("Fetched Data: ", fData)
            setReportsData(fData)
        } catch (error) {
            setReportsError(true)
            console.log(error)
        } finally {
            setReportsLoading(false)
        }
    }



    const fetchDevices = async () => {

        try {
            setDeviceLoading(true)
            setDeviceError(false)
            setShowGraph(false)

            const fDevice = await getDevices()
            console.log("Fetched Devices: ", fDevice)
            setDeviceList(fDevice)

        } catch (error) {
            setDeviceError(true)
            console.log(error)

        } finally { setDeviceLoading(false) }

    }

    const fetchSensors = async () => {

        if (!selectedDevice) {
            setSensorList([]);
            return;
        }
        if (!deviceLoading && selectedDevice) {
            try {
                setSensorLoading(true)
                setSensorError(false)

                const fSensor = await getDeviceSensors(selectedDevice)
                console.log("Fetched Sensors: ", fSensor)
                setSensorList(fSensor)

            } catch (error) {
                setSensorError(true)
                console.log(error)

            } finally { setSensorLoading(false) }
        }

    }


    useEffect(() => {

         const fetchSensorsDetails = async () => {
            if (!selectedSensor) {
                setSensorDetails([]);
                return;
            }
            if (!sensorLoading && selectedSensor) {
                try {
                    setSensorDetailsLoading(true)

                    const fSensorDetails = await getSensorDetails(selectedDevice, selectedSensor)
                    console.log("fetcched Sensor detailsf: ", fSensorDetails)
                    if (fSensorDetails) {
                        setSensorDetails(fSensorDetails[0])
                    } else {
                        setSensorDetails([])
                    }

                } catch (error) {

                    console.log(error)

                } finally {setSensorDetailsLoading(false)}
            }

        }
        fetchSensorsDetails()

    }, [selectedSensor])





    useEffect(() => {
        fetchDevices()
    }, [])


    useEffect(() => {
        fetchSensors()
    }, [selectedDevice])




    return (
        <> 
            <title>Reports</title>
            <div className="m-5">
                <div>
                    <BackButton to='/Dashboard' />
                    <h1 className="text-3xl font-extrabold ">Reports</h1>
                </div>

                <div className="mt-4 p-5 rounded-xl bg-gray-300 border-2 border-gray-500 grid grid-cols-2">
                    <div className="flex items-center m-2">
                        <p>Select Start Date:</p>
                        <input type="date" onChange={(e) => { setStartDate(e.target.value) }} className="bg-white font-bold ml-2 rounded-xl p-1" />
                    </div>

                    <div className="flex items-center m-2">
                        <p>Select End Date:</p>
                        <input type="date" onChange={(e) => { setEndDate(e.target.value) }} className="bg-white font-bold ml-2 rounded-xl p-1" />
                    </div>

                    <div className="flex items-center m-2">
                        <p>Select Device: </p>
                        <select name="device" id="device"
                            value={selectedDevice}
                            onChange={(e) => {
                                setSelectedDevice(e.target.value)
                                setSelectedSensor('')
                                setSensorList([])
                            }}
                            className="ml-3 w-45 bg-green-300 rounded-xl p-1 border">
                            <option value="">
                                ------
                            </option>
                            {
                                deviceList.map((device) => (
                                    <option key={device.id} value={device.id} >
                                        {`${device.id}: ${device.name}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex items-center m-2">
                        <p>Select Sensor: </p>
                        <select name="sensor" id="sensor"
                            value={selectedSensor}
                            disabled={!selectedDevice || sensorLoading}
                            onChange={(e) => setSelectedSensor(e.target.value)}
                            className={`bg-green-300 w-45 rounded-xl ml-3 p-1 border disabled:bg-green-200 disabled:text-gray-600`}>
                            <option value="">
                                {!selectedDevice ? "Select Device First" : '------'}
                            </option>
                            {
                                sensorList.map((sensor) => (
                                    <option key={sensor.id} value={sensor.id} >
                                        {`${sensor.id}: ${sensor.sensor_type}`}
                                    </option>
                                ))
                            }

                        </select>
                    </div>

                    <div>
                        <button
                            disabled={deviceLoading || reportsLoading || !selectedDevice || !selectedSensor}
                            className="border rounded p-1 font-bold bg-white hover:bg-blue-200 disabled:text-gray-400 hover:cursor-pointer"
                            onClick={() => { fetchReport(); setShowGraph(true) }}
                        >
                            Generate
                        </button>
                    </div>
                </div>



                <div className="mt-5">
                    <p className="">Results: </p>

                    {reportsLoading && <LoadingService />}


                    {showGraph && !reportsLoading && reportsData.length > 0 && (
                        <Graph
                            data={reportsData}
                            XAxis="created_at"
                            YAxis="value"
                            maxRefrence={sensorDetails.threshold_max_value}
                            minRefrence={sensorDetails.threshold_min_value}
                        />
                    )}


                    {reportsError && <p className="text-red-500">Error fetching data!</p>}


                    {showGraph && !reportsLoading && reportsData.length === 0 && (
                        <p>No data found</p>
                    )}

                </div>

            </div>
        </>
    )
}

export default Reports