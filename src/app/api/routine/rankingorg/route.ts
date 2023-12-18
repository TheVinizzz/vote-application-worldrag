import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import puppeteer from "puppeteer-core";
import axios from "axios";


const runningRankingORG= async () => {
    try {
        // const browser = await puppeteer.launch({
        //     headless: "new",
        //     args: ['--no-sandbox']
        // });

        const browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.NEXT_PUBLIC_BLESS_TOKEN}`
        })

        const page = await browser.newPage();

        await page.goto(`https://www.topragnarok.org/detalhar/uid5161/`);

        const tableData = await page.evaluate(() => {
			const rows = document.querySelectorAll('table tr');
		
			const data: any = [];
		
			rows.forEach((row) => {
			  const cells: any = row.querySelectorAll('td'); 
			  const rowData = [];
		
			  for (let i = 0; i < Math.min(4, cells.length); i++) {
				rowData.push(cells[i].textContent.trim());
			  }
		
			  data.push(rowData);
			});
		
			return data;
		  });
		const rows = tableData.map((val: any) => String(val[3]).replace("http://", '').replace(".vote.wo...", ''))

        browser.close();

        return rows
    }
    catch (error) {
        console.log(error);
    }
}


export const GET = async (request: NextRequest) => {
    try {
        const data = await runningRankingORG()

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

        const response = validVotes.forEach(async (val) => {
            if(val.validatedORG) return 
            const params = new URLSearchParams();
            params.append('servidor', val.server);
            params.append('acao', '1');
            params.append('login', val.user);
            params.append('key', "cblkfjas;JOAFWwvqm.,.qcwqdp1294");
            params.append('top', "2");
            await axios.post('https://worldrag.com/webservice-vote.php', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }})
            const response = await prisma.user.update({
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

        await Promise.all([response])
        
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