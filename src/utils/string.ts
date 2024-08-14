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

/**
 * Convert a string or number to a string with a thousand separators.
 * @param {string | number} numberString - The string or number to format.
 * @returns {string} - The formatted string with a thousand separators.
 */
export function withThousandSeparator(numberString: string | number): string {
    // Ensure the input is a string
    const numberStr = typeof numberString === 'string' ? numberString : numberString.toString();

    // Remove any existing separators or non-digit characters
    const cleanedNumber = numberStr.replace(/\D/g, '');

    // Convert cleaned number to an integer
    const number = parseInt(cleanedNumber, 10);

    // Format the number with a thousand separators
    return number.toLocaleString();
}

export function isDateString(data: string): boolean {
    // Regex pattern to match ISO 8601 format
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    if (isoDatePattern.test(data)) {
        const date = new Date(data);
        return isDateValid(date);
    }

    return false;
}

export function isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
}