import { useLocation, useNavigate } from "react-router-dom"

import { getDebugLog } from "../services/api"
import { useState, useEffect } from "react"
import { LoadingService } from "../services/loadingService"

import BackButton from "../components/backButton"

const Debug = () => {
    
    const location = useLocation()
    const getPageFromURL = () => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get("page"), 10);
        return isNaN(page) || page < 1 ? 1 : page;
    };


    const [debugData, setDebugData] = useState([])
    const [debugDataLoading, setDebugDataLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(getPageFromURL());
    
    const handleLoading = LoadingService()
    const navigate = useNavigate();
    

    





    const fetchDebugLog = async (page) => {
        try {
            setDebugDataLoading(true)
            const fDebugLog = await getDebugLog(page)
            console.log("Fetched Dubug Data: ", fDebugLog)
            setDebugData(fDebugLog)

            const params = new URLSearchParams(location.search);
                if (params.get("page") !== String(currentPage)) {
                    params.set("page", currentPage);
                    navigate({ search: params.toString() }, { replace: true });
                }


        } catch (error) {
            setDebugData([])
            console.log(error)

        } finally {
            setDebugDataLoading(false)
        }
    }

    useEffect(() => {
        const pageFromUrl = getPageFromURL();
        if (pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);


    useEffect(() => {
        fetchDebugLog(currentPage)
    }, [currentPage, navigate])




    return (
        <>
            <title>Debug</title>
            <div className="m-5">
                <BackButton to='/Dashboard' />

                <div className="mt-2">
                    <h1 className="text-4xl font-bold">Debug Log</h1>
                </div>

                <div className="m-5 overflow-x-auto ">

                    <div>
                        <p className="font-bold text-center mb-2">Page {currentPage}</p>

                        <div className="flex justify-between mt-3">
                            <button
                                onClick={() => debugData.previous && setCurrentPage(prev => prev - 1)}
                                disabled={!debugData.previous || debugDataLoading   }
                                className={`rounded hover:text-white bg-blue-200 hover:bg-blue-400  p-2 font-bold transition ${!debugData.previous ? 'opacity-50 cursor-not-allowed hover:bg-blue-100' : 'hover:cursor-pointer'
                                    }`}
                            >
                                &larr; Previous
                            </button>


                            {
                                debugDataLoading ? 
                                '' : <p>Showing {debugData.results?.length} of {debugData.count} enteries ({debugData.results[(debugData.results?.length)-1].id}-{debugData.results[0].id})</p>
                            }


                            <button
                                onClick={() => debugData.next && setCurrentPage(prev => prev + 1)}
                                disabled={!debugData.next || debugDataLoading}
                                className={`rounded hover:text-white bg-blue-200 hover:bg-blue-400 p-2 font-bold transition ${!debugData.next ? 'opacity-50 cursor-not-allowed hover:bg-blue-100' : 'hover:cursor-pointer'
                                    }`}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>



                    <div className="mt-3">
                        <table className="min-w-full scroll-auto w-auto whitespace-nowrap border border-gray-200 shadow-sm rounded-lg overflow-hidden border-separate border-spacing-0">

                            <thead className=" bg-blue-200">
                                <tr>
                                    <th className="px-3 py-3 text-center uppercase text-blue-800">ID</th>
                                    <th className="px-3 py-3 text-center uppercase text-blue-800">Timestamp</th>
                                    <th className="px-3 py-3 text-center uppercase text-blue-800">Topic</th>
                                    <th className="px-3 py-3 text-center uppercase text-blue-800">Payload</th>
                                    <th className="px-3 py-3 text-center uppercase text-blue-800">Response</th>
                                </tr>
                            </thead>

                            {(debugData.results?.length > 0 && !debugDataLoading
                            ) ? (
                                <>

                                    <tbody className="divide-y divide-black">
                                        {debugData.results?.map((debug) => {
                                            return (
                                                <tr key={debug.id} className="hover:bg-gray-100">
                                                    <td className="p-2 text-center ">{debug.id}</td>
                                                    <td className="p-2 text-center ">{new Date(debug.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' })}</td>
                                                    <td className="p-2 text-center ">{debug.topic}</td>
                                                    <td className="p-2 text-center ">{debug.payload}</td>
                                                    <td className="p-2 text-center ">{debug.response}</td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </>

                            ) : (
                                <tbody>

                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex justify-center">
                                            {debugDataLoading ? handleLoading : 'Error'}
                                        </div>
                                    </td>

                                </tr>
                                </tbody>
                            )}

                            {/* <tr className="">
                                        <td colSpan={7}>
                                            <div className="flex justify-center">{handleLoading}</div>
                                        </td>
                                    </tr> */}
                        </table>

                    </div>

                </div>


            </div>
        </>
    )
}

export default Debug