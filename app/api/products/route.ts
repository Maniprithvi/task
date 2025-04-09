
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/db/product";
import { decodeCursor, encodeCursor, buildFilters } from "@/app/helper/nextPage";
import { safeParseInt, seedProducts } from "@/app/helper";


export interface ProductQueryParams {
    limit?: string;
    nextPageToken?: string;
    pageToken?: string | null
    search?: string;
    category?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
}

export async function GET(req: NextRequest) {


    try {
        const searchParams = req.nextUrl.searchParams;
        const params = Object.fromEntries(searchParams.entries()) as ProductQueryParams;
        const rawLimit = safeParseInt(searchParams.get("limit"), 12, 1, 100);
        let nextPageToken = params.pageToken;
        const limit = rawLimit;
        const page = safeParseInt(searchParams.get("page"), 1, 1);
        // const skip = (page - 1) * limit;

        // Decode cursor if provided
        let cursorQuery = {};
        if (nextPageToken) {
            try {
                const decoded = await decodeCursor(nextPageToken);
                cursorQuery = { _id: { $gt: decoded._id } };
            } catch (error) {
                return NextResponse.json(
                    { success: false, error: 'Invalid nextPageToken' },
                    { status: 400 }
                );
            }
        }

        // Build filters
        const filter = buildFilters(params);

        // Fetch products
        const products = await ProductModel.find({ ...filter, ...cursorQuery })
            .sort({ _id: 1 })
            .limit(limit + 1)
            .lean();

        // Check if there's more data
        const hasNextPage = products.length > limit;
        const items = hasNextPage ? products.slice(0, -1) : products;

        // Generate next page token if there are more items
        nextPageToken = null;
        if (hasNextPage && items.length > 0) {
            const lastItem = items[items.length - 1];
            nextPageToken = encodeCursor({ _id: lastItem._id });
        }

        // Get total count for pagination (replace hardcoded 41)
        const total = await ProductModel.countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: items,
            total,
            pagination: {
                limit,
                nextPageToken,
                hasNextPage
            }
        });

    } catch (error) {
        console.error('Error in products route:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


export const POST = async (req: NextRequest) => {
    try {
        // await connectToDatabase()
        const data = await req.json();
        const product = await ProductModel.create({
            ...data
        })

        if (!product) {
            return new NextResponse("hey something went wrong in db ", { status: 404 })
        }
        return NextResponse.json("created successfully", { status: 200 })


        // for database seeding 

        // const result = await seedProducts(datas);

        // if (!result.success) {
        //     return NextResponse.json(
        //         {
        //             message: `Partial success - created ${result.created} products`,
        //             errors: result.errors
        //         },
        //         { status: 207 } // Multi-status
        //     );
        // }

        // return NextResponse.json(
        //     { message: `Successfully created ${result.created} products` },
        //     { status: 201 }
        // );

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
};
