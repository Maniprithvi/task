import { createHmac } from 'crypto';
import { ProductQueryParams } from '../api/products/route';

// Encode cursor for pagination
const PAGINATION_SECRET = process.env.PAGINATION_SECRET || 'your-secret-key';

function encodeCursor(payload: object): string {
    const str = JSON.stringify(payload);
    const hmac = createHmac('sha256', PAGINATION_SECRET);
    const signature = hmac.update(str).digest('hex');
    console.log({ "sign": Buffer.from(`${str}:${signature}`).toString('base64') })
    return Buffer.from(`${str}:${signature}`).toString('base64');
}
// Decode and validate cursor
function decodeCursor(token: string): any {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        console.log({ decoded })
        // Split on the last occurrence of '|' since signature won't contain this character
        const lastSeparatorIndex = decoded.lastIndexOf(':');
        console.log({ lastSeparatorIndex })
        if (lastSeparatorIndex === -1) {
            throw new Error('Invalid cursor format');
        }

        const str = decoded.slice(0, lastSeparatorIndex);
        const signature = decoded.slice(lastSeparatorIndex + 1);

        const hmac = createHmac('sha256', PAGINATION_SECRET);
        const expectedSignature = hmac.update(str).digest('hex');
        console.log("the decodes", { expectedSignature }, { signature })
        if (signature !== expectedSignature) {
            throw new Error('Invalid cursor signature');
        }

        return JSON.parse(str);
    } catch (error) {
        console.error('Cursor decoding failed:', error);
        throw new Error('Invalid cursor');
    }
}

function buildFilters(params: ProductQueryParams) {
    const filter: Record<string, any> = {};

    if (params.search) {
        filter.$or = [
            { name: { $regex: params.search, $options: 'i' } },
            { description: { $regex: params.search, $options: 'i' } }
        ];
    }

    if (params.category) filter.category = params.category;
    if (params.type) filter.type = params.type;

    const minPrice = parseFloat(params.minPrice || '0');
    const maxPrice = parseFloat(params.maxPrice || '100000');
    filter.price = { $gte: minPrice, $lte: maxPrice };

    return filter;
}
export { decodeCursor, encodeCursor, buildFilters }