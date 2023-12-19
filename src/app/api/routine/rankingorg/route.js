import { NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import axios from "axios";
export const dynamic = 'force-dynamic'

import cheerio from "cheerio"
import request from "request-promise"

export const GET = async () => {
    try {

        const runningRaking = async() => {
            const $ = await request({
                uri: "https://www.topragnarok.org/detalhar/uid5161/",
                transform: body => cheerio.load(body)
            })
    
            let listValues = []
            const title = $("table tr")
            title.each((f, div) => {
                const parentElement = $(div)
                const firstThreeChildren = parentElement.children().slice(3, 4);
                
                firstThreeChildren.each((index, element) => {
                    listValues.push($(element).text().trim().replace("http://", '').replace("https://", '').replace(".vote.wo...", '').replace(".vote.w...", ''))
                });
            });

            return listValues
        }

        const data = await runningRaking()

        const dateCurrent= new Date();

        const dateInitial = new Date(dateCurrent);
        dateInitial.setHours(dateCurrent.getHours() - 24);

        const votes = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: dateInitial,
                    lte: dateCurrent
                },
            },
        });

        const newString = data
        const validVotes = votes.filter(val => newString.includes(val.idCode))

        const response = validVotes.map((val) => {
            if(val.validatedORG) return null
            const params = new URLSearchParams();
            params.append('servidor', val.server);
            params.append('acao', '1');
            params.append('login', val.user);
            params.append('key', String(process.env.NEXT_PUBLIC_TOKEN_WEB_SERVICE));
            params.append('top', "2");
            axios.post('https://worldrag.com/webservice-vote.php', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }})
            const response = prisma.user.update({
                where: {
                    id: val.id,
                    user: val.user
                },
                data: {
                    validatedORG: true,
                },
            })
            return response
        })

        await Promise.all(response)
        
        return Response.json({ message: "OK", votes, validVotes })
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