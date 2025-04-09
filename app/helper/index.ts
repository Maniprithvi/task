import ProductModel from "@/db/product";
// import { connectToDatabase } from "../lib/mongoose";

export function safeParseInt(value: string | null, defaultValue: number, min = 1, max = 100): number {
    const num = parseInt(value || '');
    return isNaN(num)
        ? defaultValue
        : Math.min(max, Math.max(min, num)); // Clamps between min/max
}

export const seedProducts = async (productsData: any[]) => {
    try {
        // await connectToDatabase();git 

        // Using Promise.all for parallel creation
        const creationPromises = productsData.map(product =>
            ProductModel.create(product).catch(error => ({
                error: true,
                product: product.name,
                message: error.message
            }))
        );

        const results = await Promise.all(creationPromises);

        // Check for any errors in the results
        const errors = results.filter(result => result?.error);
        if (errors.length > 0) {
            console.error('Some products failed to create:', errors);
            return {
                success: false,
                created: results.length - errors.length,
                errors
            };
        }

        return {
            success: true,
            created: results.length
        };
    } catch (error) {
        console.error('Bulk creation failed:', error);
        throw error;
    }
};

