import React from 'react'

export default function CircularProgress({ percentage }) {
    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={120} height={120} className="relative">
            <circle
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-gray-300"
                stroke="currentColor"
            />
            <circle
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-blue-500"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
            />
            <text
                x="60"
                y="60"
                textAnchor="middle"
                dy="0.3em"
                className="text-xl font-bold fill-current text-gray-700"
            >
                {percentage}%
            </text>
        </svg>
    )
}
