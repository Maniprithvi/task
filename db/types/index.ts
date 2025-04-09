import { Document, Types } from "mongoose";

export type ProductCategory =
    | "Electronics"
    | "Fashion"
    | "Grocery"
    | "Books"
    | "Furniture";

export type ProductType = "physical" | "digital" | "service";

export interface IProduct extends Document {
    name: string;
    price: number;
    category: ProductCategory;
    type?: ProductType;
    description?: string;
    images: string[]
}
