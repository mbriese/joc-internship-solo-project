export const labelFormatters = (value: string): string =>
    value
        .toLowerCase()
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
