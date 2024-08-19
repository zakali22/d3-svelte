declare module 'd3-scale';
declare module 'd3-array';
declare module 'd3';
declare module "*.csv" {
    export default <{ [key: string] }>Array;
}