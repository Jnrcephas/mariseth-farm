"use client";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

import React from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Data doesn't need to be re-fetched every time a component remounts
			// (e.g. switching tabs and back). 30s keeps navigation feeling instant
			// while still picking up changes reasonably quickly.
			staleTime: 30 * 1000,
			gcTime: 5 * 60 * 1000,
			// Default retry:3 with exponential backoff meant a genuinely failed
			// request (server down, bad network) could hang for 7+ seconds before
			// the UI showed an error. 1 retry is enough to smooth over a blip.
			retry: 1,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: 0,
		},
	},
});

const ReactQueryClientProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default ReactQueryClientProvider;
