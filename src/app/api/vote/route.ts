import { NextRequest, NextResponse } from "next/server"

import prisma from "../../../../lib/db"

export const GET = async (request: NextRequest) => {
    try {
        const data = await prisma.user.findMany()
        return Response.json({message: "OK", data})
    }
    catch(err) {
        return NextResponse.json({
            message: "Error",
            err
        }, {
            status: 404
        })
    }
}

export const POST = async (req: Request) => {
    const {user} = await req.json()
    try {
        const voteLogResponse = await prisma.votesLog.findMany()

        if(voteLogResponse.length === 0) {
            throw "Nenhum log encontrado"
        }

        const voteAvailable = await prisma.votesLog.findFirst({
            where: { inUse: false },
        })

        if(!voteAvailable) {
            throw "Nenhum log disponivel"
        }

        const userResponse = await prisma.user.create({
            data: {
                user,
                idCode: String(voteAvailable.id)
            }
        })

        await prisma.votesLog.update({
            where: { id: voteAvailable.id },
            data: {
                inUse: true
            }
        })
        return Response.json({message: "OK", data: userResponse})
    } 
    catch(err) {
        return NextResponse.json({
            message: "Error",
            err
        }, {
            status: 404
        })
    }
}