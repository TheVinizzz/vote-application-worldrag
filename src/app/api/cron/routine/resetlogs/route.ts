import { NextResponse } from "next/server"
import prisma from "../../../../../../lib/db"
export const dynamic = 'force-dynamic'

export const GET = async () => {
    try {

        const votes = await prisma.votesLog.findMany({
            where: {
                inUse: true,
            },
        });

        const reset = votes.map(val => {
            prisma.votesLog.update({
                where: { id: val.id },
                data: {
                    inUse: false
                } 
            })
        })

        Promise.all(reset)

        return Response.json({ message: "Logs foram resetados com sucesso" })
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