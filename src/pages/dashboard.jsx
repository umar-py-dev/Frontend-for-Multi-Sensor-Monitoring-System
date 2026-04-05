import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


import { LoadingService } from "../services/loadingService";
import { ErrorService } from "../services/errorService";

import Card from "../components/card";
import GoToCard from "../components/gotoCard";
import { getReport, getDevices } from "../services/api";


function Dashboard() {

    const navigate = useNavigate()

    const handleLoading = LoadingService()
    const handleError = ErrorService()

    const [report, setReport] = useState(null)
    const [devices, setDevices] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {


        const fetchReport = async () => {
            try {
                const report_data = await getReport();
                const devices_data = await getDevices();
                console.log(devices_data)

                setReport(report_data)
                setDevices(devices_data)
            }
            catch (error) {
                console.log("AN ERROR OCCURED: " + error);
                setReport("err")
                setDevices("err")
            }
            finally {
                setLoading(false);
            }
        };

        fetchReport();

    }, []);


    const deviceTotal = (loading || !report) ? handleLoading : (report === 'err' ? handleError : report.devices.total)
    const activeDevices = (loading || !report) ? handleLoading : (report === 'err' ? handleError : report.devices.active)
    const sensorTotal = (loading || !report) ? handleLoading : (report === 'err' ? handleError : report.sensors.total)
    const activeSensors = (loading || !report) ? handleLoading : (report === 'err' ? handleError : report.sensors.active)
    const criticalAlerts = (loading || !report) ? handleLoading : (report === 'err' ? handleError : report.alerts.critical_last7days)
    const systemStatus = (loading || !report) ? handleLoading : (report === 'err' ? handleError : (criticalAlerts >= 1 ? 'Critical' : 'Healthy'))



    return (
        <>
            <title>Dashboard</title>

            <div className="ml-5 mr-5 mb-5">
                <div className="flex justify-between mb-5 mt-2">
                    <h1 className="text-3xl font-bold underline">System Dashboard</h1>

                    <button onClick={() => {
                        localStorage.clear;
                        navigate("/login");
                    }}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 hover:cursor-pointer transition"
                    >Logout</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1">
                    <Card name="Active Devices" num={loading ? handleLoading : `${activeDevices}/${deviceTotal}`} color={activeDevices == 0 ? 'red' : 'green'} />
                    <Card name="Active Sensors" num={loading ? handleLoading : `${activeSensors}/${sensorTotal}`} color={activeSensors == 0 ? 'red' : 'green'} />
                    <Card name="Critical Alerts (7 Days)" num={criticalAlerts} color={criticalAlerts == 0 ? 'green' : 'red'} />
                    <Card name="System Status" num={systemStatus} color={systemStatus === "Critical" ? 'red' : 'green'} />

                </div>


                {/* devices list */}
                <div className=" p-4 bg-white rounded-lg shadow-md overflow-hidden">

                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Device List</h2>

                    <div className="overflow-x-auto overflow-y-auto  shadow">
                        <table className="min-w-full text-left border-collapse  whitespace-nowrap scroll-auto">
                            <thead>
                                <tr className="bg-blue-200 sticky top-0 uppercase text-sm leading-normal rounded-2xl">
                                    <th className="py-3 px-4 border-b">ID</th>
                                    <th className="py-3 px-4 border-b">Name</th>
                                    <th className="py-3 px-4 border-b">Device Type</th>
                                    <th className="py-3 px-4 border-b">Location</th>
                                    <th className="py-3 px-4 border-b">Status</th>
                                    <th className="py-3 px-4 border-b">Created At</th>
                                    <th className="py-3 px-4 border-b">Action</th>

                                </tr>
                            </thead>
                            <tbody className="text-gray-900 text-sm">
                                {loading ? (
                                    <tr className="">
                                        <td colSpan={7}>
                                            <div className="flex justify-center">{handleLoading}</div>
                                        </td>
                                    </tr>

                                ) : !loading && devices !== 'err' ? (
                                    devices.map((device) => (
                                        <tr key={device.id} className="border-b hover:bg-gray-50 transition duration-300">
                                            <td className="py-3 px-4">{device.id}</td>
                                            <td className="py-3 px-4 font-medium">{device.name}</td>
                                            <td className="py-3 px-4">{device.device_type_id}</td>
                                            <td className="py-3 px-4 capitalize">{device.location}</td>
                                            <td className="py-3 px-4">
                                                {device.status.toLowerCase() === 'active' ? (
                                                    <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-bold border border-green-200">
                                                        • Active
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs font-bold border border-red-200">
                                                        • Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">{new Date(device.created_at).toLocaleDateString()}</td>

                                            <td className="py-3 px-4  ">
                                                <Link
                                                    className="rounded hover:text-white bg-blue-100 hover:bg-blue-400 p-2 font-bold"
                                                    to={`/devices/${device.id}/${device.device_type_id}`}
                                                    >Details →
                                                </Link>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-4 text-center text-gray-500">
                                            No devices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer>
                    <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

                        <GoToCard heading='Reports' to='/reports' />
                        <GoToCard heading='Alerts' to='/alerts' />
                        <div className="col-span-1 sm:col-span-2 md:col-span-1">
                            <GoToCard heading='Debug Log' to='/debug' />
                        </div>

                    </div>
                </footer>

            </div>


        </>
    );





}

export default Dashboard








