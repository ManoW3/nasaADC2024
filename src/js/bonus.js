import * as c from "./constants.js";

// This is just a matrix multiplication function I found online cuz i aint writing allat and I couldn't find a library
export function multMatrices(a ,b) {
	if (a[0].length !== b.length)
		throw new Error("Nuh Uh!!! You can't do that!!!");

	let result = [];
	for (let i = 0; i < a.length; i++) {
		result[i] = [];
		for (let j = 0; j < b[0].length; j++) {
			let sum = 0;
			for (let k = 0; k < a[0].length; k++)
				sum += a[i][k] * b[k][j];
			result[i][j] = sum;
		}
	}

	return result;
}

// Distance Formula
export function distance(antennaCords, probeCords) {
	let first = (probeCords[0] - antennaCords[0])**2;
	let second = (probeCords[1] - antennaCords[1])**2;
	let third = (probeCords[2] - antennaCords[2])**2;
	return Math.sqrt(first + second + third);
}

export function rotationMatrix(timeElapsed) {
	const earthTilt = 0.40910518;
	const earthRotation = 0.0043752689390883629091912824047036316217347442667247770055869327107291376933374649965090290441628832370979032264616092647931526225026442232147712881989155271345349586303407442060355058319830324161455127;
	// Initializes the rotation angles
	// Earth's tilt
	let thetaX = earthTilt; 
	// Earth's Rotation
	let thetaZ = earthRotation * (timeElapsed + 521);

	// Rotation matrices (got these on wikipedia cuz i am NOT doing ts myself)
	let rX = [
		[1,                   0,  0],
		[0, Math.cos(thetaX), -Math.sin(thetaX)],
		[0, Math.sin(thetaX), Math.cos(thetaX)]
	]; 
	let rZ = [
		[Math.cos(thetaZ), -Math.sin(thetaZ), 0],
		[Math.sin(thetaZ), Math.cos(thetaZ), 0],
		[0, 0, 1]
	];

	// Multiplies and returns the 2 matricies
	return multMatrices(rX, rZ);
}

export function antennaLoc(antenna, timeElapsed) {
	let radLat = c.antennaPositions[antenna][0];		// Gets the location of the antennas
	let radLong = c.antennaPositions[antenna][1];

	let totalRadius = c.earthRadius + c.antennaPositions[antenna][2];

	// Used the Math from the handbook to change it into x,y,z cords
	let x = totalRadius * Math.cos(radLat) * Math.cos(radLong);
	let y = totalRadius * Math.cos(radLat) * Math.sin(radLong);
	let z = totalRadius * Math.sin(radLat);

	let initialPos = [[x], [y], [z]];					// Has to be a 2d array or else matrixmultiplications doesnt work

	let rotation = rotationMatrix(timeElapsed);			// Finds the rotation matrix

	return multMatrices(rotation, initialPos);			// Multiplies the position by its rotation
}

export function bonusRange(antenna, probeX, probeY, probeZ, time) {
	let antennaPos = antennaLoc(antenna, time).flat();			// Finds the location of the antenna
	let probe = [probeX, probeY, probeZ];				// Finds the location of the probe

	return distance(antennaPos, probe);					// Finds and returns the distance between them
}
