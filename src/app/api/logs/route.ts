import { NextRequest, NextResponse } from "next/server"
import {v4 as uuidv4} from "uuid"
import cuid from 'cuid';

import prisma from "../../../../lib/db"
import axios from "axios"

export const GET = async (request: NextRequest) => {
    try {
        const data = await prisma.votesLog.findMany()
        return Response.json({ message: "OK", data })
    }
    catch (err) {
        return NextResponse.json({
            message: "Error",
            err
        }, {
            status: 404
        })
    }
}

export const POST = async (req: Request) => {
    const { inUse } = await req.json()
    const id = cuid()
    try {
        await axios.get(
            `https://vote.worldrag.com:2083/execute/SubDomain/addsubdomain?rootdomain=vote.worldrag.com&dir=%2Fpublic_html&canoff=1&disallowdot=0&domain=${id}`,
            {
                headers: {
                    'Authorization': `cpanel ${process.env.NEXT_PUBLIC_CPANEL_USER}:${process.env.NEXT_PUBLIC_CPANEL_TOKEN}`
                },
            }
        )

        const logResponse = await prisma.votesLog.create({
            data: {
                id,
                inUse: inUse || false
            }
        })

        return Response.json({ message: "OK", data: {...logResponse, url: `${id}.vote.worldrag.com`}})
    }
    catch (err) {
        return NextResponse.json({
            message: "Error",
            err
        }, {
            status: 404
        })
    }
}