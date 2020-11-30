export function debounce(func: (event: Event) => void, timeout: number) {
    return (event: Event) => {
        const previousCall = this.lastCall;
        this.lastCall = Date.now();
        if (previousCall && ((this.lastCall - previousCall) <= timeout)) {
            clearTimeout(this.lastCallTimer);
        }
        this.lastCallTimer = setTimeout(() => func(event), timeout);
    };
}
