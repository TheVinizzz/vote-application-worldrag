import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import puppeteer from "puppeteer-core";
import axios from "axios";

export const dynamic = 'force-dynamic'


export const GET = async (request: NextRequest) => {
    try {
        const runningRankingBR = async () => {
            try {
                // const browser = await puppeteer.launch({
                //     headless: "new",
                //     args: ['--no-sandbox']
                // });
        
                const browser = await puppeteer.connect({
                    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.NEXT_PUBLIC_BLESS_TOKEN}`,
                })
        
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
        
                await browser.close();
        
                return data
            }
            catch (error) {
                console.log(error);
            }
        }

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

        const newString = data.map((val: string) => val.replace("http://", '').replace("https://", '').replace(".vote.worldrag.com/", ''))
        
        const validVotes = votes.filter(val => newString.includes(val.idCode))

        const response = validVotes.map((val) => {
            if(val.validatedBR) return null
            const params = new URLSearchParams();
            params.append('servidor', val.server);
            params.append('acao', '1');
            params.append('login', val.user);
            params.append('key', String(process.env.NEXT_PUBLIC_TOKEN_WEB_SERVICE));
            params.append('top', "1");
            axios.post('https://worldrag.com/webservice-vote.php', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }})
            const response = prisma.user.update({
                where: {
                    id: val.id,
                    user: val.user
                },
                data: {
                    validatedBR: true,
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