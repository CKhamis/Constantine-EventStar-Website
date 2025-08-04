'use client';

import { CookiesProvider } from 'react-cookie';
import { Toaster } from "@/components/ui/sonner";

export default function ESCookieProvider({ children }: { children: React.ReactNode }) {
	return (
			<CookiesProvider>
				{children}
				<Toaster />
			</CookiesProvider>
	);
}
