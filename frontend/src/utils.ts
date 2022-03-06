import { Contract, BigNumber, BigNumberish, utils } from "ethers";
import AllBigNumber from "bignumber.js";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const MAX_UINT256 = BigNumber.from(2).pow(256).sub(1);
export const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
export function toWei(n: BigNumberish): BigNumber {
    return expandDecimals(n, 18);
}

export function toWeiString(n: BigNumberish): string {
    return expandDecimalsString(n, 18);
}

export function fromWei(n: BigNumberish): string {
    return collapseDecimals(n, 18);
}


export function expandDecimals(n: BigNumberish, decimals = 18): BigNumber {
    return BigNumber.from(new AllBigNumber(n.toString()).multipliedBy(new AllBigNumber(10).pow(decimals)).toFixed(0));
}

export function expandDecimalsString(n: BigNumberish, decimals = 18): string {
    return new AllBigNumber(n.toString()).multipliedBy(new AllBigNumber(10).pow(decimals)).toFixed();
}

export function collapseDecimals(n: BigNumberish, decimals = 18): string {
    return new AllBigNumber(n.toString()).div(new AllBigNumber(10).pow(decimals)).toFixed();
}

export function convertUnixTimeToHuman(unixTimeStamp: number): string {
    const date = new Date(unixTimeStamp * 1000);
    return date.toLocaleString();
};

export function convertToUnixTime(date: number): number {
    return Math.floor(date / 1000);
};

