import { useState, useEffect } from "react"
import { LoadingService } from "../services/loadingService"


import { getAlerts, getDevices, getDeviceSensors } from "../services/api"
import BackButton from "../components/backButton"


const AlertsDetails = () => {

    const [alertsList, setAlertsList] = useState([])
    const [alertsLoading, setAlertsLoading] = useState(false)
    const [alertsError, setAlertsError] = useState(false)


    const [deviceList, setDeviceList] = useState([])
    const [deviceLoading, setDeviceLoading] = useState(true)
    const [deviceError, setDeviceError] = useState(false)

    const [sensorList, setSensorList] = useState([])
    const [sensorLoading, setSensorLoading] = useState(true)
    const [sensorError, setSensorError] = useState(false)

    const [alertStatus, setAlertStatus] = useState('')
    const [selectedDevice, setSelectedDevice] = useState('')
    const [selectedSensor, setSelectedSensor] = useState('')

    const fetchAlerts = async () => {

        try {
            setAlertsLoading(true)
            setAlertsError(false)
            console.log("alertStatus", alertStatus, " selectedDevice", selectedDevice, "selectedSensor", selectedSensor)

            const fAlerts = await getAlerts(alertStatus, selectedDevice, selectedSensor)
            console.log("Fetched Alerts: ", fAlerts)
            setAlertsList(fAlerts)
        } catch (error) {
            setAlertsError(true)
            console.log(error)
        } finally {
            setAlertsLoading(false)
        }
    }



    const fetchDevices = async () => {

        try {
            setDeviceLoading(true)
            setDeviceError(false)

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
        fetchDevices()
    }, [])


    useEffect(() => {
        fetchSensors()
    }, [selectedDevice])



    return (
        <>
            <title>Alerts</title>

            <div className="m-6 ">
                <div>
                    <BackButton to='/Dashboard' />
                    <h1 className="mt-2 text-3xl font-bold">All Alerts</h1>
                </div>

                <div className="mt-3 py-3 flex flex-col md:flex-col lg:flex-row justify-around bg-gray-100 rounded-2xl border-2 border-gray-500 ">
                    {(deviceLoading ? (
                        <LoadingService />
                    ) : (
                        <>

                            <div className="flex items-center m-1 justify-between">
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
                                        All
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

                            <div className="flex items-center m-1 justify-between">
                                <p>Select Sensor: </p>
                                <select name="sensor" id="sensor"
                                    value={selectedSensor}
                                    disabled={!selectedDevice || sensorLoading}
                                    onChange={(e) => setSelectedSensor(e.target.value)}
                                    className={`bg-green-300 w-45 rounded-xl ml-3 p-1 border disabled:bg-green-200 disabled:text-gray-600`}>
                                    <option value="">
                                        {!selectedDevice ? "Select Device First" : 'All'}
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
                            <div className="flex items-center m-1 justify-between">
                                <p>Select Alert Status:</p>
                                <select name="status" id="status"
                                    value={alertStatus}
                                    onChange={(e) => setAlertStatus(e.target.value)}
                                    className={`ml-3 p-1 rounded-xl border w-30 ${alertStatus == 'critical' ? 'bg-red-300' : (alertStatus == 'warning') ? 'bg-amber-300' : 'bg-white'}`}>
                                    <option key='' value="" className="bg-white">All</option>
                                    <option key='critical' value="critical" className="bg-red-300">Critical</option>
                                    <option key='warning' value="warning" className="bg-amber-300">Warning</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <button
                                    disabled={deviceLoading}
                                    className="border rounded p-1 font-bold bg-white hover:bg-blue-200 disabled:text-gray-400 hover:cursor-pointer"
                                    onClick={fetchAlerts}
                                >
                                    Update
                                </button>
                            </div>
                        </>
                    ))}
                </div>




                <div className="mt-5 border whitespace-nowrap ">
                    <table className="w-auto min-w-full">
                        <thead className="sticky top-0 z-10">
                            <tr className="font-bold bg-blue-300">
                                <td className="p-2 text-center">ID</td>
                                <td className="p-2 text-center ">Device ID</td>
                                <td className="p-2 text-center ">Sensor ID</td>
                                <td className="p-2 text-center">Alert Type</td>
                                <td className="p-2 text-center">Data Value</td>
                                <td className="p-2 text-center">Threshold</td>
                                <td className="p-2 text-center">Status</td>
                                <td className="p-2 text-center">Timestamp</td>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black">
                            {!alertsLoading ?
                                (alertsList.map((alert) => (

                                    <tr key={alert.id} className="hover:bg-gray-50">
                                        <td className="p-2 text-center ">{alert.id}</td>
                                        <td className="p-2 text-center">{alert.device_id}</td>
                                        <td className="p-2 text-center">{alert.sensor}</td>
                                        <td className="p-2 text-center capitalize">{alert.alert_type}</td>
                                        <td className="p-1 text-center rounded-xl bg-violet-400 text-sm flex justify-center items-center">{alert.sensor_data}</td>
                                        <td className="p-2 text-center ">{`${Math.trunc(alert.min_threshold)} - ${Math.trunc(alert.max_threshold)}`}</td>
                                        <td className={`p-1 text-center font-bold capitalize border flex justify-center items-center rounded-xl text-sm  ${(alert.status === 'critical') ? 'bg-red-300 text-red-700 border-red-500' : 'bg-amber-200 text-amber-800 border-amber-500'}`}>{alert.status}</td>
                                        <td className="p-2 text-center">{new Date(alert.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }
                                        )}</td>
                                    </tr>)

                                )) :
                                <tr>
                                    <td colSpan={8}>
                                        <div className="flex justify-center">
                                            {LoadingService()}
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>

                    </table>

                </div>

            </div>

        </>
    )
}



export default AlertsDetails


