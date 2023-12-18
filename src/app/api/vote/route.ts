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
    const {user, server} = await req.json()
    try {

        const dateCurrent= new Date();

        const dateInitial = new Date(dateCurrent);

        dateInitial.setHours(dateCurrent.getHours() - 24);

        const votes = await prisma.user.findMany({
            where: {
                user,
                createdAt: {
                    gte: dateInitial,
                    lte: dateCurrent
                },
            },
        });

        if(votes.length > 0) throw "Voto realizado antes das 24 horas"

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
                server,
                validatedBR: false,
                validatedORG: false,
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