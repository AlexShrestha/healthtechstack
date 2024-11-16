'use client';

// Import Types
import { ListingType } from '@/supabase-special-types';
// Import External Packages
import { useState } from 'react';
// Import Components
import { Alert, AlertTitle, AlertDescription } from '@/ui/Alert';
import ListingCard from '@/components/listings/ListingCard';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
// Import Data
// Import Assets & Icons
import { AlertCircle } from 'lucide-react';
import useClientAuth from '@/app/_lib/useClientAuth';

export default function ListingGrid({
	listings,
	maxCols,
	initialItemsPerPage,
	showSearch = true,
}: {
	listings: ListingType[];
	maxCols: number;
	initialItemsPerPage: number;
	showSearch?: boolean;
}) {
	const [visibleItems, setVisibleItems] = useState<number>(
		initialItemsPerPage || maxCols * 2
	);
	const [searchTerm, setSearchTerm] = useState<string>('');

	// Filtered data based on search term
	const filteredData = listings.filter((listing) =>
		listing.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Displayed data
	const currentData = filteredData.slice(0, visibleItems);

	// Handle Load More
	const handleLoadMore = () => {
		setVisibleItems((prev) => Math.min(prev + maxCols * 2, filteredData.length));
	};
	const { userObject: user } = useClientAuth({})
	return (
		<>
			{listings.length === 0 ? (
				<Alert
					variant="destructive"
					className="bg-white w-fit h-fit mx-auto col-span-full"
				>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Ohh!</AlertTitle>
					<AlertDescription>
						It seems like we did not find any listings given search parameters.{' '}
						<br /> Please change your filters. Thank you!
					</AlertDescription>
				</Alert>
			) : (
				<>
					{showSearch && (
						<div className="w-full flex justify-end mt-8 mb-4">
							<Input
								className="w-58"
								placeholder="Filter by name..."
								onChange={(e) => setSearchTerm(e.target.value || '')}
							/>
						</div>
					)}
					{currentData.length === 0 ? (
						<Alert
							variant="destructive"
							className="bg-white w-fit h-fit mx-auto col-span-full"
						>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Ohh!</AlertTitle>
							<AlertDescription>
								It seems like we did not find any listings given search
								parameters. <br /> Please change your filters. Thank you!
							</AlertDescription>
						</Alert>
					) : (
						<>
							<div
								className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 lg:grid-cols-${maxCols.toString()} w-full`}
							>
								{currentData.map((listing) => (
									<ListingCard key={listing.slug} listing={listing} user={user} />
								))}
							</div>
							{visibleItems < filteredData.length && (
								<div className="flex justify-center mt-6">
									<Button onClick={handleLoadMore}>Load More</Button>
								</div>
							)}
						</>
					)}
				</>
			)}
		</>
	);
}
