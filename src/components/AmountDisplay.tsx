import { formatCurrency } from "../helpers"

type AmountDisplayProps = {
    label?: string
    amount: number
}

export default function AmountDisplay({ label, amount }: AmountDisplayProps) {
    return (
        <p className="text-2xl text-blue-500 fount-bold">
            {label && `${label}: `}
            <span className="font-black text-slate-300">{formatCurrency (amount)}</span>
        </p>
    )
}
