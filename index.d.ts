import {Primitive} from "d3";

declare module "d3" {
    export function contextMenu(menu: any): any;
    export function contextMenu(menu: any, opts: any): any;
}