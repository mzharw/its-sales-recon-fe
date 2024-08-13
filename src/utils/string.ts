export function toPascalCase(str: string): string {
    return str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

export function convertToNumber(decimalString: string): number {
    const cleanedString = decimalString.replace(/,/g, '');

    const number = parseFloat(cleanedString);

    if (isNaN(number)) {
        throw new Error('Invalid number format');
    }

    return number;
}