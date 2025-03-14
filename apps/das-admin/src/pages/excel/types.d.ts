import { Entity } from "@digitalaidseattle/core";

type Staff = Entity & {
    created_at: Date,
    name: string,
    email: string,
    roles: string[]
};