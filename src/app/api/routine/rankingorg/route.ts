import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import puppeteer from "puppeteer";


const runningRankingORG= async () => {
    try {
        const browser = await puppeteer.launch({

            args: ['--no-sandbox']
        });
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

        return rows
    }
    catch (error) {
        console.log(error);
    }
}


const GET = async (request: NextRequest) => {
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