// Numeric input validation utilities

/**
 * Validates if a string contains only valid numeric characters (digits, decimal point)
 * @param text - The text to validate
 * @returns boolean - True if the text is valid numeric input
 */
export const isValidNumericInput = (text: string): boolean => {
  // Allow empty string
  if (text === '') return true;
  
  // Check if it's a valid number format (digits and at most one decimal point)
  const numericRegex = /^\d*\.?\d*$/;
  return numericRegex.test(text);
};

/**
 * Formats numeric input to ensure only valid characters are allowed
 * @param text - The input text
 * @returns string - Formatted numeric string
 */
export const formatNumericInput = (text: string): string => {
  // Remove any non-numeric characters except decimal point
  let formatted = text.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = formatted.split('.');
  if (parts.length > 2) {
    formatted = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places to 8 (common for crypto amounts)
  if (parts.length === 2 && parts[1].length > 8) {
    formatted = parts[0] + '.' + parts[1].substring(0, 8);
  }
  
  return formatted;
};

/**
 * Handles numeric input change with validation
 * @param text - The input text
 * @param setValue - Function to update the value
 * @returns void
 */
export const handleNumericInputChange = (text: string, setValue: (value: string) => void): void => {
  if (isValidNumericInput(text)) {
    const formatted = formatNumericInput(text);
    setValue(formatted);
  }
}; 