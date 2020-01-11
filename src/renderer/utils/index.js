export function readableDateTime(timeInt) {
	const dateTime = new Date(timeInt);

	let date = dateTime.getDate();
	let month = dateTime.getMonth() + 1;
	const year = dateTime.getFullYear();
	let hours = dateTime.getHours();
	let minutes = dateTime.getMinutes();

	if (date < 10) date = `0${date}`;
	if (month < 10) month = `0${month}`;
	if (hours < 10) hours = `0${hours}`;
	if (minutes < 10) minutes = `0${minutes}`;

	return `${date}/${month}/${year} ${hours}:${minutes}`;
}

export function convertFileSize(size, decimals = 1) {
	if (size.toString().length < 4) return `${size}B`

	let newSize = size / 1024;
	if (newSize < 1000) return `${newSize.toFixed(decimals).replace('.', ',')}KB`;
	
	newSize /= 1024;
	if (newSize < 1000) return `${newSize.toFixed(decimals).replace('.', ',')}MB`;
	
	newSize /= 1024;
	if (newSize < 1000) return `${newSize.toFixed(decimals).replace('.', ',')}GB`;
	
	newSize /= 1024;
	return `${newSize.toFixed(decimals).replace('.', ',')}TB`;
}