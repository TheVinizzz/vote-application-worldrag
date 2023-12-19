import { NextResponse } from "next/server"

import cheerio from "cheerio"
import request from "request-promise"

export const dynamic = 'force-dynamic'


export const GET = async () => {
    try {
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

        return Response.json({ message: "OK", listValues })
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