type ColorFunc = (isDarkMode: boolean, opacity?: number) => string;

function createColorFunc(light: string, dark: string): ColorFunc {
    return (isDarkMode: boolean, opacity?: number) => {
        const baseColor = !isDarkMode ? light : dark;
        if (opacity == null) {
            return baseColor;
        } else {
            return withOpacity(baseColor, opacity);
        }
    };
}

export const Colors = {
    craftBlue: createColorFunc("#035EFF", "#44B6FF"),
    text: createColorFunc("#111111", "#F4F4F4"),
    separator: createColorFunc("#f2f2f2", "#333333"),
    background: createColorFunc("#FFFFFF", "#222222"),
    defaultImageBackground: createColorFunc("#FFFFFF", "#222222"),
    error: createColorFunc("#EB3323", "#ED4637"),
};

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

const toRGB: (c: string) => RGBColor = (c: string) => {
    if (c.startsWith("#")) {
        const r = safeParseInt(c.substr(1, 2), 16) ?? 0;
        const g = safeParseInt(c.substr(3, 2), 16) ?? 0;
        const b = safeParseInt(c.substr(5, 2), 16) ?? 0;
        return {r, g, b};
    } else if (c.startsWith("rgb(")) {
        const parts = c.substr(4, c.length - 5).split(",");
        const r = safeParseInt(parts[0], 10) ?? 0;
        const g = safeParseInt(parts[1], 10) ?? 0;
        const b = safeParseInt(parts[2], 10) ?? 0;
        return {r, g, b};
    } else if (c.startsWith("rgba(")) {
        const parts = c.substr(5, c.length - 6).split(",");
        const r = safeParseInt(parts[0], 10) ?? 0;
        const g = safeParseInt(parts[1], 10) ?? 0;
        const b = safeParseInt(parts[2], 10) ?? 0;
        return {r, g, b};
    } else {
        return {r: 127, g: 127, b: 127};
    }
};

function safeParseInt(v: any, radix: number = 10): number | null {
    const parsed = parseInt(v, radix);
    return !isNaN(parsed) ? parsed : null;
}

const withOpacity = (colorHexSring: string, percent: number) => {
    const {r, g, b} = toRGB(colorHexSring);
    return `rgba(${r},${g},${b},${toFixed(percent, 2)})`;
};

function toFixed(n: number, digits: number) {
    const factor = Math.pow(10, digits);
    return Math.round(n * factor) / factor;
}
