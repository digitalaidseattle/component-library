

const copyToClipboardFallback = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand('copy');
    } catch (error) {
        console.error('Failed to copy text: ', error);
    } finally {
        document.body.removeChild(textarea);
    }
};

export function copyToClipboard(text: string): Promise<void> {
    try {
        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text)
        }
        return Promise.resolve();
    } catch {
        return Promise.resolve(copyToClipboardFallback(text));
    }
}