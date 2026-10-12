import { Entity } from "@digitalaidseattle/core";

export type Location = Entity & {
    name: string;
    latitude: number;
    longitude: number;
}
