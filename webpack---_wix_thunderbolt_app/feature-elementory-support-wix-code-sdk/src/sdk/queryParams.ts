const createElementorySupportQueryParams = (gridAppId: string, viewMode: string, signedInstance?: string): string => {
	const gridAppIdAndViewModeQueryParams = `?gridAppId=${gridAppId}&viewMode=${viewMode}`

	return signedInstance
		? `${gridAppIdAndViewModeQueryParams}&instance=${signedInstance}`
		: gridAppIdAndViewModeQueryParams
}

export { createElementorySupportQueryParams }
