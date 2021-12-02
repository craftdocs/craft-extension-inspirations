declare module "time-ago" {
    export default {
        ago: (date: Date | string | number, short?: boolean) => string
    };
}