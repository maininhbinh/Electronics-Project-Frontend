import { IValueAttribute } from "./valueAttribute.interface";

export interface IAttribute {
    id ?: number;
    detail_id ?: string;
    name : string;
    description? : string;
    value_attributes ?: IValueAttribute[];
}