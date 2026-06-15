export default function getBasedURL() {
    // Check if the code is running in a browser environment.
    // If running in the browser, return an empty string since relative URLs can be used.
    if (typeof window !== 'undefined') {
        return '';
    }

    // Check if the environment variable VERCEL_URL is set, indicating deployment on Vercel.
    // If so, construct and return a base URL using the DOMAIN_URL environment variable.
    if (process.env.VERCEL_URL) {
        return `https://${process.env.DOMAIN_URL}`;
    }

    // Default to localhost for development purposes if no other condition is met.
    return 'http://localhost:3000';
}
