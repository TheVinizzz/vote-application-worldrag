import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../../../lib/db"
import puppeteer from "puppeteer-core";
import axios from "axios";

import cheerio from "cheerio"
import request from "request-promise"

export const dynamic = 'force-dynamic'


export const GET = async () => {
    try {
        const $ = await request({
            uri: "https://topragnarok.com.br/detail/23376",
            transform: body => cheerio.load(body)
        })

        let listValues = []
		const title = $(".flex-grow.pl-2.overflow-hidden")
		title.each((i, div) => {
			listValues.push($(div).text().trim().replace("http://", '').replace("https://", '').replace(".vote.worldrag.com/", ''))
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