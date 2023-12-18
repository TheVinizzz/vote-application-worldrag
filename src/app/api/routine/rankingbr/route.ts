import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import puppeteer from "puppeteer";


const runningRankingBR = async () => {
    try {
        const browser = await puppeteer.launch({

            args: ['--no-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(`https://topragnarok.com.br/detail/23376`);

        const sel = ".flex-grow.pl-2.overflow-hidden"

        const data = await page.evaluate((sel) => {
            let elements: any = Array.from(document.querySelectorAll(sel));
            let links = elements.map((element: any) => {
                return element.innerText
            })
            return links;
        }, sel);

        return data
    }
    catch (error) {
        console.log(error);
    }
}


const GET = async (request: NextRequest) => {
    try {
        const data = await runningRankingBR()

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

        const newString = data.map((val: string) => val.replace("http://", '').replace(".vote.worldrag.com/", ''))
        const validVotes = votes.filter(val => newString.includes(val.idCode))
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

export default GET