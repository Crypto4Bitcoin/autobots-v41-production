"use client";
import React from 'react';
import Link from 'next/link';

interface ComingSoonProps {
  feature: string;
  message?: string;
}

export default function ComingSoon({ feature, message }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mb-8 border border-blue-500/30">
        <span className="text-3xl">✦</span>
      </div>
      <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">{feature}</h1>
      <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-8">
        {message || "We're currently calibrating the sub-systems for this module. Expected availability in the next sector update."}
      </p>
      <Link href="/dashboard" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition">
        Return to Dashboard
      </Link>
    </div>
  );
}
