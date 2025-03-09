import {FC, useCallback, useEffect, useState} from "react";
import QRCode from 'qrcode';
import {basePath} from "../config.ts";
import {Link} from "react-router";

export const Create: FC = () => {
    const [channel, setChannel] = useState("")
    const [baseURL, setBaseURL] = useState("")
    const [anonKey, setAnonKey] = useState("")

    const [qrCode, setQRCode] = useState<string | null>(null)

    const normalUrl = `/${encodeURIComponent(channel || "blockchain")}/${encodeURIComponent(baseURL)}/${encodeURIComponent(anonKey)}`
    const url = `${location.origin}${basePath}${normalUrl}`

    const generateQRCode = useCallback(async (input: string) => {
        if (!input) {
            setQRCode(null)
            return
        }
        try {
            const qrCodeDataURL = await QRCode.toDataURL(input, {
                width: 200,
                margin: 2,
            })
            setQRCode(qrCodeDataURL)
        } catch (error) {
            console.error("Error generating QR code:", error)
            setQRCode(null)
        }
    }, [])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            generateQRCode(url)
        }, 200)

        return () => clearTimeout(debounceTimer)
    }, [url, generateQRCode])

    return <div className="flex items-center justify-center h-full">
        <div className="border border-gray-300 rounded-md p-10 flex flex-col gap-2 shadow-xl">
            <h1 className="font-bold text-2xl text-center">Blockchain-Beispiel</h1>
            <div id="qrcode">
                {qrCode ? (
                    <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="w-96 h-96"/>
                ) : (
                    <div
                        className="w-96 h-96 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                    </div>
                )}
            </div>
            <input placeholder="Channel" type="text" onChange={e => setChannel(e.target.value)} value={channel}/>
            <input placeholder="Supabase Base URL" type="text" onChange={e => setBaseURL(e.target.value)}
                   value={baseURL}/>
            <input placeholder="Anon Key" type="text" onChange={e => setAnonKey(e.target.value)} value={anonKey}/>
            <Link className="primary" to={normalUrl}>Öffnen</Link>
        </div>
    </div>
}