export default function formatPrice (price: number) {
    return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price)
}

// Example Output for 25000: "25 000 DZD" (or "25 000 DA")