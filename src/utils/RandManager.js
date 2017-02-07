export function uniqueRandomNumbers(numRandomNumbers, lowerLimit, upperLimit) {
	let uniqueNumbers = [];
	
	while( uniqueNumbers.length !== numRandomNumbers ) {
		let currentRandomNumber = randomNumberInRange(lowerLimit, upperLimit);
		
		if ( uniqueNumbers.indexOf(currentRandomNumber) === -1)
			uniqueNumbers.push(currentRandomNumber);
	}

	return uniqueNumbers;
}

export function randomNumberInRange(lowerLimit, upperLimit) {
	return Math.floor( Math.random() * (1 + upperLimit - lowerLimit) ) + lowerLimit;
}

export function distance(x0, y0, x1, y1) {
	return Math.sqrt( Math.pow(( x1 - x0 ), 2) + Math.pow(( y1 - y0 ), 2) );
}