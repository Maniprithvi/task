import { decodeCursor, encodeCursor } from "../helper/nextPage";


export async function GET(_request: Request) {
    // Do whatever you want

    const testPayload = { _id: "67ee75a05ed3dc9c4b758ff1", createdAt: "2023-01-01T00:00:00Z" };

    const encoded = encodeCursor(testPayload);
    console.log('Encoded:', encoded);

    const decoded = decodeCursor(encoded);
    console.log('Decoded:', decoded);
    return new Response('Hello World!', {
        status: 200,
    });
}