declare namespace _default {
    export { bahttext };
}
export default _default;
/**
 * Convert number → Thai Baht text (supports number or numeric string)
 * Mirrors behaviour of previous implementation but with faster core.
 *
 * @public
 * @param {number|string} input
 * @returns {string}
 */
export function bahttext(input: number | string): string;
/**
 * @private
 * Handle numeric input and extract baht/satang values
 * @param {number} input - numeric input (positive or negative)
 * @returns {{baht: number, bahtStr: string, satang: number, isNegative: boolean} | false}
 */
export function handleNumericInput(input: number): {
    baht: number;
    bahtStr: string;
    satang: number;
    isNegative: boolean;
} | false;
/**
 * @private
 * Handle string input and extract baht/satang values
 * @param {string} input - string input (numeric string, positive or negative)
 * @returns {{baht: number, bahtStr: string, satang: number, isNegative: boolean} | false}
 */
export function handleStringInput(input: string): {
    baht: number;
    bahtStr: string;
    satang: number;
    isNegative: boolean;
} | false;
/**
 * @private
 * Format satang portion of the output
 * @param {number} baht - baht amount
 * @param {number} satang - satang amount
 * @returns {string} formatted satang string
 */
export function formatSatang(baht: number, satang: number): string;
